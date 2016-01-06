import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import $ from 'jquery';
require('jquery-ui/sortable');
import TaskCard from './TaskCard.jsx';
import InputComponent from './InputComponent.jsx';
import Util from './Util.js';

export default class List extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			'list': this.props.list
		}
	}
	componentDidMount(){
		var moveDetails = {};
		var self = this;
		var list = $(ReactDOM.findDOMNode(this.refs.list));
		var sortable = list.sortable({
			connectWith: "ul",
			placeholder: "placeholder static",
			items: "li:not(.static)",
			start: function(event, ui){
				var parent = ui.item.closest('ul');
				moveDetails['fromList'] = parent.data('list-id');
			},
			stop: function(event, ui){
				var parent = ui.item.closest('ul');
				moveDetails['toList'] = parent.data('list-id');
				moveDetails['cardId'] = ui.item.data('card-id');
				moveDetails['cardLocation'] = parent.children('li:not(".static")').index(ui.item);
				sortable.sortable('cancel');
				self.props.cardMove(moveDetails);
			}
		});
	}
	addCard(cardLabel, card){
		var list = this.state.list;
		if(!card){
			var card = {
				name: cardLabel
			};
		}
		card['id'] = Util.UUID();
		list.cards = [card].concat(list.cards);

		this.setState({
			'list': list
		}, this.onUpdate.bind(this));
	}
	onDelete(card){
		var cards = this.state.list.cards;
		this.state.list.cards.splice(cards.indexOf(card), 1);
		this.setState(this.state, this.onUpdate.bind(this));
	}
	onUpdate() {
		this.props.update();
	}
	render(){
		var inputComponent, isTodayCard;
		if(this.props.hasInput){
			inputComponent = <li className="card-container input-container static"><InputComponent addCard={this.addCard.bind(this)}/></li>;
		}else{
			inputComponent = '';
		}

		if(this.state.list.name == 'Today'){
			isTodayCard = 1;
		}else{
			isTodayCard = 0;
		}
		
		if(this.state.list.cards.length != 0){
			var listIems = this.state.list.cards.map(function(card, i){
				return <TaskCard card={card} 
								isTodayCard={isTodayCard} 
								update={this.onUpdate.bind(this)}
								delete={this.onDelete.bind(this)}
			    				key={card.id} />
		    }.bind(this));
	    }else{
	    	var listIems = <li className="card-container empty-list static" draggable="false">
		    	<div className="card">
		      		<p className="card-name">No items</p>
		      </div>
		    </li>;
	    }

	  	return <ul className={"cards-container " + this.state.list.name}
		    	data-list-id={this.state.list.id} 
		    	ref="list">
		    	{inputComponent}
	    	{listIems}
	    </ul>;
  	}
}