const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./db_connect');

const app = express()
app.use(cors());

var single_bets = require('./routes/single_bets')
var parlay_bets = require('./routes/parlay_bets')
var total_bets = require('./routes/total_bets')

/*app.use(bodyParser.json());*/
app.use(bodyParser.urlencoded({ extended: true }));


//get all single info
app.use('/api/get/single', single_bets);
//get all single info
app.use('/api/get/parlay', parlay_bets);
//get all single info
app.use('/api/get/total', total_bets);








//set to porrt 3001
app.listen(3001, () => {
	console.log('running on port 3001')
})

