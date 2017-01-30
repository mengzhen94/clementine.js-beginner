'use strict';

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js')
module.exports = function(app, db){
	var clickHandler = new ClickHandler(db);

	app.route('/').get(function(req, res){
		res.sendFile(process.cwd() + '/public/index.html');
	});

	/*
	We're defining a new route here for our API
	The getClicks function will be executed anytime 
	there is an HTTP GET request on the /api/clicks URL. 
	This will tell the Node to execute the controller function 
	we defined previously and get the results from the database.
	*/
	app.route('/api/clicks')
		.get(clickHandler.getClicks)
		.post(clickHandler.addClick)
		.delete(clickHandler.resetClicks);
};


