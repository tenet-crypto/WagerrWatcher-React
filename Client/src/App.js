import logo from './logo.svg';
import './App.css';
import Navbar from './templates/navbar.js';
import Sidebar from './templates/sidebar.js';
import TopOpenEvents from './templates/topOpenEvents.js';
import BigBets from './templates/bigBets.js';
import TodayEvents from './templates/todayEvents.js';
import Stats from './templates/stats.js';
import EventHistory from './templates/eventHistory.js';
import UFCPicks from './templates/ufcPicks.js';
import Links from './templates/links.js';

import getOpenEvents from './templates/fetch/getOpenEvents.js';
import getAll from './templates/fetch/getAll.js';
import getCoin from './templates/fetch/getCoin.js';
import getPicks from './templates/fetch/getPicks.js';
import getEventHistory from './templates/fetch/getEventHistory.js';
import getToday from './templates/fetch/getToday.js';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {



  return (
    
      <div className="page-container">
      <div className="content-container">
        <Router>
          <Navbar></Navbar>
          <div className="body-container">
            <Sidebar />
            <div className="page-data-container">
            
              <Switch>
                <Route exact path='/'><TopOpenEvents data={getOpenEvents()} coin={getCoin()} /></Route>
                <Route exact path='/BigBets'><BigBets data={getOpenEvents()} coin={getCoin()} /></Route>
                <Route exact path='/Today'><TodayEvents data={getToday()} coin={getCoin()} /></Route>
                <Route exact path='/Stats'><Stats data={getAll()} coin={getCoin()} /></Route>
                <Route exact path='/EventStats'><EventHistory data={getEventHistory()} coin={getCoin()} /></Route>
                <Route exact path='/UFCPicks'><UFCPicks data={getPicks()}  /></Route>
                <Route exact path='/links'><Links/></Route>
              </Switch>

            </div>
          </div>
        </Router>
       </div>
      </div>
    
  );
}

export default App;
