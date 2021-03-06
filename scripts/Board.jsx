import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment';
import InputComponent from './InputComponent.jsx';
import List from './List.jsx';
import Util from './Util.js';
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
	      if(props.items.selectedBoard){
		      currentBoard = props.items.boards.filter(function(board){ return board.id === props.items.selectedBoard; })[0];
	  	  }
	      var todoList = currentBoard.lists.filter(function(list){ return list.name === 'Todo'; })[0];
	      var todayList = currentBoard.lists.filter(function(list){ return list.name === 'Today'; })[0];
	      for(var i=0;i<todoList.cards.length;i++){
	      	var deadline = todoList.cards[i].deadline;
	      	if(deadline && moment(deadline).isBefore(endOfToday)){
	      		var card = todoList.cards.splice(i, 1)[0];
	      		todayList.cards = [card].concat(todayList.cards);
	      		i--;
	      	}
	      }
	      var doneList = currentBoard.lists.filter(function(list){ return list.name === 'Done'; })[0];
	      for(var i=0;i<doneList.cards.length;i++){
	      	var deadline = doneList.cards[i].deadline;
	      	var today = moment().startOf('day');
	      	if(deadline){
	      		var diff = today.diff(deadline, 'days');
	      		if(diff >= 7){
	      			doneList.cards.splice(i,1);
	      			i--;
	      		}
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
    componentDidMount(){
    	if(this.state.isBoardModalOpen){
    		$(ReactDOM.findDOMNode(this.refs.boardInput)).find('input').focus();
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
    		board['lists'] = Constants.defaultListStructure();
    		this.props.items.boards.push(board);
    		this.props.items.selectedBoard = board['id'];
    		this.setState({
      			'board': board,
      			'isBoardModalOpen': false
      		}, this.saveToStorage);
      		$(ReactDOM.findDOMNode(this.refs.boardInput)).find('input').val('').attr('placeholder', 'Enter new board here');
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
			this.setState(state, function(){
				$(ReactDOM.findDOMNode(this.refs.boardInput)).find('input').focus();
			}.bind(this));
		}else if(value == -2){
			console.log('have to show board manager');
		}else{
			var newValue = value;
	      	var board = this.props.items.boards.filter(function(v){ return v.id == newValue; })[0];
	      	this.props.items.selectedBoard = newValue;
	      	this.setState({
	      		'board': board
	      	}, this.saveToStorage);
		}
    }
    onCardMove(moveDetails){
    	var newState = this.moveCard(moveDetails.fromList, moveDetails.toList, moveDetails.cardId, moveDetails.cardLocation);
    	this.setState({
    		'board': this.state.board
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
    			card.listName = lists[i].name;
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
	    this.placeholder = $('<li class="placeholder"></li>');
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
	dragEnter(e){
		// console.log('enter', e.target);
	}
	dragEnd(e){
		var fromList = this.dragged.closest('ul').data('list-id'),
			toList = this.target.closest('ul').data('list-id'),
			cardID = this.dragged.data('card-id'),
			cardLocation = this.placeholder.prevAll('.card-container:visible').length;
			// console.log('cardlocation', cardLocation, this.target.closest('ul'));
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

    	if(this.state.isBoardModalOpen){
    		var isCancelDisabled = (this.props.items.boards.length) ? false: true;
    		var actions = [
				<FlatButton
					label="Cancel"
					disabled={isCancelDisabled}
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
							hasInput={hasInput}
							update={this.onUpdate.bind(this)}
							cardMove={this.onCardMove.bind(this)}/>
				</li>);
			}.bind(this));
			boards = this.props.items.boards.map(function(board){
				return <MenuItem value={board.id} primaryText={board.name} key={board.id}/>
			});
			boards.push(<MenuItem value="-2" primaryText="Manage boards" key="-2"></MenuItem>);
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
			</div>);
		}
    }
}