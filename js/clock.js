
var x = setInterval(function(){getTime()}, 1000)

function getTime()
{
	var date = new Date();
	var timeString = date.toLocaleTimeString();
	document.getElementById("clock").innerHTML = timeString;
}

function getTemp() {
	var callback = "https://api.forecast.io/forecast/ce37f81ed48e44c89296b7657221f6e3/35.300399,-120.662362?callback=?";

	$.getJSON(callback, function(data) {
		$('#forecastLabel').html(data.currently.summary + " " + data.daily.data[0].temperatureMax);
		$('#forecastIcon').attr('src', "img/" + data.currently.icon + ".png");

		var curTemp = data.daily.data[0].temperatureMax;

		if (curTemp < 60)
		{
			$('body').addClass('cold');
		}
		else if (curTemp >= 90) 
		{
			$('body').addClass('hot');
		}
		else if (curTemp >= 80) 
		{
			$('body').addClass('warm');
		}
		else if (curTemp >= 70) 
		{
			$('body').addClass('nice');
		}
		else if (curTemp >= 60)
		{
			$('body').addClass('chilly');
		}
	});
}

$(document).ready(function() {
	getTemp();
});

