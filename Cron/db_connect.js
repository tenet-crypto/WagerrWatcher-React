var mysql = require('mysql')

var con = mysql.createConnection({
	host: 'localhost',
	user: 'bloooybt_alphadev',
	password: "",
	database: 'wgr_test'

});

con.connect(function(err) {
  if (err){
  	console.log(err);
  }else{
  	console.log("Connected!");
  }
  
});

module.exports = con;