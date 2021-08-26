import React, { useState, useEffect } from 'react';

function getOpenEvents(){
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [open, setOpen] = useState([]);
	const [openActions, setopenActions] = useState([]);

	useEffect(() => {

		const fetch_open_events = async () =>{
			try{
				const response = await fetch("https://explorer.wagerr.com/api/bet/openevents");
				const json = await response.json();
				setOpen(json);
				const open_events_id = json.events.map((v) => 'eventId='+v.eventId+'&').join("");
				fetch_open_actions(open_events_id);


			} catch(error){
				setError(error);
				setIsLoaded(true);

			}
		};

		const fetch_open_actions = async (eventId) =>{
			try{
				const response = await fetch("https://explorer.wagerr.com/api/bet/actions?"+eventId)
				const json = await response.json();
				setopenActions(json);
				setIsLoaded(true);


			} catch(error){
				setError(error);
				setIsLoaded(true);

			}
		};

		fetch_open_events();

		
	},[])

	if (error) {
	  return error.message;
	} else if (isLoaded == false) {
	  return false;
	} else {
		return [open, openActions];
		
	}
}



export default getOpenEvents;