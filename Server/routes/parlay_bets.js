const express = require('express');
const db = require('../db_connect');

//init express
const app = express();
//init router
var router = express.Router();



//get all events info
router.get("/", (req, res) =>{
	//combine like days and sum + count
	var query = "SELECT date AS date, wgr_bet AS wgr_bet, wgr_payout AS wgr_Payout, id AS parlay_count, event_id As events  FROM parlay_total ORDER BY date DESC";
	//run query
	db.query(query,function(err, result){
		if(err){
			console.log(err);
		}else{
			//output data
			var data = JSON.parse(JSON.stringify(result));
			res.send(data);
		}
	});
});

//get all events info
router.get("/daily", (req, res) =>{
	//combine like days and sum + count
	var query = "SELECT Date(date) AS date, SUM(wgr_bet) AS wgr_bet, SUM(wgr_payout) AS wgr_payout, COUNT(id) AS parlay_count FROM parlay_total GROUP BY DATE(date) ORDER BY date ASC";
	//run query
	db.query(query,function(err, result){
		if(err){
			console.log(err);
		}else{
			//output data
			var data = JSON.parse(JSON.stringify(result));
			res.send(data);
		}
	});
});



module.exports = router;
