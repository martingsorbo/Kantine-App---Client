const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let headers = {};
        if (options.headers){
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];

            });
        }

        $.ajax({
            url: encodeURI(SDK.serverURL + options.url),
            method: options.method,
            headers: headers,
            contentType: "application/json",
            dataType: "text",
            data: SDK.Encryption.encryptDecrypt(JSON.stringify(options.data)),
            success: (data, status, xhr) => {
                cb(null, JSON.parse(SDK.Encryption.encryptDecrypt(data)), status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
            }
        });
    },

    Orders: {
        createOrder: (items, cb) => {
            SDK.request({
               method: "POST",
               url: "/user/createOrder",
               data: {
                     User_userId: SDK.Storage.load("user_id"),
                     items: items
                     },
               headers: {Authorization: "Bearer " + SDK.Storage.load("BearerToken")}
            },
            (err, data) => {
               if (err) return cb(err);

               cb(null, data);
            })

        },
        getAll: (cb) => {
          SDK.request({
              method: "GET",
              url: "/staff/getOrders",
              data: SDK.Storage.load("user_id"),
              headers: {
                  Authorization: "Bearer " + SDK.Storage.load("BearerToken")
              }},
                (err, data) => {
                  if(err){
                      return cb(err);
                  }
                  cb(null, data);
            })
        },
        makeReady: (id, cb) => {
          SDK.request({
              method: "POST",
              url: "/staff/makeReady/"+id,
              data: SDK.Storage.load("user_id"),
              headers: {
                  Authorization: "Bearer " + SDK.Storage.load("BearerToken")
              }},
                (err, data) => {
                  if(err){
                      return cb(err);
                  }
                  cb(null, data);

          })
        },

        getByUserId: (cb) =>{
          SDK.request({
              method: "GET",
              url: "/user/getOrdersById/" + SDK.Storage.load("user_id"),
              data: SDK.Storage.load("user_id"),
              headers: {Authorization: "Bearer " + SDK.Storage.load("BearerToken")
              }},
                (err, data) => {
                  if(err){
                      return cb(err);
                  }

                cb(null, data);
            })
        },

        viewItems: (order) => {
            let orderedItems = SDK.Storage.load("orderedItems")

            if(!orderedItems){
                return SDK.Storage.persist("orderedItems", order);
            }

            SDK.Storage.persist("orderedItems", orderedItems)
        }



    },
    Items: {
        getItems: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/getItems",
                data: SDK.Storage.load("user_id"),
                headers:{Authorization: "Bearer " + SDK.Storage.load("BearerToken")}},
                (err, data) => {
                    if (err) return cb(err);

                    cb(null, data);
                })
        },
        addToBasket: (item) => {
            let basket = SDK.Storage.load("basket");

            if(!basket) {
                return SDK.Storage.persist("basket", [{
                    count: 1,
                    item: item
                }]);
            }

            let foundItem = basket.find(i => i.item.itemId === item.itemId);
            if(foundItem){
                let i = basket.indexOf(foundItem);
                basket[i].count++;
            } else {
                basket.push({
                    count: 1,
                    item: item
                });


            }
            SDK.Storage.persist("basket", basket);
        },


        removeFromBasket: (item) => {

            let basket = SDK.Storage.load("basket");

            let foundItem = basket.find(i => i.item.itemId === item.itemId);
            if (foundItem) {
                let i = basket.indexOf(foundItem);
                if (i > -1) {
                    basket.splice(i, 1);
                }
            } else {
                console.log("Kunne ikke fjernes")
            }
            SDK.Storage.persist("basket", basket);

        }

    },

    User: {
        login: (username, password, cb) => {
            SDK.request({

                url: "/start/login",
                method: "POST",
                data: {
                    username: username,
                    password: password
                }
            }, (err, data) => {
                // Login error
                if (err) {
                    return cb(err)
                }

                SDK.Storage.persist("BearerToken", data.token);
                SDK.Storage.persist("user_id", data.user_id);
                SDK.Storage.persist("isPersonel", data.isPersonel);
                SDK.Storage.persist("currentUser", data);

                cb(null, data);
            });
        },

        createUser: (username, password, cb) => {
            SDK.request({
                data: {
                    username: username,
                    password: password
                },
                url: "/user/createUser",
                method: "POST"
            }, (err, data) => {
                // Login error
                if (err) {
                    return cb(err)
                }


                cb(null, data);
            });
        },
        logOut: (cb) => {
            SDK.request({
                url: "/start/logout",
                method: "POST",
                headers:{Authorization: "Bearer " + SDK.Storage.load("BearerToken")},
                data: {
                    "user_id": SDK.Storage.load("user_id")
                }

            }, (err, data) => {
                if (err) {
                    return cb(err)
                }

                cb(null, data);
            });
            SDK.Storage.remove("BearerToken");
            SDK.Storage.remove("user_id");
            SDK.Storage.remove("isPersonel");
            SDK.Storage.remove("currentUser");


        },

    },

    Storage: {
    prefix: "KantineSDK",
    persist: (key, value) => {
        sessionStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
    },
    load: (key) => {
        const val = sessionStorage.getItem(SDK.Storage.prefix + key);
        try {
            return JSON.parse(val);
        }
        catch (e) {
            return val;
        }
    },
    remove: (key) => {
        sessionStorage.removeItem(SDK.Storage.prefix + key);
    }
    },

    Encryption: {
        encryptDecrypt(input) {
            var enc = true;
            if(enc){
                var key = ['Y', 'O', 'L', 'O'];
                var output = [];
                for(var i = 0; i < input.length; i++){
                    var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
                    output.push(String.fromCharCode(charCode));
                }
                return output.join("");
            }
            else{
                return input;
            }
        }
    }

};
