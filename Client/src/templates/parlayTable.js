import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';

function ParlayTable(prop){
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
			<tr key={"parlay_row_"+k} data-date={moment.utc(new Date(v.date)).format("YYYY-MM-DD")}>
				<td data-label="Rank" id={"parlay_rank_"+k}>{eval(k+1) }</td>
				<td data-label="Date" id={"parlay_date_"+k}>{ moment.utc(v.date).format("MMM DD, YYYY") }</td>
				<td data-label="Parlay Bets" id={"parlay_bet_"+k}>{<NumberFormat 
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
				<td data-label="# of Parlay Bets" id={"parlay_bet_count_"+k}>{v.parlay_count}</td>
				<td data-label="Parlay Payout" id={"parlay_payout_"+k}>{<NumberFormat 
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
				<td data-label="Parlay Supply Change" id={"parlay_change_"+k}>{<NumberFormat 
										value={eval(v.wgr_payout - v.wgr_bet)}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={eval((v.wgr_payout - v.wgr_bet) * coinInfo.usd)}
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
		var s_date = moment.utc(document.getElementsByName("start")[0].value).format("YYYY-MM-DD");
		var e_date = moment.utc(document.getElementsByName("end")[0].value).format("YYYY-MM-DD");

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
			if(k === 0){
				start = moment.utc(v.date).format("YYYY-MM-DD");
			}
			end = moment.utc(v.date).format("YYYY-MM-DD");
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

		var total_bet = 0;
		var total_bets_count = 0;
		var total_payout = 0;
		var total_change = 0;

		//sum table totals
		data.forEach(function(v,k){
			if( unixTime(moment.utc(v.date).format("YYYY-MM-DD")) >= unixTime(start) && unixTime(moment.utc(v.date).format("YYYY-MM-DD")) <= unixTime(end) ){
				total_bet += v.wgr_bet;
				total_bets_count += v.parlay_count;
				total_payout += v.wgr_payout;
				total_change += eval(v.wgr_payout - v.wgr_bet);
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
				<td data-label="Bet" id="table_total_parlay">{<NumberFormat 
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
						/>})
				</td>
				<td data-label="# of Bets" id="table_total_parlay_count">{<NumberFormat
							value={total_bets_count}
							displayType={"text"}
							thousandSeparator={true}
							decimalScale={0}
						/>}
				</td>
				<td data-label="Payout" id="table_total_parlay_payout">{<NumberFormat 
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
						/>})
				</td>
				<td data-label="Supply Change" id="table_total_parlay_change">{<NumberFormat 
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
						/>})
				</td>
			</tr>
		)	
	}


	return(
		<div id="parlay_bets_table_container" className="top-open-list-container">
				<div className="open-total-header">Parlay Bet Totals (Daily)</div>
				<div id="parlay_date_picker_append" className="table-date-container">
					<div className="date-picker">
						<label htmlFor="parlay_start_date">Date Start: </label>
						<input className="date-input" id="parlay_start_date" type="date" name="start" value={start} onChange={sortTable} ></input>
					</div>
					<div className="date-picker">
						<label htmlFor="parlay_end_date">Date End:</label> 
						<input className="date-input" id="parlay_end_date" type="date"  name="end" value={end} onChange={sortTable} ></input>
					</div>
					<div>
					<button className="date-reset btn btn-primary" id="parlay_reset_button" onClick={resetSort} >Reset</button>
					</div>	
				</div>
				<div>
					<table className="table table-striped">
						<thead>
						<tr>
							<th>No.</th>
							<th>Date***</th>
							<th>Parlay Bets</th>
							<th># of Parlay Bets</th>
							<th>Parlay Bets Payout</th>
							<th>Parlay Bets Supply Change</th>
						</tr>
						</thead>
						<tbody id="parlay_bets_info" className="table-sort">
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

export default ParlayTable;