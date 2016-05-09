"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Board.jsx';
import Util from './Util.js';
import Constants from './Constants.js';
import Alarms from './Alarms.js';
import Notifications from './Notifications.js';

var localData, isExt = 0;
var mountNode = document.getElementById('body');
var storage = chrome.storage ? chrome.storage.local : localStorage;

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

class App extends React.Component{
	render(){
		return <div id="main-container">
			<Board items={this.props.items} />
			<div id="footer">
				<p id="feedback"><a href="https://github.com/dhirajbodicherla/HaveToDo/issues/new" target="_blank">Feedback</a></p>
			</div>
		</div>
	}
}

Util.storage.get('havetodo', function(data){
	if( data['havetodo'] !== undefined ){
  		localData = (data['havetodo'] != "") ? JSON.parse(data['havetodo']) : {};
	}else{
		localData = Constants.defaultItemStructure;
	}
	if(Util.countTasks(localData.boards) !== 0){
		// Alarms.set();
	}else{
		// Alarms.clear();
	}
	// console.log(Notifications);
	// Notifications.create();
	ReactDOM.render(<App items={localData}/> , mountNode);
});



