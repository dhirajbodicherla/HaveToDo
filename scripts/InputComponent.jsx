import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import TextField from 'material-ui/lib/text-field';

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
		var name = $(e.target).val();
		if(name.trim() != ''){
			this.props.addCard(name, {
				name: name,
				deadline: ''
			});
			var input = ReactDOM.findDOMNode(this.refs.taskInput); 
			$(input).find('input').val('').attr('placeholder', 'Enter new task');
			this.refs.taskInput.blur();
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
		return <Card expandable={false}>
			<CardHeader>
	  	    	<TextField hintText="Enter new task" multiLine={false} ref="taskInput" onEnterKeyDown={this.createCard.bind(this)} defaultValue={this.state.card.name}/>
	  	    </CardHeader>
	  	</Card>
	}
}