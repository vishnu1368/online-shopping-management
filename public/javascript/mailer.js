    const nodemailer = require("nodemailer")
    // var address = {
    //     street :"street",
    //     city : "city",
    //     state : "state",
    //     country : "country"
    // }
    // var order_id = {
    //     time : "090909",
    //     date : "20210909"
    // }
    var transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : "vissel262@gmail.com",
            pass: "" //password for your mail account
        }
    })
    // placed_order_mail("vishnuselvaraj262@gmail.com", order_id, "shipper@gmail.com", address, function(){

    // })

    function placed_order_mail(customer_id, order_id, shipper_id, address, callback){
        var passcode = order_id["date"].split("-").join("") + order_id["time"]  + customer_id
        console.log("Order placed mail : customer" + customer_id + " shippper : " + shipper_id)
        
        var mailoption_customer = {
            from : "vissel262@gmail.com",
            to : "vishnuselvaraj262@gmail.com",
            subject : "Online Shopping",
            html : "<h1>Your order has been placed</h1><h3>Your Passcode : " + passcode + "</h3><p>Use This for order confirmation.</p>"
        }
        var mailoption_shipper = {
            from : "vissel262@gmail.com",
            to : "vishnuselvaraj262@gmail.com",
            subject : "Online Shopping",
            html : "<h3>You are assigned with order delivery</h3><h1>ADDRESS:</h1>"+
                    "<p>"+ address['street'] + "</p>"+"<br>"+
                    "<p>"+ address['city'] + "</p>"+"<br>"+
                    "<p>"+ address['state'] + "</p>"+"<br>"+
                    "<p>"+ address['country'] + "</p>"+"<br>"
        }

        transporter.sendMail(mailoption_customer, function(err, res){
            if(err){
                console.log("mail can't be send for customer")
                throw err
            }
        })
        transporter.sendMail(mailoption_shipper, function(err, res){
            if(err){
                console.log("Mail can't be send for shipper")
                throw err;
            }
            callback();
        })
    }

    function review_mail(customer_mail, passcode){
        console.log("review mail : " + customer_mail);
        var review_option = {
            from : "vissel262@gmail.com",
            to : "vishnuselvaraj262@gmail.com",
            subject : "Online Shopping",
            html : "<h3>Thanks for shopping with Us! Leave your review here!</h3>"+
                    "<form action='http://localhost:3000/review' method='POST'>"+
                    "<input type='text' name='passcode' value = '"+passcode+"' style='display: none;'>"+
                    "<input type = 'submit' value = 'Place Review' style='text-align: center; background-color: teal;width: 20vw;height: 5vh;'>"+
                    "</form>"
        }

        transporter.sendMail(review_option, function(err, res){
            if(err)
                console.log("Can't send mail for review")
        })

    }
    //review_mail("werwer", "05272021150407vishnuselvaraj262@gmail.com")
    module.exports.placed_order_mail = placed_order_mail
    module.exports.review_mail = review_mail