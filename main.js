var express = require('express');
var app = express();

app.use(express.static("public"));
app.set("veiw engine","ejs");
app.get('/', function (req, res) {

    var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "health"
});

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM hospital", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
});
});

app.listen(3000); 