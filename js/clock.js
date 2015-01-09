
var x = setInterval(function(){getTime()}, 1000)

function getTime()
{
	var date = new Date();
	var timeString = date.toLocaleTimeString();
	document.getElementById("clock").innerHTML = timeString;
}

