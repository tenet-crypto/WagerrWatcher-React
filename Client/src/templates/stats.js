import './css/stats.css';
import React, { useState, useEffect } from 'react';
import getCoin from './fetch/getCoin.js'
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


	const [data, setData] = useState({table: false, data: false});
	const [tableHeader, setTableHeader] = useState("");
	const [type, setType] = useState(false);
	const [button, setButton] = useState(null);


	//load prop data
	useEffect(() =>{
		if(prop.data[0] !== false) {
			setType('single');
		}

		if(single !== false && parlay !== false && totalmint !== false){
			setTableHeader(makeTableHeader(single, parlay, totalmint));
		}
		
	},[prop.data])
	
	 
	//chnage table data when type changes
	useEffect(() => {
		if(type == 'parlay'){
			setData({table: "parlay", data: parlay});			
		}else if(type == 'totalmint'){
			setData({table: "totalmint", data: totalmint});
		}else if(type == 'single'){
			setData({table: "single", data: single});
		}

	},[type])

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

	//add bet totals to table header
	function makeTableHeader(s,p,m){
		if(s !== false){
			//single
			var single_bets = 0;
			var single_payout = 0;
			var single_events = 0;
			s.forEach(function(v,k){
				single_bets += v.wgr_bet
				single_payout += v.wgr_payout;
				single_events += v.event_count;
			});
			//parlay
			var parlay_bets = 0;
			var parlay_payout = 0;
			var parlay_bet_count = 0;
			p.forEach(function(v,k){
				parlay_bets += v.wgr_bet;
				parlay_payout += v.wgr_payout;
				parlay_bet_count += v.parlay_count;
			});

			//mint
			var total_mint = 0;
			var total_supply_change = 0;
			var total_bets_complete = 0
			m.forEach(function(v,k){
				total_mint += v.total_transaction;
				total_supply_change += v.supply_change;
				total_bets_complete += v.total_bets_placed;
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
				{data.data === false ? <div className="chart-load">Loading...</div> : <StatsChart data={data.data} type={type} button={button} /> }
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
					<div className="update-notice">*Updated between 12AM-1AM CST (GMT-6) Daily</div>
					<div className="update-notice">**This includes bet payouts, block rewards, oracle, masternode, and developer fee's</div>
					<div className="update-notice">***Date format is UTC</div>
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