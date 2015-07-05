window.onkeypress = keypress;
/*
	Returns the basename of a file
*/
function basename(path) {
   return path.split(/[\\/]/).pop();
}

/*
	Detects a keypress and tries to match it to one of the existing keybinds (1-9)
	Plays the sound of the corresponding match
*/
function keypress(e) {
	var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
	var code = String.fromCharCode(charCode);
	var keybinds = document.getElementsByClassName('keybind');
	for (i = 0; i < keybinds.length; ++i) {
		if (keybinds[i].innerHTML == code){
			var box = keybinds[i].parentNode
			if ( box.style.display == "none" ) continue;
			box.getElementsByTagName("audio")[0].play()
			return;
		}
	}

}

/*
	Saves a cookie on the user's browser
*/
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

/*
	Retrieves a cookie from the user's browser
*/
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

/*
	Finds the div of class "box" matching an audio filename
*/
function findbox(filename){
	var audiolist = document.getElementsByTagName("audio");
	for (var i=0; i < audiolist.length; ++i){
		if (filename == basename(audiolist[i].src))
			return audiolist[i].parentNode;
	}
}

/*
	Executed when the page is loaded, intializes the list of favorite sounds from cookies
*/
function loaded(){
	var favcookie=getCookie("favlist");
	favlist = []
	if (favcookie!="") {
		cookielist = favcookie.split(',');
		
		for (var i = 0; i < cookielist.length; ++i) {
			box = findbox(cookielist[i])
			favlist.push(box)
			box.getElementsByClassName("save")[0].style.color = "green";
		}
	}
	resetboxes();
}

/*
	Saves a box in the list of favorites, updates the cookie
*/
function fav(savediv, parentdiv) {
	position = favlist.indexOf(parentdiv);
	if (! ~position ){
		favlist.push(parentdiv);
		var cookie = ""
		for (i = 0; i < favlist.length; ++i) {
			var box = favlist[i]
			cookie = cookie + basename(box.getElementsByTagName("audio")[0].src) + ",";
		}
		cookie = cookie.slice(0,-1);
		setCookie("favlist", cookie, 2);
		savediv.style.color = "green";
	}
	else{
		favlist.splice(position, 1);
		var cookie = ""
		for (i = 0; i < favlist.length; ++i) {
			var box = favlist[i]
			cookie = cookie + basename(box.getElementsByTagName("audio")[0].src) + ",";
		}
		cookie = cookie.slice(0,-1);
		setCookie("favlist", cookie, 2);
		savediv.style.color = "black";
	}
}

/*
	Move all the boxes back to original state, when "All" boxes should be shown
*/
function resetboxes(){
	var testElements = document.getElementsByClassName('box');
	var boxindex = 0;

	Array.prototype.filter.call(testElements, function(box){
		boxindex = boxindex + 1;
		box.style.display = "inline-block";
		box.getElementsByClassName('keybind')[0].innerHTML = boxindex;
	});
}

/*
	Only displays boxes present in the user's favorite list
*/
function perso(){
	var testElements = document.getElementsByClassName('box');
	Array.prototype.filter.call(testElements, function(box){
		box.style.display = "none";
	});

	for (i = 0; i < favlist.length; ++i) {
		var box = favlist[i]
		box.style.display = "inline-block";
		box.getElementsByClassName('keybind')[0].innerHTML = i+1
	}
}
