    function welcome(){
        window.alert("welcome")
    }
    function submit(){
        document.getElementById("name").value = document.getElementById("src_name").value
        document.getElementById("street").value = document.getElementById("src_street").value
        document.getElementById("city").value = document.getElementById("src_city").value
        document.getElementById("state").value = document.getElementById("src_state").value
        document.getElementById("country").value = document.getElementById("src_country").value
        document.getElementById("order_submit").click()
    } 
    
    var detail_city
    var detail_state 
    var detail_country
    
    function get_shipper(detail, callback){
        var conn = require("./get_dbconnection.js")
        var regex = /[\s,]+/

        detail_city = detail['address']['city'].split(regex).join("").toLowerCase()
        detail_state = detail['address']['state'].split(regex).join("").toLowerCase()
        detail_country = detail['address']['country'].split(regex).join("").toLowerCase()
        //console.log(city + " : " + state + " : " + country)

        //var query = "select mail_id from shipper where lower(city) = '"+ city +"' and lower(state) = '"+ state+ "' and lower(country) = '"+ country+"'"
        conn.query("select mail_id, city, state, country from shipper", function(err, res){
            if(err) throw err
            else{
                var regex = /[\s,]+/
                var mail_id;
                // since we take drop down with no spaces, comma etc. 
                //we use regex to split those thing then we need to join all the splited words
                // check for the match in database .if match found return shipper_id else return default shipper_id.
                for(let i = 0; i < res.length; i++){ 
                    var s_city = res[i].city.split(regex).join("").toLowerCase()
                    var s_state = res[i].state.split(regex).join("").toLowerCase()
                    var s_country = res[i].country.split(regex).join("").toLowerCase()
                    
                //    console.log(s_city + " " + s_state + " " + s_country)
                //    console.log(detail_city + " " +detail_state + " " + detail_country)
                //     console.log((s_city == detail_city) + " " + (s_state == detail_state) + " " + (s_country == detail_country));
                //     console.log((s_city == detail_city) && (s_state == detail_state) && (s_country == detail_country));

                   if((detail_city == s_city) && (detail_state == s_state) && (detail_country == s_country)){
                        console.log("Got Shipper ID")
                        mail_id = res[i].mail_id
                        break;
                   }
                    else if((i + 1) == res.length)
                        mail_id = 'RamKumer@gmail.com'
                }
                callback(mail_id);
            }
        })
    }
    
    function place_order(customer_id, detail,callback){

        get_shipper(detail, function(shipper){

            var conn = require('./get_dbconnection.js')
            var temp = "insert into orders values"
            // console.log(JSON.stringify(detail))
            var period = new Date()
            var date = ("0" + period.getDate()).slice(-2)
            var month = ("0" + (period.getMonth() + 1)).slice(-2)
            var year = period.getFullYear()
            var complete_date = month + "-" + date + "-" + year

            var hr = ("0" + period.getHours()).slice(-2)
            var min = ("0" + period.getMinutes()).slice(-2)
            var sec = ("0" + period.getSeconds()).slice(-2)
            var complete_time = hr+min+sec
            // not STR_TO_DATE should have %Y (capital Y)
            var val = "('" + customer_id + "','" + shipper + "'," + 'false' + ",'" + JSON.stringify(detail) + "'," + complete_time + ",STR_TO_DATE('"+complete_date+"', '%m-%d-%Y')"+ ")"   
            conn.query(temp + val, function(err, res){
                   if(err){
                        console.log("Can't place order")
                        throw err
                    }
                    else{
                        // var x = require("./customer.js")  // no need to add order date & time to customer as we can get order details by customer id
                        var order_id = {
                            date : complete_date,
                            time : complete_time
                        }
                        // x.put_order_entry(customer_id,order_id, function(){   // placing order id to customer table
                            var y = require('./mailer.js')
                            console.log("mail_sending block")
                            y.placed_order_mail(customer_id, order_id, shipper, detail['address'], function(){ // mail about order
                                callback();
                            })
                        // })
                    }
            })
        })
    }

    function select_country(){  // contain both options and selected tag
        deselect_city()
        deselect_state()
        document.getElementById("country_drop_down").style.display = "block"
        display_select_box(1)
    }
    function deselect_country(){ // hides the drop down for country
        document.getElementById("country_drop_down").style.display = "none"
    }
    function select_state(){
        deselect_city()   // it any other drop down is active hide them all
        deselect_country()
        document.getElementById("state_drop_down").style.display = 'block'
        display_select_box(2)
    }
    function deselect_state(){
        document.getElementById("state_drop_down").style.display = "none"
    }
    function select_city(){
        deselect_country()
        deselect_state()
        document.getElementById("city_drop_down").style.display = 'block'
        display_select_box(3)
    }
    function deselect_city(){
        document.getElementById("city_drop_down").style.display = "none"
    }
    function deselect_all(){
        deselect_state()  // other than country, state, city we need to hide all drop down
        deselect_city()
        deselect_country()
    }

    //drop-down box
    function display_select_box(val){   //options containing div and selected tag
        val = "option_container"  + val
        document.getElementById(val).style.display = 'block'   
    }
    function change_box_value(ref, val){ // function from drop down template
        //window.alert("hello")
        document.getElementById("selected" + val).innerHTML = ref.innerHTML
        document.getElementById("option_container" + val).style.display = 'none'
        if(val == 1){           //added functionality for hiding the drop down
            document.getElementById("country_drop_down").style.display = 'none'
            document.getElementById("src_country").value = ref.innerHTML;
        }
        if(val == 2){              //added functionality for hiding the drop down
            document.getElementById("state_drop_down").style.display = 'none'
            document.getElementById("src_state").value = ref.innerHTML;
        }
        if(val == 3){              //added functionality for hiding the drop down
            document.getElementById("city_drop_down").style.display = 'none'
            document.getElementById("src_city").value = ref.innerHTML;
        }
    }
        module.exports.place_order = place_order