function redirect_init() {
	var params = {}, query = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, temp;
	
	while (temp = regex.exec(query)) {
	  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}

	if(!params['access_token']) {
	  alert("Error: Your access was not granted");
	}
	else {
	  localStorage["token"] =  params['access_token'];
	  window.opener.callback_function();
	}

	setTimeout(function(){window.close();}, 3000);
}