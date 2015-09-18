function refreshStats() {
	"use strict";
	
	$.removeCookie("openExchangeRates");
	$.removeCookie("openExchangeBase");
	//$.removeCookie("openExchangeRates_Date");
	
	updateStats();
};

function updateStats() {
	"use strict";
	
	$.getJSON("https://finance.google.co.uk/finance/info?client=ig&q=ETR:RWE&callback=?",function(response){  
		//$("#time").html(moment().format("MMM Do, HH:mm:ss"));

		var stockInfo = response[0];
		
		if(stockInfo.cp < 0){
			if ($("#movement").hasClass("glyphicon-menu-up")) {
				$("#movement").removeClass("glyphicon-menu-up");
				$("#movement").removeClass("text-success");
				$("#priceChange").removeClass("text-success");
			};
			
			$("#movement").addClass("glyphicon-menu-down");
			$("#movement").addClass("text-danger");		
			$("#priceChange").addClass("text-danger");		
		} else {
			if ($("#movement").hasClass("glyphicon-menu-down")) {
				$("#movement").removeClass("glyphicon-menu-down");
				$("#movement").removeClass("text-danger");
				$("#priceChange").removeClass("text-danger");
			};
		
			$("#movement").addClass("glyphicon-menu-up");
			$("#movement").addClass("text-success");		
			$("#priceChange").addClass("text-success");
		};
		
		$("#lastTradedTime").html(stockInfo.lt);
		$("#lastPriceEUR").html(stockInfo.l);
		$("#priceChange").html(stockInfo.cp + "%");	
		
		if (typeof $.cookie("openExchangeRates") === "undefined") {
			$.ajax({
				url: "https://openexchangerates.org/api/latest.json?app_id=e45fa0fad635413db4a38d93558b8bc4",
				dataType: "jsonp",
				success: function(json) {
					fx.rates = json.rates;
					fx.base = json.base;				
					
					var temp = json;				
					
					$("#lastPriceGBP").html(fx.convert(stockInfo.l, {from: "EUR", to: "GBP"}).toFixed(2));
					$.cookie("openExchangeRates", JSON.stringify(temp.rates), { expires: 1, path: '/' });
					$.cookie("openExchangeBase", JSON.stringify(temp.base), { expires: 1, path: '/' });
					
					//$.cookie("openExchangeRates_Date", moment().format('MMM Do, HH:mm:ss'), { expires: 1, path: '/' });
					$("#fxDate").html("Live FX Price");				
				}
			});					
		} else {
			var rates = JSON.parse($.cookie("openExchangeRates"));
			var base = JSON.parse($.cookie("openExchangeBase"));				
			
			fx.rates = rates;
			fx.base = base;				
			
			$("#lastPriceGBP").html(fx.convert(stockInfo.l, {from: "EUR", to: "GBP"}).toFixed(2));			
			$("#fxDate").html($.cookie("openExchangeRates_Date"));			
		};
	});
};
