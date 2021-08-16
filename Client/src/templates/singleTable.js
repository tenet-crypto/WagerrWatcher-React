import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';

function SingleTable(prop){
	var coinInfo = prop.coin;
	var data = prop.data;

	const [rows, setRows] = useState(null);
	const [footer, setFooter] = useState(null);
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");
	const [button, setButton] = useState(false);

	useEffect(() => {
		if(data !== false){
			//get start and stop dats
			var dates = sortDates(data);
			//set dates
			setStart(dates[0]);
			setEnd(dates[1]);
			//for reset buttto
			setRows( makeTableRows(data) );
		}
	},[prop.data])

	useEffect(() =>{
		if(data !== false){
			setFooter( makeTableFooter(data, start, end ));
		}
	},[start,end])

	useEffect(() =>{
		if (button === true){
			//resort
			setFooter( makeTableFooter(data, start, end ));
			sortTable();
			setButton(false);
		}
		
	},[button])


	function makeTableRows(data){

		
		var table_info = data.map((v,k) =>
			<tr key={"single_row_"+k} data-date={moment(new Date(v.date)).format("YYYY-MM-DD")}>
				<td data-label="Rank" id={"single_rank_"+k}>{eval(k+1) }</td>
				<td data-label="Date" id={"single_date_"+k} >{ moment.utc(v.date).format("MMM DD, YYYY") }</td>
				<td data-label="# of Completed Events" id ={"single_events_"+k}>{v.event_count}</td>
				<td data-label="Single Bets" id={"single_bet_"+k}>{<NumberFormat 
										value={v.wgr_bet}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={eval(v.wgr_bet * coinInfo.usd)}
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>
				<td data-label="# of Single Bets" id={"single_bet_count_"+k}>{v.bets_placed}</td>
				<td data-label="Single Bets Payout" id={"single_payout_"+k}>{<NumberFormat 
										value={v.wgr_payout}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={eval(v.wgr_payout * coinInfo.usd)}
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>
				<td data-label="Single Bets Supply Change" id={"single_chnage_"+k}>{<NumberFormat 
										value={v.supply_change}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={v.supply_change}
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>
			</tr>
		)

		return table_info
	}

	function sortTable(){
		///get value of both and conver to unix time
		var s_date = moment(document.getElementsByName("start")[0].value).format("YYYY-MM-DD");
		var e_date = moment(document.getElementsByName("end")[0].value).format("YYYY-MM-DD");

		//hide table rows
		var t_body = document.getElementsByClassName("table-sort")[0];
		for(var i=0; i < t_body.rows.length; i++){
				var row_date = t_body.rows[i].dataset.date;
	
			if( unixTime(s_date) > unixTime(row_date) || unixTime(row_date) > unixTime(e_date)){
				t_body.rows[i].style.display = "none";
			}else{
				t_body.rows[i].style.display = "";
			}
		}

		//update table totals
		setStart(s_date);
		setEnd(e_date);
	
		//unix time helper
		function unixTime(date){
			var new_date = new Date(date).getTime();
			return new_date;
		}
	}

	function sortDates(data){
		var start = "";
		var end = "";

		//sum table totals
		data.forEach(function(v,k){
			//query = first = oldest
			if(k === 0){
				start = moment(v.date).format("YYYY-MM-DD");	
			}
			end = moment(v.date).format("YYYY-MM-DD");
			
		});

		return [start, end];
	}
	function resetSort(){

		var date = sortDates(data);
		//set new start or end
		setStart(date[0]);
		setEnd(date[1]);
		setButton(true);
	}
	function makeTableFooter(data, start, end){

		var total_events_count = 0;
		var total_bet = 0;
		var total_bets_count = 0;
		var total_payout = 0;
		var total_change = 0;

		//sum table totals
		data.forEach(function(v,k){
			if( unixTime(moment(v.date).format("YYYY-MM-DD")) >= unixTime(start) && unixTime(moment(v.date).format("YYYY-MM-DD")) <= unixTime(end) ){
				total_events_count += v.event_count;
				total_bet += v.wgr_bet;
				total_bets_count += v.bets_placed;
				total_payout += v.wgr_payout;
				total_change += v.supply_change;
			}
		});
		//unix time helper
		function unixTime(date){
			var new_date = new Date(date).getTime();
			return new_date;
		}

		return(
			<tr className="table-foot-bold">
				<th colSpan="2">Totals:</th>
				<td data-label="# of Completed Events" id="table_total_single_events">{<NumberFormat
							value={total_events_count}
							displayType={"text"}
							thousandSeparator={true}
							decimalScale={0}
						/>}
				</td>
				<td data-label="Bet" id="table_total_single">{<NumberFormat 
							value={total_bet}
							suffix={' WGR'}
							displayType={"text"}
							thousandSeparator={true}
							decimalScale={0}
						/>}<br></br>({<NumberFormat 
							value={eval(total_bet* coinInfo.usd)}
							prefix={'$'}
							suffix={' USD'}
							displayType={"text"}
							thousandSeparator={true}
							decimalScale={2}
						/>}
				</td>
				<td data-label="# of Bets" id="table_total_single_count">{<NumberFormat
							value={total_bets_count}
							displayType={"text"}
							thousandSeparator={true}
							decimalScale={0}
						/>}
				</td>
				<td data-label="Payout" id="table_total_single_payout">{<NumberFormat 
							value={total_payout}
							suffix={' WGR'}
							displayType={"text"}
							thousandSeparator={true}
							decimalScale={0}
						/>}<br></br>({<NumberFormat 
							value={eval(total_payout * coinInfo.usd)}
							prefix={'$'}
							suffix={' USD'}
							displayType={"text"}
							thousandSeparator={true}
							decimalScale={2}
						/>}
				</td>
				<td data-label="Supply Change" id="table_total_single_change">{<NumberFormat 
							value={total_change}
							suffix={' WGR'}
							displayType={"text"}
							thousandSeparator={true}
							decimalScale={0}
						/>}<br></br>({<NumberFormat 
							value={eval(total_change * coinInfo.usd)}
							prefix={'$'}
							suffix={' USD'}
							displayType={"text"}
							thousandSeparator={true}
							decimalScale={2}
						/>}
				</td>
			</tr>
		)	
	}


	return(
		<div id="single_bets_table_container" className="top-open-list-container">
			<div className="open-total-header">Single Bet Totals (Daily)</div>

				<div id="single_picker_append" className="table-date-container">
					<div className="date-picker">
						<label htmlFor="single_start_date">Date Start: </label>
						<input className="date-input" id="single_start_date" type="date" name="start" value={start} onChange={sortTable} ></input>
					</div>
					<div className="date-picker">
						<label htmlFor="single_end_date">Date End:</label> 
						<input className="date-input" id="single_end_date" type="date"  name="end" value={end} onChange={sortTable} ></input>
					</div>
					<div>
					<button className="date-reset btn btn-primary" id="single_reset_button" onClick={resetSort} >Reset</button>
					</div>	
				</div>
				
			<div>
				<table className="table table-striped">
					<thead id="single_table_head">
					<tr >
						<th>No.</th>
						<th>Date***</th>
						<th># of Completed Events</th>
						<th>Single Bets</th>
						<th># of Single Bets</th>
						<th>Single Bets Payout</th>
						<th>Single Bets Supply Change</th>
					</tr>
					</thead>
					<tbody id="single_bets_info" className="table-sort">
						{rows}
					</tbody>
					<tfoot className="active-footer">
						{footer}
					</tfoot>
				</table>
			</div>
		</div>
	)
	
}

export default SingleTable;