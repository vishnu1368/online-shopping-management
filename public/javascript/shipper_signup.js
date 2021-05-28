function validate(){
    var name = document.getElementById("name").value
    var password = document.getElementById("password").value
    var mail = document.getElementById("mail").value
    // var phone = document.getElementById("phone_number").value
    // var street = document.getElementById("street").value
    var city = document.getElementById("city").value
    var state = document.getElementById("state").value
    var country = document.getElementById("country").value
   // window.alert(name + " " + password +  " " + country + " "+ state + " "  + street + " " + city + " " + mail + " " +phone)
    var x = filled(name, password, mail, city, state, country)
    var y  = true, z = true
    if(password != "")
        y = valid_password(password)
    if(mail != "")
        z = valid_email(mail)

    if(x)
        document.getElementById("fill_all_items").style.display = "none"
    else{
        document.getElementById("fill_all_items").value = "Must fill all details"
        document.getElementById("fill_all_items").style.display = "block"
    }
    
    if(y){
        if(password.length != 0)
            document.getElementById("password_error").style.display = "none"
        else{
            document.getElementById("password_error").innerHTML = "Should have atleast one special character & min 8 character"
            document.getElementById("password_error").style.display = "flex"
        }
    }
    else{
        document.getElementById("password_error").innerHTML = "Password doesn't match criteria"
        document.getElementById("password_error").style.display = "flex"
    }

    if(z)
        document.getElementById("mail_error").style.display = "none"
    else{
        document.getElementById("mail_error").value = "E-mail is not valid"
        document.getElementById("mail_error").style.display = "block"
    }

    if(x && (y && password.length > 0) && (z && mail.length > 0))
        document.getElementById("submit_signup").click()
}

function filled(){
    for(let i = 0; i < arguments.length; i++)
        if(arguments[i].length == 0)
            return false
    return true
}
function valid_password(password){
    if(password.length < 8)
        return false
   // window.alert(password)
    var list = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "{", "[", "]", "}", "\\", "/", ",", "."]
    var set = new Set(list)

    for(let i = 0; i < password.length; i++)
        if(set.has(password[i]))
            return true
    return false
}
function valid_email(mail){
    var set = new Set()
    set.add("gmail.com")
    set.add("yahoo.com")
    set.add("yahoo.in")
    set.add("hotmail.com")
    set.add("rocketmail.com")
    set.add("rediffmail.com")
    set.add("aol.com")

    var x = mail.split("@")
    if(mail.length == x[0].length)
        return false
    
    if(set.has(x[1]))
        return true
    return false
}

function add_user(detail, callback){
    var conn = require("./get_dbconnection.js")
    var q = "insert into shipper(name, password, mail_id, city, state, country) values("
    var val = "'" + detail.name + "', '" + detail.password + "','" + detail.mail + "','"+ detail.city + "','" + detail.state +"','" + detail.country+ "')"   
    conn.query(q + val, function(err, res){
        if(err)
            callback(false)
        else
            callback(true)
    })
}

module.exports.add_user = add_user