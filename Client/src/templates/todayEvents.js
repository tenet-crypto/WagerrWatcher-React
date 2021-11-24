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

	const [activeSort, setActiveSort] = useState('bet');
	const [arrow, setArrow] = useState(<svg pointerEvents="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-numeric-up" viewBox="0 0 16 16">
				  <path d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z"/>
				  <path fillRule="evenodd" d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"/>
				  <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
				</svg>);


	useEffect(() =>{
		if(events != false){
			setToday(sortToday());
		};

	},[events]);

	//sort Arrays
	function array_sort(type, direction, data_in){
		const sortBy = ['Open','Pending','Complete',];
		console.log(`type ${type}, direction: ${direction}`);
		//if data is
		if(data_in != false){
			//loop array
			if(type == "bet"){
				if(direction == "desc"){
					return data_in.sort(function(a,b){
						return Number(b.betValue) - Number(a.betValue);
					});
				}else{
					return data_in.sort(function(a,b){
						return Number(a.betValue) - Number(b.betValue);
					});
				}
				
			}

			if(type == "status"){
				if(direction == "desc"){
					return data_in.sort(function(a,b){

						return sortBy.indexOf(a.status) - sortBy.indexOf(b.status);
		
					});
				}else{
					return data_in.sort(function(a,b){

						return sortBy.indexOf(b.status) - sortBy.indexOf(a.status);
		
					});
					
				}
				
			}
		}else{
			return false;
		}
	}

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
			mapToday(array_sort(activeSort,"desc",today));
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

	//sort click
	function sort_click(e){
		var test = e.target.tagName;
		
		var type = e.target.dataset.sort;
		var direction = e.target.dataset.direction;
		

		if(direction == 'desc'){
				mapToday( array_sort(type,"asc",today) );
				e.target.dataset.direction = "asc";
				setArrow(<svg pointerEvents="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-numeric-up" viewBox="0 0 16 16">
				  <path d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z"/>
				  <path fillRule="evenodd" d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"/>
				  <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
				</svg>)

			}else{
				mapToday( array_sort(type,"desc",today) );
				e.target.dataset.direction = "desc";
				setArrow(<svg pointerEvents="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-numeric-down-alt" viewBox="0 0 16 16">
						  <path fillRule="evenodd" d="M11.36 7.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.836 1.973-1.836 1.09 0 2.063.637 2.063 2.688 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"/>
						  <path d="M12.438 8.668V14H11.39V9.684h-.051l-1.211.859v-.969l1.262-.906h1.046zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
						</svg>)
			}
			
			//remove active class
			 document.querySelectorAll('.sort-active')[0].className ="es-history-sort";
			//add active class
			e.target.classList.add("sort-active");
		
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
								<th className="es-history-sort" data-sort="status" data-direction="desc" onClick = {sort_click}>Status {arrow}</th>
								<th>League</th>
								<th>Home</th>
								<th>Away</th>
								<th className="es-history-sort sort-active" data-sort="bet" data-direction="desc" onClick = {sort_click}>Total bet WGR {arrow}</th>
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