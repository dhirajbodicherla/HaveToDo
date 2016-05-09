var alarmName = 'havetodoalarms';
var Notifications = {
	'create': function(){
		var opt = {
		  type: "list",
		  title: "HaveToDo - Unfinished tasksBG",
		  message: "You have unfinished tasks",
		  iconUrl: "icons/128x128.png",
		  items: [{ title: "2 remainaing in ", message: "Home"},
		          { title: "Home", message: "3"},
		          { title: "Work", message: "4"}],
		  buttons: [{
        title: "Okay"
      }]
		}
		chrome.notifications.create('1', opt, function(){});
	}
};

chrome.alarms.getAll(function(a){ console.log(a); });

chrome.alarms.create(alarmName, {
	when: 5000,
	periodInMinutes: 1440
});

chrome.alarms.onAlarm.addListener(function( alarm ) {
	console.log('alarm', alarm);
	// Notifications.create();
});