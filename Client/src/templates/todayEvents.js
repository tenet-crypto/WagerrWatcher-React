import './css/topOpenEvents.css';
import React, { useState, useEffect } from 'react';

import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';

function TodayEvents(prop){
	const events = prop.data;
	const coinInfo = prop.coin;

	const [today, setToday] = useState(null);
	const [todayRows, setTodayRows] = useState(null);

	const [open_count, setOpen_count] = useState('Loading...');
	const [wgr_total, setWgr_total] = useState('Loading...');
	const [usd_total, setUsd_total] = useState('Loading...');


	useEffect(() =>{
		if(events != false){
			setToday(sortToday());
		};

	},[events]);

	function sortToday(){

		var today_events = [];

		var curr_date = new Date();
		curr_date.setDate(curr_date.getDate() - 1);
		curr_date.setHours(24,0,0,0);

		//completed events for the day
		events[0].data.forEach(function(v,k){
			if(new Date(v.completedAt).getTime() >= curr_date.getTime()){
				today_events.push(v);
			}

		});

		//pending events for the day
		var tom_date = new Date();
		tom_date.setHours(23,59,59,59);

		events[1].data.forEach(function(v,k){
			if(new Date(v.timeStamp).getTime() <= tom_date.getTime() && new Date(v.timeStamp).getTime() >= curr_date.getTime()){
				today_events.push(v);
			}

		});

		var today_sorted = [];

		today_events.forEach(function(v,k){
			//loop actions to get total for event
			let actions = 0;
			if(v.actions.length != 0){
				//actions are not empty
				v.actions.forEach(function(vv,kk){
					actions += vv.betValue;
				});
			}
			//get teams/league info
			if(v.events.length == 1){
				var home = v.events[0].homeTeam;
				var away = v.events[0].awayTeam;
				var league = v.events[0].league;
			}
			//check if complete or open/pending
			var status = 'Completed';
			if(v.completedAt == null){

				//found 20* 60 *1000 in wagerr source code - time betting stops before event
				if(eval((new Date(v.timeStamp).getTime()) - 20 * 60 * 1000) < new Date().getTime()){

					status = 'Pending';
				}else{
					status = 'Open';
				}
				
			}

			//make object to push
			var obj = {eventId: v._id, league: league, home: home, away: away, betValue: actions, status: status };
			today_sorted.push(obj);

		});
		

		today_sorted.sort((a,b) => {
			if(a.status > b.status){
				return -1;
			}else{
				return 1;
			}
		});
		
		return today_sorted;

	}

	useEffect(() =>{
		if(today != null){
			mapToday(today);
			mapTotals(today);
		}

	},[today])
	
	function mapToday(data){
		var sorted_today = data.map((v,k) => 
			<tr key={"table_row_"+k}>
				<td data-label="Event Id" id={"open_"+v.eventId}><a target="_blank" href={"https://explorer.wagerr.com/#/bet/event/"+v.eventId}>{v.eventId}</a></td>
				<td data-label="Status" id={"status_"+k}>{v.status}</td>
				<td data-label="League" id={"league_"+k}>{v.league}</td>
				<td data-label="Home" id={"home_"+k}>{v.home}</td>
				<td data-label="Away" id={"away_"+k}>{v.away}</td>
				<td data-label="Total Bet WGR" id={"betWgr_"+k}>{<NumberFormat 
											value={v.betValue}
											suffix={' WGR'}
											displayType={"text"}
											thousandSeparator={true}
											decimalScale={0}
										/>}
				</td>
				<td data-label="Total Bet USD" id={"betUsd_"+k}>{<NumberFormat 
										value={eval(coinInfo.usd*v.betValue)}
										prefix={'$'}
										displayType={"text"}
										thousandSeparator={true}
										decimalScale={0}
									/>}
				</td>
			</tr>
		);

		setTodayRows(sorted_today);
	}


	function mapTotals(data){
		setOpen_count(data.length);

		let wgr_total = 0;
		data.forEach(function(v,k){
			wgr_total += v.betValue;

		});

		setWgr_total(<NumberFormat 
								value={wgr_total}
								suffix={' WGR'}
								displayType={"text"}
								thousandSeparator={true}
								decimalScale={0}
							/>);

		//bet total as USD
		var usd_total = eval(wgr_total*coinInfo.usd);
		setUsd_total(<NumberFormat 
						value={usd_total}
						prefix={'$'}
						displayType={"text"}
						thousandSeparator={true}
						decimalScale={2}
					/>);

	}



	
	
	return(
		<div id="top_open_div" className="top-open-container">
			<div className="top-open-header">Today's Events</div>
			<div className="top-open-total">
				<div className="open-total-header">Today's Totals: </div>
				<div className="open-total-item">
					<div>Events Count: </div> 
					<div className="open-span">
						<span id="open_event">{open_count}</span>
					</div>
				</div>
				<div className="open-total-item">
					<div>Bet (WGR): </div>
					<div className="open-span">
						<span id="open_bet_wgr">{wgr_total}</span>
					</div>
				</div>
				<div className="open-total-item">
					<div>Bets (USD): </div>
					<div className="open-span">
						<span id="open_bet_usd">{usd_total}</span>
					</div>
				</div>
			</div>
			<div className="top-open-list-container">
				<div className="open-total-header">Today's Events</div>
				<div>
					<table className="table table-striped">
						<thead>
							<tr>
								<th>Event Id</th>
								<th>Status</th>
								<th>League</th>
								<th>Home</th>
								<th>Away</th>
								<th>Total bet WGR</th>
								<th>Total bet USD</th>
							</tr>
						</thead>
						<tbody id="open_events_info">{todayRows}</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default TodayEvents;