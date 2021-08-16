import './css/navbar.css';
import logo from './img/wgrlogomodernICONallwhite.svg';
import NumberFormat from 'react-number-format';
import getCoin from './fetch/getCoin.js'


function Navbar(){
		const coinInfo = getCoin();
	

	return(
		<div className="nav-container">
			<div className="header-logo-c">
				<div>
					<img className="header-logo" src={logo}></img>
				</div>
				<div className="header-watcher">Watcher</div>
			</div>
			<div className="header-options-c">
				<div className="header-options-list">
					<div className="header-option">WGR: <NumberFormat 
																value={coinInfo.usd}
																prefix={'$'}
																suffix={' USD'}
																displayType={"text"}
															/>
					</div>
					<div className="header-option">Supply: <NumberFormat 
																value={coinInfo.supply}
																suffix={' WGR'}
																displayType={"text"}
																thousandSeparator={true}
																decimalScale={0}
															/>
					</div>
					<div className="header-option">Market Cap: <NumberFormat 
																value={eval(coinInfo.supply * coinInfo.usd)}
																prefix={'$'}
																suffix={' USD'}
																displayType={"text"}
																thousandSeparator={true}
																decimalScale={2}
															/> 
					</div>
				</div>				
			</div>
		</div>
	)
}

export default Navbar;