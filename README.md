# Chrome command line pilot

This repo consists of 3 parts:

* Chrome plugin which contacts the local websocket server and executes command on tabs
* client , sending commands to server
* websocket server which transfers data fro client to server and back 

Communication between command line and browser is done using websockets. Chrome Experimental Network API is not allowed in 
the browser plugins, and that's why I choose websockets to do the talking. 

Client ( shell script ) and websocket server is written in Python. Server is build using Tornado and client uses websocket-client.

## Instalation

Server and client where written for Python 2.7

Install additional Python libraries:

```
sudo pip install tornado
sudo pip install websocket-client
```

Download the package.

Open chrome://extensions  , set the developer mode and install extension without package, pointing to "extension-controler" 
directiory. 

Add websocket.py to your init scripts so the server will run when you log on.

## Using

### This plugin works with one window! I haven't tested it on multiple windows
Chrome has to be started after the server will start or you will have to reload the plugin in the extension tab

Commands:
####create
* creates new tab
* params: url (optional)  - the url which will be opened, default: http://google.com

####open
* opens url in active tab
* params: url   - the urk to open

####refresh
* refreshes active tab

####left
* sets active one to the left tab

####right
* sets active one to the right tab

####moveby
* Sets active #NUMBER to the left or right
* params: number - the number of tabs to jump to the left or right, if number is negative you move to the left, if positive you move to the right

####close
* closes tab number you choose, the number is from 0 to number_of_tabs - 1 you have open
* param number   

####close-last
* closes tab first from the right

####close-first
* closes tab first from the left

####grab
* grabs the screen shot of the visible area from the active tab, default: 
* params: format (optional)  - posible:  jpeg and png , default: jpeg 
* params: quality ( optional) - quality of the image, only used with jpeg , default: 80 
* in this version images are saved in the same directory as the client

Examples:
```
chrome-pilot left                     #moves one left
chrome-pilot create                   #creates new tab and opens google.com
chrome-pilot create http://9gag.com   #creates new tab and opens 9gag.com
chrome-pilot open http://facebook.com #opens facebook in the active tab
chrome-pilot close 2                  #will close third tab from the left
```

I created this to be able to do things like reloading the page I'm working on directly from Vim, so for example:
```
nnoremap <silent> <F5> :! chrome-pilot refresh<CR><CR>
```
this key binding reloads the page I'm working on from Vim after I press F5, like in normal browser. 


In future I plan to add ability to inject CSS and JS directly from vim to page, modify screen shots and write proper vim plugin.







