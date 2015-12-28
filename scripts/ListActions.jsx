import React from 'react';
import ReactDOM from 'react-dom';
import {IconButton, FontIcon} from 'material-ui/lib/';

export default class ListActions extends React.Component{
	constructor(props){
		super(props);
		this.state = { value: 0};
	}
	render(){
		var style = {
			"visibility": "visible"
		};
		if(!this.props.hasSort){
			style["visibility"] = "hidden";
		}
		return <div style={style}>
			<IconButton>
			  <FontIcon className="muidocs-icon-custom-sort"/>
			</IconButton>
		</div>;
	}
}