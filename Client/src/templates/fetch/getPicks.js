import React, { useState, useEffect } from 'react';

function getPicks(){
		const [error, setError] = useState(null);
		const [isLoaded, setIsLoaded] = useState(false);
		const [picks, setPicks] = useState([]);

		useEffect(() => {
			const fetch_picks = async () => {
				try{
					const response = await fetch("https://script.google.com/macros/s/AKfycbwR8r3fyIyf4XPEe2KtZabyZ0GgBFs8Br4aknT0MECNZmZmFYvV2OLMaqIN7WHSD88PBA/exec");
					const json = await response.json();
					setPicks(json);
					setIsLoaded(true);


				} catch(error){
					setError(error);
					setIsLoaded(true);
				}
			};
			fetch_picks();

			
			
		},[])

		if (error) {
		  return error.message;
		} else if (isLoaded == false) {
		  return false;
		} else {
			return picks;
			
	}


}

export default getPicks;