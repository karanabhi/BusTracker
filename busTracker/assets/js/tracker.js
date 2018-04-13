import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import classnames from 'classnames';
import showGMap from './gMap';

export default function tracker_init(root, channel) {
	ReactDOM.render(<Tracker channel={channel}/>, root);
}

class Tracker extends React.Component {

	constructor(props) {
		super(props);

		this.channel = props.channel;
		this.renderStops = this.renderStops.bind(this);
		this.handleSourceChange = this.handleSourceChange.bind(this);
		this.handleDestinationChange = this.handleDestinationChange.bind(this);

		this.state ={
			stops: [],
			source:{},
			destination:{}
		}

		this.channel.join()
		.receive("ok",this.createState.bind(this))
		.receive("error",resp => "Error while joining");
	}

	createState(st1){
		var c = {
			stops: st1.stops
		}
		this.setState(c);
	}

	renderStops(stops) {
		if(stops != null){

			return $.each(stops, function(stop,index){
				return (
					<option key={index}>{stop}</option>
				);

			});
		}

	}

	render() {

		//$("map-canvas").hide;


		var stops = "";
		var stops2 = "";
		if(this.state.stops)
		{
			console.log("Stops working!");
		stops = this.state.stops.map(stop => (
			stop.id
		));
		stops2 = this.state.stops.map(stop => (
			{ id: stop.id,
				label: stop.attributes.name,
				latitude: stop.attributes.latitude,
				longitude: stop.attributes.longitude	}
			));
		}

		//showGMap(42.107156,42.107156,42.107156,42.107156);

		return(
			<div className="container">
				<div className="row">
					<div className="col">
						<Fragment>
							<Typeahead options={stops2} placeholder="Choose a source station..." valueKey="id"
						   	onChange={selected => {this.handleSourceChange(selected);}}/>
						</Fragment>
			  	</div>
				</div>
				<br/>
				<div className="row">
					<div className="col">
						<Fragment>
							<Typeahead	options={stops2} placeholder="Choose a Destination station..." valueKey="id"
							  	onChange={selected => {this.handleDestinationChange(selected);}}/>
						</Fragment>
					</div>
				</div>
				<br/>
				<div className="row">
					<div className="col" align="center">
						<button id="showMapBtn"  className="btn btn-success btn-md center-block"
						onClick={this.handleGMap.bind(this)}>Get Routes!</button>
				  </div>
				</div>
				<br/><hr/>
				<div id="map-canvas" className="map_canvas"></div>
			</div>);
	}
	handleSourceChange(x){
		var c = {
			source: {id: x[0].id, label: x[0].label, latitude: x[0].latitude, longitude: x[0].longitude}
		}
		this.setState(c);
		console.log(this.state);
		//console.log(c);

	}

	handleDestinationChange(x){
		console.log("onchange");
		console.log(x);
		console.log(x[0]);
		const
			destination =  {id: x[0].id, label: x[0].label, latitude: x[0].latitude, longitude: x[0].longitude}

		console.log("c");
		console.log(destination.label);
		this.setState({
			stops: this.state.stops,
			destination: {
				id: destination.id,
				label: destination.label,
				latitude: destination.latitude,
				longitude: destination.longitude

			}
		});
			//console.log(this.state);
	}

	handleGMap(e){
		console.log("state");
		console.log(this.state.source.latitude);
		showGMap(this.state.source.latitude,this.state.source.longitude,this.state.destination.latitude,this.state.destination.longitude);
	}
}

function Stop(params){

	return (<option value={params.stop.attributes.name} id={params.key}>{params.stop.attributes.name}</option>);
}
