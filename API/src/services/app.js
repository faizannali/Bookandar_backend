const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// MySQL Code goes here

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bookndaar',
    insecureAuth: true,
    port: 3306
});

app.post('/login/userCheck', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        console.log('connected as id ' + connection.threadId);
        const body = JSON.parse(JSON.stringify(req.body));
        params = [body.phoneNumber, body.password];
        connection.query('SELECT phoneNumber,password from userinfo where phoneNumber = ? and password = ?', params, (err, data) => {
            connection.release() // return the connection to pool
            if (data.length == 0) {
                res.send(JSON.parse('{"message":"user not found"}'));
                console.log("hello");
            }
            else if (data) {
                res.send(JSON.parse('{"message":"user found"}'));
            }
        })
    })
});


app.get('/allUsers', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) console.log(err);
        console.log('connected as id ' + connection.threadId);
        // const body = JSON.parse(JSON.stringify(req.body));
        // params = [body.phoneNumber, body.password];
        connection.query('SELECT * from userinfo', (err, data) => {
            connection.release() // return the connection to pool
            if (data.length == 0) {
                res.send(JSON.parse('{"message":"user not found"}'));
                console.log("hello");
            }
            else if (data) {
                res.send(data);
            }
        })
    })
});


app.post('/books/updateBook', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(req.body)
        params = [req.body.bookName, req.body.bookDesc, req.body.bookLocation, req.body.bookArea, req.body.bookPrice, req.body.bookId]
        console.log(params);
        connection.query('UPDATE bookinfo SET bookName = ?, bookDesc= ?,bookLocation=?,bookArea=?,bookPrice=? WHERE bookId = ?;', params, (err, rows) => {
            connection.release() // return the connection to pool
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            else {
                res.send({ "message": "Done", "rows": rows });
            }
        })
    })
});

app.post('/books/updateUserProfile', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(req.body)
        params = [req.body.fullName, req.body.email, req.body.location, req.body.password, req.body.phoneNumber]
        console.log(params);
        connection.query('UPDATE userInfo SET fullName = ?, email= ?, location=?, password=? WHERE phoneNumber = ?;', params, (err, rows) => {
            connection.release() // return the connection to pool
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            else {
                res.send({ "message": "Done", "rows": rows });
            }
        })
    })
});

app.get('/fetch/bookDetails', (req, res) => {
    pool.getConnection((err, connection) => {
        const params = req.body
        if (err) throw err
        console.log("----------------", params);
        connection.query('SELECT * FROM bookinfo;', (err, data) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send({ "message": "Done", "rows": data });
            } else {
                console.log(err)
            }
            console.log('The data from bookDetails table are: \n', data)
        })
    })
});

app.post('/signUp', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body
        connection.query('INSERT INTO userinfo SET ?', params, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send({ "message": "User registered successfully." })
            } else {
                // console.log(err)
                res.send(err)
            }
        })
    })
});
app.post('/postBookDetails', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body
        console.log(params);
        connection.query('INSERT INTO bookinfo SET ?', params, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send({ "message": "The data from table are:11 " });
            } else {
                // console.log(err)
                res.send(err);
            }
        })
    })
});

app.post('/postMyAds', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body
        console.log(params);
        connection.query('INSERT INTO user_ads SET ?', params, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send({ "message": "Data Inserted " });
            } else {
                // console.log(err)
                res.send({ "Error": err });
            }
        })
    })
});


app.post('/deleteMyAds', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = [req.body.phoneNumber, req.body.bookName];
        console.log(params);
        connection.query('Delete From user_ads Where phoneNumber = ? and bookName = ?', params, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send({ "message": "Data deleted ", "info": rows });
            } else {
                // console.log(err)
                res.send({ "Error": err });
            }
        })
    })
});
// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))