var doughnut_data = [
	{
		value: 90,
		color:"rgba(151,187,205,1)"
	},
	{
		value : 10,
		color : "rgba(151,187,205,0.5)"
	}
]

var bar_data = {
	labels : ["","","","","","",""],
	datasets : [
		{
			fillColor : "rgba(151,187,205,0.5)",
			strokeColor : "rgba(151,187,205,1)",
			data : [10,20,40,80,160,320,640]
		}
	]
}

var radar_data = {
	labels : ["","","","","","",""],
	datasets : [
		{
			fillColor : "rgba(151,187,205,0.5)",
			strokeColor : "rgba(151,187,205,1)",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#fff",
			data : [100,100,100,100,100,100, 100]
		}
	]
}

var options = {}

var doughnut_ctx = $("#doughnut").get(0).getContext("2d");
var doughnut = new Chart(doughnut_ctx).Doughnut(doughnut_data,{percentageInnerCutout : 60});

var bar_ctx = $("#bar").get(0).getContext("2d");
var bar = new Chart(bar_ctx).Bar(bar_data,{scaleShowLabels : false,
	scaleGridLineWidth : 0.1, 
	scaleLineWidth : 0.1,
	animationSteps: 100});

var radar_ctx = $('#radar').get(0).getContext("2d");
var radar = new Chart(radar_ctx).Radar(radar_data, {animationSteps:100,
	scaleOverride: true,
	scaleSteps : 4,
	scaleStepWidth : 0,
	scaleStartValue : 10})