import React, { useState, useEffect } from 'react';

function getPicks(){
		const [error, setError] = useState(null);
		const [isLoaded, setIsLoaded] = useState(false);
		const [picks, setPicks] = useState([]);

		useEffect(() => {
			fetch("https://script.google.com/macros/s/AKfycbwR8r3fyIyf4XPEe2KtZabyZ0GgBFs8Br4aknT0MECNZmZmFYvV2OLMaqIN7WHSD88PBA/exec")
			.then(res => res.json())
			.then(data => {
				setPicks(data);
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
		  return false;
		} else {
			return picks;
			
	}


}

export default getPicks;