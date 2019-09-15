//META{"name":"linePlugin"}*//

var linePlugin = function () {};
window.linePlugin = linePlugin

//don't change these. Used for css class referencing.
var LINE_ICON = "line-icon";                                 //The img element that holds the line icon
var LINE_ICON_DIV =  "line-icon-div";                        //The div the holds the line icon, placed beside the emoji selector icon

var STICKER_DIV = "LineSticker-div";                             //The div the holds the entire LineSticker system. Holds the tab area and LineSticker display area.
var STICKER_DIV_ACTIVE = "LineSticker-div-active";               //When the LineSticker div has this class, it becomes unhidden.

var STICKER_TAB_AREA = "LineSticker-tab-area";                   //Top-most div for the horizontal LineSticker tab selector.
var STICKER_TAB_AREA_LIST = "LineSticker-tab-area-list";         //List element that holds each LineSticker tab selector.
var STICKER_TAB_AREA_TOGGLE = "LineSticker-tab-area-toggle";     //Button which controls the expanding and contracting of the LineSticker tab area (not whole LineSticker div!)

var STICKER_DISPLAY_AREA = "LineSticker-display-area";           //Top-most div for the large display area that displays all stickers for a specific pack.
var STICKER_DISPLAY_AREA_LIST = "LineSticker-display-area-list";  //List element that holds each LineSticker in a specific pack.

var allJson;
var discordLocalStorage;

var dataDir;
var iconDiv;
var maxFrequentItems;
var settings;
var stickerDiv;
var stickerTabList;
var stickerDisplayList;

linePlugin.prototype.start = function () {
  // called after prototype.load function

  loadPackList(function(data) {
    allJson = JSON.parse(data);
    createLINE();
    waitForElementByClass("channel-textarea-inner", function(textarea)
    {
      addIconIfNeeded( $(textarea) );
    });
    waitForElementByClass("messages-wrapper", function(wrapper)
    {
      addStickerDivIfNeeded( $(wrapper) );
    });
  });
};

linePlugin.prototype.load = function () {
  // First function executed; perform all preliminary setup here

  // =========================================================================
  //                    Discord Authorization Token Code
  //    Reason: Retrieves Discord's hidden localStorage for token retrieval.
  //            See the displayStickerClicked method for usage information.
  // =========================================================================
  var iframeElement = document.createElement("iframe");
  document.body.appendChild(iframeElement);
  discordLocalStorage = iframeElement.contentWindow.localStorage;
  // =========================================================================

  // load custom stylesheet
  $('head').append('<link rel="stylesheet" type="text/css" href="https://jamescorsi.com/line/line_discord.css" />');

  // set location of dataDir via same function as BetterDiscordApp's core.js
  dataDir = (process.platform === 'win32' ? process.env.APPDATA : process.platform === 'darwin' ? process.env.HOME + "/Library/Preferences" : "/var/local") + '/BetterDiscord/plugins';

  var linePackPath = dataDir + '/' + 'LINE';
  createDirectory(linePackPath);

  settings = JSON.parse(getItem("line-settings"));

  if (settings == null) {
    setItem("line-settings", JSON.stringify(buildSettings(80, []), null, 2));
    settings = getItem("line-settings");
  }

  maxFrequentItems = getItem("line-frequently-used");

};

linePlugin.prototype.unload = function () {

};

linePlugin.prototype.stop = function () {
  var div = $("." + LINE_ICON_DIV);
  if (div.length) {
    div.remove();
  }
  div = $("." + STICKER_DIV)
  if (div.length) {
    div.remove();
  }
  console.log("[LineStickers] Plugin Disabled");
};

//called when a message is received
linePlugin.prototype.onMessage = function () {

};

//called when a server or channel is switched
linePlugin.prototype.onSwitch = function () {

};

//raw MutationObserver event for each mutation
linePlugin.prototype.observer = function (mutation) {
  var element;

  //If the textarea was mutated and if the textarea that was mutated WAS NOT an edit-textarea.
  // To check if it is an edit-textarea we check the grandparent of the nodeName
  //hierachy:  (child -> parent)
  element = $(mutation.target).find(".channel-textarea-inner");
  if (element.length
    //edit-container-inner -> channel-textarea -> channel-textarea-inner
    && !element.parent().parent().hasClass("edit-container-inner")
    //edit-conainer-inner -> channel-textarea -> comment -> inner -> upload-modal
    && !element.parent().parent().parent().parent().hasClass("upload-modal")) {
    addIconIfNeeded(element);
  }

  element = $(mutation.target).find(".messages-wrapper");
  if (element.length) {
    addStickerDivIfNeeded(element);
  }
};

linePlugin.prototype.getSettingsPanel = function () {
  var settings = JSON.parse(getItem("line-settings"));
  var html = "<h2>Settings Panel</h2><ul>";
  html += '<li><div class="settingsDesc">Number of recently used stickers:</div><div class="settingsPackDiv">' + settings['max-frequent-items'] + '</div></li>';

  var packs = settings['packs'];

  for (var pack = 0; pack < packs.length; pack++) {
    html += '<li><img class="dlPackIcon" src="' + packs[pack].icon + '" />';
    html += '<div class="settingsDesc">' + packs[pack].name + '</div><div class="settingsPackDiv">';
    html += '<input type="submit" value="Download" onclick="downloadAndSavePack(' + packs[pack].identifier + ')"></input>';
    html += '</div></li>';
  }
  html += '</ul>';

  html += '<input type="submit" value="Load all packs now" onclick="downloadAndSavePackList()"/>';

  return html;
};

linePlugin.prototype.getName = function () {
  return "LINE Stickers";
};

linePlugin.prototype.getDescription = function () {
  return "Plugin providing LINE stickers to send to chat!";
};

linePlugin.prototype.getVersion = function () {
  return "0.1.0";
};

linePlugin.prototype.getAuthor = function () {
  return "DV8FromTheWorld";
};

function waitForElementByClass(elementClass, callback) {
  var element = document.getElementsByClassName(elementClass);
  if(element.length == 0) {
    window.setTimeout(function() { waitForElementByClass(elementClass, callback); }, 100);
  } else {
    callback(element[0]);
  }
}

function waitForElementById(id, callback) {
  var element = document.getElementById(id);
  if(!element) {
    window.setTimeout(function() { waitForElementById(id, callback); }, 100);
  } else {
    callback(element);
  }
}

function addIconIfNeeded(textarea)
{
  //if the typing area is enabled and it no longer contains the LINE class
  if (!textarea.find("textarea").attr("disabled")
    && textarea.find("." + LINE_ICON_DIV).length == 0) {

    textarea.children().last().before(this.iconDiv);
  }
}

function addStickerDivIfNeeded(wrapper)
{
  if (wrapper.parent().find("." + STICKER_DIV).length == 0) {
    wrapper.first().after(stickerDiv);
  }
}



function loadStickers(id) {
  // Future location for loading LineSticker previews when a tab is clicked
  // also need to switch active window and pull content from cache
}

function toggleWindow() {
  var scroller = $(".messages-wrapper").find(".scroller-wrap").find(".scroller");

  if (stickerDiv.hasClass(STICKER_DIV_ACTIVE)) {
    //Hide the div.
    scroller.scrollTop(scroller.get(0).scrollTop - stickerDiv.get(0).clientHeight);
    stickerDiv.toggleClass(STICKER_DIV_ACTIVE);
  } else {
    //Show the div
    stickerDiv.toggleClass(STICKER_DIV_ACTIVE);
    scroller.scrollTop(scroller.get(0).scrollTop + stickerDiv.get(0).clientHeight);

  }

  $(document).ready( function() {
    $('.sprite-item').click( function() {
      if (stickerDiv.hasClass(STICKER_DIV_ACTIVE)) {
        scroller.scrollTop(scroller.get(0).scrollTop - stickerDiv.get(0).clientHeight);
        // stickerDiv.hide();
        stickerDiv.toggleClass(STICKER_DIV_ACTIVE);
      }
    });
  });
}

function loadPackList(successCallback) {
  $.ajax({
    type: "GET",
    url: "https://jamescorsi.com/line/v0/list.php",
    success: successCallback
  });
}

function loadPack(id, successCallback)
{
  $.ajax({
    type: "GET",
    url: "https://jamescorsi.com/line/v0/pack.php",
    data: {id: id},
    success: successCallback
  });
}

function createLINE()
{
  //Create the LINE icon that sits beside the emoji icon in the text-area.
  this.iconDiv = createDiv(LINE_ICON_DIV,
    createElementWithAttr("img", LINE_ICON,
      {
        "src": "https://i.imgur.com/oOpi6Q9.png",
        "onclick": "toggleWindow();"
      })
  );

  //Create the horizontal list of tab images used to select the different LineSticker tabs.
  this.stickerTabList =
    createElement("ul", STICKER_TAB_AREA_LIST,
      createStickerTab(0, "Frequently Used", "https://i.imgur.com/CvhIWAL.png").toggleClass("TabSelected"),
      (function() {
        var items = []
        for (var i = 0; i < allJson.length; i++) {
          stickerTab = createStickerTab(
            allJson[i].id,
            allJson[i].name,
            allJson[i].thumbnailImg);
          items.push(stickerTab);
        }
        return items;
      })()
    );

  //Create the display area that holds the selectable stickers. This is below the horizontal tab list.
  this.stickerDisplayList = createElement("ul", STICKER_DISPLAY_AREA_LIST);

  //Create the container system that holds the tab list along with the LineSticker display container.
  this.stickerDiv = createDiv(STICKER_DIV,
    createDiv(STICKER_TAB_AREA,
      createDiv("scroller-wrap fade light",
        createDiv("scroller LineSticker-tab-area-scroller",
          stickerTabList
        )
      ),
      createElement("button", STICKER_TAB_AREA_TOGGLE)
    ),
    createDiv(STICKER_DISPLAY_AREA,
      createDiv("scroller-wrap fade light",
        createDiv("scroller LineSticker-display-scroller",
          stickerDisplayList
        )
      )
    )
  );
}

function createStickerTab(id, name, imageLink) {
  var tab = createElementWithAttr("li", null, {"id": id},
    createElementWithAttr("button", "tab-button", {"type": "button", "title": name},
      createElementWithAttr("img", null, {"src": imageLink})
    )
  );
  tab.click(selectStickerTab);
  return tab;
}

function createStickerDisplay(id, imageLink) {
  var display = createElementWithAttr("li", null, {"id": id},
    createElementWithAttr("img", null, {"src": imageLink})
  );
  display.click(displayStickerClicked);
  return display;
}

function createDiv(className, ...children) {

  //We bind and apply because otherwise children would go from [] to  [[]] in withAttr
  return createElementWithAttr.bind(this, "div", className, null).apply(this, children);
}

function createElement(type, className, ...children) {

  //We bind and apply because otherwise children would go from [] to  [[]] in withAttr
  return createElementWithAttr.bind(this, type, className, null).apply(this, children);
}

function createElementWithAttr(type, className, attributes, ...children) {
  var element = document.createElement(type);

  className &&  element.setAttribute("class", className);

  //Convert from DOM element to a JQuery element.
  element = $(element);

  attributes && element.attr(attributes);

  if (children)
  {
    for (var i = 0; i < children.length; i++) {
      element.append(children[i]);
    }
  }

  return element;
}

/**
 * Used as a jquery event handler for the .click() event. Registered to Sticker Tab elements.
 * Changes from one LineSticker pack to another when a LineSticker tab is click.
 *
 * No parameters, however 'this' is bound to the DOM element that was clicked,
 * in this case, the LineSticker tab (<li><button><img> </img></button></li>)
 */
function selectStickerTab() {
  var element = this;                   //Store the DOM element so we can cache the LineSticker displays we create.
  var selectedTab = $(element);         //Change to jquery for ease of use.
  var tabs = stickerTabList.children(); //Get all LineSticker tabs, used to unselect them all before selecting the tab that was clicked.

  //Iterate through all LineSticker tabs, making sure they are all unselected.
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("TabSelected");
  }

  //Select the tab that was clicked.
  selectedTab.toggleClass("TabSelected");

  //Remove all the displayed stickers from the display list in preparation for displaying the
  //newly selected tab's stickers.
  stickerDisplayList.empty();

  //If the newly selected tab already has its display LineSticker cached, use those.
  if (element.stickers && element.stickers.length > 0)
  {
    var stickers = element.stickers;
    for (var i = 0; i < stickers.length; i++)
    {
      stickerDisplayList.append(stickers[i]);
    }
  }
  else //Otherwise, access the network, get the image urls, and build new display stickers. This is async!!
  {
    loadPack(selectedTab.attr('id'), function(json) {
      var pack = JSON.parse(json);
      var urls = pack.images;

      element.stickers = []; //Setup the array to cache the display stickers in for future use.
      for (var i = 0; i < urls.length; i++)
      {
        var url = urls[i];
        if (url.indexOf("main.png") < 0) //Allows all but the main.png
        {
          var sticker = createStickerDisplay("", urls[i]);

          //After creating the display LineSticker, add it to the display list AND add it to the LineSticker tab's cache for additional reuse.
          stickerDisplayList.append(sticker);
          element.stickers.push(sticker);
        }
      }
    });
  }
}

/**
 * Used as a jquery event handler for the .click() event. Registered to Sticker Display elements.
 * Uploads the selected LineSticker to the current channel.
 *
 * No parameters, however 'this' is bound to the DOM element that was clicked,
 * in this case, the display LineSticker (<li><img> </img><li>.
 */
function displayStickerClicked() {
  var imageElement = this.children[0];
  var selectedChannel = $(".channel.selected"); //This is actually an array!

  //If somehow this is 0, then do nothing. Can't send a file to a channel if we don't know what the channel is!
  if (!selectedChannel.length)
  {
    console.log("Did not find the selectedChannel when attempting to send LineSticker!");
    return;
  }

  selectedChannel = selectedChannel[0];          //Get the channel out of the array, should only ever be 1
  var link = selectedChannel.children[0].href;   //Get the href attribute of the selected channel.

  var channelIdRegex = /channels\/.*?\/([0-9]*)/g;
  var channelId = channelIdRegex.exec(link)[1]; //Runs the regex on the link, and gets the first capture group (index 0 is the entire string);

  link = "https://discordapp.com/api/channels/" + channelId + "/messages";

  var imageUrl = imageElement.src;
  var filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

  // ===============================================================================
  //                 Discord Authorization Token Usage: [BEGIN]
  //
  //            Reason: Token is used when sending message (file upload) to channel
  // ===============================================================================

  var token = discordLocalStorage.token;        //retrieve auth token from localStorage
  token = token.substring(1, token.length - 1); //token is wrapped in quotes (""), need to strip from ends.

  var request = require('request');
  request.get({url : imageUrl, encoding: null}, function(error, response, body) {
    var formData = new FormData();
    var blob = new Blob([new Uint8Array(body)], {type: "application/octet-stream"});
    formData.append("file", blob, filename);

    fetch(link, {
      method: 'POST',
      headers: {'Authorization': token},   //token is used to auth our upload.
      body: formData
    });
  });

  // ===============================================================================
  //                 Discord Authorization Token Usage: [End]
  // ===============================================================================
}


/**
 * Wrapper function for localStorage.setItem in case we don't use BD in the future
 *
 * @param key storage key
 * @param data data to be stored
 */
function setItem(key, data) {
  return localStorage.setItem(key, data);
}

/**
 * Wrapper function for localStorage.getItem in case we don't use BD in the future
 *
 * @param key storage key
 */
function getItem(key) {
  return localStorage.getItem(key);
}

function downloadAndSavePack(id){
  loadPack(id, function(data) {

    var json = JSON.parse(data);
    var packPath = dataDir + '/LINE/packs/' + id;

    createDirectory(packPath);

    var images = [];

    images.push(json['thumbnailImg']);
    images.push(json['previewImg']);

    for (var count = 0; count < json['images'].length; count++) {
      images.push(json['images'][count]);
    }

    for (var count = 0; count < images.length; count++) {
      downloadAndSaveFile(images[count], packPath)
    }

  });
}

/**
 * Helper function to pull remote file and save to desired path
 *
 * @param url the url to pull from remote
 * @param path the path in which to save the file
 */
function downloadAndSaveFile(url, path) {
  var fs = require('fs');
  var request = require('request');

  var splitURL = url.split('/');
  var filename = path + '/' + splitURL[splitURL.length - 1];

  request.get({url : url, encoding: 'binary'}, function(error, response, body) {
    fs.writeFile(filename, body, 'binary', function(error) {
      if (error) {
        console.log(error);
      }
    });
  });
}

function buildSettings(maxFrequentItems, packs) {
  return {
    "max-frequent-items" : maxFrequentItems,
    "packs" : packs
  }
}

/**
 * Utility function to ensure a directory and its parents are created.  Similar to
 * "mkdir -p {path}"
 *
 * @param path the path to be created
 */
function createDirectory(path) {
  var fs = require('fs');

  var pathsSplit = path.split('/');
  path = '';
  for (var count = 0; count < pathsSplit.length; count++) {
    path += pathsSplit[count] + '/';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }
}

function downloadAndSavePackList() {

  loadPackList(function(data) {
    var packList = JSON.parse(data);

    var packs = [];

    for (var entry = 0; entry < packList.length; entry++) {
      var pack = {};
      pack.name = packList[entry].name;
      pack.identifier = packList[entry].id;
      pack.count = 0;
      pack.icon = packList[entry].thumbnailImg;
      pack.enabled = false;
      packs.push(pack);
    }

    var lineSettings = buildSettings(settings['max-frequent-items'], packs);
    setItem("line-settings", JSON.stringify(lineSettings, null, 2));

    settings = JSON.parse(getItem('line-settings'));
    linePlugin.prototype.getSettingsPanel();

  });

}