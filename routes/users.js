var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vatrin"
});
// Create custom homepage
// --------------------------------------------------
router.get("/", (req, res) => {
  con.query("SELECT * FROM `user` WHERE 1", function (err, result, fields) {
    if (err)
      throw err;
  
    var userss=[];
    result.forEach(elemnt => {
      userss.push(elemnt);
    });

  res.render("users",{userss});
})
})

router.get('/:id', function(req, res) {

  const ID = req.params.id;
  con.query("SELECT * FROM user  WHERE ID =" + ID + "", function (err, result, fields) {
    if (err)
      throw err;
      if(result==0){
        var masseage = "The system not have this user";
        res.render('login.ejs',{masseage})
      return;
      }

    console.log(result.length);

      if(result.length>0){
        var Address =   result[0].addresss; 
        var email =   result[0].email; 
        var Name =   result[0].Name; 
        var masseage = null;
        res.render('profile.ejs',{Name:Name,email :email,Address:Address,ID: ID,masseage:masseage})
        res.status(200);
      }
    

    })
  })

  router.post('/:id', function(req, res) {
    
    const ID = req.params.id;

    const { Name,email, password,Address } = req.body;

    if (!Name||!email || !password||!Address) {
      var masseage = "Please enter all the fields";
      res.render('profile.ejs',{Name,email,Address,ID,masseage})
      return;
    }
    
    console.log("1name = "+Name+", email = "+ email+", password = "+password+", Address= "+ Address);

    con.query("SELECT * FROM user  WHERE ID ="+ID+"", function (err, result, fields) {
      if (err)
      throw err;

   
      if(result==0){
        var masseage = "The system not have this user";
        res.render('profile.ejs',{masseage})
      return;
      }


      console.log(result.length);

     
    
          con.query("UPDATE `user` SET `Name`='"+Name+"',`password`='"+password+"',`addresss`='"+Address+"',`email`='"+email+"' WHERE  id="+ID+"", function (err, res, fields) {
       
          if (err)
          throw err;
      
        var masseage = null;
   
      })
      req.session.user =null;
      req.session.user = {
        email,id:ID
      };
      res.redirect("/home");
      res.status(200);

  })
  })
module.exports = router;