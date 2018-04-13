import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import classnames from 'classnames';

export default function tracker_init(root, channel) {
	ReactDOM.render(<Tracker channel={channel}/>, root);
}

class Tracker extends React.Component {

	constructor(props) {
		super(props);

		this.channel = props.channel;
    this.renderStops = this.renderStops.bind(this);
		this.handleChange = this.handleChange.bind(this);

    this.state ={
      stops: []
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
		var stops = "";
		var stops2 = "";
		if(this.state.stops)
		{
			stops = this.state.stops.map(stop => (
				// <option key={stop.id}>{stop.attributes.name}</option>
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
				<div className="row">
					<div className="col">
						<Fragment>
			        <Typeahead
			          options={stops2}
			          placeholder="Choose a source station..."
								valueKey="id"
								onChange={selected => {this.handleChange(selected);}}
			        />
			      </Fragment>
					</div>
				</div>
			</div>
		);
	}
	handleChange(x){
		console.log(x[0]);
	}
}

function Stop(params){

	return (<option value={params.stop.attributes.name} id={params.key}>{params.stop.attributes.name}</option>);
}
