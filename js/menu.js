$(document).ready(() =>{

    const $itemList = $("#item-list");

    SDK.Items.getItems((err, items) => {
        if(err) throw err;
        const titleHTML = `
                    <div>
                        <Button id="sandwich">Sandwich</Button>
                        <Button id="dessert">Dessert</Button>
                        <Button id="drinks">Drinks</Button>
                    </div>
                
                `;
        $itemList.append(titleHTML);

        let type = 0;
        $("#sandwich").click(() => {
            type = 2;
            window.location.reload();


        });

        $("#dessert").click(() => {
            type = 3;
            window.location.reload();
        });

        console.log(type);

        items.forEach((item) =>{


            if(item.itemType === type) {


                const itemHtml = `
        <div class="col-lg-4 item-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${item.itemName}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-8">
                      <dl>
                        <dt>Description</dt>
                        <dd>${item.itemDescription}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4 price-label">
                            <p>Kr. <span class="price-amount">${item.itemPrice}</span></p>
                        </div>
                        <div class="col-lg-8 text-right">
                            <button class="btn btn-success purchase-button" data-item-id="${item.itemId}">Add to basket</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            
            `;

                $itemList.append(itemHtml);

            }
        });



        $(".purchase-button").click(function() {
            const itemId = $(this).data("item-id");
            const item = items.find((item) => item.itemId === itemId);
            SDK.Items.addToBasket(item);
            $("#purchase-modal").modal("toggle");
        });
    });

    $("#purchase-modal").on("shown.bs.modal", () => {
        const basket = SDK.Storage.load("basket");
        const $modalTbody = $("#modal-tbody");
        $modalTbody.empty();
        basket.forEach((entry) => {
            const total = entry.item.itemPrice * entry.count;
            $modalTbody.append(`
        <tr>
            <td></td>
            <td>${entry.item.itemName}</td>
            <td>${entry.count}</td>
            <td>kr. ${entry.item.itemPrice}</td>
            <td>kr. ${total}</td>
            <td><button class="btn btn-default removeItem" data-item-id="${entry.item.itemId}">Remove item</button></td>
        </tr>
      `);
        });
        SDK.Items.getItems((err, items) =>{
            $(".removeItem").click(function() {
                const itemId = $(this).data("item-id");
                const item = items.find((item) => item.itemId === itemId);
                SDK.Items.removeFromBasket(item);
                $("#purchase-modal").modal("toggle");
            });
        });
    });
});