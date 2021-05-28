    const { listenerCount } = require("./get_dbconnection.js")
var conn = require("./get_dbconnection.js")

    function get_json_location_detail(callback){
        conn.query("select city, state, country from shipper", function(err, res){
            if(err){
                console.log("error occured while getting location detail from shipper")
                throw err
            }
            else{
                var city_set = new Set()
                var state_set = new Set()
                var country_set = new Set()
                
                for(var i = 0; i < res.length; i++)
                    build_json(res[i], city_set, state_set, country_set)

                var shipper_json = {
                    city:Array.from(city_set),
                    state:Array.from(state_set),
                    country:Array.from(country_set)
                }
                callback(shipper_json)
            }
        })
    }
    function build_json(data, city, state, country){
            var regex = /[\s,]+/
                                        //split words across space and append words 
            city.add(data.city.split(regex).join("").toUpperCase()) // since default separator is "," we need to put it as ""
            state.add(data.state.split(regex).join("").toUpperCase())
            country.add(data.country.split(regex).join("").toUpperCase())
    }
    // 
    // get_order_to_be_delivered("Kanagaraj@gmail.com", function (x){
    //     console.log(x)
    // })
    function customer_phoneno_helper(x, callback){
        var map = new Map()
        for(let i = 0; i < x.length; i++){
            var mail = x[i].mail_id
            mail = mail.toLowerCase()
            map.set(mail, x[i].phone_number)
        }
        callback(map)
    }
    function get_customer_phone_number(x,customer_id, callback){
        var conn = require("./get_dbconnection.js")
        conn.query("select mail_id, phone_number from customer", function(err, res){
            if(err) throw err
            else{
                customer_phoneno_helper(res, function(map){
                    for(let i = 0; i < x.detail.length; i++){
                        var  y = {
                            name : x.detail[i].name,
                            street : x.detail[i].street,
                            city : x.detail[i].city,
                            state : x.detail[i].state,
                            country : x.detail[i].country,
                            phone_number : map.get(customer_id[i]) 
                        }
                        x.detail[i] = y
                    }
                    callback(x)
                })
            }
        })
    }

    function get_order_to_be_delivered(shipper_id, callback){
        var conn = require("./get_dbconnection.js")

        conn.query("select customer_id,detail from orders where shipper_id = '" + shipper_id +"' and status = false" ,function(err, res){
            if(err) throw err
            else{
                var json_list = []
                var customer_id = []
                if(res.length == 0)
                    callback(json_list, customer_id)

                for(let i = 0; i < res.length; i++){
                    //console.log(JSON.parse(res[i]['detail'])['address'])
                    json_list.push(JSON.parse(res[i]['detail'])['address'])
                    customer_id.push((res[i].customer_id+"").toLowerCase())
    
                    if(i == res.length - 1){
                        callback(json_list, customer_id)
                    }
                }
            }
        })
    }

    //confirm_order("0725201207110112345@gmail.com", function(){})

    function confirm_order(shipper_id, passcode, callback){
        var date = passcode.slice(0, 8)
        var time = passcode.slice(8, 14)
        var mail = passcode.slice(14, passcode.length)
        date = date.slice(4) + "-" + date.slice(0,2) + "-" + date.slice(2,4)
        time = time.slice(0,2) + ":" + time.slice(2,4) + ":" + time.slice(4,6)

        var conn = require("./get_dbconnection.js")

        conn.query("update orders set status = true where customer_id = '" + mail +"' and shipper_id ='"+ shipper_id +"' and date = '" + date + "' and time = '" + time + "'", function(err, res){
            if(err) throw err
            else{
                if(res.changedRows > 0){
                    var conn = require("./mailer.js")
                    conn.review_mail(mail, passcode)
                    callback(true)
                }
                else    
                    callback(false)
            }

        })
    }

    module.exports.get_json_location_detail = get_json_location_detail
    module.exports.get_order_to_be_delivered = get_order_to_be_delivered
    module.exports.get_customer_phone_number = get_customer_phone_number
    module.exports.confirm_order = confirm_order
    