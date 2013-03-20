(function(){

var Tabs = [];
var currentTab = -1;
var currentTabIndex = -1;

//retrive info on all tabs
updateAll(0,0);


ws = new WebSocket("ws://localhost:8888/browser");
ws.onopen = function () {
   	
};

ws.onmessage = function (msg) {  
		
		var parts = msg.data.split(" ");		
		if(parts){
			var command = '';
		
			if( typeof parts === 'string' ) {
				command = parts;
			}else{
				command = parts[0];
			}
			
			switch(command){
				case "refresh":
					reload();
					break;
				case "create":
					openNewTab(parts);
					break;
				case "open":
					openUrl(parts);
					break;	
				case "left":
					move(parts,-1);
					break;
				case "right":
					move(parts,1);
					break;
				case "moveby":
					move(parts, null);
					break;
				case "close":
					close(parts);
					break;
				case "close-last":
					parts[1] = Tabs.length -1;
					close(parts);
					break;
				case "close-first":
					parts[1] = 0;
					close(parts);
					break;
				case "grab":
					grabScreen(parts);
					break;
                case "update":
                    updateAll(0,0);
                    break;
            }
	
		}
};

ws.onclose = function () {
	alert('Connection is lost.');
};


/**
 *  Updates state of tabs
 */
function updateAll(one, two){
    chrome.tabs.query({}, function(openTabs){
        Tabs = [];
        for(i=0;i< openTabs.length; i++){
            Tabs.push(openTabs[i].id);
            if(openTabs[i].active){
                currentTab = openTabs[i].id;
                currentTabIndex = i;
            }
        }
    });
}


/**
 *  Attaches update function tabs events
 */
chrome.tabs.onRemoved.addListener(updateAll);
chrome.tabs.onAttached.addListener(updateAll);
chrome.tabs.onCreated.addListener(updateAll);
chrome.tabs.onDetached.addListener(updateAll);

/*
 *  This was first event, works fine so I left it
 */
chrome.tabs.onActivated.addListener(function(active){
	currentTab = active.tabId;
	for(i=0;i<Tabs.length;i++){
		if(Tabs[i] == currentTab){ currentTabIndex = i; break; }
	}
});



//reload current tab
function reload(){
	chrome.tabs.reload();
}

/*
	Open new tab
	args:
		command: create,
		url - (optional)  string, url to open, default google.com
		active - (optional) boolean, is this tab has to be active, default true
*/
function openNewTab(args){
	var url = 'http://google.com';
	var active = true;
	if( typeof args !== 'string' ) {
		if(args.length == 2){
			url = args[1];			
			chrome.tabs.create({ url : url,	active: active }, function(tab){
					Tabs.push(tab.id);
					currentTab = tab.id;
					currentTabIndex = Tabs.length - 1;
			});
		}				
	}
}

/*
	Open url in active tab
	args:
		command: open,
		url - (optional)  string, url to open
		
*/
function openUrl(args){
	if( typeof args !== 'string' ) {
		if(args.length == 2){
			var url = args[1];
			
			chrome.tabs.update({ url : url });
		}				
	}
}

/**
 *  Sets the current active window
 *  If args has 2 elements, assume that second is number by which you jump
 *  If the number is positive than jump number of tabs to the right, if negative that jump left
 *  
 *  The direction is used to move one left or right, is -1 or 1
 */
function move(args,direction){
	var newPosition = null;	
	
	if( typeof args !== 'string' ) {	
		if(args.length == 2){
			var move = parseInt(args[1]);			
			newPosition = currentTabIndex + move;						
		}		
	}
	
	if( direction == -1 || direction == 1){
			newPosition = currentTabIndex + direction;
	}
		
	if(newPosition != null){		
		if(newPosition >= 0){
			chrome.tabs.update(Tabs[(newPosition%Tabs.length)],{active:true});
		}else{			
			chrome.tabs.update(Tabs[(newPosition + Tabs.length)],{active:true});
		}
	}	
}

/**
 * Close tab by index
 * 0  is first frome the left
 * Tabs.length - 1  is first from the right
 * 
 */
function close(args){
	if( typeof args !== 'string' ) {	
		if(args.length == 2){
			var index = parseInt(args[1]);				
			if(index >= 0 && index < Tabs.length){
				chrome.tabs.remove(Tabs[index],updateAll);							
			}
		}		
	}
}


/**
 * Make screenshoot of the active tab
 *
 */
function grabScreen(args){
	var format = "jpeg";
	var quality = 80;
	
	if( typeof args !== 'string' ) {	
		if(args.length == 2){
			format = args[1];										
		}	
		if(args.length == 3){
			quality = parseInt(args[2]);										
		}		
	}
	chrome.tabs.captureVisibleTab({format: format, quality: quality}, function(data){
		ws.send(data);
	});
}

})();