    var conn = require('./get_dbconnection.js') // original
    // var conn = require(__dirname + '/get_dbconnection.js')
    //  fetch_rows(4) // for debugging

    var result = [];        // used between the execute_query and process_query
    
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

    function wishlist_product(reference, id){ /*need to add list*/
        // window.alert("hello")
        
        var x = document.getElementById("wishlist").value
        if(x != ""){ // note this is empty not null or undefinied
           // window.alert("Have some entries")
            x = JSON.parse(x)
        }
        else
            x = []
        
        x = new Set(x)
        x.add(id) 
       // window.alert(Array.from(x))
        reference.style.display = 'none' // in cart there is no account_wishlist. so if we put display = none it won't work
        document.getElementById("wishlist").value = JSON.stringify(Array.from(x))
        document.getElementById("account_wishlist").value = JSON.stringify(Array.from(x))
    }

    function process_query(data){
        var product = {
            id : data.product_id,
            words : function (){
                var arr = []
                var regex = /[\s,]+/
                arr = data.description.split(regex)
                return arr
            }
        }
        result.push(product)
    }

    function execute_query(callback){
        conn.query("select * from product", function(err, res){
            result = [] //global variable
            if(err) throw err
            else
                res.forEach(process_query)
            callback(result, res)   // should call the callback here since nodejs is asynch.
                                //if we called callback at the end then query_list would possibly be an empty list
        })
    }
    

    function getemptydesign(callback){  // for empty search result
        var design = '<html><head><meta name="viewport" content="width=device-width initial-scale = 1.0"><link rel = "stylesheet" type="text/css" href="css/product.css">'+
        '</head><script src = "javascript/product.js"></script><body><div class = "container"> <div class = "navigation"><div class = "navigation_container">'+
        '<form action="/account" method="POST" class="form_account_btn"><input type = "submit" class = "account_btn" value = "Account">'+
        '<textarea rows="10" cols="10" id="account_wishlist" name = "wishlist" hidden></textarea></form><div class = "search">'+
        '<form method = "post" action = "/search" class="form_search"><input type = "text" class = "search_txt" name = "search" placeholder="Search here">'+
        '<textarea rows="10" cols="10" id = "wishlist" name = "wishlist" hidden></textarea><button type = "submit" class = "search_btn">Search</button> '+
        '</form></div><input type = "button" class = "home_btn" value = "Home"></div></div>'+
        '<div class = "no_matchfound"><b>No Match Products For the Search</b></div></div></body></html>'
        callback(design);
    }
    function getdesign(hasrelation, query_output,callback){
            var inittemp = '<html><head><meta name="viewport" content="width=device-width initial-scale = 1.0"><link rel = "stylesheet" type="text/css" href="css/product.css">'+
            '</head><script src = "javascript/product.js"></script><body><div class = "container"> <div class = "navigation"><div class = "navigation_container">'+
            '<form action="/account" method="POST" class="form_account_btn"><input type = "submit" class = "account_btn" value = "Account">'+
            '<textarea rows="10" cols="10" id="account_wishlist" name = "wishlist" hidden></textarea></form><div class = "search">'+
            '<form method = "post" action = "/search" class="form_search"><input type = "text" class = "search_txt" name = "search" placeholder="Search here">'+
            '<textarea rows="10" cols="10" id = "wishlist" name = "wishlist" hidden></textarea><button type = "submit" class = "search_btn">Search</button> '+
            '</form></div><input type = "button" class = "home_btn" value = "Home" ></div></div>'
    
            var bodydesign = "";

            for(var i = 0; i < query_output.length; i++)
                if(hasrelation.has(query_output[i].product_id))
                        bodydesign += appenddesign(query_output[i])

            callback(inittemp + bodydesign + '</div></body></html>')
    }

    function appenddesign(data){
        var init1 = '<div class = "parent_container" id = "parent_container"><div class = "first_child" ><img src = "'+ data.location +'" alt = "img" style ="width: 100%;height: 100%;"></div><div class = "second_child" id = "second_child_container">'
        var name = '<input type = "text" value = "'+ data.name +'" class = "product_name" readonly>'
        var price = '<input type = "text" value = "' + data.price + '(Per Unit)" class = "product_price" readonly>'
        var id = '<input type="button" name = "' + data.product_id +'" value="Add To Cart" class = "cart_btn" onclick="cart_btn_change(this)">'
        var rating = '<input type = "text" value = "Review : ' + data.review.toFixed(1) + '" class = "review" readonly>'
        var rate_count = '<input type = "text" value = "Reviewers : ' + data.review_count + '" class = "review_count" readonly>'
        var remain = '<input type = "button" value = "Wishlist" class = "wishlist_btn" onclick = "wishlist_product(this,'+data.product_id+')"></div></div>'
        // return data.product_id + " " + data.name + " " + data.price + " " + data.review + " " + data.review_count
        return init1 + name + price + id + rating + rate_count + remain
    }

    // function get_addedlist(callback){
    //     console.log("Is it done ?")
    //     for(let s of choosen)
    //         console.log(s)
    //     console.log(result)
    //     callback("hello")
    // }
    
    module.exports.execute_query = execute_query
    module.exports.getemptydesign = getemptydesign
    module.exports.getdesign = getdesign
    //module.exports.get_addedlist = get_addedlist



    