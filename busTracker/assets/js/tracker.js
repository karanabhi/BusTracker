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
		this.sRoutes="";
		this.dRoutes="";
		this.commonRoutes="";
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
			//console.log("Stops working!");
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
						onClick={this.handleRoutes.bind(this)}>Get Routes!</button>
				  </div>
				</div>
				<br/><hr/>
				<div id="route-data" className="route-data">
				</div>
				<hr/>
				<div id="map-canvas" className="map_canvas"></div>
			</div>);
	}

	handleSourceChange(x){
		var c = {
			source: {id: x[0].id, label: x[0].label, latitude: x[0].latitude, longitude: x[0].longitude}
		}
		console.log(x[0].id);

		this.setState(c);
		this.handleSourceRoutesData();
	}

	handleDestinationChange(x){
		const
			destination =  {id: x[0].id, label: x[0].label, latitude: x[0].latitude, longitude: x[0].longitude}
			console.log(x[0].id);
		this.setState({
			stops: this.state.stops,
			destination: {
				id: destination.id,
				label: destination.label,
				latitude: destination.latitude,
				longitude: destination.longitude
			}
		});

		this.handleDestinationRoutesData();
	}

	handleRoutes(e){
		showGMap(this.state.source.latitude,this.state.source.longitude,this.state.destination.latitude,this.state.destination.longitude);
		var str="";
		var cRoutes=this.commonRoutes.map(route =>{
				return '<button onClick="'+this.handleRouteInfo.bind(this)+'" key='+parseInt(route) + ' id='+parseInt(route)+' className="btn btn-info">Route'+ parseInt(route) +'</button>'
			});

			//this.routeBtns=cRoutes;
			console.log(cRoutes)	;
			$("#route-data").html(cRoutes);
	}

	handleRouteInfo(event){
		console.log("ddd");
	}

	handleSourceRoutesData(){
		this.channel.push("get_routes", {tracker: 141}).receive("ok", resp => {this.receivedSourceRoutes(resp)});
	}

	handleDestinationRoutesData(){
		this.channel.push("get_routes", {tracker: 49808}).receive("ok", resp => {this.receivedDestinationRoutes(resp)});
	}

	receivedSourceRoutes(x){
		if (x.routes)
		{
		this.sRoutes = x.routes.map(route => (
			route.relationships.route.data.id
		));
		this.sRoutes = this.GetUnique(this.sRoutes);
		//console.log(sRoutes1);

			}
	}
	receivedDestinationRoutes(x){
		if (x.routes)
		{
			this.dRoutes = x.routes.map(route => (
				route.relationships.route.data.id
			));
			this.dRoutes = this.GetUnique(this.dRoutes);
			//console.log(dRoutes1);
			this.commonRoutes = this.getCommonRoutes(this.sRoutes, this.dRoutes);
			//$("#route-data").html(this.commonRoutes);
			console.log(this.commonRoutes);
		}

	}

	getCommonRoutes(array1, array2) {
	var common = $.grep(array1, function(element) {
	   return $.inArray(element, array2 ) !== -1;
	});
	return common;
}

	GetUnique(inputArray, x)
{
    var outputArray = [];

    for (var i = 0; i < inputArray.length; i++)
    {
        if ((jQuery.inArray(inputArray[i], outputArray)) == -1)
        {
            outputArray.push(inputArray[i]);
        }
    }

    return outputArray;
}

}//class

function Stop(params){

	return (<option value={params.stop.attributes.name} id={params.key}>{params.stop.attributes.name}</option>);
}
