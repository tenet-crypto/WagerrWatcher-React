import './css/sidebar.css';
import logo from './img/wgrlogomodernICONallwhite.svg'
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';


function Sidebar(){

	return(
		<div className="side-bar-container">
			<div className="side-bar">
				<div className="side-bar-mobile">
					<NavLink id="top_open_button" className="side-bar-item" activeClassName="side-bar-item-active" exact to="/">Top Open Events</NavLink>
					<NavLink id="big_bets_button" className="side-bar-item" activeClassName="side-bar-item-active" to="/BigBets">Big Bets</NavLink>
					<NavLink id="today_events_button" className="side-bar-item" activeClassName="side-bar-item-active" to="/Today">Today's Events</NavLink>
					<NavLink id="stats_button" className="side-bar-item" activeClassName="side-bar-item-active"  to="/Stats" >Betting Volume/Stats</NavLink>
					<NavLink id="event_stats_button" className="side-bar-item" activeClassName="side-bar-item-active"  to="/EventStats" >Event Stats</NavLink>
					<NavLink id="picks_button" className="side-bar-item" activeClassName="side-bar-item-active"  to="/UFCPicks" >UFC Picks</NavLink>
					<NavLink id="links_button" className="side-bar-item" activeClassName="side-bar-item-active" to="/links" >Links</NavLink>
				</div>
			</div>
		</div>
	)
}

export default Sidebar;