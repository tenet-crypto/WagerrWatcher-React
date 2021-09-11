import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';

function EventHistoryTable(prop){
	var data = prop.data;

	const [sortedData, setSortedData] = useState(false);
	const [rows, setRows] = useState(null);
	const [activeSort, setActiveSort] = useState('bet');
	const [arrow, setArrow] = useState(<svg pointerEvents="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-numeric-up" viewBox="0 0 16 16">
				  <path d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z"/>
				  <path fillRule="evenodd" d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"/>
				  <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
				</svg>);

	useEffect(() =>{
		setRows( makeTableRows( array_sort("bet",'desc',data) ) );
		
	}, [prop.data])

	useEffect(() =>{
		array_sort(data);
		
	}, [prop.data])


	

	//sort Arrays
	function array_sort(type, direction, data_in){
		//if data is
		if(data_in != false){
			//loop array
			if(type == "bet"){
				if(direction == "desc"){
					return data_in.sort(function(a,b){
						return Number(b.wgr_bet) - Number(a.wgr_bet);
					});
				}else{
					return data_in.sort(function(a,b){
						return Number(a.wgr_bet) - Number(b.wgr_bet);
					});
				}
				
			}

			if(type == "mint"){
				if(direction == "desc"){
					return data_in.sort(function(a,b){
						return Number(b.vout_vin) - Number(a.vout_vin);
					});
				}else{
					return data_in.sort(function(a,b){
						return Number(a.vout_vin) - Number(b.vout_vin);
					});
				}
				
			}

			if(type == "count"){
				if(direction == "desc"){
					return data_in.sort(function(a,b){
						return Number(b.bets_placed) - Number(a.bets_placed);
					});
				}else{
					return data_in.sort(function(a,b){
						return Number(a.bets_placed) - Number(b.bets_placed);
					});
				}
				
			}

			if(type == "supply"){
				if(direction == "desc"){
					return data_in.sort(function(a,b){
						return b.supply_change - a.supply_change;
					});
				}else{
					return data_in.sort(function(a,b){
						return a.supply_change - b.supply_change;
					});
				}
			}

		}else{
			return false;
		}
	}

	//make table
	function makeTableRows(data){
		if(data === false){
			
			return (
				<tr key={"loading"}>
					<td>Loading..</td>
					<td>Loading..</td>
					<td>Loading..</td>
					<td>Loading..</td>
					<td>Loading..</td>
					<td>Loading..</td>
					<td>Loading..</td>
				</tr>
			)
		}else{
			var sliced_data = data.slice(0,100);
			
			var table_rows = sliced_data.map((v,k) =>
				<tr key={"event_history_row_"+k} data-eventid={v.event_id}>
					<td data-label="Rank" id={"event_history_rank_"+k}>{eval(k+1) }</td>
					<td data-label="Event Id" id={"event_history_eventid_"+k}><a target="_blank" href={"https://explorer.wagerr.com/#/bet/event/"+v.event_id}>{<NumberFormat
											value={v.event_id}
											displayType={'text'}
											thousandSeparator={false}
											decimalScale={0}
					/>}</a>
					</td>
					<td data-label="Date" id ={"event_history_date"+k}>{ moment.utc(v.date).format("MMM DD, YYYY hh:mm:ss z")  }</td>
					<td data-label="WGR Bet" id={"event_history_bet_"+k}>{<NumberFormat 
											value={v.wgr_bet}
											suffix={' WGR'}
											displayType={"text"}
											thousandSeparator={true}
											decimalScale={0}
										/>}
					</td>
					<td data-label="WGR Payout" id={"event_history_payout_"+k}>{<NumberFormat 
											value={v.vout_vin}
											suffix={' WGR'}
											displayType={"text"}
											thousandSeparator={true}
											decimalScale={0}
										/>}
					</td>
					<td data-label="WGR Supply Change" id={"event_history_supply_"+k}>{<NumberFormat 
											value={v.supply_change}
											suffix={' WGR'}
											prefix={v.supply_change < 0 ? "" : "+"}
											displayType={"text"}
											thousandSeparator={true}
											decimalScale={0}
										/>}
					</td>
					<td data-label="Bet Count" id={"event_history_count_"+k}>{<NumberFormat 
											value={v.bets_placed}
											prefix={'#'}
											displayType={"text"}
											thousandSeparator={true}
											decimalScale={0}
										/>}
					</td>
					
				</tr>
			)

			return table_rows;
		}

		
	}

	//sort click
	function sort_click(e){
		var test = e.target.tagName;
		
		var type = e.target.dataset.sort;
		var direction = e.target.dataset.direction;
		

		if(direction == 'desc'){
				setRows( makeTableRows( array_sort(type,"asc",data) ) );
				e.target.dataset.direction = "asc";
				setArrow(<svg pointerEvents="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-numeric-up" viewBox="0 0 16 16">
				  <path d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z"/>
				  <path fillRule="evenodd" d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"/>
				  <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
				</svg>)

			}else{
				setRows( makeTableRows( array_sort(type,"desc",data) ) );
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
		<div id="single_bets_table_container" className="top-open-list-container">
			<div className="open-total-header">Event History Totals</div>
			<div>
				<table className="table table-striped">
					<thead id="single_table_head">
					<tr >
						<th>No.</th>
						<th>Event ID</th>
						<th>Date</th>
						<th className="es-history-sort sort-active" data-sort="bet" data-direction="desc" onClick = {sort_click}>WGR Bet {arrow} </th>
						<th className="es-history-sort" data-sort="mint" data-direction="asc" onClick = {sort_click}>WGR Payout** {arrow} </th>
						<th className="es-history-sort" data-sort="supply" data-direction="asc" onClick = {sort_click}>WGR Supply Change** {arrow} </th>
						<th className="es-history-sort" data-sort="count" data-direction="asc" onClick = {sort_click}>Single Bet Count {arrow} </th>
					</tr>
					</thead>
					<tbody id="event_history_info" className="table-sort">
						{rows}
					</tbody>
				</table>
			</div>
		</div>
	)
	
}

export default EventHistoryTable;