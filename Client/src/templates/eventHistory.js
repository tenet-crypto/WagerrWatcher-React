import './css/eventHistory.css';
import React, { useState, useEffect } from 'react';
import getCoin from './fetch/getCoin.js'
import EventHistoryChart from './eventHistoryChart.js';
import EventHistoryTable from './eventHistoryTable.js';
import TotalTable from './totalmintTable.js';
import NumberFormat from 'react-number-format';

function EventHistory(prop){
	var history = prop.data

	const [data, setData] = useState(false);
	const [button, setButton] = useState(null);

	//load prop data for chart
	useEffect(() =>{
		if(prop.data !== false) {
			setData(history)		
		}
	},[prop.data])

	

	//button click
	//chart buttons
	function buttonChart(e){
		var id = e.target.id.split('_')[0];
		setButton(id);
	}
	//reset button state to null
	useEffect(() => {
		setButton(null);
	},[button]);


	return(
		<div id="stats_div" className="stats-container">
			<div className="es-title-container">
				<div className="es-title"> Top 100 Events by Volume</div>
				<div className="es-helper"> *Hover over data point to see more infomation*</div>
				<div className="es-helper"> **This includes single and parlay bet payouts, block rewards, oracle, masternode, and developer fee's</div>
				<div className="stats-chart">
					{data === false ? <div>Loading...</div> : <EventHistoryChart data={history} button={button} /> }
				</div>
				<div className="stats-buttons">
					<button className="btn btn-primary" id="reset_button" onClick={buttonChart} >Reset zoom</button>
					
				</div>
			</div>
			<div id="stats_table_append" className="stats-table">
				<div>
					<div className="top-open-header">Event History Totals (Jan 1, 2021 - Current)</div>
					<div className="update-notice">*Updated between 12AM-1AM CST (GMT-6) Daily*</div>
					<div className="update-notice">**Includes bet payouts, block rewards, oracle, masternode, and developer fee's**</div>
				</div>

				 <EventHistoryTable data={history} />
				
				
				
			</div>
			
			
		</div>
	)
}

export default EventHistory;