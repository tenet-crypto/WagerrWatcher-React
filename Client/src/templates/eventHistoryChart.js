import React, { useState, useEffect, useRef } from 'react';
import NumberFormat from 'react-number-format';


function EventHistoryChart(prop){

//****Make charts effect
	const [chart, setChart] = useState(null);
	//run effect on prop change
	useEffect(() => {
		const data_in = prop.data;
		//parse data
			
		if(data_in != false){
			//init
			createChart(data_in);
			
		}
	},[prop.data]);

	//chart for stacked
	function createChart(data){
		


		function array_sort(type, direction, data_in){
			//if data is
			if(data_in != false){
				//loop array
				if(type == "bet"){
					if(direction == "desc"){
						data_in.sort(function(a,b){
							return Number(b.wgr_bet) - Number(a.wgr_bet);
						});
						return data_in.map(v => ({x: v.event_id, y: v.wgr_bet }));
					}
					
				}

				if(type == "mint"){
					if(direction == "desc"){
						data_in.sort(function(a,b){
							return Number(b.vout_vin) - Number(a.vout_vin);
						});
						return data_in.map(v => ({x: v.event_id, y: v.vout_vin }));
					}
					
				}

				if(type == "count"){
					if(direction == "desc"){
						 data_in.sort(function(a,b){
							return Number(b.bets_placed) - Number(a.bets_placed);
						});
						return data_in.map(v => ({x: v.event_id, y: v.bets_placed }));
					}
					
				}

				if(type == "supply"){
					if(direction == "desc"){
						data_in.sort(function(a,b){
							return b.supply_change - a.supply_change;
						});
						return data_in.map(v => ({x: v.event_id, y: v.supply_change }));
					}else{
						data_in.sort(function(a,b){
							return a.supply_change - b.supply_change;
						});
						return data_in.map(v => ({x: v.event_id, y: v.supply_change }));
					}
				}

			}else{
				return false;
			}
		}



		var sort_bet = array_sort('bet', 'desc', data);
		var sort_mint = array_sort('mint', 'desc', data);
		var sort_bet_count = array_sort('count', 'desc', data);
		var sort_supply_high = array_sort('supply', 'desc', data);
		var sort_supply_low = array_sort('supply', 'asc', data);
		
		var data_bet = sort_bet.slice(0,100);
		var data_mint = sort_mint.slice(0,100);
		var data_supply_high = sort_supply_high.slice(0,100);
		var data_supply_low = sort_supply_low.slice(0,100);
		var data_count = sort_bet_count.slice(0,100);
		
		var ctx = document.getElementById('myChart');
		var myChart = new Chart(ctx, {
			type: 'scatter',
			data: {
				datasets: [{
					label: " WGR Bet",
					data: data_bet,
					backgroundColor: [ 'orange']

				},{
					label: " WGR Payout**",
					data: data_mint,
					backgroundColor: [ '#00A300']

				},{
					label: " WGR Supply Change (Mint)**",
					data: data_supply_high,
					backgroundColor: [ '#00FF00']

				},{
					label: " WGR Supply Change (Burn)**",
					data: data_supply_low,
					backgroundColor: [ 'red']

				},{
					label: " Single Bet Count",
					data: data_count,
					backgroundColor: [ 'blue'],
					yAxisID: 'y2',

				}
				],
				

			},
			options: {
				maintainAspectRatio: false,
				plugins: {
			      	zoom: {
				        zoom: {
				          wheel: {
				          	enabled: true,
				          		
				          },
				          pinch: {
				          	enabled: true,
				          },
				          mode: 'x',
				        },
				        pan: {
				        	enabled: true,
				        	mode: 'x',
				        	rangeMin: {
				        		x: null
				        	}
				        }
			      	},
			      	legend: {
			      		title: {
			      			display: true,
			      			text: "Click legend below to add or remove data",
			      		}
			      	},
			      	tooltip: {
			      		callbacks: {
			      			title: function(tooltipitem, data) {
  		                        
  		        				var x_val = tooltipitem[0].label;

  		                        var new_label ="Event Id: " + x_val;

  		                        return new_label;
  		                    },
  		                    label: function(context) {
  		                        var label = context.dataset.label || '';
  		                        var y_val = context.parsed.y;
  		                        var x_val = context.parsed.x;

  		                        if(label != " Bet Count"){
  		                        	var new_label =label + ': ' + Number(y_val).toLocaleString('en', {maximumFractionDigits: 0}) + " WGR";
  		                        }else{
  		                        	var new_label = label + ': ' + y_val;
  		                        }
  		 
  		                        return new_label;
  		                    }
  		                }
  						
  					}					      		
			    },
				scales: {
		            x: {
		 				
		            	ticks:{
		            		
		            	},
		            	title:{
		            		display: true,
		            		text: 'Event ID',
		            	},			
		                type: 'linear',

		               
		                
		            },
		            y: {
		     
		            	title: {
		            		display: true,
		            		text: 'WGR'
		            	}
		            },
		            y2:{
		            	title: {
		            		display: true,
		            		text: 'Bet Count'
		            	},
		            	grid: {
		            	          drawOnChartArea: false // only want the grid lines for one axis to show up
		            	},
		            	position: 'right',


		            }
				}

			}	
		});
		
		//set chart
		setChart(myChart);

	}


	
	

//****Chart button effect****//
	//run effect on prop change
	useEffect(() => {
		clickButton(prop.button);
	}, [prop.button])
	//button helper
	function clickButton(button){
		if(button == 'reset'){
			chart.resetZoom();

		}
	}


	return(

		<canvas id ="myChart"></canvas>
	)
}

export default EventHistoryChart;