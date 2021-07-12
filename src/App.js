import logo from './logo.svg';
import './App.css';
import Navbar from './templates/navbar.js';
import Sidebar from './templates/sidebar.js';
import TopOpenEvents from './templates/topOpenEvents.js';
import BigBets from './templates/bigBets.js';
import Stats from './templates/stats.js';
import getAll from './templates/fetch/getAll.js';
import getCoin from './templates/fetch/getCoin.js'

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
                <Route exact path='/'><TopOpenEvents /></Route>
                <Route exact path='/BigBets'><BigBets /></Route>
                <Route exact path='/Stats'><Stats data={getAll()} coin={getCoin()} /></Route>
              </Switch>

            </div>
          </div>
        </Router>
       </div>
      </div>
    
  );
}

export default App;
