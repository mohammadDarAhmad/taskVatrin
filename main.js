var express = require('express');
var app = express();
const cookieSession = require("cookie-session");

const authentication = require("./AuthenticationUser/authentication");

// middlewares
app.use(express.urlencoded({ extened: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Make a session
app.use(
  cookieSession({
    keys: ["randomStringASyoulikehjudfsajk"],
  })
);

//Make connection to DB, the DB is PHPMyAdmin
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vatrin"
});


//
app.get("/", (req, res) => {
 res.render("index");
})
app.get("/login", (req, res) => {
  var masseage = null;

  res.render("login",{masseage});
})

app .get("/home", authentication, (req, res) => {
  res.render("home", { user: req.session.user });
});

//logout
app.get("/logout", authentication, (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});

// route for handling post requirests
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // check for missing filds
    if (!email || !password) {
      var masseage = "Please enter all the fields";
      res.render('login.ejs',{masseage})
      return;
    }

 con.query("SELECT * FROM user  WHERE email ='" + email + "' && password=" + password + "", function (err, result, fields) {
    if (err)
      throw err;
      if(result==0){
        var masseage = "nvalid username or password";
        res.render('login.ejs',{masseage})
      return;
      }

    console.log(result.length);

      if(result.length>0){
         
    req.session.user = {
      email,
    };
    res.redirect("/home");
      }
  });


  })



app.listen(3000); 