
        function do_submit_home(){  // note two times each function will execute, since two elements have the same id
            document.getElementById("do_submit_home").click();
        }

        function do_submit_accountinfo(){
            document.getElementById("do_submit_accountinfo").click();
        }

        function do_submit_cart(){
            document.getElementById("do_submit_cart").click();
        }

        function do_submit_wishlist(){
            document.getElementById("do_submit_wishlist").click();
        }

        function do_submit_orderdetail(){
            document.getElementById("do_submit_orderdetail").click();
        }

        function toggle(){
            var x = document.getElementById("toggle_btn");
            if(x.name == 'expand' ){
                x.name = 'shrink'
                x.style.display = 'none'
                document.getElementById("right_container").style.display = 'block'
            }
            else{
                x.name = 'expand'
                x.style.display = 'block'
                document.getElementById("right_container").style.display = 'none'
            }
        }


        var basic_template = '<html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">'+
        '<link rel = "stylesheet" type="text/css" href = "css/account.css"><title>Account</title></head><script src = "javascript/account.js"></script>'+
        '<body><div class = "container"><div class = "toggle_btn" onclick = "toggle()"><span></span><span></span><span></span></div>'+
        '<div class = "nav_bar_small_screen" name = "shrink" id = "toggle_btn"><div class = "account_option" onclick="do_submit_home()">Home'+
        '<form action = "/" method="GET" hidden><input type="submit" id = "do_submit_home"></form></div><div class = "account_option" onclick = "do_submit_accountinfo()">Account Info'+
        '<form action = "/account-info" method="GET" hidden><input type="submit" id = "do_submit_accountinfo"></form></div><div class = "account_option" onclick="do_submit_cart()">Cart'+
        '<form action = "/cart" method="GET" hidden><input type="submit" id = "do_submit_cart"></form></div><div class = "account_option" onclick = "do_submit_wishlist()">Wishlist'+
        '<form action = "/wishlist" method="GET" hidden><input type="submit" id = "do_submit_wishlist"></form></div><div class = "account_option" onclick = "do_submit_orderdetail()">Order Detail'+
        '<form action = "/order-detail" method="GET" hidden><input type="submit" id = "do_submit_orderdetail"></form></div></div>'+
        '<div class = "left_container"><div class = "account_option" onclick="do_submit_home()">Home<form action = "/" method="GET" hidden>'+
        '<input type="submit" id = "do_submit_home"></form></div><div class = "account_option" onclick = "do_submit_accountinfo()">Account Info'+
        '<form action = "/account-info" method="GET" hidden><input type="submit" id = "do_submit_accountinfo"></form></div><div class = "account_option" onclick="do_submit_cart()">Cart'+
        '<form action = "/cart" method="GET" hidden><input type="submit" id = "do_submit_cart"></form></div><div class = "account_option" onclick = "do_submit_wishlist()">Wishlist'+
        '<form action = "/wishlist" method="GET" hidden><input type="submit" id = "do_submit_wishlist"></form></div><div class = "account_option" onclick = "do_submit_orderdetail()">Order Detail'+
        '<form action = "/order-detail" method="GET" hidden><input type="submit" id = "do_submit_orderdetail"></form></div></div>'
        var end_template = '</div></body></html>'
        var account_info_design = ""
        var cart_design = ""

        // account info


        function get_accountinfo_helper(login_id, callback){
            var conn = require('./get_dbconnection.js')
            conn.query("select * from customer where mail_id = '"+ login_id+"'", function(err, res){
                if(err) throw err
                else{
                    // console.log(res)
                    // console.log(res[0].mail_id)
                    var name_detail = '<div class = "right_container" id = "right_container"><div class = "account_info_margin"></div><div class = "account_info_container">'+
                                '<h1>Account Info</h1><div class = "account_name">Name : '+ res[0].name +'</div>'
                    var pass = '<div class = "account_password">Password : '+ res[0].password +'</div>'
                    var mail = '<div class = "account_mail_id">Mail : '+ res[0].mail_id +'</div>'
                    var phn_no = '<div class = "account_phone_number">Phone : '+ res[0].phone_number + ' </div>'
                    var street = '<div class = "account_street">Street : '+ res[0].street +' </div>'
                    var city = '<div class = "account_city">City : '+ res[0].city +' </div>'
                    var state = '<div class = "account_state">State : '+ res[0].state+'</div>'
                    var country = '<div class = "account_country">Country :'+ res[0].country +' </div></div></div>'
                    account_info_design = name_detail + pass + mail + phn_no + street + city + state + country
                }
                callback() // here also we need to put callback() here only if we put outside the query block then it is not 
                           // synch with query block
            })
        }
        function get_accountinfo(login_id, callback){

            get_accountinfo_helper(login_id, function(){  // need to synch the fetch result
            //   console.log("waited")  
              callback(basic_template + account_info_design + end_template)
            })
             //callback("<h1>Welcome</h1>")  // need to put return here since if we wrote return within the conn.query it is the return for that funct
        }

        //Cart
        function get_cart_template(){
            var x = '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge">'+
            ' <meta name="viewport" content="width=device-width, initial-scale=1.0"> <link rel = "stylesheet" type="text/css" href = "css/account.css">'+
            ' <link rel = "stylesheet" type="text/css" href ="css/product.css"> <link rel = "stylesheet" type ="text/css" href = "css/cart.css"> <style> '+
            '/* 370 600 767 1024 */ body{ background-color: violet; } @media only screen and (max-width : 600px){ .container{ margin-top: 3vh; } '+
            '.toggle_btn{ top : 0; /*as left-container has position : fixed*/ } } </style> <title>Account</title></head><script src = "javascript/account.js">'+
            '</script><script src = "javascript/product.js"></script><script src = "javascript/cart.js"></script><body'+
            ' onload = "load_json_choosen_list()">'+  // loads the choosen_list
            ' <div class = "container"> <div class = "toggle_btn" onclick = "toggle()"> <span></span> <span></span> <span></span> </div> <div class = "nav_bar_small_screen"'+
            ' name = "shrink" id = "toggle_btn"> <div class = "account_option" onclick="do_submit_home()">Home <form action = "/" method="GET" hidden> <input type="submit" id = "do_submit_home">'+
            ' </form> </div> <div class = "account_option" onclick = "do_submit_accountinfo()">Account Info <form action = "/account-info" method="GET" hidden> <input type="submit" id = "do_submit_accountinfo">'+
            ' </form> </div> <div class = "account_option" onclick="do_submit_cart()">Cart <form action = "/cart" method="GET" hidden> <input type="submit" id = "do_submit_cart"> </form> </div> <div class = "account_option" '+
            'onclick = "do_submit_wishlist()">Wishlist <form action = "/wishlist" method="GET" hidden> <input type="submit" id = "do_submit_wishlist"> </form> </div> <div class = "account_option" onclick = "do_submit_orderdetail()">Order Detail'+
            ' <form action = "/order-detail" method="GET" hidden> <input type="submit" id = "do_submit_orderdetail"> </form> </div> </div> <div class = "left_container"> <div class = "account_option" onclick="do_submit_home()">Home'+
            ' <form action = "/" method="GET" hidden> <input type="submit" id = "do_submit_home"> </form> </div> <div class = "account_option" onclick = "do_submit_accountinfo()">Account Info <form action = "/account-info" '+
            'method="GET" hidden> <input type="submit" id = "do_submit_accountinfo"> </form> </div> <div class = "account_option" onclick="do_submit_cart()">Cart <form action = "/cart" method="GET" hidden> <input type="submit" '+
            'id = "do_submit_cart"> </form> </div> <div class = "account_option" onclick = "do_submit_wishlist()">Wishlist <form action = "/wishlist" method="GET" hidden> <input type="submit" id = "do_submit_wishlist"> </form>'+
            ' </div> <div class = "account_option" onclick = "do_submit_orderdetail()">Order Detail <form action = "/order-detail" method="GET" hidden> <input type="submit" id = "do_submit_orderdetail"> </form> </div> </div>'+
            ' <div class = "right_container" id = "right_container"> <div class = "container">'
            return x
        }
        function cart_append_result(data){
            var img = '<div class = "parent_container" id = "parent_container"><div class = "first_child" ><img src = "'+ data.location +'" alt = "img" style ="width: 100%;height: 100%;"></div>' /* img goes here*/
            var second_child = '<div class = "second_child" id = "second_child_container">'
            var product_name = '<input type = "text" value = "'+ data.name +'" class = "product_name" readonly>'
            var price = '<input type = "text" value = "'+ data.price+' (Per Unit)" class = "product_price" readonly>'
            var id = '<input type="button" name = "'+data.product_id+'" value="Remove from cart" class = "cart_btn" onclick="cart_btn_change(this)" style="background-color: red;">'
            var review = '<input type = "text" value = "Review : '+ data.review+'" class = "review" readonly>'
            var review_count = '<input type = "text" value = "Review Count : '+ data.review_count +'" class = "review_count" readonly>'
            var wishlist = '<input type = "button" value = "Wishlist" class = "wishlist_btn" onclick = "wishlist_product(this,'+data.product_id+')"></div></div>'
            return img + second_child + product_name + price + id + review + review_count + wishlist
        }
        function get_cartinfo(items_list, json_choosen_list, callback){
            var conn = require('./get_dbconnection.js')
            conn.query("select product_id, name, price, review, review_count, location from product where product_id in " + items_list, function (err, res){
                if(err) throw err;
                else{
                    var x = {
                        info : res,
                        choosen_list : json_choosen_list
                    }
        //             var base = get_cart_template();
        //             var design = ""
        //             for(let i = 0; i < res.length; i++)
        //                 design += cart_append_result(res[i]);
        //             console.log("json : " + json_choosen_list)
        //             var cart_attach = '<div class = "generate_margin"></div> <div class = "footer"> <div class = "total_amount"'+
        //                                 'id = "totalamount">TotalAmount</div> <div class = "placeorder" onclick = "placeorder()">'+
        //                                 'PlaceOrder <form action="/placeorder" method="POST" hidden><input type = "text" name = "final_list" id = "final_list" >'+
        //                                 '<input type="submit"  id = "placeorder_submit"> <textarea rows="10" cols="10" value = "" id = "wishlist" name = "wishlist" hidden></textarea>' + ' </form>'+
        //    /*adding json to html*/      '<textarea rows="10" cols="10" id = "json_totalamount_saver" hidden readonly>'+ json_choosen_list+'</textarea> '+
        //                                 ' </div> </div> </div> </div> </div></body></html>'

        //             cart_design = base + design + cart_attach
                }
                callback(x);                    
            })
        }



    module.exports.get_accountinfo = get_accountinfo
    module.exports.get_cartinfo = get_cartinfo