$(document).ready(() => {

    const $basketTBody = $("#basket-tbody");
    const currentUser = SDK.Storage.load("currentUser");

    $(".page-header").html(`
        <h1>Hi, ${currentUser.username}</h1>
    `);

    $(".profile-info").html(`
        <dl>
            <dt>Username: ${currentUser.username}</dt>
            <dt>ID: ${currentUser.user_id}</dt>     
        </dl>
    `)

    SDK.Orders.getByUserId((err, orders) => {
        if(err) throw err;
        orders.forEach(order => {

            if(order.isReady){
                status = "Klar";
            } else {
                status = "Ikke klar";
            }

            $basketTBody.append(`
                <tr>
                    <td>${order.orderTime}</td><br>
                    <td><button class="btn btn-primary btn-sm viewItems" data-order-id="${order.orderId}">Åpne</button></td><br>
                    <td>${status}</td><br>
                </tr>
            `);

            });

        $(".viewItems").click(function() {
            const orderId = $(this).data("order-id");
            const order = orders.find((order) => order.orderId === orderId);
            SDK.Orders.viewItems(order);
            $("#item-modal").modal("toggle");

        });

    });

    $("#item-modal").on("shown.bs.modal", () => {
        const $modalTbody = $("#modal-tbody");
        let order = SDK.Storage.load("orderedItems");

        let $itemName = "";
        let $itemPrice = "";
        let $itemCount = "";
        let $itemTotal = 0;


        let items = [];
        for (let i = 0; i < order.items.length; i++){
            let newItem = true;
            for(let j = 0; j < items.length; j++){
                if(items[j].item.itemId === order.items[i].itemId){
                    newItem = false;
                    items[j].count++;
                }
            }
            if(newItem){
                items.push({count: 1, item: order.items[i]});
            }
        }

        for (let g = 0; g < items.length; g++){
            $itemName += items[g].item.itemName + "<br>";
            $itemCount += items[g].count + "<br>";
            $itemPrice += items[g].item.itemPrice + "<br>";
            $itemTotal += items[g].item.itemPrice * items[g].count;
        }


        $modalTbody.empty();
        $modalTbody.append(`
        <tr>
            <td></td>
            <td>${$itemName}</td>
            <td>${$itemCount}</td>
            <td>${$itemPrice}</td>
            <td>${$itemTotal}</td>
        </tr>
      `);

        SDK.Storage.remove("orderedItems");
    });
});