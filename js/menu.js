$(document).ready(() =>{

    const $itemList = $("#item-list");

    type = 0;
    $("#sandwich").click(() => {
        type = 2;
        loadItems();
    });
    $("#dessert").click(() => {
       type = 3;
       loadItems();
    });
    $("#drinks").click(() => {
       type = 1;
       loadItems();
    });

    //Get all items
    function loadItems() {
        $itemList.empty();

        SDK.Items.getItems((err, items) => {
            if (err) throw err;

            //Function to show sandwiches when clicking on that button
            items.forEach((item) => {

                //Sort items to a specific type
                if (item.itemType === type) {


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
            //Function for the purchase button on each item to add to basket
            $(".purchase-button").click(function () {
                const itemId = $(this).data("item-id");
                const item = items.find((item) => item.itemId === itemId);
                SDK.Items.addToBasket(item);
                $("#purchase-modal").modal("toggle");
            });


        });
    }

    //Adds the items in your basket to the modal
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