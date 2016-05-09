/*
chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (notifId === myNotificationID) {
        if (btnIdx === 0) {
            window.open("...");
        } else if (btnIdx === 1) {
            saySorry();
        }
    }
});
var Notifications = {
	'create': function(){
		var opt = {
		  type: "list",
		  title: "HaveToDo - Unfinished tasks",
		  message: "You have unfinished tasks",
		  iconUrl: "icons/128x128.png",
		  items: [{ title: "2 remainaing in- ", message: "Home"},
		          { title: "Home", message: "3"},
		          { title: "Work", message: "4"}],
		  buttons: [{
        	title: "Okay"
      	  }]
		}
		chrome.notifications.create('1', opt, function(){});
	}
};
export default Notifications;
*/