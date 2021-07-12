import React, { useState, useEffect } from 'react';

function getOpenEvents(){
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [open, setOpen] = useState([]);
	const [openActions, setopenActions] = useState([]);

	useEffect(() => {
		fetch("https://explorer.wagerr.com/api/bet/openevents")
		.then(res => res.json())
		.then(events => {
			setOpen(events);

			//get actions for all open events
			var open_events_id = events.events.map((v) => 'eventId='+v.eventId+'&').join("");
			fetch("https://explorer.wagerr.com/api/bet/actions?"+open_events_id)
			.then(res2 => res2.json())
			.then(data => {
				setopenActions(data);
				setIsLoaded(true);
			},
			(error) =>{
				setIsLoaded(true);
				setError(error);
			})
		},
		(error) =>{
			setIsLoaded(true);
			setError(error);
		})
	},[])

	if (error) {
	  return error.message;
	} else if (isLoaded == false) {
	  return 'loading';
	} else {
		return [open, openActions];
		
	}
}



export default getOpenEvents;