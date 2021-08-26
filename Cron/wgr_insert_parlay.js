//require db_connection
var con = require('./db_connect');

//require node fetch
const fetch = require('node-fetch');



function get_event(skip){
	//get query URl
	var url = 'https://explorer.wagerr.com/api/bet/parlaybets?limit=1000&skip='+skip+'&opened_or_completed=false';

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

	console.log(data.data.length  == 0);

	var last_date = null;

	if(data.data.length != 0){

		//if you want to get all back to 2021
		if(type == "all"){
			//make previous date
			var prev_date = new Date();
			prev_date.setDate(prev_date.getDate() - 1);
			prev_date.setUTCHours(23,59,59,59);

			//loop data array
			data.data.forEach(function(v,k){
				if(v.betResultType != "pending"){
					//make query date using event completion
					let query_date = new Date(v.payoutDate);
					last_date = query_date;
					//use event completion date minus 1 day and make sure it is 2021
					if(query_date.getTime() <= prev_date.getTime() && query_date.getUTCFullYear() == 2021 && !past_id.includes(v._id)){

						//add to past_id
						past_id.push(v._id);

						//loop through all actions
						var wgr_bet = v.betValue;
						var wgr_payout = v.payout;

						//create obj
						var obj = {wgr_bet: wgr_bet, date: v.payoutDate, wgr_payout: wgr_payout, event_id: v.eventId };
						//add each event obj to vals array
						vals.push(obj);
					}else{
						console.log("not the right date");
					}
				}else{
					console.log('pending bet....');
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
				if(v.betResultType != "pending"){
					//make query date using event completion
					let query_date = new Date(v.payoutDate);
					console.log(query_date);
					
					//find events that wer ecompleted the previous day only
					if(query_date.getTime() >=  prev_start.getTime() && query_date.getTime() <=  prev_end.getTime() && !past_id.includes(v._id)){

						//add to past_id
						past_id.push(v._id);

						//loop through all actions
						var wgr_bet = v.betValue;
						var wgr_payout = v.payout;

						//create obj
						var obj = {wgr_bet: wgr_bet, date: v.payoutDate, wgr_payout: wgr_payout, event_id: v.eventId };
						//add each event obj to vals array
						vals.push(obj);
					}else{
						console.log("not the right date");
					}
				}else{
					console.log('pending bet....');
				}

			});
			console.log('DONE ..... insert da query!!');
			insert_query(vals);
		}
	}else{
		console.log('DONE array is empty..... insert da query!!');
		insert_query(vals);
	}
	
}

function insert_query(data){
	var values = data.map(v =>([v.date, v.wgr_bet, v.wgr_payout, v.event_id]));
	var sql = "INSERT INTO parlay_total (date, wgr_bet, wgr_payout, event_id) VALUES ?"
	con.query(sql, [values] , function(err, result){
		if(err) throw err;
		if(result){
			console.log(result);
			process.exit(0);
		}


	});
}

get_event(0);



