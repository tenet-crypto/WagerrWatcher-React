import React, { useState, useEffect } from 'react';
import StatsChart from '../statsChart.js';

function getStatsSingle(){
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [single, setSingle] = useState([]);
	
	

	useEffect(() => {
		fetch("https://script.google.com/macros/s/AKfycbwG9LNM70OIgcD0YEt6eVAagrKSYMDxkns6lw7AA_37HWj-CZqHbUJRgn1oHmus9fw8/exec?betType=single")
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
	    return 'Loading...';
	  } else {
	    return single;
	  }
}



export default getStatsSingle;