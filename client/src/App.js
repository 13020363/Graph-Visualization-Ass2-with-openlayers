import React, { Component } from 'react';
// import ol from 'openlayers';
import {Map, View} from 'ol';
import 'openlayers/css/ol.css';
import './olbasemap.scss';
import TileLayer from "ol/layer/Tile";
import BingMaps from "ol/source/BingMaps";
import {fromLonLat} from 'ol/proj.js';
import {easeIn, easeOut} from 'ol/easing.js';
import OSM from "ol/source/OSM";
import './App.css';
import {defaults as defaultControls, OverviewMap} from 'ol/control.js';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction.js';

var styles = [
    'Road',
    'RoadOnDemand',
    'Aerial',
    'AerialWithLabels',
    'collinsBart',
    'ordnanceSurvey'
];


var london = fromLonLat([-0.12755, 51.507222]);
// var moscow = fromLonLat([37.6178, 55.7517]);
// var istanbul = fromLonLat([28.9744, 41.0128]);
var rome = fromLonLat([12.5, 41.9]);
// var bern = fromLonLat([7.4458, 46.95]);

var sydeney = fromLonLat([151.207859,-33.861568]);

var view = new View({
    center:london,
    zoom:6
});

var layers = [];
var i, ii;

// var select = document.getElementById('layer-select');

class App extends Component {
    state={
        selectStyle:'AerialWithLabels',
    }
    componentDidMount(){
        for (i = 0, ii = styles.length; i < ii; ++i) {
            layers.push(new TileLayer({
                visible: false,
                preload: Infinity,
                source: new BingMaps({
                    key: 'AuD9mcqmkdR1Q2FiUoIuBhTZa2JFG_qJThOkX7fB_BZ0CaOcB7Afq_Wt7oVs4TvE',
                    imagerySet: styles[i]
                    // use maxZoom 19 to see stretched tiles instead of the BingMaps
                    // "no photos at this zoom level" tiles
                    // maxZoom: 19
                })
            }));
        };

        var overviewMapControl = new OverviewMap({
            // see in overviewmap-custom.html to see the custom CSS used
            className: 'ol-overviewmap ol-custom-overviewmap',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            collapseLabel: '\u00BB',
            label: '\u00AB',
            collapsed: false
        });


        var map = new Map({
                controls: defaultControls().extend([
                    overviewMapControl
                ]),
                interactions: defaultInteractions().extend([
                    new DragRotateAndZoom()
                ]),
                layers: layers,
                // Improve user experience by loading tiles while dragging/zooming. Will make
                // zooming choppy on mobile or slow devices.
                loadTilesWhileInteracting: true,
                target: 'map',
                view: view
            });
    };

    onChange = (e) => {
        var style = e.target.value;
        this.setState({selectStyle:style});
        for (var i = 0, ii = layers.length; i < ii; ++i) {
            layers[i].setVisible(styles[i] === style);
        }
    };

    onRotateleft =()=> {
        view.animate({
            rotation:view.getRotation()+ Math.PI/2
        });
    };

    onRotateright =()=> {
        view.animate({
            rotation: view.getRotation() - Math.PI / 2
        });
    };

    onRotateraround=()=>{
        var rotation = view.getRotation();
        view.animate({
            rotation: rotation + Math.PI,
            center:rome,
            easing: easeIn
        }, {
            rotation: rotation + 2 * Math.PI,
            center:rome,
            easing: easeOut
        });
    };

    onPanto=()=>{
        view.animate({
            center: london,
            duration: 2000
        });
    };

    flyTo = (location,done) => {
        var duration = 2000;
        var zoom = view.getZoom();
        var parts = 2;
        var called = false;
        function callback(complete) {
            --parts;
            if (called) {
                return;
            }
            if (parts === 0 || !complete) {
                called = true;
                done(complete);
            }
        }
        view.animate({
            center: location,
            duration: duration
        }, callback);
        view.animate({
            zoom: 3,
            duration: duration / 2
        }, {
            zoom: 8,
            duration: duration / 2
        }, callback);
    };

    onFlyto=()=>{
        this.flyTo(sydeney,function(){});
    };

  render(){
        return(
            <div class="app">
                <div id='map'/>
                <select id="layer-select" value={this.state.selectStyle} onChange={this.onChange}>
                    <option value="Aerial">Aerial</option>
                    <option value="AerialWithLabels">Aerial with labels</option>
                    <option value="Road">Road (static)</option>
                    <option value="RoadOnDemand">Road (dynamic)</option>
                    <option value="collinsBart">Collins Bart</option>
                    <option value="ordnanceSurvey">Ordnance Survey</option>
                </select>
                <button id="rotate-left" title="Rotate clockwise" onClick={this.onRotateleft}>↻</button>
                <button id="rotate-right" title="Rotate counterclockwise" onClick={this.onRotateright}>↺</button>
                <button id="pan-to-london" onClick={this.onPanto}>Pan to London</button>
                <button id="elastic-to-moscow">Elastic to Moscow</button>
                <button id="bounce-to-istanbul">Bounce to Istanbul</button>
                <button id="spin-to-rome">Spin to Rome</button>
                <button id="fly-to-bern" onClick={this.onFlyto}>Fly to Bern</button>
                <button id="rotate-around-rome" onClick={this.onRotateraround}>Rotate around Rome</button>
                <button id="tour">Take a tour</button>
            </div>
        );
  }
}

export default App;
