
    // get_order_detail("12345@gmail.com", function(list){
    //     console.log(list)
    // })

    function get_json_order_list_detail(list, map, callback){
            var x = []
            for(let i = 0; i < list.length; i++){
                if(i < list.length - 1){
                    var y = {
                        name : map.get(list[i]['id']).name,
                        location : map.get(list[i]['id']).location,
                        price : list[i]['price']
                    }
                    x.push(y)
                }
                else
                    callback(x, list[i]['price']) // getting total amount                   
            }
    }
        
        var json_order_list
        function get_order_detail(customer_id, callback){
            var conn = require("./get_dbconnection.js")  //get all the orders placed by logon_id
            conn.query("select status, detail, date from orders where customer_id = '" + customer_id +"'", function(err, res){
                if(err){
                    console.log("Can't get mail-id while try to display order-detail")
                    throw err
                }
                else{
                    json_order_list = []
                    if(res.length == 0)     //if no order palced, then return empty list
                        callback(json_order_list)
                    else 
                        get_help(function (map){  // since we need name of the product we get all the product_id along with the name in the map
                            for(let i = 0; i < res.length; i++){ // for each order map the product_id to its id and generate the json for display detail
                                var parsed = JSON.parse(res[i].detail)
                                // console.log( parsed['items']+"  "+parsed['items'][0]['price'])
                                //console.log(parsed['items'] + " " + parsed['items'].length)
                                get_json_order_list_detail(parsed['items'], map, function(json_list, total_amount){
                                    var y = 'UnDelivered' // check for delivery status
                                    if (res[i].status)
                                        y = 'Delivered'
                                    var x = res[i].date;
                                    // console.log((x + "").slice(4,15))
                                    var x = {
                                        date : (res[i].date + "").slice(4,15),
                                        status : y,
                                        totalamount : Math.round(total_amount), 
                                        detail : json_list
                                    }
                                    json_order_list.push(x) 
                                    if(res.length - 1 == i){
                                        //console.log(json_order_list)
                                        callback(json_order_list)
                                    }
                                })
                            }
                        })
                }
            })
        }

        function get_help(callback){
            var conn = require("./get_dbconnection.js")
            conn.query("select product_id, name,location from product", function(err2, res2){
                if(err2){
                    console.log("can't take product id and name")
                    throw err2
                }
                else{
                    var map = new Map()
                    for(var i = 0; i < res2.length; i++){
                        var x = {
                            name : res2[i].name,
                            location : res2[i].location
                        }
                        map.set(res2[i].product_id, x)
                        //map.set(res2[i].product_id, res2[i].name)
                    }
                    callback(map)
                }
            })
        }



        function make_visible(x){
            var visibility = document.getElementById("container"+x)
            if(visibility.style.display == "flex")
                visibility.style.display = "none"
            else    
                visibility.style.display = "flex"
        }


        module.exports.get_order_detail = get_order_detail

