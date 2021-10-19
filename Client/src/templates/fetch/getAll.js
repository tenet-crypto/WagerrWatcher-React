import React, { useState, useEffect } from 'react';
import StatsChart from '../statsChart.js';

function getAll(){
	const get_all = getStats();
	
	const api = "https://wagerrwatcher.com/api";
	const localhost = "http://localhost:3001/api";

	function getStats(){
		const [error, setError] = useState(null);
		const [isLoaded, setIsLoaded] = useState(false);
		const [single, setSingle] = useState([]);
		const [parlay, setParlay] = useState([]);
		const [mint, setMint] = useState([]);
		
		useEffect(() => {
			const fetch_all = async () =>{
				try{
					//parallel request
					const [singleResponse, parlayResponse, mintResponse] = await Promise.all([
						fetch(localhost + "/get/single/daily"),
						fetch(localhost + "/get/parlay/daily"),
						fetch(localhost + "/get/total")
					]) 
					const singleJson = await singleResponse.json();
					const parlayJson = await parlayResponse.json();
					const mintJson = await mintResponse.json();

					setSingle(singleJson);
					setParlay(parlayJson);
					setMint(mintJson);
					setIsLoaded(true);

				} catch (error){
					setError(error);
					setIsLoaded(true);	
				}
			};

			fetch_all();
		},[])


		if (error) {
		    return error;
		} else if (!isLoaded) {
			return false;
		} else {
			return [single, parlay, mint];
		}
	}

	if(get_all == false){
		return [false, false, false];
	}else{
		return get_all;
	}
	
}





export default getAll;