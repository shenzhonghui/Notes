// require('./src/pickerDateRange/dateRange.css');
// require('./src/dialog.css"');
// require('./src/dropkick/dropkick.css');
import $ from 'jquery';
import 'dropkickjs';
import * as d3 from "d3";
import {drag} from "d3-drag";
import {format} from "d3-format";
import {scaleOrdinal, schemeCategory20} from "d3-scale";
import {select, mouse} from "d3-selection";
import {sankey} from "d3-sankey";
import {rgb} from "d3-color";
import pickerDateRange from './src/pickerDateRange/dateRange.js';
import Event from './src/event.js';
import dialog from './src/dialog.js';
var fs = require('graceful-fs');
var doT = require('dot');

function renderSankey (opts) {
  // var el = opts.el + '-' + Math.random().toString(36).substring(2);
  var el = opts.el;
  var width = opts.layoutStyle.width || 600;
  var height = opts.layoutStyle.height || 400;
  var margin = opts.layoutStyle.margin || {top: 1, right: 1, bottom: 1, left: 1};
  var dataNodes = opts.data.nodes || [];
  var dataLinks = opts.data.links || [];
  var nodeCallback = opts.nodeCallback || function () {};
  // set color formate
  var formatNumber = format(",.0f"),   //decimal places
  format = function(d) { return formatNumber(d) + ""; },
  color = scaleOrdinal(schemeCategory20);
  select("#"+el).append('div').attr("class", "tooltip")
  //  set svg container
  var svg = select("#"+el).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // use d3-sankey
  var sanky = sankey();
  sanky.nodeWidth(20).nodePadding(10).size([width, height]);

  var path = sanky.link();
  var toolTips = select("#"+el).select(".tooltip");
  sanky.nodes(dataNodes)
      .links(dataLinks)
      .layout(32);

  // set link
  var link = svg.append("g").selectAll(".link")
      .data(dataLinks)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) {
        return b.dy - a.dy;
      })
      .on('mouseover', function ( d) {
          var coordinates = [0, 0];
          coordinates = mouse(this);
          var x = coordinates[0];
          var y = coordinates[1];
          toolTips.html(function () {
            return d.source.name + "->" + d.target.name + "<br/>" + format(d.value);
          })
          toolTips.style("display", "block")
          toolTips.style("top", (y + 100) + "px")
          toolTips.style("left", (x + 50) + "px")
      })
      .on('mousemove', function (d) {
        var coordinates = [0, 0];
        coordinates = mouse(this);
        var x = coordinates[0];
        var y = coordinates[1];
        toolTips.html(function () {
          return d.source.name + "->" + d.target.name + "<br/>" + format(d.value);
        })
        toolTips.style("display", "block")
        toolTips.style("top", (y + 100) + "px")
        toolTips.style("left", (x + 50) + "px")
      })
      .on('mouseout', function (d, e) {
        var evt = window.event || e;
        var obj=evt.toElement||evt.relatedTarget;
        var pa=this;
        if(pa.contains(obj)) return false;
        toolTips.style("display", "none")
      })
  // set node
  var node = svg.append("g").selectAll(".node")
      .data(dataNodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on("click", function (d) {
        nodeCallback.apply(this, arguments);
      })
    // .call(d3.drag()
    //   .subject(function(d) {
    //     return d;
    //   })
    //   .on("start", function() {
    //     this.parentNode.appendChild(this);
    //   })
    //   .on("drag", dragmove))

  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sanky.nodeWidth())
      .style("fill", function(d) { return d.color = color(d.name.split("|")[0]); })
      .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });

  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .style("fill", "#666")
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sanky.nodeWidth())
      .attr("text-anchor", "start");
  function dragmove (d) {
    select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sanky.relayout();
    link.attr("d", path);
  }
}
// 请求数据
var postData = {};

$('#normal_select').dropkick({
  change: function () {
    postData.select1 = this.value;
    Event.trigger( 'add', postData);
  }
})
$('#normal_select_pages').dropkick({
  change: function () {
    postData.select2 = this.value;
    Event.trigger( 'add', postData);
  }
})
var data = {
  name: 'shen'
}


var dateRange = new pickerDateRange('date_demo3', {
  aRecent7Days : 'aRecent7DaysDemo', //最近7天
  isTodayValid : false,
  startDate : '2017-03-29', // 开始日期
  endDate : '2017-03-29', // 结束日期
  defaultText : ' 至 ',
  inputTrigger : 'input_trigger_demo3',
  theme : 'ta',
  success : function(obj) {
    postData.startDate = obj.startDate
    postData.endDate = obj.endDate
    Event.trigger( 'add', postData);
  }
});
Event.listen( 'add', function (postData) {
  console.log(postData);
  setTimeout(function () {
    document.getElementById("chart").innerHTML="";
      var product= {
        nodes: [
          {
            name: "加入购物车",
            value: 3
          },
          {
            name: "下单",
            value: 2
          },
          {
            name:"付款",
            value:2
          },
          {
            name:"加入购物车",
            value:3
          },
          {
            name:"下单",
            value:5
          },
          {
            name:"付款",
            value:3
          },
          {
            name:"收货",
            value:2
          },
          {
            name:"下单",
            value:2
          },
          {
            name:"付款",
            value:8
          },
          {
            name:"申请退款",
            value:1
          },
          {
            name:"收货",
            value:1
          },
          {
            name:"加入购物车",
            value:1
          },
          {
            name:"付款",
            value:4
          },
          {
            name:"收货",
            value:3
          },
          {
            name:"付款",
            value:1
          },
          {
            name:"申请退款",
            value:3
          },
          {
            name:"收货",
            value:7
          },
          {
            name:"退货",
            value:2
          },
          {
            name:"收货",
            value:1
          }
          ],
          links: [
          {
            source:5,
            target:10,
            value:1
          },
          {
            source:2,
            target:6,
            value:2
          },
          {
            source:1,
            target:5,
            value:2
          },
          {
            source:8,
            target:16,
            value:4
          },
          {
            source:3,
            target:8,
            value:2
          },
          {
            source:7,
            target:12,
            value:2
          },
          {
            source:8,
            target:13,
            value:2
          },
          {
            source:3,
            target:7,
            value:1
          },
          {
            source:12,
            target:15,
            value:1
          },
          {
            source:5,
            target:13,
            value:1
          },
          {
            source:13,
            target:17,
            value:1
          },
          {
            source:0,
            target:5,
            value:1
          },
          {
            source:14,
            target:18,
            value:1
          },
          {
            source:11,
            target:14,
            value:1
          },
          {
            source:10,
            target:17,
            value:1
          },
          {
            source:8,
            target:15,
            value:2
          },
          {
            source:0,
            target:4,
            value:2
          },
          {
            source:12,
            target:16,
            value:3
          },
          {
            source:4,
            target:8,
            value:5
          },
          {
            source:5,
            target:9,
            value:1
          }
          ]
        }
        renderSankey({
          el: 'chart',
          layoutStyle: {
            width: 840,
            height: 440
          },
          data: product,
          nodeCallback: function (d) {
            var data = {
              name: "shen"
            };
            var slot = doT.template($('#js_keydata_tpl').text())(data)
            dialog({
              slot: slot + slot + slot + slot
            })
            $('.ui_trendgrid_number').on('click', function () {
              alert('djd')
            })
          }
        })
    }, 1000)
});
Event.trigger( 'add', postData);
