const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

// MySQL Code goes here

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "bookndaar",
  insecureAuth: true,
  port: 3306,
});

//user Login
app.post("/login/userCheck", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) console.log(err);
    console.log("connected as id " + connection.threadId);
    const body = JSON.parse(JSON.stringify(req.body));
    params = [body.phoneNumber, body.password];
    connection.query(
      "SELECT fullName,phoneNumber,password from userinfo where phoneNumber = ? and password = ?",
      params,
      (err, data) => {
        connection.release(); // return the connection to pool
        if (data.length == 0) {
          res.send({ fullName: "User Not Found" });
        } else if (data) {
          res.send(data[0]);
        }
      }
    );
  });
});

//User Signup
app.post("/signUp", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const params = req.body;
    connection.query("INSERT INTO userinfo SET ?", params, (err, rows) => {
      connection.release(); // return the connection to pool
      if (!err) {
        res.send({ message: "User registered successfully" });
      } else {
        // console.log(err)
        res.send({ message: err });
      }
    });
  });
});

// app.get('/allUsers', (req, res) => {
//     pool.getConnection((err, connection) => {
//         if (err) console.log(err);
//         console.log('connected as id ' + connection.threadId);

//         // params = [body.phoneNumber, body.password];
//         connection.query('SELECT * from userinfo', (err, data) => {
//             connection.release() // return the connection to pool
//             if (data.length == 0) {
//                 res.send(JSON.parse('{"message":"user not found"}'));
//                 console.log("hello");
//             }
//             else if (data) {
//                 res.send(data);
//             }
//         })
//     })
// });

//Insert Book Details
app.post("/postBookDetails", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const params = req.body;
    console.log(params);
    connection.query("INSERT INTO bookinfo SET ?", params, (err, rows) => {
      connection.release(); // return the connection to pool
      if (!err) {
        res.send({ message: "Book Added successfully" });
      } else {
        // console.log(err)
        res.send({ message: err });
      }
    });
  });
});

//Personal Ads posted by users
app.post("/postMyAds", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const params = req.body;
    console.log(params);
    connection.query("INSERT INTO user_ads SET ?", params, (err, rows) => {
      connection.release(); // return the connection to pool
      if (!err) {
        res.send({ message: "Ad Successfully Posted." });
      } else {
        // console.log(err)
        res.send({ message: err });
      }
    });
  });
});

//upload image api
app.post("/postImageUrl", (req, res) => {
  let a = Math.random() + Date.now().toString;
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + "/upload/" + a;
  sampleFile.pool.getConnection((err, connection) => {
    if (err) throw err;

    const params = req.image;
    console.log(params);
    connection.query("INSERT INTO image SET ?", params, (err, rows) => {
      connection.release(); // return the connection to pool
      if (!err) {
        res.send({ message: "Ad Successfully Posted." });
      } else {
        // console.log(err)
        res.send({ message: err });
      }
    });
  });
});

//Show my ads
app.post("/showMyAds", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const params = [req.body.phoneNumber];
    console.log(params);
    connection.query(
      "Select * From user_ads Where phoneNumber = ?",
      params,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send({ message: "Success", info: rows });
        } else {
          // console.log(err)
          res.send({ message: err });
        }
      }
    );
  });
});

//delete my Ads
app.post("/deleteMyAds", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const params = [req.body.phoneNumber, req.body.orderId];
    console.log(params);
    connection.query(
      "Delete From user_ads Where phoneNumber = ? and orderId = ?",
      params,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send({ message: "Deleted Successfully", info: rows });
        } else {
          // console.log(err)
          res.send({ message: err });
        }
      }
    );
  });
});

//update Book Details

app.post("/updateMyAds", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(req.body);
    params = [
      req.body.bookName,
      req.body.bookDesc,
      req.body.bookGenre,
      req.body.bookLocation,
      req.body.bookArea,
      req.body.bookPrice,
      req.body.orderId,
    ];
    console.log(params);
    connection.query(
      "UPDATE user_ads SET bookName = ?, bookDesc= ?,bookGenre= ?,bookLocation=?,bookArea=?,bookPrice=? WHERE orderId = ?;",
      params,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) {
          console.log("error: ", err);
          result(null, err);
          res.send({ message: "Failed" });
          return;
        } else {
          res.send({ message: "Updated Successfully" });
        }
      }
    );
  });
});

//update my profile
app.post("/books/updateUserProfile", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(req.body);
    params = [req.body.email, req.body.area, req.body.phoneNumber];
    console.log(params);
    connection.query(
      "UPDATE userInfo SET email= ?, area=? WHERE phoneNumber = ?;",
      params,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (err) {
          console.log("message: ", err);
          result(null, err);
          return;
        } else {
          res.send({ message: "Profile updated" });
        }
      }
    );
  });
});

app.post("/profileInfo", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const params = [req.body.phoneNumber];
    console.log(params);
    connection.query(
      "Select * From userinfo Where phoneNumber = ?",
      params,
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(rows[0]);
        } else {
          // console.log(err)
          res.send({ message: err });
        }
      }
    );
  });
});

app.post("/allAds", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("Select * From user_ads", (err, rows) => {
      connection.release(); // return the connection to pool
      if (!err) {
        res.send({ message: "Success", info: rows });
      } else {
        // console.log(err)
        res.send({ message: err });
      }
    });
  });
});

// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`));
