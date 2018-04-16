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

		this.state ={
			stops: [],
			source:{
				id: null,
				label: null,
				latitude: null,
				longitude: null,
			},
			destination:{
				id: null,
				label: null,
				latitude: null,
				longitude: null,
			}
		};

		this.channel = props.channel;
		this.renderStops = this.renderStops.bind(this);
		//this.handleSourceChange = this.handleSourceChange.bind(this);
		//this.handleDestinationChange = this.handleDestinationChange.bind(this);
		//this.handleRouteInfo = this.handleRouteInfo.bind(this);
		this.sRoutes="";
		this.dRoutes="";
		this.commonRoutes="";


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
				<div id="navbar"></div>


				<div className="container-fluid">
					<div className="row">
						<div className="col-xs-12">
							<Fragment>
								<Typeahead options={stops2} placeholder="Choose a source station..." valueKey="id"
							   	onChange={selected => {this.handleSourceChange(selected);}}/>
							</Fragment>
				  	</div>
					</div>
					<br/>
					<div className="row">
						<div className="col-xs-12">
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
				</div>
				<br/><hr/>
				<div className="row">
					<div className="col-md-5 route-div">

						<div className="row">
							<div id="route-data">
								Search a route!
							</div>
						</div>
						<div className="row">
							<label id="route-info-title"><strong><i>Next Arrivals</i></strong></label><br/>
							<div id="route-info">
							</div>
						</div>

					</div>
					<hr/>
					<div id="map-canvas" className="col-md-6 map_canvas"></div>

				</div>
			</div>);
	}

	handleSourceChange(x){
		//alert("yes");
		 $("#route-data").html("Search a route!");
		 $("#route-info").html("");
		 this.commonRoutes=[];
		 if(x!=""){
			 var
			 source = {id: x[0].id, label: x[0].label, latitude: x[0].latitude, longitude: x[0].longitude}

			 console.log("source");
			 console.log(x[0].id);
			 var id = x[0].id;
			 var label = x[0].label;
			 var latitude = x[0].latitude;
			 var longitude = x[0].longitude;

			 console.log(x[0].id);


			 this.setState({source: source}, function () {
				 this.handleSourceRoutesData();
			 })

		 }
	}

	handleDestinationChange(x){
		 $("#route-data").html("Search a route!");
		 $("#route-info").html("");
		 this.commonRoutes=[];
		var
			destination =  {id: x[0].id, label: x[0].label, latitude: x[0].latitude, longitude: x[0].longitude}
			console.log(x[0].id);
		console.log("destination");
		console.log(x[0].id);
		this.setState({destination: destination}, function () {
			this.handleDestinationRoutesData();
		})
	}

	handleRoutes(e){
		this.commonRoutes = this.getCommonRoutes(this.sRoutes, this.dRoutes);
		showGMap(this.state.source.latitude,this.state.source.longitude,this.state.destination.latitude,this.state.destination.longitude);
		var str="";
		// var cRoutes=this.commonRoutes.map(route =>{
		// 		return '<button key='+parseInt(route) + ' id='+parseInt(route)+' class="btn btn-info routebtn">Route'+ parseInt(route) +'</button>'
		// 	});
		console.log("type of");
		console.log(typeof route);

			var cRoutes=this.commonRoutes.map(route =>{
				console.log("type of");
				console.log(typeof route);

					return '<button key='+route+' id='+route+' class="btn btn-info routebtn">'+ route +'</button>'
				});

			//this.routeBtns=cRoutes;
			console.log(cRoutes)	;
			$("#route-data").html(cRoutes);

			$(".routebtn").click((e) => {this.handleRouteInfo(e, this.state.source.id)});

	}

	handleRouteInfo(e, sourceId){
		//alert("askb");
		//console.log(e.target.id);
		console.log(e.target);
		this.channel.push("get_route_info", {route_id: e.target.id, source_id: sourceId}).receive("ok", resp => {this.receivedRouteInfo(resp)});
	}

	handleSourceRoutesData(){
		console.log("state");
		console.log(this.state);
		this.channel.push("get_routes", {tracker: this.state.source.id}).receive("ok", resp => {this.receivedSourceRoutes(resp)});
	}

	handleDestinationRoutesData(){
		console.log("state");
		console.log(this.state);
		this.channel.push("get_routes", {tracker: this.state.destination.id}).receive("ok", resp => {this.receivedDestinationRoutes(resp)});
	}

	receivedSourceRoutes(x){
		console.log("receivedSourceRoutes");
		console.log(x);
		if (x.routes)
		{
		this.sRoutes = x.routes.map(route => (
			route.relationships.route.data.id
		));
		this.sRoutes = this.GetUnique(this.sRoutes);
		console.log("source routes");
		console.log(this.sRoutes);

			}
	}

	receivedRouteInfo(response){
		//alert(response);
		console.log("receivedRouteInfo");

		alert(response.length);
		if (response.routes.length > 0)
		{
		var info = response.routes.map(route => {
			if(route.attributes.arrival_time!=null)
				return "<label>"+new Date(Date.parse(route.attributes.arrival_time)).toLocaleTimeString()+"</label><br/>"
		});
		$("#route-info").html(info);

		// var cRoutes=this.commonRoutes.map(route =>{
		// 		return '<button key='+parseInt(route) + ' id='+parseInt(route)+' class="btn btn-info rbt">Route'+ parseInt(route) +'</button>'
		// 	});
    //

			}
		else {
			alert("here");
			$("#route-info").html("");
			$("#route-data").html("No Route Found!");
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

			//$("#route-data").html(this.commonRoutes);
			console.log("Destination routes");
			console.log(this.dRoutes);
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
