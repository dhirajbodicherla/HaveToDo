import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Util from './util.js';
import Constants from './Constants.js';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import DatePickerDialog from 'material-ui/lib/date-picker/date-picker-dialog';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';

export default class TaskCard extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			'card': this.props.card
		};
	}
	setDeadline(d, dateText){
		var card = this.state.card;
		card.deadline = dateText;
		this.setState({
			'card': card
		}, this.onUpdate.bind(this));
	}
	editMode(){
		$(this.refs.listEl).attr('draggable', 'false');
		$(ReactDOM.findDOMNode(this.refs.cardName)).hide();
		$(ReactDOM.findDOMNode(this.refs.taskInput)).show();
		this.refs.taskInput.focus();
	}
	normalMode(){
		$(ReactDOM.findDOMNode(this.refs.cardName)).show();
		$(ReactDOM.findDOMNode(this.refs.taskInput)).hide();
		$(this.refs.listEl).attr('draggable', 'true');
	}
	saveCard(e){
		var card = this.state.card;
		card.name = this.refs.taskInput.getValue();
		this.setState({
			'card': card
		}, this.onUpdate.bind(this));
		this.normalMode();
	}
	onUpdate(){
		this.props.update();
	}
	showDatepicker() {
		this.refs.datepicker.openDialog();
	}
	render(){
		var today = (new Date()).toUTCString(),
			diff = moment(today).diff(this.props.card.deadline, 'days'),
			style = {
				borderLeft: "#FFFFFF"
			};
		if(this.props.isTodayCard && diff > 0){
			var shadePer = (diff > 4 ) ? 4 : diff;
			var shadedColor = Constants.colors[shadePer];
			style['borderLeft'] = "10px solid " + shadedColor;
		}
	  	var card = this.state.card;
	  	return <li className="card-container" draggable="true" data-card-id={card.id} ref="listEl">
		  	<Card expandable={false} style={style}>
		  		<CardHeader title={card.name} onClick={this.editMode.bind(this)} ref="cardName" />
		  	    	<TextField hintText="Enter task here" 
		  	    				multiLine={false} 
		  	    				ref="taskInput" 
		  	    				defaultValue={card.name} 
		  	    				style={{"display": "none"}} 
		  	    				onEnterKeyDown={this.saveCard.bind(this)} 
		  	    				onBlur={this.saveCard.bind(this)}
		  	    				underlineStyle={{"color": "rgba(27, 100, 121, 0.75)"}}/>
		  	    <CardText className="deadline-container" onClick={this.showDatepicker.bind(this)}>
		  	          <span className="time">&#9716;</span>{Util.timeago(card.deadline, diff)}
	  	        </CardText>
		  	</Card>
        	<DatePicker
        		ref="datepicker"
  				autoOk={true}
	  		  	textFieldStyle={{"display": "none"}}
	  		  	onChange={this.setDeadline.bind(this)} />
	    </li>;
	}
}