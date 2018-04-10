import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import classnames from 'classnames';

export default function tracker_init(root, channel) {
	ReactDOM.render(<Tracker channel={channel}/>, root);
}

class Tracker extends React.Component {

	constructor(props) {
		super(props);

		this.channel = props.channel;
    this.renderStops = this.renderStops.bind(this);

    this.state ={
      stops: []
    }

		this.channel.join()
								.receive("ok",this.createState.bind(this))
								.receive("error",resp => "Error while joining");

	}

	createState(st1){
		this.setState(st1.stops);
	}

  renderStops(stops) {
    if(stops != null){

    return $.each(stops, function(stop,index){
        return (
          <li key={index}>{stop}</li>
        );

      });
    }

  }

	render() {


		return(
			<div className="container">
        <ul>
          {this.renderStops(this.state)}
        </ul>
			</div>
		);

	}
}

function Stop(params){

	return (<option value={params.stop.attributes.name} id={params.key}>{params.stop.attributes.name}</option>);
}
