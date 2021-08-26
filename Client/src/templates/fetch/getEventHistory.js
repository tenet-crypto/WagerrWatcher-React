import React, { useState, useEffect } from 'react';

function getEventHistory(){
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const fetch_history = async () =>{
			try{
				const response = await fetch("https://wagerrwatcher.com/api/get/single")
				const json = await response.json();
				setEvents(json);
				setIsLoaded(true);
				
			} catch(error){
				setError(error);
				setIsLoaded(true);
			}
		};

		fetch_history();
		
	},[])

	if (error) {
	  return error.message;
	} else if (isLoaded == false) {
	  return false;
	} else {
		return events;
		
	}
}



export default getEventHistory;