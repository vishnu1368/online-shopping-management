    function put_order_entry(customer_id,order_id, callback){
        var conn = require('./get_dbconnection.js')
        conn.query("select order_detail from customer where mail_id = '"+ customer_id +"'", function(err, res){
            if(err){
                console.log("Can't take customer_id for order_updation")
                throw err
            }
            else{
                var order_list = res[0].order_detail
                if(order_list == null)
                    order_list = []
                else
                    order_list = JSON.parse(order_list)
                order_list.push(order_id)
                conn.query("update customer set order_detail = '" + JSON.stringify(order_list) + "' where mail_id = '"+ customer_id +"'", function(err, res){
                    if(err){
                        console.log("Can't update order list")
                        throw err
                    }
                    callback();
                })
            }
        })
    }

    module.exports.put_order_entry = put_order_entry