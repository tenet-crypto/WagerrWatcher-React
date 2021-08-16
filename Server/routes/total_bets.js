const express = require('express');
const db = require('../db_connect');

//init express
const app = express();
//init router
var router = express.Router();


//get all single + parlay totals summed
router.get("/", (req, res) =>{
	//combine like days and sum + count
	var query = "SELECT Date(t1.date) AS date, \
				SUM(wgr_bet) + IFNULL(t2.parlay_bet,0) AS total_wgr_bet, SUM(wgr_payout)+ IFNULL(t2.parlay_payout,0) AS total_payout, SUM(bets_placed)+ IFNULL(t2.parlay_count,0) AS total_bets_placed, COUNT(event_id) AS event_count, SUM(transaction_total) AS total_transaction, SUM(transaction_total) - ( SUM(wgr_bet)+IFNULL(t2.parlay_bet,0) ) AS supply_change\
				FROM events_total AS t1\
				LEFT JOIN(SELECT Date(date) AS date, SUM(wgr_bet) AS parlay_bet, SUM(wgr_payout) AS parlay_payout, COUNT(id) AS parlay_count FROM parlay_total GROUP BY DATE(date) ORDER BY date DESC) AS t2\
				ON DATE(t1.date)=DATE(t2.date) \
				GROUP BY DATE(t1.date) ORDER BY t1.date ASC"
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
