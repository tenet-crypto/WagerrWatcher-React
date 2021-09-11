import React, { useState, useEffect, useRef } from 'react';
import NumberFormat from 'react-number-format';
import Stats from './stats.js'

function StatsChart(prop){

//****Make charts effect
	const [chart, setChart] = useState(null);
	//chart helper for single and parlay cases
	function createChart(data){
		var data_total = [];
		var data_win = [];

		data.forEach(function(v,k){
			data_total.push( {x: v.date, y: v.wgr_bet} );
			data_win.push( {x: v.date, y: v.wgr_payout} );
		});

		var ctx = document.getElementById('myChart');
		var myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				datasets: [{
					label: " Total WGR Bet",
					data: data_total,
					backgroundColor: [ 'red']

				},{
					label: " Total WGR Won",
					data: data_win,
					backgroundColor: [ 'green']

				}
				],
				

			},
			options: {
				layout: {
				            padding: {
				            	left: 10,
				                right: 20
				            }
				},
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
			      			text: "Click below to add or remove data",
			      		}
			      	},
			      	tooltip: {
			      		callbacks: {
			      			title: function(tooltipitem, data) {
  		                        
  		        				var x_val = tooltipitem[0].parsed.x;
  		                        var new_label = moment.utc(x_val).format("dddd MMM DD, YYYY");

  		                        return new_label;
  		                    }
  		                    
  		                }
  						
  					}					      		
			    },
				scales: {

		            x: {
		            	title:{
		            		display: true,
		            		text: 'Date',
		            	},			
		                type: 'time',				            				       
		                time: {				   
		                	unit: 'day',
		                	stepSize: 1,		     
		                    displayFormats: {
		                    	day: 'MMM DD, YYYY',
		                    	month: 'MMM YYYY',
		                    	week: 'MMM DD, YYYY',
		                    },
		                    tooltipFormat: 'YYYY-MMM-DD', 
		                },
		                
		            },
		            y: {
		            	title: {
		            		display: true,
		            		text: 'WGR'
		            	}
		            }
			        
				
				}

			}	
		});
		myChart.update();
		setChart(myChart);

	}
	//chart helper for mint case
	function createChartMint(data){
		var mint_total = [];
		var bet_total = [];
		var bet_count = [];

		data.forEach(function(v,k){

			var bet = v.total_wgr_bet;
			var count = v.total_bets_placed;

			mint_total.push( {x: v.date, y: v.total_transaction } );
			bet_total.push( {x: v.date, y: v.total_wgr_bet } );
			bet_count.push( {x: v.date, y: v.total_bets_placed } );
			
		});

		var ctx = document.getElementById('myChart');
		var myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				datasets: [{
					label: " Total WGR Bet",
					data: bet_total,
					backgroundColor: [ 'red'],
					

				},
				{
					label: " Total WGR Mint",
					data: mint_total,
					backgroundColor: [ 'green'],
					

				}],
				

			},
			options: {
				layout: {
				            padding: {
				            	left: 10,
				                right: 20
				            }
				},
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
			      			text: "Click below to add or remove data",
			      		}
			      	},
			      	tooltip: {
			      		callbacks: {
			      			title: function(tooltipitem, data) {
  		                        
  		        				var x_val = tooltipitem[0].parsed.x;
  		                        var new_label = moment.utc(x_val).format("dddd MMM DD, YYYY");

  		                        return new_label;
  		                    }
  		                    
  		                }
  						
  					}					      		
			    },
				scales: {

		            x: {
		            	title:{
		            		display: true,
		            		text: 'Date',
		            	},			
		                type: 'time',				            				       
		                time: {				   
		                	unit: 'day',
		                	stepSize: 1,		     
		                    displayFormats: {
		                    	day: 'MMM DD, YYYY',
		                    	month: 'MMM YYYY',
		                    	week: 'MMM DD, YYYY',
		                    	
		                    },
		                    tooltipFormat: 'dddd MMM DD, YYYY', 
		                },
		                
		            },
		            y: {
		            	title:{
		            		display: true,
		            		text: 'WGR',
		            	},}
				}

			}	
		});
		myChart.update();
		setChart(myChart);
	}
	//run effect on prop change
	useEffect(() => {

		const data_in = prop.data;
		const type = prop.type;
		//parse data
			
		if(chart != null){
			chart.destroy();
			setChart(null);

			if(type == 'totalmint'){
				createChartMint(data_in);
			}else{
				createChart(data_in);
			}
			
		}else{
			if(type == 'totalmint'){
				createChartMint(data_in);
			}else{
				createChart(data_in);
			}
			
		}
	},[prop.data]);

//****Chart button effect****//
	//run effect on prop change
	useEffect(() => {
		clickButton(prop.button);
	}, [prop.button])
	//button helper
	function clickButton(button){
		if(button == 'reset'){
			chart.resetZoom();

		}else if(button == 'month'){
			chart.options.scales.x.time.unit = 'month';
			chart.update();
			
		}else if(button == 'day'){
			chart.options.scales.x.time.unit = 'day';
			chart.update();
			
		}else if(button == 'week'){
			chart.options.scales.x.time.unit = 'week';
			chart.update();
		
		}
	}


	return(

		<canvas id ="myChart"></canvas>
	)
}

export default StatsChart;