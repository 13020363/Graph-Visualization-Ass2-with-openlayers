import React, { Component } from 'react';
import {Map, View,Feature} from 'ol';
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
import VectorLayer from "ol/layer/Vector";
import LineString from 'ol/geom/LineString.js';
import Point from "ol/geom/Point";
import {Stroke, Style, Fill,Text} from 'ol/style.js';
import VectorSource from 'ol/source/Vector.js';
import testJson from './test';
import CityJson from './City';
// import CircleStyle from "ol/style/Circle";
import Icon from "ol/style/Icon";
import FullScreen from "ol/control/FullScreen";
import Attribution from "ol/control/Attribution";
import ScaleLine from "ol/control/ScaleLine";
// import { Table } from 'semantic-ui-react';

var styles = [
    'Road',
    'RoadOnDemand',
    'Aerial',
    'AerialWithLabels'
];

//location
var london = fromLonLat([-0.12755, 51.507222]);
// var moscow = fromLonLat([37.6178, 55.7517]);
// var istanbul = fromLonLat([28.9744, 41.0128]);
var rome = fromLonLat([12.5, 41.9]);
// var bern = fromLonLat([7.4458, 46.95]);
var sydeney = fromLonLat([151.207859,-33.861568]);

//Calculate great circles routes as lines in GeoJSON or WKT format.
var arc = require('arc');


var labelStyle = new Style({
    text: new Text({
        font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
        placement: 'line',
        textBaseline: 'bottom',
        fill: new Fill({
            color: 'black'
        })
    })
});



var style = null;

const findstyle = (e)  => {
    switch(e){
        default:case "A":
            style = new Style({
                stroke: new Stroke({
                    color: '#ea424d',
                    width: 2
                })
            });break;
        case "B":
            style = new Style({
                stroke: new Stroke({
                    color: '#e6ea11',
                    width: 2
                })
            });break;
        case "C":
            style = new Style({
                stroke: new Stroke({
                    color: '#363bea',
                    width: 2
                })
            });break;

        case "D":
            style = new Style({
                stroke: new Stroke({
                    color: '#be42ea',
                    width: 2
                })
            });break;

        case "E":
            style = new Style({
                stroke: new Stroke({
                    color: '#15ea5c',
                    width: 2
                })
            });break;
    }
    return style;
}

// var headInnerImageStyle = new Style({
//     image: new CircleStyle({
//         radius: 2,
//         fill: new Fill({color: 'blue'})
//     })
// });
//
// var headOuterImageStyle = new Style({
//     image: new CircleStyle({
//         radius: 5,
//         fill: new Fill({color: 'black'})
//     })
// });


var plane;
const findPlane =(e) =>{
    switch(e) {
        default: case "A330-203":
            plane = "M166.113,84.29l-58.046-31.462V18.11c0-10.138-7.94-17.885-18.68-18.105L89.067,0v0.004c-11,0.201-20,8.29-20,18.106v35.26\n" +
                "\tL12.022,84.289c-1.74,0.941-2.955,3.06-2.955,5.15v9.523c0,2.287,1.754,4.079,3.994,4.079c0.347,0,0.699-0.043,1.048-0.129\n" +
                "\tl54.958-13.566v61.65l-14.468,11.895c-1.422,1.163-1.532,3.025-1.532,3.569v8.402c0,1.865,1.323,3.271,3.077,3.271\n" +
                "\tc0.295,0,0.595-0.042,0.894-0.123l32.029-8.759l32.031,8.759c0.297,0.081,0.598,0.123,0.893,0.123c1.754,0,3.077-1.406,3.077-3.271\n" +
                "\tv-8.402c0-0.543-0.11-2.406-1.527-3.564l-15.473-12.722V89.099l55.961,13.814c0.346,0.085,0.698,0.128,1.045,0.128\n" +
                "\tc2.239,0,3.994-1.792,3.994-4.079v-9.523C169.067,87.349,167.851,85.23,166.113,84.29z";
            break;
        case "B737-3B7":
            plane = "M164.221,94.237L152.859,85.8c0.003-0.343,0.002-0.689-0.003-1.04c-0.443-32.43-4.264-36.802-7.974-36.802\n" +
                "\tc-3.378,0-6.589,3.427-7.616,26.263l-7.888-5.857c-0.836-26.611-4.38-30.406-7.829-30.406c-2.998,0-5.863,2.7-7.189,19.254\n" +
                "\tl-6.175-4.586c0.919-14.347,1.44-24.236,1.45-24.419l0.003-0.131C109.638,18.215,101.993,0,91.099,0h-0.493\n" +
                "\tC79.712,0,72.067,18.215,72.067,28.076l0.003,0.131c0.01,0.182,0.521,9.886,1.424,24.01l-7.329,5.396\n" +
                "\tc-1.312-16.911-4.204-19.655-7.25-19.655c-3.437,0-6.995,3.821-7.811,30.742l-7.864,5.789C42.226,51.409,39,47.958,35.582,47.958\n" +
                "\tc-3.68,0-7.5,4.372-7.943,36.801c-0.006,0.411-0.005,0.815,0,1.215l-11.221,8.26c-1.416,1.047-2.85,3.169-2.85,5.198v6.913\n" +
                "\tc0,2.287,1.857,4.078,4.229,4.078c0.356,0,0.713-0.043,1.059-0.128l56.788-13.944c0.365-0.09,0.709-0.238,1.042-0.409\n" +
                "\tc0.03,0.352,0.058,0.704,0.088,1.056c1.69,19.999,3.411,35.946,5.117,47.396c0.044,0.296,0.088,0.576,0.131,0.865l-24.655,20.101\n" +
                "\tc-0.896,0.733-1.8,2.122-1.8,3.568v7.933c0,1.804,1.49,3.271,3.323,3.271c0.306,0,0.611-0.041,0.907-0.122l30.77-8.377l30.769,8.377\n" +
                "\tc0.296,0.081,0.602,0.122,0.907,0.122c1.833,0,3.323-1.468,3.323-3.271v-7.933c0-1.446-0.904-2.835-1.804-3.571l-24.143-19.683\n" +
                "\tc0.065-0.422,0.129-0.842,0.194-1.28c1.706-11.45,3.427-27.397,5.117-47.396c0.021-0.244,0.041-0.489,0.061-0.733\n" +
                "\tc0.083,0.026,0.161,0.064,0.246,0.085l56.538,13.944c0.347,0.085,0.693,0.128,1.031,0.128c2.178,0,3.758-1.715,3.758-4.078v-6.913\n" +
                "\tC166.567,97.836,165.952,95.517,164.221,94.237z M102.651,32.815c-0.064,1.265-0.99,1.737-1.567,0.244\n" +
                "\tC98.987,27.634,95.271,23,91.035,23H90.67c-4.162,0-7.822,4.503-9.938,9.822c-0.63,1.584-1.626,0.869-1.692-0.455\n" +
                "\tc-0.151-3.018-0.231-4.644-0.231-4.644C78.809,21.173,84.12,9,90.67,9h0.365c6.551,0,11.861,12.306,11.861,18.857\n" +
                "\tC102.896,27.857,102.812,29.626,102.651,32.815z";
            break;
        case "B737-476":
            plane = "M167.222,96.098l-27.76-21.534c0.891-1.483,1.413-3.212,1.413-5.064c0-5.445-4.43-9.875-9.875-9.875\n" +
                "\tc-2.741,0-5.223,1.124-7.014,2.934l-12.692-9.846c0.811-14.536,1.267-24.328,1.276-24.522l0.002-0.115\n" +
                "\tc0-9.862-7.646-28.076-18.54-28.076H93.54C82.646,0,75,18.214,75,28.076l0.002,0.115c0.009,0.192,0.456,9.797,1.252,24.092\n" +
                "\tl-14.486,11.14c-1.809-2.308-4.615-3.798-7.768-3.798c-5.445,0-9.875,4.43-9.875,9.875c0,2.234,0.754,4.289,2.009,5.946\n" +
                "\tL19.283,96.094c-1.383,1.067-2.783,3.197-2.783,5.201v4.913c0,2.287,1.858,4.079,4.229,4.079c0.357,0,0.713-0.043,1.059-0.128\n" +
                "\tl56.787-13.944c0.142-0.035,0.276-0.094,0.413-0.142c0.231,3.288,0.469,6.597,0.716,9.902c1.181,15.807,2.377,29.364,3.572,40.517\n" +
                "\tl-22.976,18.732c-0.896,0.733-1.801,2.121-1.801,3.569v7.933c0,1.834,1.459,3.271,3.322,3.271c0,0,0,0,0,0\n" +
                "\tc0.306,0,0.611-0.041,0.908-0.122l24.248-6.601C89.249,184.843,91.265,186,93.54,186h0.493c2.265,0,4.273-1.147,6.532-12.58\n" +
                "\tl23.706,6.454c0.296,0.081,0.602,0.122,0.908,0.122c1.832,0,3.322-1.467,3.322-3.271v-7.933c0-1.448-0.905-2.835-1.804-3.571\n" +
                "\tl-22.447-18.302c1.211-11.235,2.423-24.934,3.619-40.945c0.241-3.226,0.474-6.454,0.699-9.664l56.144,13.848\n" +
                "\tc0.347,0.085,0.694,0.128,1.032,0.128c2.177,0,3.758-1.715,3.758-4.079v-4.913C169.5,99.709,168.902,97.395,167.222,96.098z\n" +
                "\t M105.584,32.711c-0.064,1.265-0.99,1.771-1.567,0.278C101.92,27.565,98.204,23,93.968,23h-0.365c-4.162,0-7.822,4.451-9.938,9.771\n" +
                "\tc-0.63,1.584-1.626,0.817-1.692-0.507c-0.151-3.018-0.231-4.609-0.231-4.609C81.742,21.104,87.053,9,93.604,9h0.365\n" +
                "\tc6.551,0,11.861,12.255,11.861,18.805C105.829,27.805,105.745,29.523,105.584,32.711z";
            break;
        case "A320-232":
            plane = "M183.663,100.906c0-1.92,0.007-3.795,0.014-5.608c0.057-15.114-0.024-21.903-2.551-24.439c-1.419-1.424-3.771-1.424-5.189,0\n" +
                "\tc-1.886,1.893-2.409,6.158-2.53,14.48l-13.847-2.199c-0.633-9.547-3.529-9.555-4.558-9.555c-0.975,0-3.628,0.002-4.443,8.126\n" +
                "\tl-11.529-1.831c-0.54-10.21-3.547-10.213-4.599-10.213c-1,0-3.763,0.008-4.5,8.768l-8.785-1.395V68.5c0-2.481-2.019-4.5-4.5-4.5\n" +
                "\th-0.783c0.268-7.3,0.396-11.87,0.399-12.015C116.261,47.586,111.997,0,98.479,0h-0.537C84.424,0,80.161,47.586,80.162,52.055\n" +
                "\tc0.003,0.118,0.131,4.669,0.398,11.954c-2.442,0.046-4.415,2.039-4.415,4.491v8.4l-10.75,1.703\n" +
                "\tc-0.714-8.932-3.508-8.937-4.515-8.937c-1.058,0-4.09,0.007-4.607,10.383l-11.506,1.823c-0.795-8.284-3.476-8.288-4.458-8.288\n" +
                "\tc-1.035,0-3.958,0.009-4.569,9.719L22.883,85.34c-0.121-8.323-0.644-12.589-2.53-14.481c-1.419-1.424-3.771-1.424-5.189,0\n" +
                "\tc-2.527,2.536-2.608,9.325-2.551,24.439c0.007,1.813,0.014,3.688,0.014,5.608s-0.007,3.795-0.014,5.608\n" +
                "\tc-0.057,15.114,0.024,21.903,2.551,24.439c0.709,0.712,1.631,1.104,2.595,1.104s1.885-0.393,2.595-1.104\n" +
                "\tc1.844-1.851,2.384-5.987,2.52-13.954h60.37c1.173,17.299,2.494,31.173,3.932,41.242c0.037,0.259,0.074,0.505,0.111,0.758h-1.729\n" +
                "\tc-1.125,0-2.659,0.425-3.583,1.611L70.32,175.485c-0.74,0.947-1.15,2.377-1.021,3.558l1.578,14.511\n" +
                "\tc0.173,1.585,1.379,2.735,2.868,2.735c0.801,0,1.583-0.342,2.202-0.963l12.491-12.517c0.028-0.015,0.065-0.03,0.096-0.04\n" +
                "\tl18.218-0.055c0.027,0.01,0.061,0.023,0.087,0.036l12.594,12.571c0.617,0.616,1.396,0.955,2.194,0.956h0\n" +
                "\tc1.492,0,2.7-1.153,2.873-2.743l1.578-14.528c0.128-1.181-0.273-2.563-1.025-3.525l-11.647-14.864\n" +
                "\tc-0.929-1.192-2.462-1.617-3.588-1.617h-0.683c0.037-0.253,0.074-0.499,0.111-0.758c1.438-10.069,2.759-23.943,3.931-41.242h60.238\n" +
                "\tc0.136,7.967,0.675,12.103,2.52,13.954c0.709,0.712,1.631,1.104,2.595,1.104s1.885-0.393,2.595-1.104\n" +
                "\tc2.527-2.536,2.608-9.325,2.551-24.439C183.669,104.701,183.663,102.826,183.663,100.906z";
            break;
        case "A320-242":
            plane = "M170.122,81.41L142.5,72.415V65.5c0-3.584-2.916-6.5-6.5-6.5h-6c-3.584,0-6.5,2.916-6.5,6.5v0.727l-16.938-5.516\n" +
                "\tc0.281-4.464,0.465-7.142,0.473-7.257l0.006-0.173C107.041,52.748,106.392,0,91.94,0h-0.548c-14.451,0-15.1,52.704-15.1,53.236\n" +
                "\tl0.006,0.178c0.008,0.111,0.192,2.725,0.471,7.11L59.5,66.123V65.5c0-3.584-2.916-6.5-6.5-6.5h-6c-3.584,0-6.5,2.916-6.5,6.5v6.783\n" +
                "\tl-28.152,9.126C10.457,82.024,8.5,84.061,8.5,86.405v6.487c0,2.458,2.276,4.535,4.875,4.396l65.217-3.313\n" +
                "\tc0.645,14.355,1.175,30.434,1.175,44.544c0,6.024,0.782,13.485,2.101,20.32l-20.697,5.644c-2.662,0.737-4.669,3.407-4.669,6.21v5.63\n" +
                "\tc0,3.13,2.418,5.677,5.392,5.677h59.55c2.884,0,5.058-2.44,5.058-5.677v-5.63c0-2.846-1.891-5.44-4.494-6.168l-20.417-5.719\n" +
                "\tc-0.039-0.011-0.086-0.02-0.126-0.031c1.288-6.719,2.05-14.014,2.05-19.896c0-13.775,0.561-30.158,1.235-44.875l64.347,3.283\n" +
                "\tc0.077,0.004,0.161,0.011,0.228,0.006c1.239,0,2.353-0.51,3.136-1.436c0.672-0.793,1.042-1.846,1.042-2.966v-6.487\n" +
                "\tC173.5,84.11,172.11,82.056,170.122,81.41z";
            break;
        case "A737-3B7":
            plane = "M166.845,98.491l-45.971-24.356c0.147-1.968,0.204-3.898,0.204-5.55c0-6.674-0.754-17.87-5.838-17.87\n" +
                "\tc-4.95,0-5.797,10.616-5.838,17.335l-5.5-2.914V16.641c0-9.455-4.919-16.418-11.663-16.636L91.902,0v0.003\n" +
                "\tc-6,0.158-13,6.855-13,16.638v49.026l-6.816,3.61c0.002-0.235,0.003-0.466,0.003-0.691c0-6.674-0.759-17.87-5.843-17.87\n" +
                "\ts-5.843,11.196-5.843,17.87c0,1.979,0.068,4.357,0.295,6.721L16.959,98.49c-1.795,0.951-3.057,3.114-3.057,5.146v8.458\n" +
                "\tc0,2.243,1.586,3.935,3.743,3.935c0.481,0,0.947-0.087,1.422-0.257l47.46-17.135C67.297,98.36,68.735,98,69.555,98h9.347v33h-1.679\n" +
                "\tc-0.302-6.692-1.863-10.09-4.658-10.09c-3.129,0-4.715,4.247-4.715,12.622s1.586,12.622,4.715,12.622\n" +
                "\tc2.804,0,4.365-3.421,4.66-10.154h1.677v9.662l-23.666,25.771c-0.798,0.869-1.334,2.246-1.334,3.427v5.863\n" +
                "\tc0,1.756,1.245,3.079,2.896,3.08c0.632,0,1.264-0.208,1.824-0.598l27.183-18.878c0.612,5.24,2.082,10.126,5.44,10.126\n" +
                "\tc3.539,0,4.981-5.425,5.531-10.974l28.402,19.724c0.563,0.392,1.194,0.6,1.827,0.6c1.651,0,2.896-1.324,2.896-3.08v-5.863\n" +
                "\tc0-1.181-0.536-2.558-1.335-3.428l-24.665-26.86V136h1.679c0.295,6.734,1.856,10.154,4.66,10.154c3.129,0,4.715-4.247,4.715-12.622\n" +
                "\ts-1.586-12.622-4.715-12.622c-2.795,0-4.355,3.398-4.657,10.09h-1.681V98h10.347c0.82,0,2.268,0.36,3.039,0.637l47.468,17.079\n" +
                "\tc0.477,0.171,0.922,0.285,1.403,0.285c2.157,0,3.743-1.664,3.743-3.908v-8.458C169.902,101.604,168.64,99.441,166.845,98.491z";
            break;
        case "B717-200":
            plane = "M189.547,59.563l-4.936,0.113c0.079-0.607,0.126-1.231,0.126-1.873c0-0.977-0.102-1.914-0.281-2.803H185\n" +
                "\tc1.381,0,2.5-1.119,2.5-2.5S186.381,50,185,50h-2.867c-1.291-1.497-2.969-2.395-4.83-2.395s-3.539,0.897-4.83,2.395H170\n" +
                "\tc-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h0.15c-0.179,0.889-0.281,1.826-0.281,2.803c0,0.76,0.062,1.496,0.171,2.205\n" +
                "\tl-9.514,0.217c0.133-0.775,0.211-1.583,0.211-2.422c0-0.977-0.102-1.914-0.281-2.803H161c1.381,0,2.5-1.119,2.5-2.5\n" +
                "\tS162.381,50,161,50h-2.867c-1.291-1.497-2.969-2.395-4.83-2.395s-3.539,0.897-4.83,2.395H146c-1.381,0-2.5,1.119-2.5,2.5\n" +
                "\ts1.119,2.5,2.5,2.5h0.15c-0.179,0.889-0.281,1.826-0.281,2.803c0,0.958,0.099,1.877,0.271,2.75l-9.715,0.221\n" +
                "\tc0.201-0.937,0.312-1.933,0.312-2.971c0-0.977-0.102-1.914-0.281-2.803H137c1.381,0,2.5-1.119,2.5-2.5S138.381,50,137,50h-2.867\n" +
                "\tc-1.291-1.497-2.969-2.395-4.83-2.395s-3.539,0.897-4.83,2.395H122c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h0.15\n" +
                "\tc-0.179,0.889-0.281,1.826-0.281,2.803c0,1.159,0.14,2.263,0.389,3.294l-8.472,0.193c0.971-17.017,1.524-28.885,1.534-29.098\n" +
                "\tl0.002-0.115c0-9.861-7.646-28.076-18.54-28.076H96.29C85.396,4,77.75,22.215,77.75,32.076l0.002,0.115\n" +
                "\tc0.01,0.214,0.562,12.071,1.533,29.077l-8.929-0.203c0.244-1.021,0.381-2.115,0.381-3.262c0-0.977-0.102-1.914-0.281-2.803H71\n" +
                "\tc1.381,0,2.5-1.119,2.5-2.5S72.381,50,71,50h-2.867c-1.291-1.497-2.969-2.395-4.83-2.395s-3.539,0.897-4.83,2.395H56\n" +
                "\tc-1.381,0-2.5,1.119-2.5,2.5S54.619,55,56,55h0.15c-0.179,0.889-0.281,1.826-0.281,2.803c0,1.027,0.109,2.011,0.306,2.939\n" +
                "\tl-9.703-0.221c0.168-0.864,0.265-1.772,0.265-2.718c0-0.977-0.102-1.914-0.281-2.803H47c1.381,0,2.5-1.119,2.5-2.5S48.381,50,47,50\n" +
                "\th-2.867c-1.291-1.497-2.969-2.395-4.83-2.395s-3.539,0.897-4.83,2.395H32c-1.381,0-2.5,1.119-2.5,2.5S30.619,55,32,55h0.15\n" +
                "\tc-0.179,0.889-0.281,1.826-0.281,2.803c0,0.827,0.076,1.624,0.205,2.39l-9.503-0.217c0.107-0.699,0.166-1.425,0.166-2.173\n" +
                "\tc0-0.977-0.102-1.914-0.281-2.803H23c1.381,0,2.5-1.119,2.5-2.5S24.381,50,23,50h-2.867c-1.291-1.497-2.969-2.395-4.83-2.395\n" +
                "\ts-3.539,0.897-4.83,2.395H8c-1.381,0-2.5,1.119-2.5,2.5S6.619,55,8,55h0.15c-0.179,0.889-0.281,1.826-0.281,2.803\n" +
                "\tc0,0.631,0.046,1.244,0.123,1.841l-3.434-0.078l-0.104-0.002C1.998,59.563,0,61.563,0,64.019v11.503c0,2.372,1.715,4.425,3.99,4.774\n" +
                "\tl77.203,11.818c0.393,5.867,0.815,11.87,1.262,17.86c1.194,15.975,2.403,29.649,3.611,40.87l-23.2,18.878\n" +
                "\tc-0.693,0.565-1.865,1.954-1.865,3.569v7.933c0,1.804,1.543,3.271,3.439,3.271h0c0.312,0,0.62-0.041,0.917-0.122l24.457-6.671\n" +
                "\tC92.05,188.875,94.044,190,96.29,190h0.493c2.23,0,4.212-1.104,6.43-12.06l23.683,6.434c0.296,0.081,0.599,0.122,0.899,0.122\n" +
                "\tc1.798,0,3.206-1.438,3.206-3.271v-7.933c0-1.265-0.715-2.732-1.74-3.569l-22.323-18.237c1.231-11.339,2.464-25.229,3.68-41.511\n" +
                "\tc0.446-5.968,0.866-11.947,1.258-17.793c0.032,0.001,0.062,0.01,0.095,0.01c0.214,0,0.436-0.016,0.667-0.051l77.374-11.846\n" +
                "\tc2.274-0.349,3.989-2.401,3.989-4.773V64.019C194,61.563,192.002,59.563,189.547,59.563z M95,24.125c0,0.646-0.501,0.66-0.69,0.692\n" +
                "\tc-2.839,0.476-5.956,3.285-7.634,7.388c-0.541,1.323-1.569-3.228-1.654-3.97c-0.61-5.281,4.538-15.18,9.346-15.872\n" +
                "\tC94.536,12.339,95,12.458,95,13.083V24.125z M108.614,28.234c-0.077,1.006-1.147,5.293-1.688,3.97\n" +
                "\tc-1.704-4.166-4.73-7.03-7.617-7.407C99.164,24.778,99,24.708,99,24.229V13.167c0-0.646,0.301-0.821,0.513-0.783\n" +
                "\tC104.281,13.231,109.016,22.981,108.614,28.234z";
            break;
    }
    return plane;
}

var col;
const findEngine = (e) => {
    switch(e){
        default: case "CF6-80E142":
            col="#111eae";break;
        case "CFM56-3B1":
            col="#56ae2e";break;
        case "CFM-56-3":
            col="#19ae9a";break;
        case "V2527-5A":
            col="#8311ae";break;
        case "772B-60":
            col="#e6ea11";break;
        case "Unknown":
            col="#ae0b08";break;
    }
    return col;
}


const view = new View({
    center: fromLonLat([134.027715,-26.029331]),
    zoom:4.5
});


var layers = [];

var p = [
    'A330-203',
    'B737-3B7',
    'B737-476',
    'A320-232',
    'A320-242',
    'A737-3B7',
    'B717-200'
]

class App extends Component {
    state={
        selectStyle:'Road'
    }
    componentDidMount(){
        //select map of bind
        for (var i = 0; i < styles.length; i++) {
            layers.push(new TileLayer({
                visible: styles[i] === this.state.selectStyle,
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

        //customer small overview map
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

        var att = new Attribution({
            className: 'ol-attribution ol-custom-attribution',
            label:'S',
            collapsed:false,
            tipLabel:'Style indicate'

        });

        //map layer
        var map = new Map({
            controls: defaultControls().extend([
                new FullScreen(),
                overviewMapControl,
                att,
                new OverviewMap(),
                new ScaleLine({
                    units: 'metric'
                })
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


        var base ='';
        for (var z = 0; z<p.length;z++) {
            if(z%2===0){
                var str =
                    '<tr>'+
                    '  <th scope="row">'+p[z]+'</th>' +
                    '  <td>' +
                    '     <svg width="50" height="50" viewBox="-100 -50 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
                    '        <path d="'+findPlane(p[z])+'"/>' +
                    '     </svg>'+
                    '  </td>'+
                    '  <th scope="row">'+p[z+1]+'</th>' +
                    '  <td>' +
                    '     <svg width="50" height="50" viewBox="-100 -50 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
                    '        <path d="'+findPlane(p[z+1])+'"/>' +
                    '     </svg>'+
                    '  </td>'+
                    '</tr>';
                base = base + str;
            }
          console.log(base);
        }

        var attribution = '<table class="table table-hover">' +
            '  <thead>' +
            '    <tr>' +
            '      <th scope="col">Class</th>' +
            '      <th scope="col">LineColor</th>' +
            '      <th scope="col">Engine</th>' +
            '      <th scope="col">PlaneColor</th>' +
            '    </tr>' +
            '  </thead>' +
            '  <tbody>' +
            '    <tr>' +
            '      <th scope="row">A</th>' +
            '      <td>' +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#ea424d" />\n' +
            '        </svg>' +
            '      </td>' +
            '      <th scope="row">CF6-80E142</th>' +
            '      <td>' +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#111eae" />\n' +
            '        </svg>' +
            '      </td>' +
            '    </tr>' +
            '    <tr>' +
            '      <th scope="row">B</th>' +
            '      <td>' +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#e6ea11" />\n' +
            '        </svg>' +
            '      </td>' +
            '      <th scope="row">CFM56-3B1</th>' +
            '      <td>' +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#56ae2e" />\n' +
            '        </svg>' +
            '      </td>' +
            '    </tr>' +
            '    <tr>' +
            '      <th scope="row">C</th>' +
            '      <td>' +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#363bea" />\n' +
            '        </svg>' +
            '      </td>' +
            '      <th scope="row">CFM-56-3</th>' +
            '      <td>' +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#19ae9a" />\n' +
            '        </svg>' +
            '      </td>' +
            '    </tr>' +
            '    <tr>' +
            '      <th scope="row">D</th>' +
            '      <td>' +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#be42ea" />\n' +
            '        </svg>' +
            '      </td>' +
            '      <th scope="row">V2527-5A</th>' +
            '      <td>' +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#8311ae" />\n' +
            '        </svg>' +
            '      </td>' +
            '    </tr>' +
            '    <tr>' +
            '      <th scope="row">E</th>' +
            '      <td>' +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#15ea5c" />\n' +
            '        </svg>' +
            '      </td>' +
            '      <th scope="row">772B-60</th>' +
            '      <td>' +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#e6ea11" />\n' +
            '        </svg>' +
            '      </td>' +
            '    </tr>' +
            '    <tr>' +
            '      <th scope="row"></th>' +
            '      <td></td>' +
            '      <th scope="row">Unknown</th>' +
            '      <td>' +
            '        <svg width="50" height="10">\n' +
            '           <rect width="50" height="10" style="fill:#ae0b08" />\n' +
            '        </svg>' +
            '      </td>' +
            '    </tr>' +
            '  </tbody>' +
            '  <thead>' +
            '    <tr>' +
            '      <th scope="col">AircraftModel</th>' +
            '      <th scope="col">PlaneStyle</th>' +
            '      <th scope="col">AircraftModel</th>' +
            '      <th scope="col">PlaneStyle</th>' +
            '    </tr>' +
            '  </thead>' +
            '  <tbody>' +
                    base +
            '  </tbody>' +
            '</table>';





        var flightsSource = new VectorSource({
            wrapX: false,
            attributions: attribution,
            loader: function() {
                // var flightsData = flightJson.flights;
                var flightsData = testJson;
                var CityData = CityJson;
                for (var i = 0; i < flightsData.length; i++) {
                    // var flight = flightsData[i];
                    // var from = flight[0];
                    // var to = flight[1];

                    //customerize
                    //get Class name
                    var AirSpaceClass = flightsData[i].AirSpaceClass;

                    //get Price
                    var Price = flightsData[i].Price;

                    //get AircraftModel
                    var AircraftModel = flightsData[i].AircraftModel;

                    //get EngineModel
                    var EngineModel = flightsData[i].EngineModel;



                    // console.log(AirSpaceClass);
                    for(var j = 0; j< CityData.length; j++){
                        if(CityData[j].CityName === flightsData[i].From_City){
                            var from = CityData[j].CityPoint;
                        }
                        if(CityData[j].CityName === flightsData[i].To_City){
                            var to = CityData[j].CityPoint;
                        }
                    }

                    // create an arc circle between the two locations
                    var arcGenerator = new arc.GreatCircle(
                        {x: from[1], y: from[0]},
                        {x: to[1], y: to[0]},{'name': 'Seattle to DC'});

                    var arcLine = arcGenerator.Arc(500, {offset: 10});
                    if (arcLine.geometries.length === 1) {
                        var line = new LineString(arcLine.geometries[0].coords);
                        // var point =  new Point(arcLine.geometries[0].coords[0]);
                        line.transform('EPSG:4326', 'EPSG:3857');
                        // point.transform('EPSG:4326', 'EPSG:3857');

                        var feature = new Feature({
                            type:LineString,
                            geometry: line,
                            finished: false,
                            AirSpaceClass: AirSpaceClass,
                            Price: Price,
                            AircraftModel: AircraftModel,
                            EngineModel: EngineModel,
                            population: 4000,
                            rainfall: 500
                        });

                        // var pointFeature =  new Feature({
                        //     type:Point,
                        //     coordinates:arcLine.geometries[0].coords,
                        //     geometry: point,
                        //     finished: false,
                        //     AirSpaceClass: AirSpaceClass
                        // });

                        // add the feature with a delay so that the animation
                        // for all features does not start at the same time
                        addLater(feature, i * 500);
                        // addLater(pointFeature,i * 500)
                        // addLater(featurePoint,i * 500);
                    }
                }
                map.on('postcompose', animateFlights);
            },
        });

        // add delay
        function addLater(feature, timeout) {
            window.setTimeout(function() {
                feature.set('start', new Date().getTime());
                flightsSource.addFeature(feature);
            }, timeout);
        }


        var pointsPerMs = 0.1;
        //第二次生成出来接event的function
        // const animateFlights = (styles) => (event) => {
        function animateFlights(event) {
            var vectorContext = event.vectorContext;
            var frameState = event.frameState;
            var features = flightsSource.getFeatures();

            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                var coords = feature.getGeometry().getCoordinates();
                // if(feature.get('type') === LineString){
                    if (!feature.get('finished')) {

                        // only draw the lines for which the animation has not finished yet
                        var elapsedTime = frameState.time - feature.get('start');
                        var elapsedPoints = elapsedTime * pointsPerMs;
                        // console.log(elapsedPoints);

                        var index = Math.round(10 * elapsedTime / 1000);
                        if (index >= coords.length-2) {
                            feature.set('finished', true);
                        }
                        var maxIndex = Math.min(elapsedPoints, coords.length);
                        var currentLine = new LineString(coords.slice(0, maxIndex));
                        // directly draw the line with the vector context
                        var airClass = feature.get("AirSpaceClass");
                        var style = findstyle(airClass);
                        vectorContext.setStyle(style);
                        vectorContext.drawGeometry(currentLine);

                        // labelStyle.getText().setText(feature.get('Price'));
                        // vectorContext.setStyle(labelStyle);
                        // vectorContext.drawGeometry(currentLine);

                        //movepoint
                        // var index = Math.round(maxIndex); // point moving with line
                        if(index<500){
                            var currentPoint = new Point(coords[index]);
                            var airEngine = feature.get("EngineModel");
                            var airPlane =  feature.get("AircraftModel");

                            var plane = findPlane(airPlane);


                            col = findEngine(airEngine);
                            var svg = '<svg fill="'+col+'" width="200" height="200" version="1.1" xmlns="http://www.w3.org/2000/svg"><' +
                                'path d="'+plane+'"/></svg>';

                            var mysvg = new Image();
                            mysvg.src = 'data:image/svg+xml,' + escape(svg);

                            //and then declare your style with img and imgSize
                            var planeStyle = new Style({
                                image: new Icon({
                                    opacity: 1,
                                    // anchor:[0.5,0.5],
                                    img: mysvg,
                                    imgSize:[170,170],
                                    scale: 0.2,
                                    rotation:planeRoation(coords[i+1],coords[i])
                                })
                            });


                            // draw the movepoint with the vector context
                            vectorContext.setStyle(planeStyle);
                            vectorContext.drawGeometry(currentPoint);
                        }
                    }
                }
            // tell OpenLayers to continue the animation
            map.render();
        }


        //change plane direction
        function planeRoation(new_p,old_p){
            //90 度 的 PI 值
            var pi_90 = Math.atan2(1,0);
            // current 的 PI 值
            var pi_ac = Math.atan2(new_p[1] - old_p[1], new_p[0] - old_p[0]);
            return pi_90 - pi_ac;
        }


        var flightsLayer = new VectorLayer({
            source: flightsSource,
            style: function(feature) {
                // if the animation is still active for a feature, do not
                // render the feature with the layer style
                labelStyle.getText().setText("$"+feature.get('Price'));
                if (feature.get('finished')) {
                    // console.log(feature.get("AirSpaceClass"));
                    return findstyle(feature.get("AirSpaceClass"));
                } else {
                    return labelStyle;
                }
            }
        });

        // var lat = -33.861568;
        // var lng = 151.207859;
        // var iconFeature =  new Feature ({
        //     geometry: new Point(transform([lng, lat], 'EPSG:4326', 'EPSG:3857')),
        //     name: 'The icon',
        //     population: 4000,
        //     rainfall: 500
        // });

        // var svgStyle = new Style({
        //     image: new Icon({
        //         opacity: 1,
        //         src: 'data:image/svg+xml;utf8,' + svg,
        //         scale: 0.2
        //     })
        // });


        // iconFeature.setStyle(iconStyle);
        //
        // var vectorSource = new VectorSource({
        //     features: [iconFeature]
        // });
        // var vectorLayer = new VectorLayer({
        //     source: vectorSource
        // });
        //
        //
        // map.addLayer(vectorLayer);


        map.addLayer(flightsLayer);
    };

    onChange = (e) => {
        var style = e.target.value;
        this.setState({selectStyle:style});
        for (var i = 0; i<layers.length; i++) {
            layers[i].setVisible(styles[i] === style);
        }
    };

    //rotateleft
    onRotateleft =()=> {
        view.animate({
            rotation:view.getRotation()+ Math.PI/2
        });
    };

    //rotateright
    onRotateright =()=> {
        view.animate({
            rotation: view.getRotation() - Math.PI / 2
        });
    };

    //rotate around
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
    //pan
    onPanto=()=>{
        view.animate({
            center: london,
            duration: 2000
        });
    };
    //fly
    flyTo = (location,done) => {
        var duration = 2000;
        // var zoom = view.getZoom();
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
            <div className = "app">
                <div id='map'>
                </div>
                <select id="layer-select" value={this.state.selectStyle} onChange={this.onChange}>
                    <option value="Aerial">Aerial</option>
                    <option value="AerialWithLabels">Aerial with labels</option>
                    <option value="Road">Road (static)</option>
                    <option value="RoadOnDemand">Road (dynamic)</option>
                </select>
                <button id="rotate-left" title="Rotate clockwise" onClick={this.onRotateleft}>↻</button>
                <button id="rotate-right" title="Rotate counterclockwise" onClick={this.onRotateright}>↺</button>
                <button id="pan-to-london" onClick={this.onPanto}>Pan to London</button>
                <button id="fly-to-Sydney" onClick={this.onFlyto}>Fly to Sydney</button>
                <button id="rotate-around-rome" onClick={this.onRotateraround}>Rotate around Rome</button>
            </div>
        );
    }
}

export default App;
