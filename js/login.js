$(document).ready(() => {

    //Add function to login button
    $("#loginBtn").click(() => {

        const username = $("#inputUsername").val();
        const password = $("#inputPassword").val();

        SDK.User.login(username, password, (err, user) => {
            if(err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
            }
            else if(err){
                console.log("Noe gikk galt")
            } else {
                if(user.isPersonel == 1) {
                    window.location.href = "orderlist.html";
                } else {
                    window.location.href = "profile.html";
                }
            }
        });
    });

    //Make it possible to login by pressing enter
    $("#inputPassword").keypress(function (e) {
        if(e.which == 13){
            $("#loginBtn").click();
        }
    });

    $(".logOut").click(()=>{
        window.location.href = "index.html";
        SDK.User.logOut();
    });

    $("#createViewBtn").click(()=>{
        window.location.href = "createuser.html";
    });

});
