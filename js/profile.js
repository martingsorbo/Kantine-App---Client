$(document).ready(() => {

    const $basketTBody = $("#basket-tbody");
    const currentUser = SDK.User.current();

    $(".page-header").html(`
        <h1>Hi, ${currentUser.username}</h1>
    `);

    $(".profile-info").html(`
        <dl>
            <dt>Name</dt>
            <dd>${currentUser.username}</dd>
            <dt>ID</dt>
            <dd>${currentUser.user_id}</dd>
        </dl>
    `)

    SDK.Order.getByUserId(err, orders) => {
        if(err) throw err;
        orders.forEach(order => {
            $basketTBody.append(`
                <tr>
                    <td>${order.id}</td>
                 
            `)
        })
    })

})