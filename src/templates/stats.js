import './css/stats.css';
import React, { useState, useEffect } from 'react';
import getCoin from './fetch/getCoin.js'
import getStatsSingle from './fetch/getStatsSingle.js';
import getStatsParlay from './fetch/getStatsParlay.js';
import getStatsMint from './fetch/getStatsMint.js';
import StatsChart from './statsChart.js';
import SingleTable from './singleTable.js';
import ParlayTable from './parlayTable.js';
import TotalTable from './totalmintTable.js';
import NumberFormat from 'react-number-format';

function Stats(prop){
	let single = prop.data[0];
	let parlay = prop.data[1];
	let totalmint = prop.data[2];
	let coinInfo = prop.coin;


	const [chart, setChart] = useState('loading');
	const [data, setData] = useState({table: false, data: false});
	const [type, setType] = useState(false);
	const [table, setTable] = useState("Loading...");
	const [button, setButton] = useState(null);
	const [sort, setSort] = useState(null);
	

	//load prop data
	useEffect(() =>{
		if(prop.data[0] === false){
			//do nothing
		}else{
			setType('single');
		}
		
	},[prop.data])
	
	var tableHeader = makeTableHeader(single, parlay, totalmint) 
	//chnage table data when type changes
	useEffect(() => {
		if(type == 'parlay'){
			setChart(parlay);
			setData({table: "parlay", data: parlay});			
		}else if(type == 'totalmint'){
			setChart(totalmint);
			setData({table: "totalmint", data: totalmint});
		}else if(type == 'single'){
			setChart(single);
			setData({table: "single", data: single});
		}

	},[type])

	
	useEffect(() =>{
		setTable(makeTableData(data.table, data.data, false, false));
	},[data])

	//change chart
	function changeChart(e){
		var id = e.target.id
		setType(id)	
	}
	//chart buttons
	function buttonChart(e){
		var id = e.target.id.split('_')[0];
		setButton(id);
	}
	//reset button state to null
	useEffect(() => {
		setButton(null);
	},[button]);


	function makeTableSingle(data, type, start, end){

		var table_info = data.map((v,k) =>
			<tr key={"single_row_"+k} data-date={moment(new Date(v.date)).format("YYYY-MM-DD")}>
				<td id={"single_rank_"+k}>{eval(k+1) }</td>
				<td id={"single_date_"+k} >{new Date(v.date).toString().substr(4).split(' G')[0].split('00:')[0]}</td>
				<td id ={"single_events_"+k}>{v.event_count}</td>
				<td id={"single_bet_"+k}>{<NumberFormat 
										value={v.wgr_total}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={eval(v.wgr_total * coinInfo.usd)}
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>
				<td id={"single_bet_count_"+k}>{v.bet_count}</td>
				<td id={"single_payout_"+k}>{<NumberFormat 
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
				<td id={"single_chnage_"+k}>{<NumberFormat 
										value={eval(v.wgr_payout - v.wgr_total)}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={eval((v.wgr_payout - v.wgr_total) * coinInfo.usd)}
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>
			</tr>
		)

		var footer = makeTableFooter(data, type, start, end);
		var sort = makeTableSort(data, type, start, end);

		return(
			<div id="single_bets_table_container" className="top-open-list-container">
				<div className="open-total-header">Single Bet Totals (Daily)</div>
					{sort}
				<div>
					<table className="table table-striped">
						<thead id="single_table_head">
						<tr >
							<th>No.</th>
							<th>Date</th>
							<th># of Completed Events</th>
							<th>Single Bets</th>
							<th># of Single Bets</th>
							<th>Single Bets Payout</th>
							<th>Single Bets Supply Change</th>
						</tr>
						</thead>
						<tbody id="single_bets_info" className="table-sort">
							{table_info}
						</tbody>
						<tfoot className="active-footer">
							{footer}
						</tfoot>
					</table>
				</div>
			</div>
		)
	}
	function makeTableParlay(data,type, start, end){

		var table_info = data.map((v,k) =>
			<tr key={"parlay_row_"+k} data-date={moment(new Date(v.date)).format("YYYY-MM-DD")}>
				<td id={"parlay_rank_"+k}>{eval(k+1) }</td>
				<td id={"parlay_date_"+k}>{new Date(v.date).toString().substr(4).split(' G')[0].split('00:')[0]}</td>
				<td id={"parlay_bet_"+k}>{<NumberFormat 
										value={v.wgr_total}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={eval(v.wgr_total * coinInfo.usd)}
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>
				<td id={"parlay_bet_count_"+k}>{v.bet_count}</td>
				<td id={"parlay_payout_"+k}>{<NumberFormat 
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
				<td id={"parlay_change_"+k}>{<NumberFormat 
										value={eval(v.wgr_payout - v.wgr_total)}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={eval((v.wgr_payout - v.wgr_total) * coinInfo.usd)}
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>
			</tr>
		)

		var footer = makeTableFooter(data, type, start, end);
		var sort = makeTableSort(data, type, start, end);

		return(
			<div id="parlay_bets_table_container" className="top-open-list-container">
				<div className="open-total-header">Parlay Bet Totals (Daily)</div>
				<div id="parlay_date_picker_append" className="table-date-container">
					{sort}
				</div>
				<div>
					<table className="table table-striped">
						<thead>
						<tr>
							<th>No.</th>
							<th>Date</th>
							<th>Parlay Bets</th>
							<th># of Parlay Bets</th>
							<th>Parlay Bets Payout</th>
							<th>Parlay Bets Supply Change</th>
						</tr>
						</thead>
						<tbody id="parlay_bets_info" className="table-sort">
							{table_info}
						</tbody>
						<tfoot className="active-footer">
							{footer}
						</tfoot>
					</table>
				</div>
			</div>
		)
	}
	function makeTableMint(data, type, start, end){

		var table_info = data.map((v,k) =>
			<tr key={"totals_row_"+k} data-date={moment(new Date(v.date)).format("YYYY-MM-DD")} > 
				<td id={"totals_rank_"+k}>{eval(k+1) }</td>
				<td id={"totals_date_"+k}>{new Date(v.date).toString().substr(4).split(' G')[0].split('00:')[0]}</td>
				<td id={"totals_bet_"+k}>{<NumberFormat 
										value={eval(v.single + v.parlay)}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={eval(eval(v.single + v.parlay) * coinInfo.usd)}
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>

				<td id={"totals_payout_"+k}>{<NumberFormat 
										value={v.mint}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={eval(v.mint * coinInfo.usd)}
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>

				<td id={"totals_change_"+k}>{<NumberFormat 
										value={eval(v.mint - eval(v.single + v.parlay))}
										suffix={' WGR'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}<br></br>({<NumberFormat 
										value={eval((v.mint - eval(v.single + v.parlay)) * coinInfo.usd)}
										prefix={'$'}
										suffix={' USD'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={2}
									/>})
				</td>
				<td id={"totals_bet_count_"+k}>{eval(v.parlay_count + v.single_count)}</td>
			</tr>
		)

		var footer = makeTableFooter(data, type, start, end);
		var sort = makeTableSort(data, type, start, end);

		return(
			<div id="mint_table_container" className="top-open-list-container">
				<div className="open-total-header">Totals(Daily)</div>
				<div id="mint_date_picker_append" className="table-date-container">
					{sort}
				</div>
				<div>
					<table className="table table-striped">
						<thead>
						<tr>
							<th>No.</th>
							<th>Date</th>
							<th>Total Bet</th>
							<th>Total Mint</th>
							<th>Supply Change</th>
							<th>Total # of Bets</th>
						</tr>
						</thead>
						<tbody id="mint_info" className="table-sort">
							{table_info}
						</tbody>
						<tfoot className="active-footer">
							{footer}
						</tfoot>
					</table>
				</div>
			</div>
		)
	}

	//make footer
	function makeTableFooter(data, type, start, end){
	
		var total_events_count = 0;
		var total_bet = 0;
		var total_bets_count = 0;
		var total_payout = 0;
		var total_change = 0;

		//sum table totals
		data.forEach(function(v,k){
			if (type == 'totalmint'){
				if( unixTime(v.date) > unixTime(start) || unixTime(v.date) < unixTime(end) ){
					total_bets_count += eval(v.single_count + v.parlay_count);
					total_bet += eval(v.single + v.parlay);
					total_payout += v.mint;
					total_change += eval(v.mint - eval(v.single + v.parlay));
				}			
			}else{
				if( unixTime(v.date) > unixTime(start) || unixTime(v.date) < unixTime(end) ){
					total_events_count += v.event_count;
					total_bet += v.wgr_total;
					total_bets_count += v.bet_count;
					total_payout += v.wgr_payout;
					total_change += eval(v.wgr_payout - v.wgr_total);
				}
			}
		});

		//unix time helper
		function unixTime(date){
			var new_date = new Date(date).getTime();
			return new_date;
		}

		if(type == 'single'){
			return(
				<tr className="table-foot-bold">
					<th colSpan="2">Total</th>
					<td id="table_total_single_events">{<NumberFormat
								value={total_events_count}
								displayType={"text"}
								thousandSeparator={true}
								decimalScale={0}
							/>}
					</td>
					<td id="table_total_single">{<NumberFormat 
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
					<td id="table_total_single_count">{<NumberFormat
								value={total_bets_count}
								displayType={"text"}
								thousandSeparator={true}
								decimalScale={0}
							/>}
					</td>
					<td id="table_total_single_payout">{<NumberFormat 
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
					<td id="table_total_single_change">{<NumberFormat 
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
		}else if(type == 'parlay'){
			return(
				<tr className="table-foot-bold">
					<th colSpan="2">Total</th>
					<td id="table_total_parlay">{<NumberFormat 
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
					<td id="table_total_parlay_count">{<NumberFormat
								value={total_bets_count}
								displayType={"text"}
								thousandSeparator={true}
								decimalScale={0}
							/>}
					</td>
					<td id="table_total_parlay_payout">{<NumberFormat 
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
					<td id="table_total_parlay_change">{<NumberFormat 
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
		}else if(type == 'totalmint'){
			return(
				<tr className="table-foot-bold">
					<th colSpan="2">Total</th>
					<td id="table_total_totals">{<NumberFormat 
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
					
					<td id="table_total_totals_payout">{<NumberFormat 
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
					<td id="table_total_totals_change">{<NumberFormat 
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
					<td id="table_total_totals_count">{<NumberFormat
								value={total_bets_count}
								displayType={"text"}
								thousandSeparator={true}
								decimalScale={0}
							/>}
					</td>
				</tr>
			)
		}
		
	}


	//make stats table
	function makeTableData(type, data, start, end){
		if(data !== false){
			var start_date = start;
			var last_date = end;
			if(start == false && end == false){
				//sum table totals
				data.forEach(function(v,k){
					if(k === 0){
						start_date = new Date(v.date);
					}
					last_date = new Date(v.date);
				});
			}
			
		switch (type){
			case "single":
				return makeTableSingle(data, type, start_date, last_date);
				break;
			case "parlay":
				return makeTableParlay(data, type, start_date, last_date);
				break;
			case "totalmint":
				return makeTableMint(data, type, start_date, last_date);
				break;
		}
		


			
		}
	}
	
	//add bet totals to table header
	function makeTableHeader(s,p,m){
		if(s !== false){
			//single
			var single_payout = 0;
			var single_events = 0;
			s.forEach(function(v,k){
				single_payout += v.wgr_payout;
				single_events += v.event_count;
			});
			//parlay
			var parlay_payout = 0;
			p.forEach(function(v,k){
				parlay_payout += v.wgr_payout;
			});

			//mint
			var single_bets = 0;
			var parlay_bets = 0;
			var total_mint = 0;
			var total_supply_change = 0;
			var total_bets_complete = 0
			m.forEach(function(v,k){
				single_bets += v.single;
				parlay_bets += v.parlay;
				total_mint += v.mint;
				total_supply_change += eval(v.mint - eval(v.single + v.parlay));
				total_bets_complete += eval(v.single_count + v.parlay_count);
			});
		}

		return	<div className="top-open-total">
					<div className="open-total-header">Bet Totals: </div>
					<div className="open-total-item">
						<div>Single Bets: </div> 
						<div className="open-span">
							<span id="single_placed">{ s ? <NumberFormat 
															value={single_bets}
															suffix={' WGR'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={0}
														/> : "Loading..."}<br></br>{<NumberFormat 
															value={eval(single_bets* coinInfo.usd)}
															prefix={'($'}
															suffix={' USD)'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={2}
													/>}
							</span>
						</div>
					</div>
					<div className="open-total-item">
						<div>Parlay Bets: </div> 
						<div className="open-span">
							<span id="parlay_placed">{ s ? <NumberFormat 
															value={parlay_bets}
															suffix={' WGR'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={0}
														/> : "Loading..."}<br></br>{<NumberFormat 
															value={eval(parlay_bets* coinInfo.usd)}
															prefix={'($'}
															suffix={' USD)'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={2}
													/>}
							</span>
						</div>
					</div>
					<div className="open-total-item">
						<div>Total Bets: </div> 
						<div className="open-span">
							<span id="total_placed">{ s ? <NumberFormat 
															value={eval(single_bets + parlay_bets)}
															suffix={' WGR'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={0}
														/> : "Loading..."}<br></br>{<NumberFormat 
															value={eval(eval(single_bets + parlay_bets)* coinInfo.usd)}
															prefix={'($'}
															suffix={' USD)'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={2}
													/>}
							</span>
						</div>
					</div>
					<div className="open-total-item">
						<div>Total Payout (Bets only): </div> 
						<div className="open-span">
							<span id="total_payout">{ s ? <NumberFormat 
															value={eval(single_payout + parlay_payout)}
															suffix={' WGR'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={0}
														/> : "Loading..."}<br></br>{<NumberFormat 
															value={eval(eval(single_payout + parlay_payout)* coinInfo.usd)}
															prefix={'($'}
															suffix={' USD)'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={2}
													/>}
							</span>
						</div>
					</div>
					<div className="open-total-item">
						<div>**Total Mint: </div> 
						<div className="open-span">
							<span id="total_payout_mint">{ s ? <NumberFormat 
															value={total_mint}
															suffix={' WGR'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={0}
														/> : "Loading..."}<br></br>{<NumberFormat 
															value={eval(total_mint* coinInfo.usd)}
															prefix={'($'}
															suffix={' USD)'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={2}
													/>}
							</span>
						</div>
					</div>
					<div className="open-total-item">
						<div>Total Supply Change: </div>
						<div className="open-span">
							<span id="supply_placed">{ s ? <NumberFormat 
															value={total_supply_change}
															suffix={' WGR'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={0}
														/> : "Loading..."}<br></br>{<NumberFormat 
															value={eval(total_supply_change* coinInfo.usd)}
															prefix={'($'}
															suffix={' USD)'}
															displayType={"text"}
															thousandSeparator={true}
															decimalScale={2}
													/>}</span>
						</div>
					</div>
					<div className="open-total-item">
						<div>Total Events Completed: </div>
						<div className="open-span">
							<span id="events_completed">{ s ? <NumberFormat
																	value={single_events}
																	displayType={"text"}
																	thousandSeparator={true}
																	decimalScale={0}
																/>
															: 'Loading...'}</span>
						</div>
					</div>
					<div className="open-total-item">
						<div>Total Bets Placed: </div>
						<div className="open-span">
							<span id="bets_completed">{ s ? <NumberFormat
																	value={total_bets_complete}
																	displayType={"text"}
																	thousandSeparator={true}
																	decimalScale={0}
																/>
															: 'Loading...'}</span>
						</div>
					</div>
				</div>
	}

	//sort inputs
	function makeTableSort(data, type, startDate, endDate){
		//set start date format
		var start_date = moment(startDate).format('YYYY-MM-DD');
		//set end date format
		var yesterdate = moment(endDate).format('YYYY-MM-DD');

		return (
			<div key={type}>
				<div id={type+"_picker_append"} className="table-date-container">
					<div className="date-picker">
						<label htmlFor={type+"_start_date"}>Date Start: </label>
						<input className="date-input" id={type+"_start_date"} type="date" defaultValue={start_date} data-type={type} name="start" onChange={sortTable}></input>
					</div>
					<div className="date-picker">
						<label htmlFor={type+"_end_date"}>Date End:</label> 
						<input className="date-input" id={type+"_end_date"} type="date" defaultValue={yesterdate} data-type={type}  name="end" onChange={sortTable} ></input>
					</div>
					<div>
					<button className="date-reset btn btn-primary" id={type+"_reset_button"}>Reset</button>
					</div>	
				</div>
			</div>
		)
	}

	//sort onchange
	function sortTable(e){
		///get value of both and conver to unix time
		var s_date = new Date(document.getElementsByName("start")[0].value);
		var e_date = new Date (document.getElementsByName("end")[0].value);

		var input_type = e.target.dataset.type;

		var t_body = document.getElementsByClassName("table-sort")[0];
		for(var i=0; i < t_body.rows.length; i++){
				var row_date = t_body.rows[i].dataset.date;
	
			if( unixTime(s_date) > unixTime(row_date) || unixTime(row_date) > unixTime(e_date)){
				t_body.rows[i].style.display = "none";
			}else{
				t_body.rows[i].style.display = "";
			}
		}
		
	
		//unix time helper
		function unixTime(date){
			var new_date = new Date(date).getTime();
			return new_date;
		}
	}
	
	


	return(
		<div id="stats_div" className="stats-container">
			<div className="stats-options">
				<div className="btn-group" role="group" aria-label="Basic radio toggle button group">
				  <input type="radio" className="btn-check" name="btnradio" id="single" autoComplete="off" defaultChecked  onClick={changeChart}/>
				  <label className="btn btn-outline-primary btn-wgr" htmlFor="single">Single Bets</label>

				  <input type="radio" className="btn-check" name="btnradio" id="parlay" autoComplete="off" onClick={changeChart} />
				  <label className="btn btn-outline-primary btn-wgr" htmlFor="parlay">Parlay Bets</label>
				  <input type="radio" className="btn-check" name="btnradio" id="totalmint" autoComplete="off" onClick={changeChart} />
				  <label className="btn btn-outline-primary btn-wgr" htmlFor="totalmint">Totals</label>
				</div>
			</div>
			<div className="stats-chart">
				{chart == 'loading' ? <div>Loading...</div> : <StatsChart data={chart} type={type} button={button} /> }
			</div>

			<div className="stats-buttons">
				<button className="btn btn-primary" id="reset_button" onClick={buttonChart} >Reset zoom</button>
				<button className="btn btn-primary" id="month_button" onClick={buttonChart} >Month</button>
				<button className="btn btn-primary" id="week_button" onClick={buttonChart} >Week</button>
				<button className="btn btn-primary" id="day_button" onClick={buttonChart} >Day</button>
			</div>
			<div id="stats_table_append" className="stats-table">
				<div>
					<div className="top-open-header">Bet Totals (Jan 1, 2021 - Current)</div>
					<div className="update-notice">*Updated between 12AM-1AM CST (GMT-6) Daily*</div>
					<div className="update-notice">**This includes bet payouts, block rewards, oracle, masternode, and developer fee's**</div>
				</div>

				{tableHeader}
				{data.table == "single" ? <SingleTable data={data.data} coin={coinInfo} />
				: data.table == "parlay" ? <ParlayTable data={data.data} coin={coinInfo} />
				: data.table == "totalmint" ? <TotalTable data={data.data} coin={coinInfo} /> 
				: <div>Loading...</div> }
				
				
			</div>
			
		</div>
	)
}

export default Stats;