$(document).ready(() => {

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

    $("#logOut").click(()=>{

        SDK.User.logOut();
        window.location.href = "index.html";

    });

    $("#createViewBtn").click(()=>{
        window.location.href = "createuser.html";
    });

});
