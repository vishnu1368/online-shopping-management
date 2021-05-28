function validate(){
    var mail = document.getElementById("mail").value
    var password = document.getElementById("password").value
    mail = mail.toLowerCase()
    password = password.toLowerCase()
    //window.alert(mail + " " + password)
    
    var x = valid_email(mail)
    var y = valid_password(password) 

    if(x && y)
        document.getElementById("submit_btn").click()
    else {
        if(!x){
            document.getElementById("mail_error").value = "E-mail not valid"
            document.getElementById("mail_error").style.display = "block"
        }
        else
            document.getElementById("mail_error").style.display = "none"
        if(!y){
            if(password.length == 0)
                document.getElementById("password_error").innerHTML = "Should have atleast one special character & min 8 character"
            else
                document.getElementById("password_error").innerHTML = "Password doesn't match the criteria"
            document.getElementById("password_error").style.display = "flex"
        }
        else
            document.getElementById("password_error").style.display = "none"
    }
}

function valid_password(password){
    if(password.length < 8)
        return false
   // window.alert(password)
    var list = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "{", "[", "]", "}", "\\", "/", ",", "."]
    var set = new Set(list)

    for(let i = 0; i < password.length; i++)
        if(set.has(password[i])){
            return true
        }
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

function submit_signup(){
    document.getElementById("signup_submit").click()
}
function submit_forgotpassword(){
    document.getElementById("forgotpassword_submit").click()
}
function try_login(mail_id,password, callback){
    var conn  = require("./get_dbconnection.js")
    conn.query("select password from shipper where mail_id = '" + mail_id +"'", function(err, res){
        if(err){
            console.log("Error while loggin")
            throw err
        }
        else{
            var x
            if(res.length == 0){
                 x = {
                    mail : mail_id,
                    password : password,
                    valid_mail : false,
                    valid_password : true
                }
                callback(x)
            }
            else{
                if(password != res[0].password){
                    x = {
                        mail : mail_id,
                        password : password,
                        valid_mail : true,
                        valid_password : false
                    }
                }
                else{
                    x = {
                        mail : mail_id,
                        password : password,
                        valid_mail : true,
                        valid_password : true
                    }
                }
                callback(x)
            }
        }
    })
}

function try_change_password(mail, password, callback){
    var conn = require("./get_dbconnection.js")
    conn.query("")
    conn.query("update shipper set password = '"+password +"' where mail_id = '" + mail + "'", function(err, res){
        if(err){
            console.log("Error while updating")
            throw err
        }                
        else{
            if(res.affectedRows > 0)
                callback(true)
            else    
                callback(false)
        }
    })       
}

// try_change_password("123345@gma.com", "12233", function(x){
//     console.log(x)
// })

// try_login("12345@gmail.com", "passWord", function(x){
//     console.log(x)
// })

module.exports.try_login = try_login
module.exports.try_change_password = try_change_password