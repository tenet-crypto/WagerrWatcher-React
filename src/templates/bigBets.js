import './css/bigBets.css';
import React, { useState, useEffect } from 'react';
import getCoin from './fetch/getCoin.js'
import getOpenEvents from './fetch/getOpenEvents.js';
import NumberFormat from 'react-number-format';

import {useSelector} from 'react-redux';


function BigBets(prop){
	var events = prop.data;
	var coinInfo = prop.coin;
	
	//set init to loading
	var bet_count = 'Loading...';
	var actual_count = 'Loading...'
	var wgr_total_2 = 'Loading...';
	var usd_total_2 = 'Loading...';



	if (events !== false){
		//create actions array
		var actions = events[1].actions.map((v) => 
			({eventId: v.eventId, betType: v.betChoose, betValue: v.betValue, created: v.createdAt})
			)
		//create big bets array
		var big_bets = [];
		//loop each actions item from through helper and sum all matches
		actions.forEach(function(v,k){
			//init helper which return index if matched
			var helper = bigBets_helper(v.eventId, v.created, v.betType);
			//if -1 then no match
			if(helper === -1){
				big_bets.push({eventId: v.eventId, betType: v.betType, betValue: v.betValue, created: v.created})
			//match and update existing bet total using index
			}else{
				big_bets[helper].betValue += v.betValue;
			}
		});
		//sort high to low
		big_bets.sort((a,b) => b.betValue - a.betValue);

		//bigbets helper to change to
		function bigBets_helper(id, date, type){
			//set init index to no match
			var kk = -1;
			big_bets.forEach(function(v,k){
				//compare eventid, bet type and timestamp
				if(id == v.eventId && type == v.betType && new Date(date).getTime() == new Date(v.created).getTime() ){
					//update index
					kk = k;
				}
			});
			//return index
			return kk;
		}
		///add team to big bets
		//create events array
		var teams = events[0].events.map((v) => 
			({eventId: v.eventId, home: v.homeTeam, away: v.awayTeam})
			)
		big_bets.map(function(v){
			var helper = bigBets_teams_helper(v.eventId);
			//add home team
			if( v.betType.includes('Home')){
				v.team = helper[0];
			//add away
			}else if(v.betType.includes('Away')){
				v.team = helper[1];
			//add special case... adds both
			}else if (v.betType.includes('Totals') || v.betType.includes('Draw') ){
				v.team = helper[0] + " vs. " + helper[1];
			}
		});

		//helper to add team to big bets
		function bigBets_teams_helper(id){
			var home = null;
			var away = null;
			teams.forEach(function(v,k){
				if(id == v.eventId){
					home = v.home;
					away = v.away;
				}
			});

			return [home,away];

		}

		//append
		//append sorted events
		var sorted_bigBets = big_bets.map((v,k) => 
			<tr key={"table_row_"+k}>
				<td data-label="Rank" id={"rank_"+k}>{eval(k+1)}</td>
				<td data-label="Event Id" id={"big_"+v.eventId}><a target="_blank" href={"https://explorer.wagerr.com/#/bet/event/"+v.eventId}>{v.eventId}</a></td>
				<td data-label="Bet Type" id={"type_"+k}>{v.betType}</td>
				<td data-label="Team" id={"team_"+k}>{v.team}</td>
				<td data-label="Time" id={"created_"+k}>{new Date(v.created).toString().substr(4).split(' G')[0]}</td>
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

		//append totals
		//count bets
		bet_count = actions.length;
		actual_count = big_bets.length;
		//wgr total
		var wgr_total = 0;
		big_bets.forEach(function(v){
			wgr_total += v.betValue;
		});
		wgr_total_2 = <NumberFormat 
								value={wgr_total}
								suffix={' WGR'}
								displayType={"text"}
								thousandSeparator={true}
								decimalScale={0}
							/>;
		//usd total
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
		<div id="big_bets_div" className="top-open-container">
			<div className="top-open-header">Big Bets</div>
			<div className="big-bets-limit">*Limit is 10,000 WGR per bet.  Actual is the combination of bets where Event Id, Bet Type, and Time are equal*</div>
			<div className="top-open-total">
				<div className="open-total-header">Bet Totals: </div>
				<div className="open-total-item">
					<div>Bets Placed:* </div> 
					<div className="open-span">
						<span id="big_bet_placed">{bet_count + " (Actual: "+ actual_count+")"}</span>
					</div>
				</div>
				<div className="open-total-item">
					<div>Bet (WGR): </div>
					<div className="open-span">
						<span id="big_bet_wgr">{wgr_total_2}</span>
					</div>
				</div>
				<div className="open-total-item">
					<div>Bets (USD): </div>
					<div className="open-span">
						<span id="big_bet_usd">{usd_total_2}</span>
					</div>
				</div>
			</div>
			<div className="top-open-list-container">
				<div className="open-total-header">Big Bets</div>
				<div>
					<table className="table table-striped">
						<thead>
							<tr>
								<th>Rank</th>
								<th>Event Id</th>
								<th>Bet Type</th>
								<th>Team</th>
								<th>Time</th>
								<th>Total bet WGR</th>
								<th>Total bet USD</th>
							</tr>
						</thead>
						<tbody id="big_bets_info">{sorted_bigBets}</tbody>
					</table>
				</div>
			</div>
		</div>
		
	)
}

export default BigBets;