'use strict';

/*
immediately invoked function express (IIFE)
An IIFE is going to bind all the variables within to the local scope of that function. 
This means that any variables declared within this function will not conflict with 
other variables within the application that may share the same name or need to be re-used.
*/

(function(){
	var addButton = document.querySelector('.btn-add');
	var deleteButton = document.querySelector('.btn-delete');
	var clickNbr = document.querySelector('#click-nbr');
	var apiUrl = 'http://localhost:8080/api/clicks';

	function ready(fn){
		//This prevents elements like arrays and strings from being provided as arguments.
		if(typeof fn !== 'function'){
			return;
		}
		//if the readyState property of the document object is equal to complete, 
		//we're going to execute the function passed as an argument.
		if(document.readyState === 'complete'){
			return fn();
		}
		//if the document has not yet loaded
		/*document.addEventListener(type, listener, useCapture)
		type: a string representing the type of event to listen for. 
		In our case, we're listening for the `DOMContentLoaded' event
		listener: the function that should be executed when the event occurs
		 -- the fn argument in this case
		userCapture: a true/false value which specifies if all events of the 
		specified type should be executed with the listener argument. This defaults to false
		*/
		document.addEventListener('DOMContentLoaded', fn, false);
	}

	/*
	create a function that will retrieve the data from the API. 
	To do this, we're going to use an XMLHttpRequest. 
	This object will allow us to retrieve information without requiring the entire page 
	to be refreshed. 
	*/
	/*
	The HTTP method that we would like the request to use (i.e. GET / POST / DELETE)
	The url that the function makes the HTTP request to
	A callback function that should be executed once the data has been retrieved.
	*/
	function ajaxRequest(method, url, callback){
		//Think of this as essentially creating a "copy" of the 
		//XMLHttpRequest object for us to use.
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function(){
			//A readyState of 4 means that the operation (i.e. data retrieval) has been completed. 
			if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
				/*
				If both of those conditions are met, then we are executing the callback function 
				provided as an argument to the function, and also passing the xmlhttp.response 
				property as an argument for use in that function. 
				This response property is the piece that will contain the data from the AJAX request.
				*/
				callback(xmlhttp.response);
			}
		};
		/*
		When the function is first called, we want to initiate the request. 
		That's the purpose of the xmlhttp.open(method, url, async)

		method: a string containing the HTTP method to use as part of the request (i.e. 'GET'/'POST'/etc). 
		In this case, we are passing in our method argument from the ajaxRequest function.

		url: the URL to send the request to (again, 
		in this case we're passing in the url argument from the ajaxRequest function)

		async: A boolean value which specifies if the request should be made asynchronously. 
		In this case, we do want the request to be asynchronous, so we specify a value of true
		*/
		xmlhttp.open(method, url, true);
		/*
		the xmlhttp.send() method executes the previously initiated request (from the open() method)*/
		xmlhttp.send();
	}

	function updateClickCount(data){
		//Note that the data argument being passed in 
		//will actually be the data from the xmlhttp.response

		//convert the string from the data argument to an object using the JSON.parse() method. 
		var clicksObject = JSON.parse(data);
		// reference the clicks property and return its associated value. 
		//Remember that our data object from the API looks like: { 'clicks': 0 }.
		clickNbr.innerHTML = clicksObject.clicks;
	}

	ready(ajaxRequest('GET', apiUrl, updateClickCount));

	addButton.addEventListener('click', function(){
		//This function first makes a POST AJAX request, 
		//which increments the number of clicks.
		ajaxRequest('POST', apiUrl, function(){
			// a GET request is made to update the 'clicks' value in the browser.
			ajaxRequest('GET', apiUrl, updateClickCount)
		});
	}, false);

	deleteButton.addEventListener('click', function(){
		ajaxRequest('DELETE', apiUrl, function(){
			ajaxRequest('GET', apiUrl, updateClickCount);
		});
	}, false);

})();