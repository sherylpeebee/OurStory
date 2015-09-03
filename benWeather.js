var promiseForecast = $.get('http://api.wunderground.com/api/58853d29672309fb/forecast/q/'+state +'/' + city + '.json');
		promiseForecast.success(function(data){
			console.log('forecast success data:', data);
			var forecast = data.forecast.txt_forecast.forecastday;
			var forecastLength = forecast.length;
			console.log(forecast);
			$forecast = $('#forecast-list');
			var title;
			var iconUrl;
			var icon;
			var fcttext;
			var fcttext_metric;
			var toAppend;
			console.log(forecast.length);
			for (i = 0; i < forecastLength.length; i++) {
				console.log("Loop here!");
				console.log(forecast[i]);

  		$('#forecastTitle').append(forecast[i].title);
    	$('#forecastIconUrl').attr('src', iconUrl);
    	$('#forecastIcon').append(forecast[i].icon);
    	$('#forecastText').append(forecast[i].fcttext);
    	$('#forecastTextM').append(forecast[i].fcttext_metric);
			};
			console.log("end of loop!");


		});
		promiseForecast.fail(function(error){
			console.log('error:', error);
		});
