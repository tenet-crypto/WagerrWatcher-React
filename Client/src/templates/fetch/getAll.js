import React, { useState, useEffect } from 'react';
import StatsChart from '../statsChart.js';

function getAll(){
	const single = getStatsSingle();
	const parlay = getStatsParlay();
	const mint = getStatsMint();
	var api = "https://wagerrwatcher.com/api";
	var localhost = "http://localhost:3001/api";

	function getStatsSingle(){
		const [error, setError] = useState(null);
		const [isLoaded, setIsLoaded] = useState(false);
		const [single, setSingle] = useState([]);
		
		

		useEffect(() => {
			fetch(api + "/get/single/daily")
			.then(res => res.json())
			.then(data => {
				setSingle(data);
				setIsLoaded(true);
				
			},
			(error) =>{
				setIsLoaded(true);
				setError(error);
			})

		},[])


		if (error) {
		    return <div>Error: {error.message}</div>;
		  } else if (!isLoaded) {
		    return false;
		  } else {
		    return single;
		  }
	}

	function getStatsParlay(){
		const [error, setError] = useState(null);
		const [isLoaded, setIsLoaded] = useState(false);
		const [parlay, setParlay] = useState([]);

		
		useEffect(() => {
			//get paraly
			fetch(api + "/get/parlay/daily")
			.then(res => res.json())
			.then(data => {
				setParlay(data);
				setIsLoaded(true);
		
			},
			(error) =>{
				setIsLoaded(true);
				setError(error);
			})
		},[])

		if (error) {
		    return <div>Error: {error.message}</div>;
		  } else if (!isLoaded) {
		  		return false;
		  } else {
		    return parlay ;
		  }
	}

	function getStatsMint(){
		const [error, setError] = useState(null);
		const [isLoaded, setIsLoaded] = useState(false);
		const [mint, setMint] = useState([]);
		

		useEffect(() => {
			//get mint
			fetch(api + "/get/total")
			.then(res => res.json())
			.then(data => {
				setMint(data);
				setIsLoaded(true);
				
			},
			(error) =>{
				setIsLoaded(true);
				setError(error);
			})

		},[])

		if (error) {
		    return <div>Error: {error.message}</div>;
		  } else if (!isLoaded) {
		   	return false;
		  } else {
		    return  mint ;
		  }
	}

	if(single == false || parlay == false || mint == false){
		return [false, false, false];
	}else{
		return [single, parlay, mint];
	}
	
}





export default getAll;