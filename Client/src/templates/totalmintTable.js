import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';

function TotalTable(prop){
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
			<tr key={"totals_row_"+k} data-date={moment.utc(new Date(v.date)).format("YYYY-MM-DD")} > 
				<td data-label="Rank" id={"totals_rank_"+k}>{eval(k+1) }</td>
				<td data-label="Date" id={"totals_date_"+k}>{ moment.utc(v.date).format("MMM DD, YYYY") }</td>
				<td data-label="Total Bet" id={"totals_bet_"+k}>{<NumberFormat 
										value={ v.total_wgr_bet }
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={ eval(v.total_wgr_bet * coinInfo.usd) }
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>

				<td data-label="Total Mint" id={"totals_payout_"+k}>{<NumberFormat 
										value={v.total_transaction}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={ eval(v.total_transaction * coinInfo.usd) }
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>

				<td data-label="Total Supply Change" id={"totals_change_"+k}>{<NumberFormat 
										value={v.supply_change }
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={ eval(v.supply_change * coinInfo.usd) }
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>
				<td data-label="Total # of Bets" id={"totals_bet_count_"+k}>{ v.total_bets_placed }</td>
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
		var start = null;
		var end = null;

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
				total_bets_count += v.total_bets_placed;
				total_bet += v.total_wgr_bet;
				total_payout += v.total_transaction;
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
				<td data-label="Bet" id="table_total_totals">{<NumberFormat 
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
				
				<td data-label="Mint" id="table_total_totals_payout">{<NumberFormat 
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
				<td data-label="Supply Change" id="table_total_totals_change">{<NumberFormat 
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
				<td data-label="# of Bets" id="table_total_totals_count">{<NumberFormat
							value={total_bets_count}
							displayType={"text"}
							thousandSeparator={true}
							decimalScale={0}
						/>}
				</td>
			</tr>
		)	
	}


	return(
		<div id="mint_table_container" className="top-open-list-container">
				<div className="open-total-header">Totals(Daily)</div>
				<div id="mint_date_picker_append" className="table-date-container">
					<div className="date-picker">
						<label htmlFor="mint_start_date">Date Start: </label>
						<input className="date-input" id="mint_start_date" type="date" name="start" value={start} onChange={sortTable} ></input>
					</div>
					<div className="date-picker">
						<label htmlFor="mint_end_date">Date End:</label> 
						<input className="date-input" id="mint_end_date" type="date"  name="end" value={end} onChange={sortTable} ></input>
					</div>
					<div>
					<button className="date-reset btn btn-primary" id="mint_reset_button" onClick={resetSort} >Reset</button>
					</div>
				</div>
				<div>
					<table className="table table-striped">
						<thead>
						<tr>
							<th>No.</th>
							<th>Date***</th>
							<th>Total Bet</th>
							<th>Total Mint**</th>
							<th>Supply Change**</th>
							<th>Total # of Bets</th>
						</tr>
						</thead>
						<tbody id="mint_info" className="table-sort">
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

export default TotalTable;