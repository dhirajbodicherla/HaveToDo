import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment';
import InputComponent from './InputComponent.jsx';
import List from './List.jsx';
import Util from './util.js';
import Constants from './Constants.js';
import ListActions from './ListActions.jsx';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';


export default class Board extends React.Component{
	constructor(props) {
      super(props);
      if(this.props.items.boards.length){
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
	      	board: currentBoard,
	      	isBoardModalOpen: false
	      };
	  }else{
	  	this.state = {
	  		isBoardModalOpen: true
	  	};
	  }
    }
    saveToStorage() {
		Util.storage.set("havetodo", JSON.stringify(this.props.items));
    }
    onUpdate() {
    	this.saveToStorage();
    }
    createBoard(){
    	var name = this.refs.boardInput.getValue();
    	if(name.trim() != ''){
    		var board = {};
    		board['id'] = Util.UUID();
    		board['name'] = name;
    		board['lists'] = Constants.defaultListStructure;
    		this.props.items.boards.push(board);
    		this.setState({
      			'board': board,
      			'isBoardModalOpen': false
      		}, this.saveToStorage);
      		this.refs.boardInput.clearValue();
    	}
    }
    boardModalButtonClick(){
    	var state = this.state;
		state['isBoardModalOpen'] = false;
		this.setState(state);
    }
	changeBoard(e, index, value){
		if(value == -1){
			var state = this.state;
			state['isBoardModalOpen'] = true;
			this.setState(state);
		}else{
			var newValue = value;
	      	var board = this.props.items.boards.filter(function(v){
	      		return v.id == newValue;
	      	})[0];
	      	this.setState({
	      		'board': board
	      	}, this.saveToStorage);
		}
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
	    var boards = [];
	    if(this.props.items.boards.length){
	    	var actions = [
				<FlatButton
					label="Cancel"
					primary={true} 
					onTouchTap={this.boardModalButtonClick.bind(this)} />,
				<FlatButton
					label="Submit"
					secondary={true}
					onTouchTap={this.createBoard.bind(this)} />,
		    ];
			var board = this.state.board;
			var boardLists = board.lists.map(function(list, i){
				var hasInput = (i == 0) ? 1 : 0;
				var hasSort = (i == -1) ? 1 : 0;
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
			boards = this.props.items.boards.map(function(board){
				return <MenuItem value={board.id} primaryText={board.name} key={board.id}/>
			});
			boards.push(<MenuItem value="-1" primaryText="Create new board" key="-1"></MenuItem>);

			return (<div>
				<div id="actions-container">
					<input type="button" value="state" onClick={this.showState.bind(this)} style={{"display": "none"}}/>
					<DropDownMenu ref="changeBoardDropDown" 
									style={{"minWidth": "200px"}} 
									value={board.id} 
									onChange={this.changeBoard.bind(this)}>
						{boards}
					</DropDownMenu>
				</div>
				<div id="board-container">
					<ReactCSSTransitionGroup key={board.id} transitionEnterTimeout={500} transitionLeaveTimeout={300} component="ul" transitionName="tasks-list-transition" className="lists-container">{boardLists}</ReactCSSTransitionGroup>
				</div>
				<Dialog
		          title="Create new board"
		          actions={actions}
		          modal={true}
		          open={this.state.isBoardModalOpen}>
		          	<TextField fullWidth={true} hintText="Enter new board here" ref="boardInput" onEnterKeyDown={this.createBoard.bind(this)}/>
		        </Dialog>
			</div>);
		}else{
	    	var actions = [
				<FlatButton
					label="Cancel"
					disabled={true}
					primary={true} 
					onTouchTap={this.boardModalButtonClick.bind(this)} />,
				<FlatButton
					label="Submit"
					secondary={true}
					onTouchTap={this.createBoard.bind(this)} />,
		    ];
			return <Dialog
		          title="Create new board"
		          actions={actions}
		          modal={true}
		          open={this.state.isBoardModalOpen}>
		          	<TextField fullWidth={true} 
		          				hintText="Enter new board here" 
		          				ref="boardInput"
		          				onEnterKeyDown={this.createBoard.bind(this)}/>
		        </Dialog>;
		}
    }
}