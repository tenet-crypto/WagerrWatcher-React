import React, { useState, useEffect } from 'react';
import StatsChart from '../statsChart.js';

function getStatsMint(){
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [mint, setMint] = useState([]);
	

	useEffect(() => {
		//get mint
		fetch("https://script.google.com/macros/s/AKfycbwG9LNM70OIgcD0YEt6eVAagrKSYMDxkns6lw7AA_37HWj-CZqHbUJRgn1oHmus9fw8/exec?betType=mint")
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
	   	return 'Loading...';
	  } else {
	    return  mint ;
	  }
}



export default getStatsMint;