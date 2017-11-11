$(document).ready(() => {

    const $orderList = $("#order-list");


    SDK.Orders.getAll((err, orders) => {
        if(err) throw err;

            orders.forEach((order) =>{
                let $itemName = "";
                let $itemPrice = "";
                let $itemCount = "";
                let $itemTotal = 0;

                let items = [];
                for (let i = 0; i<order.items.length; i++){
                    let newItem = true;
                    for (let j = 0; j<items.length; j++){
                        if (items[j].item.itemId === order.items[i].itemId) {
                            newItem = false;
                            items[j].count++;
                        }
                    }
                    if (newItem){
                        items.push({count: 1, item: order.items[i]});
                    }
                }

                for (let g = 0; g< items.length; g++){
                    $itemName += items[g].item.itemName + "<br>";
                    $itemCount += items[g].count + "<br>";
                    $itemPrice += items[g].item.itemPrice + "<br>";
                    $itemTotal += items[g].item.itemPrice * items[g].count;
                }

                const orderHtml = `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${order.orderTime}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-8" style="width: 100%">
                      <dl>
                        <dt>Order time:</dt>
                        <dd>${order.orderTime}</dd>
                        <dt>Is order ready:</dt>
                        <dd>${order.isReady}</dd>
                        <dt>Items:</dt>
                      <table class="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Quantity</th>
                                <th>Price</th>
                             
                                                                               
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${$itemName}</td>
                                <td>${$itemCount}</td>
                                <td>${$itemPrice}</td>
                      
                              
                            </tr>
                            <tr>
                                
                                <td><b>Total</b></td>
                                <td></td>
                                <td>kr. ${$itemTotal}</td>
                            </tr>
                        </tbody>
                      </table>

                      </dl>
                      <input type="button" class="btn btn-default makeOrderReady" data-order-id="${order.orderId}" value="Order done">
                    </div>
                </div>
            </div>
        </div>`;
                $orderList.append(orderHtml);
            });

            $(".makeOrderReady").click(function(){
              const orderId = $(this).data("order-id");
              SDK.Orders.makeReady(orderId, (err) =>{
                  if(err) throw err;
                  window.location.reload();
              });

            })

    })


});

