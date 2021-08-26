const express = require('express');
const db = require('../db_connect');

//init express
const app = express();
//init router
var router = express.Router();




//get all single info
router.get("/", (req, res) =>{
	//combine like days and sum + count
	const query = "SELECT date AS date, wgr_bet AS wgr_bet, wgr_payout AS wgr_payout, bets_placed AS bets_placed, event_id AS event_id, transaction_total AS vout_vin, supply_change AS supply_change\
				   FROM events_total ORDER BY date DESC";
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


//get all single info
router.get("/daily", (req, res) =>{
	//combine like days and sum + count
	const query = "SELECT Date(date) AS date, SUM(wgr_bet) AS wgr_bet, SUM(wgr_payout) AS wgr_payout, SUM(bets_placed) AS bets_placed, COUNT(event_id) AS event_count, SUM(transaction_total) AS vout_vin, SUM(supply_change) AS supply_change\
				   FROM events_total GROUP BY DATE(date) ORDER BY date ASC";
	//run query
	db.query(query,function(err, result){
		if(err){
			console.log(err);
		}else{
			//output data
			var data = JSON.parse(JSON.stringify(result));
			res.send(data);

			var timers = Intl.DateTimeFormat().resolvedOptions().timeZone 
			console.log(timers);

		}
	});
});



module.exports = router;
