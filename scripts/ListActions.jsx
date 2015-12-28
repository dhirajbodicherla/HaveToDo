import React from 'react';
import ReactDOM from 'react-dom';
import {IconButton, FontIcon} from 'material-ui/lib/';

export default class ListActions extends React.Component{
	constructor(props){
		super(props);
		this.state = { value: 0};
	}
	onClick(){
		this.props.sort();
	}
	render(){
		var style = {
			"visibility": "visible"
		};
		if(!this.props.hasSort){
			style["visibility"] = "hidden";
		}
		return <div style={style} onClick={this.onClick.bind(this)}>
			<IconButton>
			  <FontIcon className="muidocs-icon-custom-sort"/>
			</IconButton>
		</div>;
	}
}