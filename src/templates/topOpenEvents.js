import './css/topOpenEvents.css';
import React, { useState, useEffect } from 'react';
import getCoin from './fetch/getCoin.js'
import getOpenEvents from './fetch/getOpenEvents.js';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';

function TopOpenEvents(){
	var events = getOpenEvents();
	var coinInfo = getCoin();


	//set init to loading
	var open_count= 'Loading...';
	var wgr_total_2 = 'Loading...';
	var usd_total_2 = 'Loading...';

	if (events == 'loading' || events == ''){
		console.log("there was an error");
	}else{
		//build top open table
		var open_events =[];
		events[0].events.forEach(function(v,k){
			var id = v.eventId;
			var helper = open_actions_helper(id);
			//create object to push
			var obj = {eventId: id, betValue: helper, home: v.homeTeam, away: v.awayTeam, league: v.league};
			//push to new array
			open_events.push(obj);
		});
		
		//sort hightest to low by betValue
		open_events.sort(function(a,b){
			return(b.betValue - a.betValue);

		});
		//append sorted events
		var sorted_events = open_events.map((v,k) => 
			<tr key={"table_row_"+k}>
				<td id={"rank_"+k}>{eval(k+1)}</td>
				<td id={"open_"+v.eventId}><a target="_blank" href={"https://explorer.wagerr.com/#/bet/event/"+v.eventId}>{v.eventId}</a></td>
				<td id={"league_"+k}>{v.league}</td>
				<td id={"home_"+k}>{v.home}</td>
				<td id={"away_"+k}>{v.away}</td>
				<td id={"betWgr_"+k}>{<NumberFormat 
											value={v.betValue}
											suffix={' WGR'}
											displayType={"text"}
											thousandSeparator={true}
											decimalScale={0}
										/>}
				</td>
				<td id={"betUsd_"+k}>{<NumberFormat 
										value={eval(coinInfo.usd*v.betValue)}
										prefix={'$'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}
				</td>
			</tr>
		);
		//helper to find open event bet totals
		function open_actions_helper(id){
			//set init to 0
			var betTotal = 0;
			events[1].actions.forEach(function(v,k){
				//check for match
				if(id == v.eventId){
					//sum total bets
					betTotal += v.betValue;	
				}
			});
			//return bet total
			return betTotal;
		}

		//append open event totals
		//count numbe rof open events
		open_count = open_events.length;

		//get wgr bet total
		var wgr_total = 0;
		open_events.forEach(function(v,k){
			wgr_total += v.betValue;
		});
		wgr_total_2 = <NumberFormat 
								value={wgr_total}
								suffix={' WGR'}
								displayType={"text"}
								thousandSeparator={true}
								decimalScale={0}
							/>;

		//bet total as USD
		var usd_total = eval(wgr_total*coinInfo.usd);
		usd_total_2 = <NumberFormat 
						value={usd_total}
						prefix={'$'}
						displayType={"text"}
						thousandSeparator={true}
						decimalScale={2}
					/>;
	}
	


	

	return(
		<div id="top_open_div" className="top-open-container">
			<div className="top-open-header">Top Open Events</div>
			<div className="top-open-total">
				<div className="open-total-header">Open Event Totals: </div>
				<div className="open-total-item">
					<div>Open Events: </div> 
					<div className="open-span">
						<span id="open_event">{open_count}</span>
					</div>
				</div>
				<div className="open-total-item">
					<div>Bet (WGR): </div>
					<div className="open-span">
						<span id="open_bet_wgr">{wgr_total_2}</span>
					</div>
				</div>
				<div className="open-total-item">
					<div>Bets (USD): </div>
					<div className="open-span">
						<span id="open_bet_usd">{usd_total_2}</span>
					</div>
				</div>
			</div>
			<div className="top-open-list-container">
				<div className="open-total-header">Open Events</div>
				<div>
					<table className="table table-striped">
						<thead>
							<tr>
								<th>Rank</th>
								<th>Event Id</th>
								<th>League</th>
								<th>Home</th>
								<th>Away</th>
								<th>Total bet WGR</th>
								<th>Total bet USD</th>
							</tr>
						</thead>
						<tbody id="open_events_info">{sorted_events}</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default TopOpenEvents;