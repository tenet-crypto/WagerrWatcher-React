import './css/ufcPicks.css';
import React, { useState, useEffect } from 'react';


function UFCPicks(prop){
	var data = prop.data;

	if(data !== false){
		var rows = data.map((v,k) =>
			<tr key={"ufc_picks_row_"+eval(k+1)}>
				<td data-label="Rank" id="picks_Rank">{eval(k+1)}</td>
				<td data-label="Event Id" id="picks_Event_ID"><a target="_blank" href={"https://explorer.wagerr.com/#/bet/event/"+v.eventId}>{v.eventId}</a></td>
				<td data-label="Date" id="picks_Date">{v.date.split(".")[0]}</td>
				<td data-label="Home" id="picks_Home">{v.home}</td>
				<td data-label="Away" id="picks_Away">{v.away}</td>
				<td data-label="Pick" id="picks_Pick" className="table-pick">{v.pick}</td>
				<td data-label="Method" id="picks_Method" className="table-pick">{v.how}</td>
				<td data-label="Confidence" id="picks_confidence" className={"table_"+v.confidence.split(' ')[0]}>{v.confidence}</td>
			</tr>

		)
	}else{
		var rows =  <tr key={"loading_picks"}>
						<td>Loading... </td>
					</tr>
			}


	return(
		<div id="picks_div" className="stats-container">
			<div id="Ufc_table_append" className="ufc-table">
				<div>
					<div className="top-open-header">UFC Totals</div>
				</div>
				
				<div className="top-open-total">
					<div className="open-total-header">Bet Totals: </div>
					<div className="open-total-item">
						<div>Total Correct: </div> 
						<div className="open-span">
							<span id="UFC_correct">77</span>
						</div>
					</div>
					<div className="open-total-item">
						<div>Total In-correct: </div> 
						<div className="open-span">
							<span id="UFC_incorrect">68</span>
						</div>
					</div>
					<div className="open-total-item">
						<div>Total Picks: </div> 
						<div className="open-span">
							<span id="UFC_total">121</span>
						</div>
					</div>
					<div className="open-total-item">
						<div>% Accurate</div>
						<div className="open-span">
							<span id="UFC_accurate">53.1%</span>
						</div>
					</div>
				</div>
				<div id="UFC_picks_table_container" className="top-open-list-container">
					<div className="open-total-header">UFC Picks</div>
					<div className="Ufc_table_note">**The picks are determined using machine learning (MLP, Decision Trees) using python and <a target="_blank" href="https://scikit-learn.org/stable/">scikit-learn</a>.  Data is pulled directly from <a target="_blank" href="http://ufcstats.com/statistics/events/completed">UFC Stats</a>**</div>
					<div className="Ufc_table_confidence">
						<div>Very Confident: 75%-90%</div>
						<div>Confident: 50%-75%</div>
						<div>Not Confident: 0%-50%</div>
						
					</div>
					
					<div>
						<table className="table table-striped">
							<thead>
								<tr>
									<th>No.</th>
									<th>Event ID</th>
									<th>Date</th>
									<th>Home</th>
									<th>Away</th>
									<th>Pick</th>
									<th>How</th>
									<th>Confidence</th>
								</tr>
							</thead>
							<tbody id="UFC_bets_info">
								{rows}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

	)
}

export default UFCPicks;
