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
var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');
app.use('/user', usersRouter);
app.use('/', indexRouter);


app.get("/login", (req, res) => {
  var masseage = null;

  res.render("login",{masseage});
  res.status(200);

})


app .get("/home", authentication, (req, res) => {
  var masseage = null;
  res.render("home", {masseage, user: req.session.user });
});

//logout
app.get("/logout", authentication, (req, res) => {
  req.session.user = null;
  res.status(200);
  res.redirect("/login");
  
});

app.get("/register", (req, res) => {
  var masseage = null;
  res.render("register",{masseage});
})

  app.get('/delete/:id', authentication, function(req, res) {
    
  const ID = req.params.id;
  con.query("DELETE FROM `user` WHERE id ="+ID+"", function (err, result, fields) {
    console.log("Join delete");
    console.log(err);

    if (err)
      throw err;

      if(result==0){
        var masseage = "The system not have this user";
        res.render('profile.ejs',{masseage})
      return;
      }

  
        var masseage = "The user is Deleted";

        // if(req.session.user.email=="admin@vatring.com"){
        //   res.render('.ejs',{masseage,user})

        // }
        req.session.user = null;
        res.render('index.ejs',{masseage})

      
    })
     })

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
       var id=  result = result[0].ID;
    req.session.user = {
      email,id
    };
    res.redirect("/home");
    res.status(200);

      }
  });
  


  })

app.post("/register", async (req, res) => {
    const { Name,email, password,Address } = req.body;
    // check for missing filds
    if (!Name||!email || !password||!Address) {
      var masseage = "Please enter all the fields";
      res.render('register.ejs',{masseage})
      return;
    }
    console.log("name = "+Name+", email = "+ email+", password = "+password+", Address= "+ Address);

    con.query("SELECT * FROM user  WHERE email ='" + email + "' || Name='" + Name + "'", function (err, result, fields) {
      if (err)
        throw err;
        console.log(result.length);

        if(result.length>0){
          var masseage = "A user with that email already exits please try another one!";
          res.render('register.ejs',{masseage})
          return
        }
   
    con.query("INSERT INTO `user` ( `Name`, `password`, `addresss`, `email`) VALUES ( '"+Name+"', '"+password+"', '"+Address+"', '"+email+"')", function (err, result, fields) {

      if (err)
        throw err;
      console.log(result.length);
  
      var masseage = "You resgister to the website";
      res.render('login.ejs',{masseage})
    return;
      
      });
  });
    

  });

app.listen(3000); 