
    // get_order_detail("12345@gmail.com", function(list){
    //     console.log(list)
    // })
    // decrypt("05272021150407vishnuselvaraj262@gmail.com", function(x){
    //     console.log(x)
    // })

    function decrypt(en, callback){
        // 05272021150407vishnuselvaraj262@gmail.com
        var date = en.slice(0, 8)
        var time = en.slice(8, 14)
        var mail = en.slice(14)
        date = date.slice(4) + "-" + date.slice(0,2) + "-" + date.slice(2,4)
    
        time = time.slice(0,2) + ":" + time.slice(2,4) + ":" + time.slice(4,6)

        //console.log(date +" " + time + " " + mail)
        get_order_detail(mail, date, time, function(x){
            callback(x)
        })
    }

    function get_json_order_list_detail(list, map, callback){
        var x = []
        for(let i = 0; i < list.length; i++){
            if(i < list.length - 1){
                var y = {
                    id : list[i]['id'],
                    name : map.get(list[i]['id']).name,
                    location : map.get(list[i]['id']).location
                }
                x.push(y)
            }
            else
                callback(x) // getting total amount                   
        }
    }

        function get_order_detail(customer_id, date, time, callback){
            var conn = require("./get_dbconnection.js")  //get all the orders placed by logon_id
            var que = "select detail from orders where customer_id = '" + customer_id +"' and date = '"+ date+"' and time = '"+ time +"'"
            //console.log(que)
            conn.query(que, function(err, res){
                if(err){
                    console.log("Can't get mail-id while try to display order-detail")
                    throw err
                }
                else{
                  //  console.log(res)
                    var x = JSON.parse(res[0].detail) // paring
                   // console.log(x['items'])
                    get_help(function (map){  // since we need name of the product we get all the product_id along with the name in the map
                        get_json_order_list_detail(x['items'], map, function(x){
                            callback(x)
                        })
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

        // placing review
        var review_update = require('./get_dbconnection.js')
        function update_db_review(id, value, callback){
            review_update.query("select review, review_count from product where product_id = '" + id +"'", function(err, res){
                if(err)
                    console.log("Error occured")
                else{
                    var review = res[0].review
                    var review_count = res[0].review_count
        
                    review_count = Number(review_count) + 1
                    review = Number(review) + value
                    var res = review

                    if(review_count > 1)
                        res = review / 2
        
                    res = res.toFixed(7)
        
                    review_update.query("update product set review = " + res + ", review_count = "+ review_count +" where product_id = '"+ id +"'", function(err, res){
                        if(err)
                            throw err
                        else{
                            //console.log("review set")
                            callback();
                        }
                    })
                }   
                    
            })
        }

        function update_review(list, callback){
            list = JSON.stringify(list)
            list = list.slice(1, list.length - 1)
            var review_list = list.split(",") // getting all product review separate
            var json_list = []

            for(let i = 0; i < review_list.length; i++){
                var split = review_list[i].split(":") // separate value and their id's
                split[0] = split[0].slice(1, split[0].length - 1) // removing the double coats
                split[1] = split[1].slice(1, split[1].length - 1)
                var x = {
                    id : split[0],
                    rating : parseFloat(split[1])
                }
                json_list.push(x)
            }
            // console.log(json_list)
            for(let i = 0; i < json_list.length; i++){
                update_db_review(json_list[i].id, Number(json_list[i].rating), function(){})
                if(i == json_list.length - 1)
                    callback()
            }
            
        }

        function validate_review(index){
            var x = document.getElementById(index).value
            x = Number(x)
            if(x > 5)
                x = 5
            else if(x < 0 || x == "")
                x = 0      
            document.getElementById(index).value = x
        }

        function do_submit(){
            document.getElementById("review_submit").click()
        }

    module.exports.decrypt = decrypt
    module.exports.update_review = update_review