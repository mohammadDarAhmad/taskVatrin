var express = require('express');
var app = express();

// middlewares
app.use(express.urlencoded({ extened: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//Make connection to DB, the DB is PHPMyAdmin
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vatrin"
});

app.get("/", (req, res) => {
 res.render("index");
})
app.get("/login", (req, res) => {
  res.render("login");
})


// route for handling post requirests
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // check for missing filds
    if (!email || !password) {
      res.send("Please enter all the fields");
      return;
    }

 con.query("SELECT * FROM user  WHERE email ='" + email + "' && password=" + password + "", function (err, result, fields) {
    if (err)
      throw err;
      if(result==0){
        res.send("Invalid username or password");
      }

    console.log(result.length);

      if(result.length>0){
    res.redirect("/home");
      }
  });

  
  })



app.listen(3000); 