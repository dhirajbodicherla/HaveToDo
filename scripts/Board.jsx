import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment';
import InputComponent from './InputComponent.jsx';
import List from './List.jsx';
import Util from './util.js';
import ListActions from './ListActions.jsx';

export default class Board extends React.Component{
	constructor(props) {
      super(props);
      var endOfToday = moment().endOf('day');
      var currentBoard = props.items.boards[0];
      var todoList = currentBoard.lists.filter(function(list){
      	return list.name === 'Todo';
      })[0]
      var todayList = currentBoard.lists.filter(function(list){
      	return list.name === 'Today';
      })[0];
      for(var i=0;i<todoList.cards.length;i++){
      	var deadline = todoList.cards[i].deadline;
      	if(deadline && moment(deadline).isBefore(endOfToday)){
      		var card = todoList.cards.splice(i, 1)[0];
      		todayList.cards = [card].concat(todayList.cards);
      		i--;
      	}
      }
      this.state = {
      	board: currentBoard
      };
    }
    saveToStorage() {
		Util.storage.set("havetodo", JSON.stringify(this.props.items));
    }
    onUpdate() {
    	this.saveToStorage();
    }
	changeBoard(e){
		var newValue = e.target.value;
      	var board = this.props.items.boards.filter(function(v){
      		return v.id == newValue;
      	})[0];
      	this.setState({
      		'board': board
      	}, this.saveToStorage);
    }
    moveCard(fromList, toList, cardID, cardLocation){
    	var lists = this.state.board.lists, tList, card;     
		for(var i=0;i<lists.length;i++){
			if(lists[i].id === fromList){
				lists[i].cards = lists[i].cards.filter(function(v){
					if(v.id === cardID){
						card = v;
						return false;
					}else{
						return true;
					}
		    	});
		    	break;
			}
    	}
    	for(i=0;i<lists.length;i++){
    		if(lists[i].id === toList){
    			lists[i].cards.splice(cardLocation, 0, card);
    		}
    	}
    	
    	var board = this.state.board;
    	board.lists = lists;
    	return board;
    }
    dragStart(e){
		var e = e.nativeEvent;
		this.dragged = $(e.target);
	    e.dataTransfer.effectAllowed = 'move';
	    e.dataTransfer.setData("text/html", this.dragged);
	    this.placeholder = $('<div class="placeholder"></div>');
	}
	dragOver(e){
		var e = e.nativeEvent;
		if(e.target.className == "placeholder") return;
		this.target = $(e.target).closest('.card-container');
	    this.dragged.hide();
	    if(this.target.index() > this.dragged.index()){
	    	this.target.after(this.placeholder);
	    }else{
	    	this.target.before(this.placeholder);
	    }
	}
	dragEnd(e){
		var fromList = this.dragged.closest('ul').data('list-id'),
			toList = this.target.closest('ul').data('list-id'),
			cardID = this.dragged.data('card-id'),
			cardLocation = (this.target.index() > this.dragged.index()) ? this.target.index() + 1 : this.target.index() -1;
		
		var newState = this.moveCard(fromList, toList, cardID, cardLocation);
		ReactDOM.findDOMNode(this.placeholder[0]).remove();
		this.dragged.show();
		this.setState({
			'board': this.state.board
		}, this.saveToStorage);
	}
	showState() {
		console.log(this.state, this.props);
	}
	sortList(listID){
		var board = this.state.board;
		var list = board.lists.filter(function(list){ return list.id === listID})[0];

	}
    render() {
		var board = this.state.board;
		var boardLists = board.lists.map(function(list, i){
			var hasInput = (i == 0) ? 1 : 0;
			var hasSort = (i == 1) ? 1 : 0;
			return (<li className={"list-container " + list.name} key={list.id}>
				<p className="list-name">{list.name}</p>
				<ListActions hasSort={hasSort} sort={this.sortList.bind(this, list.id)}/>
				<List list={list} 
						dragOver={this.dragOver.bind(this)}
						dragEnd={this.dragEnd.bind(this)}
						dragStart={this.dragStart.bind(this)}
						hasInput={hasInput}
						update={this.onUpdate.bind(this)}/>
			</li>);
		}.bind(this));
		var boards = this.props.items.boards.map(function(board){
			return <option key={board.id} value={board.id}>{board.name}</option>
		});
		return (<div>
				<input type="button" value="state" onClick={this.showState.bind(this)} style={{"display": "none"}}/>
				<select onChange={this.changeBoard.bind(this)} style={{"display": "none"}}>{boards}</select>
				<ReactCSSTransitionGroup transitionEnterTimeout={500} transitionLeaveTimeout={300} component="ul" transitionName="tasks-list-transition" className="lists-container">{boardLists}</ReactCSSTransitionGroup>
		</div>
		);
    }
}