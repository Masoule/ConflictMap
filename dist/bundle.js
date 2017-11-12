/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function fillMap(selection, color, data) {
  selection
    .attr("fill", function(d) { return typeof data[d.id] === 'undefined' ? default_color : d3.rgb(color(data[d.id])); });
}

function addCircle(selection, data) {
  var radius = d3.scaleSqrt()
    .domain([0, 1e6])
    .range([0, 15]);

  console.log(data)
  selection
    .attr("r", function(d) {
      return typeof data[d.id] === 'undefined' ?
      0 : radius(data[d.id])*10;
    });
}

function showInfo(selection, data) {
  selection
  .text(function(d) { return "" + d.id + ", " +
  (typeof data[d.id] === 'undefined' ? 'N/A' : data[d.id]); });
}

function colorGradient(data) {
  // console.log(data, "??/")
  let data_values = Object.values(data).sort( function(a, b){ return a-b; });

  quantiles_calc = quantiles.map( function(elem) {
    return Math.ceil(d3.quantile(data_values, elem));
  });

  let scale = d3.scaleQuantile()
  .domain(quantiles_calc)
  .range(d3.schemeReds[(quantiles_calc.length)-1]);

  return scale;
}

function updateMap(color, data) {
  // update colors
  d3.selectAll("svg#map path").transition()
    .delay(50)
    .call(fillMap, color, data)

  //update circles
  d3.selectAll("svg#map circle").transition()
    .delay(50)
    .call(addCircle, data);

  // update path titles
  d3.selectAll("svg#map path title")
    .call(showInfo, data);

  // update headline
  d3.select("h2").text(headline + d3.select("#slider").node().value);
}

// function renderPlot() {
//   var area = d3.area()
//       .x(function(d) { return x(d.year); })
//       .y1(function(d) { return y(d.killed); });
//
//   d3.csv("data.csv", function(d) {
//     d.year = parseInt(d.year);
//     d.killed = +d.killed;
//     d.description = d.description;
//     return d;
//   }, function(error, data) {
//     if (error) throw error;
//
//     x.domain(d3.extent(data, function(d) { return d.year; }));
//     y.domain([0, d3.max(data, function(d) { return d.killed; })]);
//     area.y0(y(0));
//
//     let plot = d3.select("svg#plot g.plot")
//
//     plot.append("path")
//         .datum(data)
//         .attr("fill", "red")
//         .attr("d", area);
//     plot.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x));
//     plot.append("g")
//         .call(d3.axisLeft(y))
//     plot.append("text")
//         .attr("fill", "#000")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 6)
//         .attr("dy", "0.71em")
//         .attr("text-anchor", "end")
//         .text("total casualties");
//   });
// }


/***/ })
/******/ ]);