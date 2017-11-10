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
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: headers,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                cb(null, data, status, xhr);
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
        makeReady: (id, data, cb) => {
          SDK.request({
              method: "POST",
              url: "/staff/makeReady/"+id,
              data: data,
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

        getByUserId: () =>{
          SDK.request({
              method: "GET",
              url: "/user/getOrdersById" + SDK.Storage.load("user_id"),
              headers: {Authorization: "Bearer " + SDK.Storage.load("BearerToken")
              }},
                (err, data) => {
                  if(err){
                      return cb(err);
                  }

                cb(null, data);
            })
        },



    },
    Items: {
        getItems: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/getItems",
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
                data: {
                    username: username,
                    password: password
                },
                url: "/start/login",
                method: "POST"
            }, (err, data) => {
                // Login error
                if (err) {
                    return cb(err)
                }

                SDK.Storage.persist("BearerToken", data.token);
                SDK.Storage.persist("user_id", data.user_id);
                SDK.Storage.persist("isPersonel", data.isPersonel);

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
        //Endre på denne se på muneeb sin løsning
        logOut: (cb) => {
            SDK.request({
                url: "/start/logout",
                method: "POST",
                headers:{Authorization: "Bearer " + SDK.Storage.load("BearerToken")},
                data: {
                    "user_id": SDK.Storage.load("user_id")
                },

            }, (err, data) => {
                if (err) {
                    return cb(err)
                }
                SDK.Storage.remove("BearerToken");
                SDK.Storage.remove("user_id");
                SDK.Storage.remove("isPersonel");

                cb(null, data);
            })

        },
    },

    Storage: {
    prefix: "KantineSDK",
    persist: (key, value) => {
        window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
    },
    load: (key) => {
        const val = window.localStorage.getItem(SDK.Storage.prefix + key);
        try {
            return JSON.parse(val);
        }
        catch (e) {
            return val;
        }
    },
    remove: (key) => {
        window.localStorage.removeItem(SDK.Storage.prefix + key);
    }
    },

};
