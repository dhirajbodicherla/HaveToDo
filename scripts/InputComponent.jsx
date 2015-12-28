import React from 'react';
import moment from 'moment';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import DatePickerDialog from 'material-ui/lib/date-picker/date-picker-dialog';
import Util from './util.js';

export default class InputComponent extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			'card': {
				'name': '',
				'deadline': ''
			}
		};
	}
	createCard(e){
		if(e.keyCode == 13 && $(e.target).val().trim() != ''){
			this.props.addCard($(e.target).val(), {
				name: $(e.target).val(),
				deadline: this.refs.datepicker.getDate()
			});
			this.refs.taskInput.clearValue();
		}
	}
	setDeadline(d, dateText){
		var card = this.state.card;
		card.deadline = dateText;
		this.setState({
			'card': card
		});
	}
	showDatepicker() {
		this.refs.datepicker.openDialog();
	}
	render(){
		var today = (new Date()).toUTCString();
		var diff = (this.state.card.deadline !== '') ? moment(today).diff(this.state.card.deadline, 'days') : 0;
		return <Card expandable={false}>
			<CardHeader>
	  	    	<TextField hintText="Enter new task" multiLine={false} ref="taskInput" onKeyUp={this.createCard.bind(this)}/>
	  	    </CardHeader>
	  	    <CardText className="deadline-container" onClick={this.showDatepicker.bind(this)}>
	  	          <span className="time">&#9716;</span>{Util.timeago(this.state.card.deadline, diff)}
  	        </CardText>
	    	<DatePicker
	    		ref="datepicker"
				autoOk={true}
	  		  	textFieldStyle={{"display": "none"}}
	  		  	onChange={this.setDeadline.bind(this)} />
	  	</Card>
	}
}