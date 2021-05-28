const express = require('express')
const app = express()

app.use(express.static("public")) 
app.use(express.urlencoded({extended : true}))
app.set("view engine", "ejs")

var login_id = '12345@gmail.com'

        app.post("/search", function(req, res){ // takes the query string and split across each space and comma symbol and looks for match in product desc if it matches then display the result
            var search_string = req.body.search;
                            //console.log("seached for " + search_string)
            var wishlist = req.body.wishlist
           // console.log("From serach wishlist : " + wishlist)
            
            if(wishlist != "" && wishlist != undefined){
                var x_wishlist = require("./public/javascript/wishlist.js")
                x_wishlist.update_cart(login_id, wishlist, function(){})
            }

            var search_arr = []
            var set = new Set()
            var regex = /[\s,]+/

            search_arr = search_string.split(regex)
            for(let i = 0; i < search_arr.length; i++)
                set.add(search_arr[i])
                                //   for(const k of set)
                                //     console.log(k)   // getting the split of words
            var con = require('./public/javascript/product.js')  // getting the execute_query function

            con.execute_query(function (search_string, query_output){   // since nodejs is asynch we need to make synch by executing sequentially. 
                // note we need to call the call back function at the end of parent funct. should see the execute_funct.
                var hasrelation = []
                for(let i = 0; i < search_string.length; i++){   // getting the matched record from the database
                    var temp = search_string[i].words()
                    for(let j = 0; j < temp.length; j++)
                            if(set.has(temp[j])){
                                hasrelation.push(search_string[i].id);
                                break;
                            }
                }
                        //console.log("related : " + hasrelation)
                    
                    var design = "";
                    if(hasrelation.length != 0){
                            var tempset = new Set()
                            for(let i = 0; i < hasrelation.length; i++)
                                tempset.add(hasrelation[i])

                            con.getdesign(tempset,query_output,function (design){
                                res.send(design)        
                            })
                    }
                    else
                            con.getemptydesign(function(gotdesign){
                                design = gotdesign
                                res.write(design);
                                res.send()        
                            })
            })
        })

        app.post("/account", function(req, res){  // modify display view : divided screen and put left and right container
            var wishlist = req.body.wishlist
            // console.log("From account wishlist : " + wishlist)
            if(wishlist != ""){
                var x = require("./public/javascript/wishlist.js")
                x.update_cart(login_id, wishlist, function(){})
            }
            res.sendFile(__dirname + "/account.html")
        })

        app.get("/account-info", function(req, res){  // gets the account info and displays in the screen
            var x = require('./public/javascript/account.js')
            x.get_accountinfo(login_id, function(account_info){
               // console.log("got : " + account_info)
                res.send(account_info)
            })
        })
        app.get("/cart", function(req, res){  // takes values from session storage and gives to show-cart
                res.sendFile(__dirname +"/get_cartvalue.html")
        })
        app.post("/show_cart", function(req, res){   // takes input(contains product id which has been added to cart) from session storage using /cart. shows the cart page. 
            var account_js = require('./public/javascript/account.js')
            var cart_js = require('./public/javascript/cart.js')
            var y = JSON.parse(req.body.cart_added_list)
            y = y + ""

            var choosen_set = new Set(y.split(",")) // if you try to build set from string, it will take each char as a key
            
            if(y.length == 0)
                y = "'empty'"
            y = '(' + y + ')'
        
            cart_js.init_totalamount(choosen_set, function(json_choosen_list){ 
                //console.log(json_choosen_list)
                account_js.get_cartinfo(y,json_choosen_list, function(design){ // y is the added items to cart and json_choosen list is amount for those items
                    //res.send(design)                                            // since in cart customer can remove some items
                    res.render("cart.ejs", list = design)
                }) 
               // console.log(choosen_set)
               // res.send("<h1>hello</h1>")
            })
        })  
        app.get("/wishlist", function (req, res){  // takes the wish list from db and render it in the screen
            var x = require("./public/javascript/wishlist.js")
            x.get_wishlist(login_id, function(json_wishlist){
                    res.render("wishlist.ejs", list = json_wishlist)
            })
        })
        app.post("/remove_wishlist", function(req, res){ // called by the update btn in wishlist panel
            var x = req.body.remove_wishlist
            console.log("Remove list : " + x)

            if(x != ""){
                var y = require("./public/javascript/wishlist.js")
                y.remove_wishlist(login_id, JSON.parse(x), function(){
                    res.redirect("/wishlist")
                })
            }
            else{
                console.log("empty")
                res.redirect("/wishlist")
            }
        }) 
        app.get("/order-detail", function(req, res){  // get the order detail from db and render the info
            var x = require("./public/javascript/order_detail.js")
            x.get_order_detail(login_id, function(json_order_detail){
                res.render("order_Detail.ejs",list = json_order_detail)
            })
        })

        var list_to_be_ordered      //global variable which stores the list of product to be ordered, which avoids duplicating work of getting the ordered
                                    // list.if its not here we need to keep track of ordered list during delivery adress verification
        
        app.post("/placeorder", function(req, res){ // place order is executed when placeorder btn is clicked
            list_to_be_ordered = JSON.parse(req.body.final_list)  // from cart_list which is from account.js
            
            var wishlist = req.body.wishlist
            
            //wishlist
            if(wishlist != ""){ // check if any wish list added, if added then made entry in db
                var x_wishlist = require("./public/javascript/wishlist.js")
                x_wishlist.update_cart(login_id, wishlist, function(){})
            }


            var x = require("./public/javascript/cart.js")
            x.init_totalamount(new Set(list_to_be_ordered), function(json_choosen_list){
                    list_to_be_ordered = json_choosen_list
                    var y = require('./public/javascript/shipper.js')
                    y.get_json_location_detail(function(shipper_json){
                        console.log("shipper detail" + shipper_json)
                       res.render("placeorder.ejs", shipper_json) 
                    })
            })
        })

        app.post("/order", function(req, res){  //function which makes order completion
            var person_name = req.body.name;
            var s_street = req.body.street
            var s_city = req.body.city
            var s_state = req.body.state
            var s_country = req.body.country
            var order_detail = {
                address : {
                    name : person_name,
                    street : s_street,
                    city : s_city,
                    state : s_state,
                    country : s_country                    
                },
                items : JSON.parse(list_to_be_ordered) // need to parse since we stringgyfied the list
            }
            // var k = require("./public/javascript/get_dbconnection.js")
            // k.query("insert into test_json values('" +JSON.stringify(order_detail)+ "')", function(err, res){
            //     if(err)
            //         console.log("not valid")
            //     else    
            //         console.log("valid");
            // })
            var x = require("./public/javascript/placeorder.js")
            x.place_order(login_id, order_detail, function(rep){
                res.redirect("/product")
            })
        })

        var shipper_id = "Kanagaraj@gmail.com"  // shipper_id

        app.get("/shipper_section", function(req, res){ // get the info about orders. called when shipper logged in
            var conn = require("./public/javascript/shipper.js")

            conn.get_order_to_be_delivered(shipper_id, function(x, customer_id){ //gets the info about order from order table and also takes cusotmer id from order for getting the phone number
                var x = {
                    detail : x,
                    error : false
                }
                conn.get_customer_phone_number(x, customer_id, function(delivery_list){ //gets the customer phn number from customer column
                    res.render("shipper.ejs", list = delivery_list)
                })
            })
        })

        
        app.post("/delivered_order", function(req, res){ // validates the order delivery with passcode. if error occurs renders the error msg to shipper
                                                        
                                                        // called when shipper tries to submit the passcode
            var conn = require("./public/javascript/shipper.js")
            conn.confirm_order(shipper_id, req.body.passcode, function(is_valid){ // mon date yr hr min sec mail (passcode)
                conn.get_order_to_be_delivered(shipper_id, function(x, customer_id){
                    var delivery_list = {
                        detail : x,
                        error : !is_valid
                    }
                    conn.get_customer_phone_number(delivery_list, customer_id, function(list_delivery){
                        res.render("shipper.ejs", list = list_delivery)                   
                    })
                })
            })
        })

        app.post("/review", function(req, res){ //getting the encoded msg and decode it and it will find the entry in orders table and display it on the screen
            //var encrpty = "0725201207110112345" // mon date yr hr min sec mail
            var encrpty = req.body.passcode

            var x = require("./public/javascript/review.js")

            x.decrypt(encrpty, function(y){
                res.render("review.ejs", list = y)
            })
        })

        app.post("/review_customer", function(req, res){
            // console.log(JSON.stringify(req.body))
            var x = require("./public/javascript/review.js")
            x.update_review(req.body, function(){
                res.send("<h1>Your review has been added! Keep in touch with Us!</h1>")
            })
        })

        app.post("/signup", function(req, res){
            var username = req.body.name;
            var mail = req.body.mail
            var password = req.body.password
            var phone = req.body.phone_number
            var street = req.body.street
            var city = req.body.city
            var state = req.body.state
            var country = req.body.country

            //console.log(username + " " + mail + " " + password + " " + street + " " + city + " " + state + " " + city + " " + country)

            var json_signup_info = {
                name : username,
                mail : mail,
                password : password,
                phone : phone,
                street : street,
                city : city,
                state : state,
                country : country
            }
            var x = require("./public/javascript/signup.js")
            x.add_user(json_signup_info, function(x){
                if(x)
                    res.sendFile(__dirname +"/login.html")
                else    
                    res.render("signup.ejs", list = json_signup_info)
            })
            // res.render("signup.ejs", list = json_signup_info)
        })

        app.post("/login", function(req, res){
            var mail = req.body.mail_id
            var password = req.body.password

            // var json_login_detail = {
            //     mail : mail,
            //     password : password,
            //     valid_mail : true,
            //     valid_password : true
            // }
            var x = require('./public/javascript/login.js')
            x.try_login(mail, password, function(x){
                if(x.valid_mail && x.valid_password){
                    login_id = mail
                    res.sendFile(__dirname +"/product.html")
                }
                else
                    res.render("login.ejs", list = x)
            })
        })

        app.post("/forgotpassword", function(req, res){
            var mail = req.body.mail_id
            var password = req.body.password

            var json_forgotpassword_info = {
                mail : mail,
                password : password
            }
            var x = require("./public/javascript/login.js")
            x.try_change_password(json_forgotpassword_info.mail, json_forgotpassword_info.password, function(x){
                if(x)
                    res.sendFile(__dirname + "/login.html")
                else
                    res.render("forgotpassword.ejs", list = json_forgotpassword_info)
            })
        })

        //shipper-login info

        app.post("/shipper_signup", function(req, res){
            var username = req.body.name;
            var mail = req.body.mail
            var password = req.body.password
            // var phone = req.body.phone_number
            // var street = req.body.street
            var city = req.body.city
            var state = req.body.state
            var country = req.body.country

            var json_signup_info = {
                name : username,
                mail : mail,
                password : password,
                city : city,
                state : state,
                country : country
            }
            var x = require("./public/javascript/shipper_signup.js")
            x.add_user(json_signup_info, function(x){
                if(x)
                    res.sendFile(__dirname +"/shipper_login.html")
                else    
                    res.render("shipper_signup.ejs", list = json_signup_info)
            })
        })

        app.post("/shipper_login", function(req, res){
            var mail = req.body.mail_id
            var password = req.body.password

            var x = require('./public/javascript/shipper_login.js')
            x.try_login(mail, password, function(x){
                if(x.valid_mail && x.valid_password){
                    shipper_id = mail
                    // console.log(shipper_id)
                    res.redirect("/shipper_section")
                }
                else
                    res.render("shipper_login.ejs", list = x)
            })
        })

        app.post("/shipper_forgotpassword", function(req, res){
            var mail = req.body.mail_id
            var password = req.body.password

            var json_forgotpassword_info = {
                mail : mail,
                password : password
            }
            var x = require("./public/javascript/shipper_login.js")
            x.try_change_password(json_forgotpassword_info.mail, json_forgotpassword_info.password, function(x){
                if(x)
                    res.sendFile(__dirname + "/shipper_login.html")
                else
                    res.render("shipper_forgotpassword.ejs", list = json_forgotpassword_info)
            })
        })





        app.get("/product", function(req, res){
            res.sendFile(__dirname +"/product.html")
        })


        app.get("/product", function(req, res){
            res.sendFile(__dirname +"/product.html")
        })
        app.get("/forgotpassword", function(req, res){
            res.sendFile(__dirname +"/forgotpassword.html")
        })
        app.get("/signup", function(req, res){
            res.sendFile(__dirname +"/signup.html")
        })
        app.get("/login", function(req,res){
            res.sendFile(__dirname +"/login.html")
        })

        app.get("/shipper_forgotpassword", function(req, res){
            res.sendFile(__dirname +"/shipper_forgotpassword.html")
        })
        app.get("/shipper_signup", function(req, res){
            res.sendFile(__dirname +"/shipper_signup.html")
        })
        app.get("/shipper_login", function(req,res){
            res.sendFile(__dirname +"/shipper_login.html")
        })

        app.get("/type_of_user", function(req, res){
            res.sendFile(__dirname + "/type_of_user.html")
        })

        app.post("/user_choose", function(req, res){
            var choice = req.body.choosen
            choice = choice.toLowerCase()
            console.log(choice)
            if(choice == 'shipper')
                res.sendFile(__dirname + "/shipper_login.html")
            else
                res.sendFile(__dirname + "/login.html")
        })

        app.post("/", function(req, res){
            console.log("general post")
        })
        
        app.get("/", function(req, res){
            res.sendFile( __dirname +"/product.html")
        })

        app.listen(3000, function(req, res){
            console.log("server listing on port 3000")
        })