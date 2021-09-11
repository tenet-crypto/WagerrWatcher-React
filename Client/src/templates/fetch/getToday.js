import React, { useState, useEffect } from 'react';

function getToday(){
	
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [completed, setCompleted] = useState([]);
	const [pending, setPending] = useState([]);
	
	useEffect(() => {
		const fetch_all = async () =>{
			try{
				//parallel request
				const [completedResponse, pendingResponse] = await Promise.all([
					fetch("https://explorer.wagerr.com/api/bet/events/info?limit=250&skip=0&opened_or_completed=false"),
					fetch("https://explorer.wagerr.com/api/bet/events/info?limit=250&skip=0&opened_or_completed=true"),
				]) 
				const completedJson = await completedResponse.json();
				const pendingJson = await pendingResponse.json();
		
				setCompleted(completedJson);
				setPending(pendingJson);
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
		return [completed, pending];
	}
}





export default getToday;