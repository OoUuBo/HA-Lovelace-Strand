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
    style.innerHTML = 'div#customHeader{background-color:#34364c;position:absolute;top:0;left:0;right:0;height:3.3em;z-index:100}div#customHeaderClock{font-size:2em;color:#fff;font-weight:700;margin-top:.13em;margin-left:1em;font-family:Roboto;position:absolute;line-height:initial}div#customHeaderDate{font-size:1.2em;color:#f3f3f3;font-weight:700;margin-top:.8em;margin-left:7.4em;font-family:Roboto,Quicksand;position:absolute}div#customHeaderAlert{font-size:1.2em;color:#fff;font-weight:500;margin-top:.8em;margin-left:13.6em;font-family:Quicksand;position:absolute;height:1.2em;overflow:hidden;width:64vw;border-left:.15em #1f8984 solid;padding-left:1em}div#customHeaderAlert .message{animation:swing-in-top-fwd .5s cubic-bezier(.175,.885,.32,1.275) both;margin-left:1.6em}#customHeaderMenu{font-size: 1.2em;margin-top: .8em;position: relative;height: 1.2em;width: 2em;border-left: .15em #1f8984 solid;padding-left: .6em;float: right;color: white;}';

haElem.appLayout.appendChild( style );


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

haElem.appLayout.appendChild( newHeader );

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
