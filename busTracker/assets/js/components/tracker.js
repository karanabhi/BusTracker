import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import classnames from 'classnames';
import showGMap from './gMap';
import Link from 'react-dom';

class Tracker extends React.Component {

	constructor(props) {
		super(props);

		if (localStorage.getItem("login_token") == null){
			//alert("Please Login!");
			return location.replace("/");
		}

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

		//this.initMap();
		this.channel = props.channel;
		this.renderStops = this.renderStops.bind(this);

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

			return(
				<div className="container">
				<div className="container-fluid">
					<div className="searchBox">
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
							<div id="route-info"></div>
						</div>
						<div className="row">
							<label id="route-info-title"><strong><i>Vehicle Info</i></strong></label><br/>
							<div id="vehicle-data"></div>
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
				$("#vehicle-data").html("");
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
				$("#vehicle-data").html("");
				this.commonRoutes=[];
				var	destination =  {id: x[0].id, label: x[0].label, latitude: x[0].latitude, longitude: x[0].longitude}
				console.log(x[0].id);
				console.log("destination");
				console.log(x[0].id);
				this.setState({destination: destination}, function () {
					this.handleDestinationRoutesData();
				})
			}

			handleRoutes(e){
				$("#vehicle-data").html("");
				this.commonRoutes = this.getCommonRoutes(this.sRoutes, this.dRoutes);
				console.log("commonRoutes");
				console.log(this.commonRoutes);
				showGMap(this.state.source.latitude,this.state.source.longitude,this.state.destination.latitude,this.state.destination.longitude);
				var str="";
				// var cRoutes=this.commonRoutes.map(route =>{
				// 		return '<button key='+parseInt(route) + ' id='+parseInt(route)+' class="btn btn-info routebtn">Route'+ parseInt(route) +'</button>'
				//
				if(this.commonRoutes.length>0) {
					 	console.log("Common Routes");
						console.log(this.commonRoutes);
					var cRoutes=this.commonRoutes.map(route =>{
						console.log("type of");
						console.log(typeof route);

						return '<button key='+route+' id='+route+' class="btn btn-info routebtn">'+ route +'</button> &emsp;'
					});
				}
				else {
					var cRoutes = "No direct MBTA Service Found!";
				}
				$("#route-data").html(cRoutes);
				$(".routebtn").click((e)=>{this.handleRouteInfo(e,this.state.source.id)});

			}


			handleRouteInfo(e, sourceId){
				//alert("askb");
				//console.log(e.target.id);
				$("#vehicle-data").html("");
				console.log(e.target.id);
				this.channel.push("get_route_info", {route_id: e.target.id, source_id: sourceId}).receive("ok", resp => {this.receivedRouteInfo(resp)});
			}

			receivedVehicleData(data) {
				console.log("receivedVehcileData");
				console.log(data.data);
				console.log(data.data.data.attributes.current_status);
				console.log("head sign");
				console.log()
				if(data.data.included[0].type == "trip" && data.data.included[1].type == "stop") {
					if(data.data.data.attributes.current_status == 'STOPPED_AT')
					var info = '<b>'+data.data.included[0].attributes.headsign+':</b> stopped at ' +data.data.included[1].attributes.name;
					else if(data.data.data.attributes.current_status == 'IN_TRANSIT_TO')
					var info = '<b>'+data.data.included[0].attributes.headsign+':</b> in transit to '+data.data.included[1].attributes.name;
					else if(data.data.data.attributes.current_status == 'INCOMING_AT')
					var info = '<b>'+data.data.included[0].attributes.headsign+':</b> incoming at '+data.data.included[1].attributes.name;

					let infoWindow = new google.maps.InfoWindow;

					var latitude = data.data.data.attributes.latitude;
					var longitude = data.data.data.attributes.longitude;
					infoWindow.setPosition({lat: latitude, lng: longitude});
					infoWindow.setContent(info);
					infoWindow.open(window.map);

				}
				else {
					if(data.data.data.attributes.current_status == 'STOPPED_AT')
					var info = '<b>'+data.data.included[1].attributes.headsign+':</b> stopped at ' +data.data.included[0].attributes.name;
					else if(data.data.data.attributes.current_status == 'IN_TRANSIT_TO')
					var info = '<b>'+data.data.included[1].attributes.headsign+':</b> in transit to '+data.data.included[0].attributes.name;
					else if(data.data.data.attributes.current_status == 'INCOMING_AT')
					var info = '<b>'+data.data.included[1].attributes.headsign+':</b> incoming at '+data.data.included[0].attributes.name;

					let infoWindow = new google.maps.InfoWindow;

					var latitude = data.data.data.attributes.latitude;
					var longitude = data.data.data.attributes.longitude;
					infoWindow.setPosition({lat: latitude, lng: longitude});
					infoWindow.setContent(info);
					infoWindow.open(window.map);

				}
								//window.map.setCenter(pos);


				$('#vehicle-data').html(info);
			}

			getVehicleData(vehicle_id) {
				console.log("vehcile_id-------------------");
				console.log(vehicle_id)
				this.channel.push("get_vehicle_data", {vehicle_id: vehicle_id}).receive("ok", resp => {this.receivedVehicleData(resp)});

			}

			handleSourceRoutesData(){
				console.log("state");
				console.log(this.state);
				this.channel.push("get_routes", {tracker: this.state.source.id}).receive("ok", resp => {this.receivedSourceRoutes(resp)});
			}

			handleDestinationRoutesData(){
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
				console.log(response);
				var spaces = '&emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;'
				//alert(response.length);
				if (response.routes.length>0)
				{
					var info = response.routes.map(route => {
						if(route.attributes.arrival_time != null)
						{
							console.log(route);
							console.log("vehicle id");
							if(route.relationships.vehicle.data != null)
							console.log(route.relationships.vehicle.data.id)
							console.log("time");
							console.log(route.attributes.arrival_time);
							if(route.relationships.vehicle.data != null)
							return '<label>'+new Date(Date.parse(route.attributes.arrival_time)).toLocaleTimeString()+'<button key='+route.relationships.vehicle.data.id+' id='+route.relationships.vehicle.data.id+' class="btn btn-secondary vehiclebtn"> Get Vehicle Data </button> </label> <br/>';
							else
							return '<label>'+new Date(Date.parse(route.attributes.arrival_time)).toLocaleTimeString()+'</label> '+spaces+' No vehicle data available <br/>';
						}
					});
				}	else {

					$("#route-info").html("Route Data Not Found!");
				}

				$("#route-info").html(info);
				$(".vehiclebtn").click(e => {this.getVehicleData(e.target.id)});
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



			componentDidMount(){
				this.initMap();
			}


			initMap(){
				//alert("yo");
				window.map = new google.maps.Map(document.getElementById('map-canvas'), {
					center: {lat: 42.3386095, lng: -71.0944618},
					zoom: 18
				});
				var infoWindow = new google.maps.InfoWindow;

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						var pos = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};

						var marker = new google.maps.Marker({
							position: pos,
							map: window.map
						});
						marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
						console.log(pos.lat);
						console.log(pos.lng);
						infoWindow.setPosition(pos);
						infoWindow.setContent('You are here.');
						infoWindow.open(map);
						window.map.setCenter(pos);
					}, function() {
						infoWindow.setPosition({lat: 42.3386095, lng: -71.0944618});
						infoWindow.setContent('Error: The Geolocation service failed.');
						infoWindow.open(map);
					},{maximumAge:60000, timeout:5000, enableHighAccuracy:true});
				}else {
					// Browser doesn't support Geolocation
					infoWindow.setPosition({lat: 42.3386095, lng: -71.0944618});
					infoWindow.setContent('Error: Your browser doesn\'t support geolocation.');
					infoWindow.open(map);

				}
			}


		}//class

		function Stop(params){

			return (<option value={params.stop.attributes.name} id={params.key}>{params.stop.attributes.name}</option>);
		}

		// function state2props(state) {
		//   return {
		//           login: state.login,
		//           token: state.token};
		// }
		//
		// export default connect(state2props)(Tracker);
		export default Tracker;
