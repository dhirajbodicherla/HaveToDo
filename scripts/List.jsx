import React from 'react';
import moment from 'moment';
import TaskCard from './TaskCard.jsx';
import InputComponent from './InputComponent.jsx';

export default class List extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			'list': this.props.list
		}
	}
	addCard(cardLabel, card){
		var list = this.state.list;
		if(!card){
			var card = {
				name: cardLabel
			};
		}
		card['id'] = Math.random().toString(36).substring(7);
		list.cards = [card].concat(list.cards);

		this.setState({
			'list': list
		}, this.onUpdate.bind(this));
	}
	onUpdate() {
		this.props.update();
	}
	render(){
		var inputComponent, isTodayCard;
		if(this.props.hasInput){
			inputComponent = <li className="card-container input-container"><InputComponent addCard={this.addCard.bind(this)}/></li>;
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
				return <TaskCard card={card} isTodayCard={isTodayCard} update={this.onUpdate.bind(this)}
			    				key={card.id} />
		    }.bind(this));
	    }else{
	    	var listIems = <li className="card-container empty-list" draggable="false">
		    	<div className="card">
		      		<p className="card-name">No items</p>
		      </div>
		    </li>;
	    }

	  	return <ul className={"cards-container " + this.state.list.name}
	  			onDragOver={this.props.dragOver}
	  			onDragStart={this.props.dragStart}
		    	onDragEnd={this.props.dragEnd}
		    	data-list-id={this.state.list.id}>
		    	{inputComponent}
	    	{listIems}
	    </ul>;
  	}
}