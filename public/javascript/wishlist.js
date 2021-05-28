
        // function which is same as in product.js since in wishlist.html we import account.js, cart.js. the last imported cart.js has
        // cart_btn_change function  which acts as btn for cart since cart section has different functionality as compared to wishlist
        // we copied the function from product.js to here
            function cart_btn_change(x){       // function which changes the cart btn alternatively
                if(x.style.backgroundColor == 'red'){   
                    x.value = "Add To Cart"
                    x.style.backgroundColor = 'green'
                    var ses_store = sessionStorage.getItem("cart")  // we can use set. but the operation b/w web js and nodejs varies in terms of execution  
                    ses_store = new Set(JSON.parse(ses_store))      // web js executes specific block only where nodejs executes complete code
                    ses_store.delete(x.name)                    
                    sessionStorage.setItem("cart", JSON.stringify(Array.from(ses_store))) 
                }
                else{
                    x.value = "Remove From Cart"
                    x.style.backgroundColor = 'red'
                    var ses_store
                    if(sessionStorage.getItem("cart") == null){
                        ses_store = []
                        sessionStorage.setItem("cart", JSON.stringify(ses_store))
                    }
                        ses_store = sessionStorage.getItem("cart")
                        // window.alert(JSON.parse(ses_store))
                        ses_store = new Set(JSON.parse(ses_store))
                        ses_store.add(x.name)
                        sessionStorage.setItem("cart", JSON.stringify(Array.from(ses_store)))
                }
            }
        
        
        function wishlist_product_opposite(reference, id){

            var x = document.getElementById("remove_wishlist").value;

            if(x != "")
                x = JSON.parse(x)
            else
                x = []
            x.push(id)
            document.getElementById("remove_wishlist").value = JSON.stringify(x)
            reference.style.display = "none"
        }
        function update_wishlist(){
            document.getElementById("wishlist_submit").click()
        }

        //update_cart("12345@gmail.com", '[1,2,3]', function(){})
       // get_wishlist("12345@gmail.com", function(){})
       
       function update_cart(login_id, list, callback){
            const conn = require("./get_dbconnection.js")
            conn.query("select wishlist from customer where mail_id = '"+ login_id + "'", function(err, res){
                    if(err){
                        console.log("Error in updating the wishlist")
                        throw err
                    }
                    else{
                        var x = JSON.parse(res[0].wishlist)
                        
                        list = JSON.parse(list)
                    
                        x = new Set(x)

                        for(var i = 0; i < list.length; i++)
                            x.add(list[i])
                        x = JSON.stringify(Array.from(x))
                        update_db(x, login_id, function(){
                            callback()
                        })                
                    }
            })
        }

        function update_db(list, login_id, callback){
            var conn = require("./get_dbconnection.js")
            conn.query("update customer set wishlist = '"+ list +"' where mail_id = '"+ login_id +"'", function(err, res){
                if(err) throw err
                else callback();
            })
        }

        function get_wishlist(login_id, callback){
            var conn = require("./get_dbconnection.js")
            conn.query("select wishlist from customer where mail_id = '" + login_id +"'", function(err, res){
                if(err){
                    console.log("No user Found")
                    throw err                    
                }
                else{
                    // console.log("Length : " + res[0].wishlist.length)
                    if(res.length <= 0 ||(res.length == 1 && JSON.parse(res[0].wishlist) == null)|| (res.length == 1 && JSON.parse(res[0].wishlist).length == 0)){
                        callback([])
                    }
                    else{
                        var y = res[0].wishlist
                        y = y.slice(1, y.length - 1)
                        y = "(" + y + ")"
                        var query = "select product_id, name, price, review, review_count,location from product where product_id in " + y + ""
                        // console.log(query)

                        conn.query(query, function(err, res){
                            if(err) throw err
                            else callback(res)
                        })
                    }
                }
            })
        }
    
            //remove_wishlist("12345@gmail.com", [1,3], function(){})
        function remove_wishlist(login_id, list, callback){
            var conn = require("./get_dbconnection.js")
            conn.query("select wishlist from customer where mail_id = '" + login_id + "'", function(err, res){
                if(err){
                    console.log("Error on removing wishlist")
                    throw err
                }
                else{
                    var set = new Set(JSON.parse(res[0].wishlist))

                    for(let i = 0; i < list.length; i++){
                        // console.log(set.has("2"))
                        // console.log( list[i] + " " + set.has(Number(list[i])))
                        set.delete(list[i])
                        set.delete(Number(list[i])) // note when we parse we got the entry as a string. since we store entries in set as a number it won't work.
                    }
                   // console.log("updated set : " + JSON.stringify(Array.from(set)))

                    update_db(JSON.stringify(Array.from(set)),login_id, function(){ // if you put this function outside the loop then we lost synch
                        callback()
                    })
                }
            })
        }
        

    module.exports.update_cart = update_cart
    module.exports.get_wishlist = get_wishlist
    module.exports.remove_wishlist = remove_wishlist