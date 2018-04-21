import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import classnames from 'classnames';
import showGMap from './gMap';
import Link from 'react-dom';
import api from '../api';
import swal from 'sweetalert';
import socket from "../socket";

class Tracker extends React.Component {


	constructor(props) {
		super(props);

		if (localStorage.getItem("login_token") == null){
			return location.replace("/");
		}
		$(".fetchingStops").show();
		this.searchQuery=localStorage.getItem("searchQuery");
		if(this.searchQuery){
			this.searchQuery=JSON.parse(this.searchQuery);
			localStorage.removeItem("searchQuery");
		}

		this.openInfoWindow;
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
		this.currentVehicleId = null;
		this.currentRouteId = null;
		//this.initMap();
		//this.channel = props.channel;
		this.renderStops = this.renderStops.bind(this);

		this.sRoutes="";
		this.dRoutes="";
		this.commonRoutes="";

		//
		// if(this.channel.state != "joined")
		// this.channel.join()
		// .receive("ok",this.createState.bind(this))
		// .receive("error",resp => "Error while joining");
		//this.channel.terminate();

		if(this.channel == undefined){

		//let socket = new Socket("/socket", {params: {token: window.userToken}})
		//socket.connect();
		var uId = localStorage.getItem('login_id');

		this.channel = socket.channel("tracker:"+uId, {});
		this.channel.join()
		.receive("ok",this.createState.bind(this))
		.receive("error",resp => "Error while joining");
		}

		this.channel.on("routeUpdate", payload=>
      {
        this.receivedRouteInfo(payload)
			});

		this.channel.on("vehicleUpdate", payload=>
		   {
		    this.receivedVehicleData(payload)
			});
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

			if(stops2.length > 0){
				$(".fetchingStops").fadeOut("slow");
			}
			//Hiding save search option initially
			$("#searchHistoryBtn").hide();

			return(
				<div className="container">

					<div className="searchBox">
						<div className="row">
							<div className="col-xs-12">
								<Fragment>
								<div className="input-group">
									<div className="input-group-addon">
										<span className="glyphicon glyphicon-search"></span>
									</div>
									<Typeahead options={stops2} placeholder="Choose a source station..." valueKey="id"
									inputProps={{id: "src"}}
									onChange={selected => {this.handleSourceChange(selected);}}/>
									</div>
								</Fragment>
							</div>
						</div>
						<br/>
						<div className="row">
							<div className="col-xs-12">
								<Fragment>
								<div className="input-group">
									<div className="input-group-addon">
										<span className="glyphicon glyphicon-search"></span>
									</div>
									<Typeahead	options={stops2} placeholder="Choose a Destination station..." valueKey="id"
									inputProps={{id: "dst"}}
									onChange={selected => {this.handleDestinationChange(selected);}}/>
									</div>
								</Fragment>
							</div>
						</div>
						<br/>
						<div className="row">
							<div className="col" align="center">
								<button id="showMapBtn"  className="btn btn-success btn-md center-block"
								onClick={this.handleRoutes.bind(this)}> <span className="glyphicon glyphicon-search"></span>  Search Routes</button>
								<br/>
								<button id="searchHistoryBtn"  className="btn btn-info btn-md center-block"
								onClick={this.handleSearchHistory.bind(this)}><span className="glyphicon glyphicon-pushpin"></span>&nbsp;&nbsp;Save Search</button>
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

			handleSearchHistory(){
				swal({
	        title: "Your Search has been saved!",
	        text: "",
	        icon: "success",
	        button: "Okay",
	        dangerMode: false,
	      })
	      .then((ok) => {
	        if (ok) {
						var q={
							sourceName: this.state.source.label,
							destinationName: this.state.destination.label,
							sourceId: this.state.source.id,
							destinationId: this.state.destination.id
						};
						var data={
								user_id: localStorage.getItem("login_id"),
								query: JSON.stringify(q)
						}

						api.insertIntoSearchDb(data);
						$("#searchHistoryBtn").hide();
	        }
	      });


			}

			handleSourceChange(x){
				if(this.currentRouteId != null){
					this.channel.push("stop_route_updates", {id: this.currentRouteId});
					this.currentRouteId=null;
				}
				if(this.currentVehicleId != null){
					this.channel.push("stop_vehicle_updates",{id: this.currentVehicleId});
					this.currentVehicleId=null;
				}

				$("#route-data").html("Search a route!");
				$("#route-info").html("");
				$("#vehicle-data").html("");
				this.commonRoutes="";


				if(x!=""){

					var
					source = {id: x[0].id, label: x[0].label, latitude: x[0].latitude, longitude: x[0].longitude}

					var id = x[0].id;
					var label = x[0].label;
					var latitude = x[0].latitude;
					var longitude = x[0].longitude;

					this.setState({source: source}, function () {
						this.handleSourceRoutesData();
					});

				}
			}

			handleDestinationChange(x){
				if(this.currentRouteId != null){
					this.channel.push("stop_route_updates", {id: this.currentRouteId});
					this.currentRouteId=null;
				}
				if(this.currentVehicleId != null){
					this.channel.push("stop_vehicle_updates",{id: this.currentVehicleId});
					this.currentVehicleId=null;
				}

				$("#route-data").html("Search a route!");
				$("#route-info").html("");
				$("#vehicle-data").html("");
				this.commonRoutes="";


				if(x!="") {

					var	destination =  {id: x[0].id, label: x[0].label, latitude: x[0].latitude, longitude: x[0].longitude}

					this.setState({destination: destination}, function () {

						this.handleDestinationRoutesData();
					});
				}
			}

			handleRoutes(e){

				//Show Search History button
				$("#searchHistoryBtn").show();

				$("#vehicle-data").html("");
				this.commonRoutes = this.getCommonRoutes(this.sRoutes, this.dRoutes);
				showGMap(this.state.source.latitude,this.state.source.longitude,this.state.destination.latitude,this.state.destination.longitude);
				var str="";
				if(this.commonRoutes.length>0) {
					var cRoutes=this.commonRoutes.map(route =>{
						return '<button key='+route+' id='+route+' class="btn btn-warning routebtn"><span class="glyphicon glyphicon-road"></span>&nbsp;'+ route +'</button> &emsp;'
					});
				}
				else {
					var cRoutes = "No direct MBTA Service Found!";
				}
				$("#route-data").html(cRoutes);
				$(".routebtn").click((e)=>{this.handleRouteInfo(e,this.state.source.id)});

			}


			handleRouteInfo(e, sourceId){

				$("#vehicle-data").html("");
				this.channel.push("get_route_info", {route_id: e.target.id, source_id: sourceId}).receive("ok", resp => {this.receivedRouteInfo(resp)});
				if(this.currentRouteId != null){
					this.channel.push("stop_route_updates", {id: this.currentRouteId});
				}
				this.currentRouteId = e.target.id;
				this.channel.push("get_route_updates", {id: localStorage.getItem("login_id"),route_id: e.target.id, source_id: sourceId});

			}

			receivedVehicleData(data) {
				$('#vehicle-data').html(info);
				if(data.data.included[0].type == "trip" && data.data.included[1].type == "stop") {
					if(data.data.data.attributes.current_status == 'STOPPED_AT')
					var info = '<b>'+data.data.included[0].attributes.headsign+':</b> Stopped At ' +data.data.included[1].attributes.name;
					else if(data.data.data.attributes.current_status == 'IN_TRANSIT_TO')
					var info = '<b>'+data.data.included[0].attributes.headsign+':</b> In Transit to '+data.data.included[1].attributes.name;
					else if(data.data.data.attributes.current_status == 'INCOMING_AT')
					var info = '<b>'+data.data.included[0].attributes.headsign+':</b> Incoming At '+data.data.included[1].attributes.name;


					var latitude = data.data.data.attributes.latitude;
					var longitude = data.data.data.attributes.longitude;

					if(this.openInfoWindow){
						this.openInfoWindow.close();
					}
					let infoWindow = new google.maps.InfoWindow;
					infoWindow.setPosition({lat: latitude, lng: longitude});
					infoWindow.setContent(info);
					infoWindow.open(window.map);
					this.openInfoWindow = infoWindow;

				}
				else {
					if(data.data.data.attributes.current_status == 'STOPPED_AT')
					var info = '<b>'+data.data.included[1].attributes.headsign+':</b> Stopped at ' +data.data.included[0].attributes.name;
					else if(data.data.data.attributes.current_status == 'IN_TRANSIT_TO')
					var info = '<b>'+data.data.included[1].attributes.headsign+':</b> In transit to '+data.data.included[0].attributes.name;
					else if(data.data.data.attributes.current_status == 'INCOMING_AT')
					var info = '<b>'+data.data.included[1].attributes.headsign+':</b> Incoming at '+data.data.included[0].attributes.name;


					var latitude = data.data.data.attributes.latitude;
					var longitude = data.data.data.attributes.longitude;
					if(this.openInfoWindow){
						this.openInfoWindow.close();
					}
					let infoWindow = new google.maps.InfoWindow;
					infoWindow.setPosition({lat: latitude, lng: longitude});
					infoWindow.setContent(info);
					infoWindow.open(window.map);
					this.openInfoWindow = infoWindow;
				}
								//window.map.setCenter(pos);


				$('#vehicle-data').html(info);
			}

			getVehicleData(vehicle_id) {
				this.channel.push("get_vehicle_data", {vehicle_id: vehicle_id}).receive("ok", resp => {this.receivedVehicleData(resp)});

				if(this.currentVehicleId != null){
					this.channel.push("stop_vehicle_updates",{id: this.currentVehicleId});
				}

				this.currentVehicleId = vehicle_id;
				this.channel.push("get_vehicle_updates", {id: localStorage.getItem("login_id") ,vehicle_id: vehicle_id});
			}

			handleSourceRoutesData(){

				this.channel.push("get_routes", {tracker: this.state.source.id}).receive("ok", resp => {this.receivedSourceRoutes(resp)});
			}

			handleDestinationRoutesData(){

				this.channel.push("get_routes", {tracker: this.state.destination.id}).receive("ok", resp => {this.receivedDestinationRoutes(resp)});
			}

			receivedSourceRoutes(x){

				this.sRoutes = "";
				if (x.routes)
				{

					this.sRoutes = x.routes.map(route => (
						route.relationships.route.data.id
					));
					this.sRoutes = this.GetUnique(this.sRoutes);

				}
			}


			receivedRouteInfo(response){

				$("#route-info").html("");
				var spaces = '&emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;'

				if (response.routes.length>0)
				{
					var info = response.routes.map(route => {
						if(route.attributes.arrival_time != null)
						{

							if(route.relationships.vehicle.data != null)
							return '<label>'+new Date(Date.parse(route.attributes.arrival_time)).toLocaleTimeString()+'<button key='+route.relationships.vehicle.data.id+' id='+route.relationships.vehicle.data.id+' class="btn btn-info vehiclebtn"><i class="material-icons">directions_transit</i>&nbsp; Info </button> </label> <br/>';
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
				this.dRoutes = "";

				//this.sRoutes = "";
				if (x.routes)
				{

					this.dRoutes = x.routes.map(route => (
						route.relationships.route.data.id
					));
					this.dRoutes = this.GetUnique(this.dRoutes);
				}

			}

			getCommonRoutes(array1, array2) {
				if (this.state.source.id == this.state.destination.id){
					return [];
				}
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

				if(this.searchQuery){
					$("#src").val(this.searchQuery.sourceName);
					$("#dst").val(this.searchQuery.destinationName);
				}
				this.initMap();
			}


			initMap(){

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
							map: window.map,
							title: "You are here!"
						});
						marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
						marker.setMap(window.map);
						// infoWindow.setPosition(pos);
						// infoWindow.setContent('You are here.');
						// infoWindow.open(window.map);
						window.map.setCenter(pos);
					}, function() {
						// infoWindow.setPosition({lat: 42.3386095, lng: -71.0944618});
						// infoWindow.setContent('Error: The Geolocation service failed.');
						// infoWindow.open(map);
						var marker = new google.maps.Marker({
							position: {lat: 42.3386095, lng: -71.0944618},
							map: window.map,
							title: "You are here!"
						});
						marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
						marker.setMap(window.map);
					},{maximumAge:60000, timeout:5000, enableHighAccuracy:true});
				}else {
					// Browser doesn't support Geolocation
					infoWindow.setPosition({lat: 42.3386095, lng: -71.0944618});
					infoWindow.setContent('Error: Your browser doesn\'t support geolocation.');
					infoWindow.open(map);

				}
			}


			componentWillUnmount(){
				this.channel.leave();
			}

		}

		function Stop(params){

			return (<option value={params.stop.attributes.name} id={params.key}>{params.stop.attributes.name}</option>);
		}

		export default Tracker;
