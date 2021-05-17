var ADMIN_OVERRIDE = false;

// not mine
// (source unknown) Used for the clock
Number.prototype.pad = function (len) {
    return (new Array(len+1).join("0") + this).slice(-len);
}


// not mine
// https://github.com/maykar/custom-header/blob/master/src/ha-elements.js
////////////////////////////////////////////////////////////////////////////////

const getHass = () => {
  const main = document.querySelector('home-assistant').shadowRoot.querySelector('home-assistant-main');
  if (main && main.hass) return main.hass;
  else setTimeout(getHass, 300);
};

const hass = getHass();

const ha_elements = () => {
  const haElem = {};

  haElem.hass = getHass();

  haElem.homeAssistant = document.querySelector('home-assistant');
  haElem.main = haElem.homeAssistant.shadowRoot.querySelector('home-assistant-main').shadowRoot;
  haElem.partialPanel = haElem.main.querySelector('partial-panel-resolver');
  haElem.panel = haElem.main.querySelector('ha-panel-lovelace');
  if (!haElem.panel) return;
  haElem.root = haElem.panel.shadowRoot.querySelector('hui-root');
  if (!haElem.root) return;
  haElem.root = haElem.root.shadowRoot;

  haElem.tabs = Array.from((haElem.root.querySelector('paper-tabs') || haElem.root).querySelectorAll('paper-tab'));

  haElem.tabContainer = haElem.root.querySelector('ha-tabs'); //querySelector('paper-tabs')

  haElem.tabsContent = haElem.tabContainer.shadowRoot.querySelector("#tabsContent");


  haElem.menu = haElem.root.querySelector('ha-menu-button');
  haElem.options = haElem.root.querySelector('ha-button-menu, paper-menu-button');
  haElem.voice =
    haElem.root.querySelector('app-toolbar').querySelector('mwc-icon-button') ||
    haElem.root.querySelector('ha-start-voice-button') ||
    haElem.root.querySelector('paper-icon-button[icon="hass:microphone"]') ||
    haElem.root.querySelector('ha-icon-button[icon="hass:microphone"]');
  haElem.drawer = haElem.main.querySelector('#drawer');
  haElem.sidebar = {};
  haElem.sidebar.main = haElem.main.querySelector('ha-sidebar').shadowRoot;
  haElem.sidebar.menu = haElem.sidebar.main.querySelector('.menu');
  haElem.sidebar.listbox = haElem.sidebar.main.querySelector('paper-listbox');
  haElem.sidebar.divider = haElem.sidebar.main.querySelector('div.divider');
  haElem.appHeader = haElem.root.querySelector('app-header');
  haElem.appLayout = haElem.root.querySelector('ha-app-layout');

  return haElem;
};

const haElem = ha_elements();

////////////////////////////////////////////////////////////////////////////////



// Save current drawer width
var drawer_width = haElem.drawer.offsetWidth;

// click the element to get the other width value
haElem.drawer.querySelector("ha-sidebar").shadowRoot.querySelector("mwc-icon-button").click();

// select the lowest
drawer_width = (haElem.drawer.offsetWidth < drawer_width) ? haElem.drawer.offsetWidth : drawer_width;

// reset state
haElem.drawer.querySelector("ha-sidebar").shadowRoot.querySelector("mwc-icon-button").click();


if( !haElem.hass.user.is_admin || ADMIN_OVERRIDE ) {

  // set the drawer width to zero to get full width
  haElem.homeAssistant.shadowRoot.querySelector("home-assistant-main").style.setProperty("--app-drawer-width", 0);

  // completely hide the sidebar
  // this creates full width for the top and bottom bar
  haElem.drawer.style.display = "none";
}




// first change the header to be at the bottom
haElem.appHeader.style.bottom = 0;
haElem.appHeader.style.top = "auto";

// add some height
haElem.root.querySelector('app-toolbar').style.height = "6em";

// make the buttons centered
haElem.tabsContent.style.display = 'flex';
haElem.tabsContent.style.width = '100%';


if( !haElem.hass.user.is_admin || ADMIN_OVERRIDE ) {
  //remove edit button
  haElem.appHeader.querySelector('ha-button-menu').remove();
}

// add shadow style
haElem.root.querySelector('app-toolbar').style.background = 'linear-gradient(0deg, rgba(247,247,248,1) 0%, rgba(247,247,248,1) 93%, rgba(211,211,217,1) 100%)';


// loop through all buttons to add text
for (var i = 0; i < haElem.tabs.length; i++) {
    let svg;

    // create style for button text
    let style = document.createElement('style');
        style.innerHTML = 'span, div{font-family: Exo, Roboto, Noto, sans-serif;font-size: 1.8em;font-weight: 600;color: #1b7974;padding: .6em;}' +
        'div{padding-top: 2.8em;}' +
        'ha-svg-icon{width: 4em;height: 4.3em;color: #34364c;}';

    // simple solution
    // if tab doesn't have an icon continue to the next element
    try {
        svg = haElem.tabs[i].querySelector('ha-icon').shadowRoot.querySelector('ha-svg-icon');
        // append style to the icon combo
        svg.appendChild( style );
    }
    catch(err){
        // append style to div element
        haElem.tabs[i].shadowRoot.appendChild( style );
        continue;
    }

    // Get title from the icon
    let title = haElem.tabs[i].querySelector('ha-icon').getAttribute('title');

    // Create span for the button title
    let span = document.createElement('span');
        span.appendChild( document.createTextNode( title ) );

    let br = document.createElement('br');

    svg.parentNode.insertBefore(span, svg.nextSibling);
    svg.parentNode.insertBefore(br, svg.nextSibling);

    // center the text
    haElem.tabs[i].querySelector('ha-icon').style.textAlign = 'center';
}


// fix scroll isues
haElem.root.querySelector('#view').style.minHeight = '';




// Create new header

// Baked CSS
let style = document.createElement('style');
    style.innerHTML = 'div#customHeader{background-color:#34364c;position:fixed;top:0;left:var(--app-drawer-width, 256px);right:0;height:3.3em;z-index:100}div#customHeaderClock{font-size:2em;color:#fff;font-weight:700;margin-top:.13em;margin-left:1em;font-family:Roboto;position:absolute;line-height:initial}div#customHeaderDate{font-size:1.2em;color:#f3f3f3;font-weight:700;margin-top:.8em;margin-left:7.4em;font-family:Exo, Roboto, Noto, sans-serif;position:absolute}div#customHeaderAlert{font-size:1.2em;color:#fff;font-weight:500;margin-top:.8em;margin-left:13.6em;font-family:Exo, Roboto, Noto, sans-serif;position:absolute;height:1.2em;overflow:visible;width:64vw;border-left:.15em #1f8984 solid;padding-left:1em}div#customHeaderAlert .message{animation:swing-in-top-fwd .5s cubic-bezier(.175,.885,.32,1.275) both;margin-left:2.8em}#customHeaderMenu{cursor: pointer;font-size: 1.2em;margin-top: .8em;position: relative;height: 1.2em;width: 2em;border-left: .15em #1f8984 solid;padding-left: .6em;float: right;color: white;}#alertIcon svg {fill: #fff;height: 1.5em;display: none;}#alertIcon svg.alert {display: block;}div#alertIcon {position: absolute;margin-top: 0em;}';

    style.innerHTML += '\n#customHeaderPopup{display:none;position: absolute;margin-top: 26vh;background-color: #f7f7f8;width: 36vh;height: 26vh;margin-left: auto;margin-right: auto;left: 0;right: 0;box-shadow: 0px 6px 14px -8px #888888ad;border-radius: .4em;border: 1px #e9e9e9 solid;overflow: hidden;}#customHeaderPopup .close{width: 2em;height: 2em;position: absolute;margin-left: 32vh;margin-top: .4em;cursor: pointer;}#customHeaderPopup svg{fill: #218984;}#customHeaderPopup .title{font-family: Exo, Roboto, Noto, sans-serif;font-size: 1.2em;font-weight: 700;color: #f7f7f8;padding: .6em 1em;width: calc( 36vh - 2em );background-color: #34364c;}#customHeaderPopup .message{padding: 1em;}#customHeaderPopup .dismis{position: absolute;width: 5em;top: 21vh;background-color: #218984;margin-left: auto;margin-right: auto;left: 0;right: 0;border-radius: .6em;color: #f7f7f8;font-family: Exo, Roboto, Noto, sans-serif;font-size: 1em;font-weight: 700;padding: .3em;text-align: center;cursor: pointer;}#alertIcon .circle {display:none;border: #34364c 2px solid;position: absolute;width: 1.6em;height: 1.5em;border-radius: 2em;background-color: #ffffff;top: -.6em;color: #34364c;padding: .1em 0em 0em 0em;font-size: .7em;text-align: center;left: 1.3em;font-weight: 700;}';

    style.innerHTML += `div#customHeaderDropdown {
      position: absolute;
      width: 28vw;
      padding-top: 5px;
      border-radius: 3px;
      border: 1px solid #d8d9e4;
      top: 3.6em;
      background-color: #ffffff;
      left: 17em;
      display: none;
    }

    div#customHeaderDropdown::before,
    div#customHeaderDropdown::after {
    	content: '\\0020';
    	display: block;
    	position: absolute;
    	top: -10px;
    	left: 60px;
    	z-index: 2;
    	width: 0;
    	height: 0;
    	overflow: hidden;
    	border: solid 10px transparent;
    	border-top: 0;
    	border-bottom-color: #ffffff;
    }

    div#customHeaderDropdown::before {
    	top: -11px;
    	z-index: 1;
    	border-bottom-color: #d8d9e4;
    }

    div#customHeaderDropdownContainer {
      min-height: 16vh;
      max-height: 28vh;
      overflow-y: scroll;
      position: relative;
      padding: 0px 5px 0px 5px;
    }

    div#customHeaderDropdownContainer::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    div#customHeaderDropdownContainer::-webkit-scrollbar-track {
      border-radius: 10px;
      background: rgba(0,0,0,0.1);
    }
    div#customHeaderDropdownContainer::-webkit-scrollbar-thumb{
      border-radius: 10px;
      background: rgba(0,0,0,0.2);
    }
    div#customHeaderDropdownContainer::-webkit-scrollbar-thumb:hover{
    	background: rgba(0,0,0,0.4);
    }
    div#customHeaderDropdownContainer::-webkit-scrollbar-thumb:active{
    	background: rgba(0,0,0,.9);
    }

    div#customHeaderDropdown .message {
      width: calc( 100% - 0.4em );
      overflow: hidden;
      font-family: Exo, Roboto, Noto, sans-serif;
      border-radius: 2px;
      padding: 0.2em;
      cursor: pointer;
      margin-bottom: .2em;
    }

    div#customHeaderDropdown .message:hover {
      background-color: #ebebeb;
    }

    div#customHeaderDropdown svg {
      width: 2.8em;
      position: absolute;
      fill: #34364c;
    }

    div#customHeaderDropdown .title {
      font-size: 1.2em;
      font-weight: 700;
      color: #218984;
      margin-left: 3.5rem;
      margin-top: .2rem;
      max-height: 2.8em;
      word-wrap: break-word;
      overflow: hidden;
    }

    div#customHeaderDropdown .text {
      font-size: 1em;
      font-weight: 100;
      color: #34364c;
      margin-left: 3.5rem;
      max-height: 7em;
      overflow: hidden;
      word-wrap: break-word;
      margin-bottom: .3em;
      display: none;
    }

    div#customHeaderDropdown .time {
      font-size: .8em;
      font-weight: 100;
      color: #5a5c6f;
      margin-left: 3.5rem;
    }

    div#customHeaderDropdownClear {
      border-top: #d8d9e4 1px solid;
      text-align: center;
      padding: 1em;
      font-family: Exo, Roboto, Noto, sans-serif;
      font-weight: 700;
      color: #5a5c6f;
      cursor: pointer;
    }

    div#customHeaderDropdownClear:hover {
      background-color: #f5f9f9;
    }

    div#customHeaderDropdownClear:active {
      color: #34364c;
    }

    div#customHeaderDropdown .clear {
      font-size: 1em;
      font-weight: 700;
      float: right;
      color: #b92028;
      margin-right: 1em;
      display: none;
    }
    `;


    /* ----------------------------------------------
     * Generated by Animista on 2021-1-28 21:6:54
     * Licensed under FreeBSD License.
     * See http://animista.net/license for more info.
     * w: http://animista.net, t: @cssanimista
     * ---------------------------------------------- */

     style.innerHTML += '@-webkit-keyframes swing-in-top-fwd {  0% {-webkit-transform: rotateX(-100deg);transform: rotateX(-100deg);-webkit-transform-origin: top;transform-origin: top;opacity: 0;  }  100% {-webkit-transform: rotateX(0deg);transform: rotateX(0deg);-webkit-transform-origin: top;transform-origin: top;opacity: 1;  }}@keyframes swing-in-top-fwd {  0% {-webkit-transform: rotateX(-100deg);transform: rotateX(-100deg);-webkit-transform-origin: top;transform-origin: top;opacity: 0;  }  100% {-webkit-transform: rotateX(0deg);transform: rotateX(0deg);-webkit-transform-origin: top;transform-origin: top;opacity: 1;  }}';

haElem.main.appendChild( style );


// header div
let newHeader = document.createElement('div');
    newHeader.id = 'customHeader';

    let clock = document.createElement('div');
        clock.id = 'customHeaderClock';

    let date = document.createElement('div');
        date.id = 'customHeaderDate';

    let alert = document.createElement('div');
        alert.id = 'customHeaderAlert';

    let menu = document.createElement('div');
        menu.id = 'customHeaderMenu';

    newHeader.appendChild( clock );
    newHeader.appendChild( date );
    newHeader.appendChild( alert );
    newHeader.appendChild( menu );

haElem.main.appendChild( newHeader );


// create icons for the alerts
let alertIcon = document.createElement('div');
    alertIcon.id = 'alertIcon';

    alertIcon.innerHTML = '<svg class="event" viewBox="0 0 24 24"><path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21" /></svg><div class="circle"></div>';

alert.appendChild( alertIcon );

// add icon to menu
menu.innerHTML = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M21,15.61L19.59,17L14.58,12L19.59,7L21,8.39L17.44,12L21,15.61M3,6H16V8H3V6M3,13V11H13V13H3M3,18V16H16V18H3Z" /></svg>';

// click event to reapear the menu
menu.onclick = function(){
  if( haElem.drawer.style.display == 'none'){
    haElem.homeAssistant.shadowRoot.querySelector("home-assistant-main").style.setProperty("--app-drawer-width", drawer_width+'px');
    haElem.drawer.style.display = "block";
  }
  else{
    haElem.homeAssistant.shadowRoot.querySelector("home-assistant-main").style.setProperty("--app-drawer-width", 0);
    haElem.drawer.style.display = "none";
  }
};


const time = clock;
const date_t = date;

function showCurrentTime() {
    let date = new Date();
    let hr = date.getHours().pad(2);
    let min = date.getMinutes().pad(2);
    let date_n = date.getDate();
    let month = date.toLocaleString('default', { month: 'long' });

    time.textContent = hr+':'+min;

    date_t.textContent = date_n+' '+month;
}

showCurrentTime();

setInterval(showCurrentTime, 1000);




/**
 * Class for messages
 *
 * Reads persistent_notification and displays it
 */


function multi_sort(valuePath, array){
  let path = valuePath.split('.')

  return array.sort((a, b) => {
     return getValue(b,path) -  getValue(a,path)
  });

  function getValue(obj, path){
    path.forEach(path => obj = obj[path])
    return obj;
  }
}

class ALERTS {

  constructor(headerLoc) {

    this._alertBox = headerLoc.querySelector('#customHeaderAlert');

    this._alerts = [];

    this.currentid = null;

    this._interval = null;

  }

  init () {

    //this._clear();
    this._spawnDropdown()

    this._loop()

    //this._spawnPopup()

    this._interval = setInterval(this._loop.bind(this), 1000);

  }

  time_ago(time) {
    //https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site

    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    ];
    var seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;

    if (seconds == 0) {
      return 'Just now'
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    var i = 0,
      format;
    while (format = time_formats[i++])
      if (seconds < format[0]) {
        if (typeof format[2] == 'string')
          return format[list_choice];
        else
          return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
      }
    return time;
  }

  _spawnDropdown () {
    this._dropdown = document.createElement('div');
        this._dropdown.id = 'customHeaderDropdown';

      let container = document.createElement('div');
          container.id = 'customHeaderDropdownContainer';

    let clear = document.createElement('div');
        clear.id = 'customHeaderDropdownClear';
        clear.innerText = 'Clear all notifications';

        // activate clear all messages
        clear.addEventListener('click', ()=>{
          this._dropdown.style.display = 'none';

          for (var i = this._alerts.length - 1; i >= 0; i--) {
            this._removeMessage( this._alerts[i]['id'].replace('persistent_notification.','') );
          }
        });

    this._dropdown.appendChild( container );
    this._dropdown.appendChild( clear );

    haElem.main.querySelector('#customHeader').appendChild( this._dropdown );
  }

  showDropdown () {
    let container = this._dropdown.querySelector('#customHeaderDropdownContainer');

    // clear contents
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }

    // loop through messages
    for (var i = this._alerts.length - 1; i >= 0; i--) {

      let message = document.createElement('div');
        message.className = 'message';
        message.setAttribute("messageid", this._alerts[i]['id'].replace('persistent_notification.',''));

        message.innerHTML = '<svg viewBox="0 0 24 24"><path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>';

        let title = document.createElement('div');
          title.className = 'title';
          title.innerText = this._alerts[i]['title'];

        let text = document.createElement('div');
          text.className = 'text';
          text.innerText = this._alerts[i]['message'];

        let clear = document.createElement('div');
          clear.className = 'clear';
          clear.innerText = 'Remove';

        let time = document.createElement('div');
          time.className = 'time';
          time.innerText = this.time_ago( this._alerts[i]['time'] );

        message.appendChild( title );
        message.appendChild( text );
        message.appendChild( clear );
        message.appendChild( time );

      // add message to dropdown
      container.appendChild( message );

      // create event listener to expand content
      message.addEventListener('click', ()=>{
        text.style.display = text.style.display === 'block' ? 'none' : 'block';
        clear.style.display = clear.style.display === 'block' ? 'none' : 'block';
      });

      let msgID = this._alerts[i]['id'].replace('persistent_notification.','');
      // create remove action
      clear.addEventListener('click', ()=>{
        message.remove();
        this._removeMessage( msgID );

        // yeah I know confusing
        // It's because of the array update delay
        if( this._alerts.length < 2 ){
          this._dropdown.style.display = 'none';
        }

      });
    }

    // make visible
    this._dropdown.style.display = 'block';
  }

  _spawnPopup () {
    this._popup = document.createElement('div');
        this._popup.id = 'customHeaderPopup';

    haElem.main.querySelector('#customHeader').appendChild( this._popup );

    // create popup elements
    let popupClose = document.createElement('div');
        popupClose.className = 'close';
        popupClose.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z"></path></svg>'

    let popupTitle = document.createElement('div');
        popupTitle.className = 'title';

    let popupMessage = document.createElement('div');
        popupMessage.className = 'message';

    let popupDismis = document.createElement('div');
        popupDismis.className = 'dismis';
        popupDismis.innerHTML = 'Dismiss';

    this._popup.appendChild( popupClose );
    this._popup.appendChild( popupTitle );
    this._popup.appendChild( popupMessage );
    this._popup.appendChild( popupDismis );

    popupClose.addEventListener('click', ()=>{
      this._popup.style.display = 'none';
    });

    popupDismis.addEventListener('click', ()=>{
      this._popup.style.display = 'none';

      this._removeMessage( popupDismis.getAttribute("messageid") );
    });
  }

  showPopup (msg) {
    this._popup.getElementsByClassName('title')[0].innerHTML = msg['title'];
    this._popup.getElementsByClassName('message')[0].innerHTML = msg['message'];

    this._popup.getElementsByClassName('dismis')[0].setAttribute("messageid", msg['id'].replace('persistent_notification.',''));

    this._popup.style.display = 'block';
  }

  _currentMessages () {

    let keyID = 'persistent_notification.';

    let HASS = getHass().states;

    let messages = [];

    for (var key in HASS) {
      if ( key.includes( keyID ) ) {
        let partKey = key.substr( keyID.length );

        let id = HASS[key]['entity_id'];//HASS[key]['context']['id'];
        let title = HASS[key]['attributes']['title'];
        let message = HASS[key]['attributes']['message'];
        let prio = new Date( HASS[key]['last_changed'] ).getTime();

        messages.push({'id': id, 'type': 'event', 'priority': prio, 'time': prio, 'title': title, 'message': message});
      }
    }

    this._alerts = multi_sort('priority', messages).reverse()

    return this._alerts;
  }

  _loop () {

    this._alertBox.getElementsByClassName('circle')[0].innerHTML = this._alerts.length;

    this._currentMessages();

    if(this._alerts.length < 1 && this._current){
      this._clear();
      this._current = null;
    }

    if(this._alerts.length < 1){
      return null;
    }

    if(this._current != this._alerts[0].id && this._current){
      this._show(0);
    }

    if(!this._current){
      this._show(0);
    }

  }

  _show(id){

    console.log(this._alerts.length);

    this._clear();

    this._alertBox.getElementsByClassName( this._alerts[id].type )[0].style.display = 'block';

    this._alertBox.getElementsByClassName('circle')[0].style.display = 'block';

    this._alertBox.getElementsByClassName('circle')[0].innerHTML = this._alerts.length;

    var messageDIV = document.createElement('div');
      messageDIV.className = 'message';

      messageDIV.innerText = this._alerts[id].title;

      messageDIV.setAttribute("messageID", id);

    this._alertBox.appendChild( messageDIV );

    this._current = this._alerts[id].id;

    messageDIV.addEventListener('click', ()=>{
      if(this._dropdown.style.display === 'block'){
        this._dropdown.style.display = 'none';
      }
      else{
        this.showDropdown();
      }
    });

  }

  _clear () {
    var messages = this._alertBox.getElementsByClassName('message');

    while(messages.length > 0){
      messages[0].parentNode.removeChild(messages[0]);
    }

    var icons = this._alertBox.getElementsByTagName('svg');

    for (var i = 0; i < icons.length; i++) {
      icons[i].style.display = 'none';
    }

    this._alertBox.getElementsByClassName('circle')[0].style.display = 'none';
  }

  _removeMessage (id) {
    let HASS = getHass();
    HASS.callService("persistent_notification", "dismiss", {notification_id: id});
  }

  showMessage (id) {

  }


  clear() {
    this._alerts = [];
    this._current = null;
    this._clear();
  }

}


let alerts = new ALERTS(haElem.main);
alerts.init();
