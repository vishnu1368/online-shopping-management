        const mysql = require('mysql')

        var pool = mysql.createPool({
            host : 'localhost',
            port : '3306',
            user : 'root',
            password : 'root',
            database : 'onlineshopping'
        })

        pool.getConnection(function(err, conn){
            if(err)
                throw err
            else
                console.log("pool created")
        })

        pool.on('error', function(err){
            console.log(err.code)
        })
        module.exports = pool