$(document).ready(() =>{

   //set variables to use html code in js
   const $modalTbody = $("#basket-tbody");
   const $checkoutActions = $("#checkout-actions");

   //Method to load the basket in to html table
    function loadBasket() {
        const basket = SDK.Storage.load("basket") || [];
        let total = 0;

        basket.forEach(entry => {
            let subtotal = entry.item.itemPrice * entry.count;
            total += subtotal;
            $modalTbody.append(`
                <tr>
                    <td></td>
                    <td>${entry.item.itemName}</td>
                    <td>${entry.count}</td>
                    <td>kr. ${entry.item.itemPrice}</td>
                    <td>kr. ${subtotal}</td>
                </tr>        
            `);
        });

        $modalTbody.append(`
            <tr>
                <td colspan="3"></td>
                <td><b>Total</b></td>
                <td>kr. ${total}</td>
            </tr>
        `);


    }

    $checkoutActions.append(`
        <button class="btn btn-success btn-lg" id="checkout-button">Checkout</button>
        `)
       loadBasket();

        //Add function to clear button in checkout
        $("#clear-basket-button").click(() => {
            SDK.Storage.remove("basket");
            window.location.reload();
        });

        //Add function to checkout button
        $("#checkout-button").click(() =>{
            const basket = SDK.Storage.load("basket");
            const orderedItems = basket.map((x) => x.item);

            SDK.Orders.createOrder(
                orderedItems, (err) =>{
                if(err) throw err;

                $("#order-alert-container").find(".alert-success").show();
                SDK.Storage.remove("basket");
                });
        });

});