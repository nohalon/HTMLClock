
var x = setInterval(function(){getTime()}, 1000)
var userId = "";

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

		if (curTemp < 60) {
			$('body').addClass('cold');
		}
		else if (curTemp >= 90) {
			$('body').addClass('hot');
		}
		else if (curTemp >= 80) {
			$('body').addClass('warm');
		}
		else if (curTemp >= 70) {
			$('body').addClass('nice');
		}
		else if (curTemp >= 60) {
			$('body').addClass('chilly');
		}
	});
}

$(document).ready(function() {
	getTemp();
	getAllAlarms();
});

// Alarms
function showAlarmPopup() {
	$("#mask").removeClass("hide");
	$("#popup").removeClass("hide");
}

function hideAlarmPopup() {
	$("#mask").addClass("hide");
	$("#popup").addClass("hide");
}

function insertAlarm(hours, minutes, ampm, alarmName, alarmId) {
	var time = hours.concat(":").concat(minutes).concat(" ").concat(ampm);
	insertStoredAlarm(time, alarmName, alarmId);
}

function insertStoredAlarm(time, alarmName, alarmId) {
	var containerDiv = $("<div/>", {class : "flexable"});
	var outsideInput = $("<input />", { type: 'checkbox', class : "flexable", id : alarmId });
	var nameDiv = $("<div/>", {class : "name", text : alarmName});
	var timeDiv = $("<div/>", {class : "time", text : time})

	containerDiv.append(outsideInput);
	containerDiv.append(nameDiv);
	containerDiv.append(timeDiv);

	$("#alarms").append(containerDiv);
}

function addAlarm() {
	var hours, minutes, ampm, alarmName, time;
	hours = $("#hours option:selected").text();
	minutes = $("#mins option:selected").text();
	ampm = $("#ampm option:selected").text();
	alarmName = $("#alarmName").val();
	time = hours.concat(":").concat(minutes).concat(" ").concat(ampm);

	var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();
      alarmObject.save({"time": time, "alarmName": alarmName, "userId" : userId}, {
      success: function(object) {
        insertAlarm(hours, minutes, ampm, alarmName, object.id);
		hideAlarmPopup();

		// Google analytics
		ga('send', 'event', 'Alarm', 'Add');
      }
    });
}

function getAllAlarms(localUserId) {
	Parse.initialize("eKjTEoY8WADoVRMKGZgPkRaosUEsGt3tm43IKjwD", "UI42VgHKdK81nOyyJk1TQUgcmbZUGGXvIm3dnEdn");
	var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);

    query.equalTo("userId", localUserId);
    query.find({
        success: function(results) {
          for (var i = 0; i < results.length; i++) { 
            insertStoredAlarm(results[i].get("time"), results[i].get("alarmName"), results[i].id);
          }
        }
    });
}

function deleteAlarms() {
	var alarms = document.getElementById('alarms');
	var inputs  = alarms.getElementsByTagName('input');

	var AlarmObject = Parse.Object.extend("Alarm");
	var query = new Parse.Query(AlarmObject);


	for (var i = 0, len = inputs.length; i < len; i++) {
		if (inputs[i].type == 'checkbox' && inputs[i].checked) {
			var deleteID = inputs[i].id;

			$("#" + deleteID).parent().addClass("hide");
			$("#" + deleteID).parent().removeClass("flexable");

			query.get(deleteID, {
				success: function(alarms) {
					alarms.destroy({
						error: function(myObject, error) {
							console.log("error");
						}
					})
				},
				error: function(object, error) {
		   			console.log("Error getting " + object + " " + error);
	  			}
			});

			// Google Analytics
			ga('send', 'event', 'Alarm', 'Delete');
		}
	}
}

function signinCallback(authResult) {
	var userName = "";
    if (authResult['status']['signed_in']) {
    	// Get the users information
		gapi.client.load('plus','v1', function() {
			var request = gapi.client.plus.people.get({
			   'userId': 'me'
			});
			request.execute(function(resp) {
			   userName = resp.displayName;
			   userId = resp.result.id;
			   // Show the users id
			   getAllAlarms(userId);
			   $('.clockText').html(userName + "'s Clock and Alarms");
			});
		});
    	document.getElementById('signinButton').setAttribute('style', 'display: none');
    } else {
    	
	    document.getElementById('signinButton').setAttribute('style', 'display: inline');
	    console.log('Sign-in state: ' + authResult['error']);
    }
}
