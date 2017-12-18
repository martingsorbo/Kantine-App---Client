$(document).ready(() => {

    //Add function to create user button
    $("#createBtn").click(() => {

        //Gets values from input fields
        const username = $("#createUsername").val();
        const password = $("#createPassword").val();
        const passwordCheck = $("#checkPassword").val();

        if(username == "" || password == ""){
            window.alert("Ulovlig brukernavn eller passord");
        }else {
            if (password != passwordCheck) {
                window.alert("Passord er ikke like");
            } else {
                SDK.User.createUser(username, password, (err, data) => {
                    if (err && err.xhr.status !== 200) {
                        console.log("Brukeren kunne ikke oprettes");
                    } else {
                        console.log("Bruker opprettet!");
                        window.location.href = "index.html";
                    }

                });
            }
        }

    });

});