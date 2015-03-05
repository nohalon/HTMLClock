
var client_id, type, callback_function;

function init(obj) {
	client_id = obj.client_id;
	type = obj.type;
	callback_function = obj.callback_function;
}

function test() {
	localStorage["token"];
	$.ajax({
      url: "https://api.imgur.com/3/account/me",
      type: "GET",
      headers: {
         "Authorization": "Bearer " + localStorage["token"]
      },
      success: function(data, textStatus, xhr){
         alert("Hello "+ data.data.url +"!");
      }
   });
}

function login() {
   login_window = $(window.open('https://api.imgur.com/oauth2/authorize?client_id='+client_id+'&response_type='+type+'&state='));
}