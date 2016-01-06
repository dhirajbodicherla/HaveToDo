import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Util from './Util.js';
import Constants from './Constants.js';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import DatePickerDialog from 'material-ui/lib/date-picker/date-picker-dialog';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import FontIcon from 'material-ui/lib/font-icon';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/divider';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import Dialog from 'material-ui/lib/dialog';

export default class TaskCard extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			'card': this.props.card,
			'isDeleteDialogOpen': false
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
		setTimeout(function(){
			this.refs.taskInput.focus();
		}.bind(this), 400);
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
	deleteCardPrompt(){
		this.handleDeleteDialogOpen();
	}
	deleteCard(){
		this.props.delete(this.state.card);
	}
	onUpdate(){
		this.props.update();
	}
	showDatepicker() {
		if(this.props.card.deadline)
			this.refs.datepicker.setDate(new Date(this.props.card.deadline));
		this.refs.datepicker.openDialog();
	}
	handleDeleteDialogClose(){
		var state = this.state;
		state['isDeleteDialogOpen'] = false;
		this.setState(state);
	}
	handleDeleteDialogOpen(){
		var state = this.state;
		state['isDeleteDialogOpen'] = true;
		this.setState(state);	
	}
	render(){
		var today = moment().startOf('day'),
			deadline = moment(this.props.card.deadline),
			diff = today.diff(deadline, 'days'),
			style = {
				borderLeft: "#FFFFFF"
			};
		if(this.props.isTodayCard && diff > 0){
			var shadePer = (diff > 4 ) ? 4 : diff;
			var shadedColor = Constants.colors[shadePer];
			style['borderLeft'] = "10px solid " + shadedColor;
		}
	  	var card = this.state.card;
	  	var iconButtonElement = <IconButton><MoreVertIcon /></IconButton>;
	  	const deleteDialogActions = [
	      <FlatButton
	        label="No"
	        primary={true}
	        onTouchTap={this.handleDeleteDialogClose.bind(this)} />,
	      <FlatButton
	        label="Yes"
	        secondary={true}
	        keyboardFocused={true}
	        onTouchTap={this.deleteCard.bind(this)} />,
	    ];

	  	return <li className="card-container" draggable="true" data-card-id={card.id} ref="listEl">
		  	<Card expandable={false} style={style} tabIndex={Util.getTabIndex()}>
		  		<CardHeader title={card.name} ref="cardName" style={{"width": "240px", "float": "left"}}/>
		  	    	<TextField hintText="Enter task here" 
		  	    				multiLine={false} 
		  	    				ref="taskInput" 
		  	    				defaultValue={card.name} 
		  	    				inputStyle={{"width":"240px"}}
		  	    				style={{"display": "none", "marginLeft": "16px", "marginBottom": "24px", "float": "left", "width" : "220px"}} 
		  	    				onEnterKeyDown={this.saveCard.bind(this)} 
		  	    				underlineStyle={{"color": "rgba(27, 100, 121, 0.75)"}}/>
      	    	<IconMenu iconButtonElement={iconButtonElement} 
      	    			style={{"float": "right"}}
      	    			anchorOrigin={{"horizontal": "left", "vertical": "top"}}
      	    			targetOrigin={{"horizontal": "left", "vertical": "top"}}
      	    			className="card-options">
    			  <MenuItem primaryText="Edit" onClick={this.editMode.bind(this)}/>
    			  <MenuItem primaryText="Delete" onClick={this.deleteCardPrompt.bind(this)}/>
    			</IconMenu>
    			<div className="clearfix" style={{"clear": "both"}}></div>
		  	    <CardText className="deadline-container" onClick={this.showDatepicker.bind(this)}>
	  	          <FlatButton secondary={true} style={{"color":"black", "fontSize": "10px"}}label={Util.timeago(card.deadline, diff)} labelPosition="after">
	  	            <FontIcon style={{"verticalAlign": "middle", "fontSize": "14px", "right": "-10px"}}className="material-icons">schedule</FontIcon>
	  	          </FlatButton>
	  	        </CardText>
		  	</Card>
        	<DatePicker
        		ref="datepicker"
  				autoOk={true}
	  		  	textFieldStyle={{"display": "none"}}
	  		  	onChange={this.setDeadline.bind(this)} />
  		  	<Dialog
  		  	  ref="deleteDialog"
	          title="Delete!"
	          actions={deleteDialogActions}
	          modal={false}
	          open={this.state.isDeleteDialogOpen}
	          onRequestClose={this.handleDeleteDialogClose.bind(this)}>
	          Are you sure you want to delete?
	        </Dialog>
	    </li>;
	}
}