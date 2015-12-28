"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Board.jsx';
import Util from './util.js';

var localData, isExt = 0;
var mountNode = document.getElementById('body');
var storage = chrome.storage ? chrome.storage.local : localStorage;

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var lists = [{
    'name': 'Todo',
    'id': 'list1-b1',
    'cards': []
}, {
    'name': 'Today',
    'id': 'list3-b1',
    'cards': []
}, {
    'name': 'Done',
    'id': 'list2-b1',
    'cards': []
}];

var items = {
    'boards': [{
        'name': 'Work',
        'id': 'board11',
        'lists': lists
    }]
};

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
		localData = items;
	}
	ReactDOM.render(<App items={localData}/> , mountNode);
});



