import React, { useState, useEffect } from 'react';

function getCoin(){
		const [error, setError] = useState(null);
		const [isLoaded, setIsLoaded] = useState(false);
		const [coin, setCoin] = useState([]);

		useEffect(() => {
			fetch("https://explorer.wagerr.com/api/coin/")
			.then(res => res.json())
			.then(data => {
				setCoin(data);
				setIsLoaded(true);
				
			},
			(error) =>{
				setError(error);
				setIsLoaded(true);
				
			})
		},[])

		if (error) {
		  return error.message;
		} else if (isLoaded == false) {
		  return 'loading';
		} else {
			return coin;
			
	}


}

export default getCoin;