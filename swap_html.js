if (!window.jQuery){
	sjq = document.createElement('script');
	sjq.setAttribute('src', 'http://code.jquery.com/jquery-latest.min.js');
	document.head.appendChild(sjq);
}

document.onreadystatechange = function(){
	var SWAP_DAYS = 365;
	var SWAP_DICT = {"(31) 3333-3333": "(31) 9999-9999", "31 3333-3333": "(31) 9999-9999"};
	var SWAP_ALL = true;
	
	var referrer = getReferrer();
	var referrerKey = getReferrerKey(referrer);
	var keys = ['google_paid', 'facebook_paid'];
	 
	if(contains(keys, referrerKey) || SWAP_ALL){
		setCookie("ads_referrer", referrer, SWAP_DAYS);
		swapHTML(SWAP_DICT);
	}
};	
	
function swapHTML(fromToDict){
	shtml = jQuery(document.body).html();
	for(key in fromToDict){
		var i = jQuery('*:contains(' + key + '):last');
		while(i.length>0) {
			i.html(i.html().replace(key, fromToDict[key]));
			console.log(i);
			i = jQuery('*:contains(' + key + '):last');
		}
	}
}

function setCookie(name, value, days){
	var date = new Date();
	date.setTime(date.getTime() + (days*24*60*60*1000));
	var expires = "; expires=" + date.toGMTString();
	document.cookie = name + "=" + value + expires + ";path=/";;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getReferrer(){
	var referrer = document.referrer;
	if(getCookie('ads_referrer')) {
		referrer = getCookie('ads_referrer');
	}
	return referrer;
}

function getReferrerKey(referrer){
	var referrer_key = 'direct';
	if (referrer.match(/^(.*)gclid=(.*)$/)) {
		referrer_key = 'google_paid';
	} else if (referrer.match(/^(.*)fbid(.*)$/)) {
		referrer_key = 'facebook_paid';
	}
	else if (referrer.match(/^(.*)aclk(.*)$/)) {
		referrer_key = 'google_paid';
	} else if (referrer.match(/^(.*)google(.*)$/) && !referrer.match(/^(.*)mail\.google\.com(.*)$/)) {
		if (referrer.match(/^(.*)maps\.google\.[a-z\.]{2,6}\/(.*)$/)) {
			referrer_key = 'google_local';
		} else if (referrer.match(/^(.*)google\.[a-z\.]{2,6}\/aclk(.*)$/) || referrer.match(/^(.*)googleadservices(.*)$/) || referrer.match(/^(.*)utm_medium=cpc(.*)$/i) || referrer.match(/^(.*)utm_medium=ppc(.*)$/i)) {
			referrer_key = 'google_paid';
		} else {
			referrer_key = 'google_organic';
		}
	} else if (referrer.match(/^(.*)yahoo(.*)$/) && !referrer.match(/^(.*)mail\.yahoo\.com(.*)$/)) {
		if (referrer.match(/^(.*)local\.yahoo\.com(.*)$/) || referrer.match(/^(.*)local\.search\.yahoo\.com(.*)$/)) {
			referrer_key = 'yahoo_local';
		} else if (referrer.match(/^(.*)msn\.com(.*)$/) || referrer.match(/^(.*)utm_medium=cpc(.*)$/i) || referrer.match(/^(.*)utm_medium=ppc(.*)$/i)) {
			referrer_key = 'yahoo_paid';
		} else {
			referrer_key = 'yahoo_organic';
		}
	} else if (referrer.match(/^(.*)facebook(.*)$/)) {
		if (referrer.match(/^(.*)utm_medium=cpc(.*)$/i)) {
			referrer_key = 'facebook_paid';
		} else {
			referrer_key = 'facebook_organic';
		}
	} else if (referrer.match(/^(.*){1}(\/|\.)bing\.(.*)$/)) {
		if (referrer.match(/^(.*)bing\.com\/local(.*)$/)) {
			referrer_key = 'bing_local';
		} else if (referrer.match(/^(.*)utm_medium=cpc(.*)$/i) || referrer.match(/^(.*)utm_medium=ppc(.*)$/i)){
			referrer_key = 'bing_paid';
		} else {
			referrer_key = 'bing_organic';
		}
	} else if (referrer.match(/^(.*)msn\.com(.*)$/)) {
		referrer_key = 'bing_paid';
	}
	return referrer_key;
}

function contains(a, obj) {
	if(jQuery.inArray(obj, a) > -1){
		return true;
	} else {
		return false;
	}
}
