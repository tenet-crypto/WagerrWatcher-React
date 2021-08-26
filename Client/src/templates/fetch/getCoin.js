import React, { useState, useEffect } from 'react';

function getCoin(){
		const [error, setError] = useState(null);
		const [isLoaded, setIsLoaded] = useState(false);
		const [coin, setCoin] = useState([]);

		useEffect(() => {
			const fetch_coin = async () =>{
				try{
					const response = await fetch("https://explorer.wagerr.com/api/coin/")
					const json = await response.json();
					setCoin(json);
					setIsLoaded(true);

				} catch(error){
					setError(error);
					setIsLoaded(true);
				}
			};

			fetch_coin();
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