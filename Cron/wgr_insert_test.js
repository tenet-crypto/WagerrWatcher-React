//require db_connection
var con = require('./db_connect');

//require node fetch
const fetch = require('node-fetch');



function get_event(skip){
	//get query URl
	var url = 'https://explorer.wagerr.com/api/bet/events/info?limit=1000&skip='+skip+'&opened_or_completed=false';

	fetch(url)
		.then(response => response.json())
		.then(data => {
			var result = data;
			/*sort_data(result, 'all');*/
			sort_data(result, 'all');
			
		})
		.catch(error => {
			console.log(error);
		});



}
var vals =[];
var past_id =[];
var skipper = 0;

function sort_data(data,type){
	

	var last_date = null;

	//if you want to get all back to 2021
	if(type == "all"){
		//make previous date
		var prev_date = new Date();
		prev_date.setDate(prev_date.getDate() - 1);
		prev_date.setUTCHours(23,59,59,59);

		//loop data array
		data.data.forEach(function(v,k){

			//make query date using event completion
			let query_date = new Date(v.completedAt);
			last_date = query_date;
			//use event completion date minus 1 day and make sure it is 2021
			if(query_date.getTime() <= prev_date.getTime() && query_date.getUTCFullYear() == 2021 && !past_id.includes(v._id)){

				//add to past_id
				past_id.push(v._id);

				//loop through all actions
				var wgr_bet = 0;
				var wgr_payout = 0;
				var bet_count = 0;
				v.actions.forEach(function(vv,kk){
					if(vv.betResultType != "pending"){
			            //Pending = cause error.... should be either win or lose
			            wgr_bet  += vv.betValue 
			            wgr_payout += vv.payout
			            bet_count ++;
			        }
					
				});

				var sport_type = null;
				//loop through event and get sport
				if(v.events[0].transaction.sport){
					sport_type = v.events[0].transaction.sport
				}
				

				//loop through results vin
		        var vin = 0;
		        v.results[0].payoutTx.vin.forEach(function(vv,kk){
		          vin += vv.value;
		        });
		        //loop through results vout
		        var vout = 0;
		        v.results[0].payoutTx.vout.forEach(function(vv,kk){
		          vout += vv.value;
		        });


		        //create obj
				var obj = {event_id: v._id, sport: sport_type, date: v.completedAt, wgr_bet: wgr_bet, wgr_payout: wgr_payout, bet_count: bet_count, transaction_total: eval(vout - vin), supply_change: eval((vout - vin) - wgr_bet)};
				//add each event obj to vals array
				vals.push(obj);
			}else{
				console.log("not the right date");
				
			}

		});
		
	
		if( last_date.getUTCFullYear() == 2021 ){
			skipper += 995;
			get_event(skipper);
			console.log("still 2021... skipper = ");
			console.log(skipper)
		}else{
			console.log('DONE ..... insert da query!!');
			insert_query(vals);
		}

	}else if(type == "day"){
		//make previous date
		var prev_start = new Date();
		prev_start.setDate(prev_start.getDate() - 1);
		prev_start.setUTCHours(00,00,00,00);

		var prev_end = new Date();
		prev_end.setDate(prev_end.getDate() - 1);
		prev_end.setUTCHours(23,59,59,59);
		//loop data array
		data.data.forEach(function(v,k){

			//make query date using event completion
			let query_date = new Date(v.completedAt);
			console.log(query_date);
			
			//find events that wer ecompleted the previous day only
			if(query_date.getTime() >=  prev_start.getTime() && query_date.getTime() <=  prev_end.getTime() && !past_id.includes(v._id)){

				//add to past_id
				past_id.push(v._id);

				//loop through all actions
				var wgr_bet = 0;
				var wgr_payout = 0;
				var bet_count = 0;
				v.actions.forEach(function(vv,kk){
					if(vv.betResultType != "pending"){
			            //Pending = cause error.... should be either win or lose
			            wgr_bet  += vv.betValue 
			            wgr_payout += vv.payout
			            bet_count ++;
			        }
					
				});

				//loop through results vin
		        var vin = 0;
		        v.results[0].payoutTx.vin.forEach(function(vv,kk){
		          vin += vv.value;
		        });
		        //loop through results vout
		        var vout = 0;
		        v.results[0].payoutTx.vout.forEach(function(vv,kk){
		          vout += vv.value;
		        });

		        var sport = null;
				//loop through event and get sport
				v.events[0].transaction.forEach(function(vv,kk){
					sport = vv.sport;
				});

		        //create obj
				var obj = {event_id: v._id, sport: sport, date: v.completedAt, wgr_bet: wgr_bet, wgr_payout: wgr_payout, bet_count: bet_count, transaction_total: eval(vout - vin), supply_change: eval((vout - vin) - wgr_bet)};
				//add each event obj to vals array
				vals.push(obj);
			}else{
				console.log("not the right date");
			}

		});
		console.log('DONE ..... insert da query!!');
		insert_query(vals);
	}
	
}

function insert_query(data){
	var values = data.map(v =>([v.event_id, v.sport, v.date, v.wgr_bet, v.wgr_payout, v.bet_count, v.transaction_total, v.supply_change]));
	var sql = "INSERT INTO events_total_2 (event_id, sport, date, wgr_bet, wgr_payout, bets_placed, transaction_total, supply_change) VALUES ?"
	con.query(sql, [values] , function(err, result){
		if(err) throw err;
		if(result){
			console.log(result);
			process.exit(0);
		}
		


	});
}

get_event(0);



