import './css/links.css';
import React, { useState, useEffect } from 'react';
import donate from './img/donate.png';


function Links(){

	function copyClipboard(){
		var copyText = document.getElementById("donate_input");
		//select field
		copyText.select();

		//for mobile
		copyText.setSelectionRange(0, 99999);

		//copy text
		document.execCommand('copy');

		alert("Copied the text: " + copyText.value);

	}
	
	return(
		<div id="links_div" className="top-open-container">
			<div className="top-open-header">Links</div>
			<div className="links_list">
				<ul>
					<li className="link-item">Wagerr Sports Book: <a target="_blank" href="https://wagerr.com/sportsbook">https://wagerr.com/sportsbook</a></li>
					<li className="link-item">Wagerr.com: <a target="_blank" href="https://wagerr.com/">https://wagerr.com/</a></li>
					<li className="link-item">Wagerr Blockchain Explorer: <a target="_blank" href="https://explorer.wagerr.com/#/">https://explorer.wagerr.com/#/</a></li>
					<li className="link-item donate">Donate: <input className="donate-input" id="donate_input" type="text" name="donate" defaultValue="WaPR8APAouvJjKAAoWpdhBa1pppbSBW12E" readOnly ></input><button id="donate_button" className="btn btn-primary" onClick={copyClipboard} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
					  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
					  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
						</svg> Copy to Clipboard</button> </li>
					<img className="donate-qr" src={donate}></img>
					<div style={{fontWeight: 'bold'}} >**All Donations will be bet!!</div>
				</ul>
			</div>
		</div>
		

	)
}

export default Links;
