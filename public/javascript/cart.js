    function add_tostorage(data, json_choosen_list){    //cache all needed data, for the products which are in cart
        var pair = null
        pair = {
            id : data.product_id,
            price : data.price
        }
        json_choosen_list.push(pair)
    }
    function init_totalamount_helper(prev_added_set, callback){  // stores the price and product id in json format before rendering
        const conn = require('./get_dbconnection.js')
        conn.query("select product_id,price from product", function (err, res){

            if(err) throw err
            else{
                var json_choosen_list = []
                var amt = 0
                for(let i = 0; i < res.length; i++)
                    if(prev_added_set.has(res[i].product_id)){
                        amt += res[i].price
                        add_tostorage(res[i], json_choosen_list)
                    }

                var total_amt = {
                    id : "totalamount",   // adding total amount to the cached data
                    price : amt
                }
                json_choosen_list.push(total_amt)
            }
            callback(JSON.stringify(json_choosen_list))  // encoding js object as a string
       })
    }
    function init_totalamount(prev_added_set, callback){  // function called by app.js to get json format choosen list
            init_totalamount_helper(prev_added_set, function(json_choosen_list){
                callback(json_choosen_list)
            })
    }
    /*
     need to sessionStorage.clear("totalamount")  // clearing previous cached data
    */
   function load_json_choosen_list(){  // function called by web page on load, to store the json format choosen list in sessionstorage
    //   sessionStorage.clear("totalamount") // dont't clear total_amount. it will be done by user as they like to rm the product
       var item_list = document.getElementById("json_totalamount_saver").value 
        // window.alert(item_list)
       sessionStorage.setItem("totalamount", item_list)
       item_list = JSON.parse(item_list)
       
       var amt = 0

       for(let i = 0; i < item_list.length; i++)
            if(item_list[i].id == 'totalamount'){
                amt = item_list[i].price
                break
            }
            // window.alert(amt)
            amt = Math.round(amt)
        document.getElementById('totalamount').innerHTML = "Total Amount : "+amt // setting the total amount
   }
    function get_cost(product_id, ch){      // function gives the total bill amount. called when add/remove cart btn pressed
        var cached_list = JSON.parse(sessionStorage.getItem("totalamount"))
        var total_amt
        var product_amt

        for(let i  = 0; i < cached_list.length; i++)
            if(product_id == cached_list[i].id)   // if we found the value and the total amount update the total amount
                product_amt = cached_list[i].price // teh aim of this funct is to get total amount so don't worry about uncached
            else if(cached_list[i].id == "totalamount")  // products in cart since it can we added we need to put in the list.
                total_amt = cached_list[i].price             // total_amt = Number(cached_list[i].price)

        var bill_amt
        if(ch == 1)
            bill_amt = Math.round(Number(total_amt) + Number(product_amt))
        else
            bill_amt = Math.round(Number(total_amt) - Number(product_amt))

        for(let i = 0; i < cached_list.length; i++)
            if(cached_list[i].id == "totalamount"){
                if(ch == 0)
                    cached_list[i].price = (Number(total_amt) - Number(product_amt)).toFixed(2) // storing the extact difference
                else    
                    cached_list[i].price = (Number(total_amt) + Number(product_amt)).toFixed(2)
                break
            }
    
        sessionStorage.setItem("totalamount", JSON.stringify(cached_list))  // encoding the updated total amount to string to save the object
        return bill_amt
    }
    
    function cart_btn_change(x){       // function which changes the cart btn alternatively and also changes total amount accordingly 
        var cost                       

        if(x.style.backgroundColor == 'green'){   
            x.value = "Remove From Cart"
            x.style.backgroundColor = 'red'
            var ses_store
            if(sessionStorage.getItem("cart") == null){
                ses_store = []
                sessionStorage.setItem("cart", JSON.stringify(ses_store))
            }
            ses_store = sessionStorage.getItem("cart")
            // window.alert(JSON.parse(ses_store))
            ses_store = new Set(JSON.parse(ses_store))   // gettting out set object back
            ses_store.add(x.name)
            sessionStorage.setItem("cart", JSON.stringify(Array.from(ses_store)))  
            cost = get_cost(x.name, 1)             // calculates the total amount
            if(cost > 0)
                document.getElementById("placeorder_decider").style.display = "flex"
            document.getElementById("totalamount").innerHTML = "Total Amount : "+ cost
        }
        else{
            x.value = "Add To Cart"
            x.style.backgroundColor = 'green'
            var ses_store = sessionStorage.getItem("cart")  // we can use set. but the operation b/w web js and nodejs varies in terms of execution  
            ses_store = new Set(JSON.parse(ses_store))      // web js executes specific block only where nodejs executes complete code
            ses_store.delete(x.name)                        // so web js doesn't aware of global variable
            sessionStorage.setItem("cart", JSON.stringify(Array.from(ses_store))) 
            cost = get_cost(x.name, 0)
            if(cost == 0)
                document.getElementById("placeorder_decider").style.display = "none"
            document.getElementById("totalamount").innerHTML = "Total Amount : "+ cost  // calculates the total amount
        }
    }

    // function wishlist_product(x){ /*need to add list*/
    //     x.style.display = 'none';
    // }
    function placeorder(){
        var final_list = sessionStorage.getItem("cart")
        document.getElementById("final_list").value = final_list
        document.getElementById("placeorder_submit").click()
    }

    module.exports.init_totalamount = init_totalamount