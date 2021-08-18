import React, { useState, useEffect } from 'react';

function getEventHistory(){
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [events, setEvents] = useState([]);

	useEffect(() => {
		fetch("https://wagerrwatcher.com/api/get/single")

		.then(res => res.json())
		.then(events => {
			setEvents(events);
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
		return events;
		
	}
}



export default getEventHistory;