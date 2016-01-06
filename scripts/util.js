var moment = require('moment');

var isExt = (chrome.storage) ? 1 : 0;
var Util = {
	"storage": {
		"set": function(){},
		"get": function(){}
	}
};
Util.storage.set = function(key, keyValue){
	if(isExt){
		var obj = {};
		obj[key] = keyValue;
		chrome.storage.local.set(obj);
	}else{
		localStorage.setItem(key, keyValue);
	}
};
Util.storage.get = function(key, cb){
	if(isExt){
		chrome.storage.local.get(key, cb);
	}else{
		var result = {};
		if(localStorage.getItem(key) !== null){
			result[key] = localStorage.getItem(key);
		}
		cb.call(null, result);
	}
};

Util.shadeColor = function(p,c0,c1) {
    var n=p<0?p*-1:p,u=Math.round,w=parseInt;
    if(c0.length>7){
        var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
        return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")";
    }else{
        var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
        return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1);
    }
};

Util.timeago = function(time, timeDifference){
	if(!time) return;
	if(timeDifference === 0) return "Today";
	else if(timeDifference === 1) return "Yesterday";
	else return moment(time).format("ddd, MMM Do")
};

Util.UUID = function(){
	return Math.random().toString(36).substring(7);
}

Util.getTabIndex = function(){

}

Util.countTasks = function(boards){

	var count = 0;
	for(var i=0;i<boards.length;i++){
		// count+=boards[i].lists.map(fun)
		for(var j=0;j<boards[i].lists.length;j++){
			count += boards[i].lists[j].cards.length;
		}
	}
	return count;

}

export default Util;