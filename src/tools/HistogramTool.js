let React = require('react');

let _ = require('underscore');

let gio = require('@geotiff/gio');
let Map = require('../Map');

let ImportGeoJSON = require('../shared/ImportGeoJSON');

class HistogramTool extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scale_type: 'ratio',
            num_classes: 3,
            class_type: 'equal-interval',
            results: null,
            layer: null,
            draw_mode: 'none',
            geometry: null
        };
        this.draw_rectangle = this.draw_rectangle.bind(this);
        this.draw_polygon = this.draw_polygon.bind(this);
        this.close = this.close.bind(this);
        this.add_geojson = this.add_geojson.bind(this);
        this.set_scale_type = this.set_scale_type.bind(this);
        this.set_num_classes = this.set_num_classes.bind(this);
        this.set_class_type = this.set_class_type.bind(this);
        this.get_histogram = this.get_histogram.bind(this);
    }

    componentWillMount() {
        Map.subscribe(this);
    }

    componentWillUnmount() {
        Map.unsubscribe(this);
    }

    set_scale_type(event) {
        let scale_type = event.target.value;
        this.setState({ scale_type });
    }

    set_num_classes(event) {
        let num_classes = Number(event.target.value);
        this.setState({ num_classes });
    }

    set_class_type(event) {
        let class_type = event.target.value;
        this.setState({ class_type });
    }

    draw_rectangle() {
        this.props.lose_focus();
        if (Map.tiff) {
            this.setState({ draw_mode: 'rectangle' });
            Map.start_draw_rectangle();
        } else {
            alert('Please load a GeoTIFF on the Map');
        }
    }

    draw_polygon() {
        this.props.lose_focus();
        if (Map.tiff) {
            this.setState({ draw_mode: 'polygon' });
            Map.start_draw_polygon();
        } else {
            alert('Please load a GeoTIFF on the Map');
        }
    }

    listen(event_type, message) {
        if (event_type === 'rectangle' || event_type === 'polygon') {
            if (this.state.layer) {
                Map.remove_layer(this.state.layer);
            }
            let layer = message.layer;
            Map.add_layer(layer);

            if (event_type === 'rectangle') {
                let latlngs = layer.getBounds();
                let geometry = [latlngs.getWest(), latlngs.getSouth(), latlngs.getEast(), latlngs.getNorth()];
                this.setState({ geometry });
                Map.stop_draw_rectangle();
            } else {
                let geojson = layer.toGeoJSON();
                let geometry = geojson.geometry.coordinates;
                this.setState({ geometry });
                Map.stop_draw_polygon();
            }

            let draw_mode = 'none';
            this.setState({ layer, draw_mode });
        }
    }

    close() {
        if (this.state.layer) {
            Map.remove_layer(this.state.layer);
            Map.unsubscribe(this);
            this.setState({ layer: null });
        }
        this.props.on_remove();
    }

    add_geojson(geojson) {
        if (this.state.layer) {
            Map.remove_layer(this.state.layer);
        }
        let draw_mode = 'none';
        let layer = Map.create_geojson_layer(geojson);
        Map.add_layer(layer);
        this.setState({ draw_mode, layer, geometry: geojson });
    }

    get_histogram() {

        let { scale_type, num_classes, class_type, geometry, ...rest} = this.state;

        // make sure parameters are valid
        if (!num_classes % 1) {
            alert('Please make sure the number of classes is an integer.');
            return;
        }
        if (!geometry) {
            alert('Please make sure to select a geography to run the tool on.');
            return;
        }

        // convert to list because react doesn't like storing objects in state
        let results_objs = gio.histogram(Map.image, geometry, { scale_type, class_type, num_classes });
        let results_lists = results_objs.map(band_results => {
            return _.keys(band_results).map(bin => [bin, band_results[bin]]);
        });

        // sort results
        let results;
        if (scale_type === 'nominal') {
            results = results_lists.map(results_list => {
                return _.sortBy(results_list, bin => Number(bin[0]));
            });
        } else {
            results = results_lists.map(results_list => {
                return _.sortBy(results_list, bin => Number(bin[0].split('- ')[1]));
            });
        }
        
        this.setState({ results });
    }

    render() {
        return (
            <div id='sum-tool' className='tool'>
                <section className='controls'>
                    <header>
                        <i className='material-icons gt-remove' onClick={this.close}>clear</i>
                        <h3 className='tool-title'>Get the Histogram Distribution of an Area</h3>
                    </header>
                    <div className='content'>

                        <p>1. Select a Measurement Scale</p>
                        <select 
                            className='gt-dropdown'
                            onChange={this.set_scale_type}
                            value={this.state.scale_type}
                        >
                            <option value='ratio'>Ratio</option>
                            <option value='nominal'>Nominal</option>
                        </select>
                        <br />
                        <p>2. Select how many classes to distribute the values across</p>
                        <input 
                            type='number'
                            className='gt-input'
                            onChange={this.set_num_classes}
                            value={this.state.num_classes}
                            min='0'
                            step='1'
                            disabled={this.state.scale_type === 'nominal'}
                        />
                        <br />
                        <p>3. Select how the data should be classified</p>
                        <select 
                            className='gt-dropdown'
                            onChange={this.set_class_type}
                            value={this.state.class_type}
                            disabled={this.state.scale_type === 'nominal'}
                        >
                            <option value='equal-interval'>Equal-Interval</option>
                            <option value='quantile'>Quantile</option>
                        </select>
                        <br />
                        <p>4. Select a geometry. Either draw a geometry using the buttons below</p>
                        <div className='content-row'>
                            <button 
                                className={`gt-button ${this.state.draw_mode === 'rectangle' ? 'active' : '' }`}
                                onClick={this.draw_rectangle}
                            >
                                Draw Rectangle
                            </button>
                            <button
                                className={`gt-button ${this.state.draw_mode === 'polygon' ? 'active' : '' }`}
                                onClick={this.draw_polygon}
                            >
                                Draw Polygon
                            </button>
                        </div>
                        <p className="or"><b>OR</b></p>
                        <p>Add GeoJSON. You can either import a GeoJSON file or write it out yourself.</p>
                        <ImportGeoJSON add_geojson={this.add_geojson} />
                        <button
                            className='gt-button'
                            onClick={this.get_histogram}
                        >
                            Get Histogram
                        </button>
                    </div>
                </section>
                {
                    this.state.results !== null
                    ? 
                        <section className='results'>
                            <h3>Histogram</h3>
                            { this.state.results.map(band => {
                                return band.map(bin => <p><b>{ bin[0] }:</b> { bin[1] }</p>);
                            }) }
                        </section>
                    : ''
                }
            </div>
        )
    }
}

module.exports = HistogramTool;