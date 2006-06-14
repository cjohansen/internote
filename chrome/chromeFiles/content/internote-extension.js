// Internote Chrome Javascript
// 2006 - Tim Horton

var stickiesCount = 0;

var stickiesPreviousURL = "";
var internoteDisabled = false;
var inloading = false;
var currentPage; // store the current URL in case it's special (with a regex in it!)
var currentPageMatch;
var stickyUrls = new Array();

var CSI;

function getHighestNoteOrder()
{
	var currentCount = stickiesCount;
	var maxOrder = 0;
    
    var i;
    for(i = 0; i < currentCount; i++)
    {
        if(document.getElementById("stickies-stickynote" + i))
        {
        	var newZ = parseInt(document.getElementById("stickies-stickynote" + i).style.zIndex,10);
        	if(newZ > maxOrder) maxOrder = newZ;
        }
    }
    return maxOrder;
}

function newSticky()
{
	if(getBrowser().getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex).contentWindow.location.href == "about:blank") return;
	
	saveOneSticky();
	getHighestNoteOrder();
	
	if(internoteDisabled)
	{
		var doReenable = confirm(document.getElementById('internote-strings').getString("ReenableInternote"));
		
		if(doReenable)
		{
			disableInternote();
		}
	}
	
	var notePos = internotePreferences.getDefaultPosition();
	var noteLeft = 0;
	var noteTop = 0;
	
	switch(notePos)
	{
		case(notePos="0"): // Top Left
			noteLeft += 1;
			noteTop += 1;
			
			noteLeft += (stickiesCount * 5);
			noteTop += (stickiesCount * 5);
	
			break;
		case(notePos="1"): // Top Right
			noteLeft += (window.innerWidth - 150 - 1);
			noteTop += 1;
			
			noteLeft -= (stickiesCount * 5);
			noteTop += (stickiesCount * 5);
	
			break;
		case(notePos="2"): // Bottom Left
			noteLeft += 1;
			noteTop += (window.innerHeight - 233 - 1);
			
			noteLeft += (stickiesCount * 5);
			noteTop -= (stickiesCount * 5);
			
			break;
		case(notePos="3"): // Bottom Right
			noteLeft += (window.innerWidth - 150 - 1);
			noteTop += (window.innerHeight - 233 - 1);
			
			noteLeft -= (stickiesCount * 5);
			noteTop -= (stickiesCount * 5);
	
			break;
		case(notePos="4"): // Centered
			noteLeft += ((window.innerWidth / 2) - (150 / 2) - 1);
			noteTop += ((window.innerHeight / 2) - (233 / 2) - 1);
			
			noteLeft += (stickiesCount * 5);
			noteTop += (stickiesCount * 5);
	
			break;
	}
	
	var noteSize = internotePreferences.getDefaultSize();
	var noteWidth = 0;
	var noteHeight = 0;
	
	switch(noteSize)
	{
		case(noteSize="0"): // Tiny
			noteWidth = 150;
			noteHeight = 100;
			break;
		case(noteSize="1"): // Normal
			noteWidth = 150;
			noteHeight = 150;
			break;
		case(noteSize="2"): // Large
			noteWidth = 200;
			noteHeight = 250;
			break;
		case(noteSize="3"): // Giant
			noteWidth = 350;
			noteHeight = 350;
			break;
	}
	
	noteTop += getBrowser().getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex).contentWindow.scrollY;
	
    newStickyWithContents("", noteLeft + "px",noteTop + "px",noteWidth + "px",noteHeight + "px", internotePreferences.getDefaultColor(), internotePreferences.getDefaultTextColor(), 1);
}

function newStickyWithContents(stickytext, stickyleft, stickytop, stickywidth, stickyheight, stickycolor, stickytextcolor, dosave, sct)
{
	if(internoteDisabled) return;
	
	stickytop = (parseInt(stickytop,  10) + document.getElementById("content").browsers.item(0).boxObject.y - getBrowser().getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex).contentWindow.scrollY) + "px";
	
    var myBody = document.getElementById("main-window");
    
    var useScrollbar = internotePreferences.getScrollbar();
    
    var stickyhighlightable = internotePreferences.getDefaultHighlightable();
    
    var mainDiv = document.createElementNS("http://www.w3.org/1999/xhtml","html:div");
    mainDiv.setAttribute("style", "overflow: hidden; width: " + stickywidth + "; height: " + stickyheight + "; position: fixed; top: " + stickytop + "; left: " + stickyleft + "; z-index: " + (getHighestNoteOrder() + 1) + "; font-weight: normal; font-size: 12pt; color: black; opacity: 0; display: none;");
    mainDiv.addEventListener("mousedown", stickiesStartDrag, false);
    mainDiv.setAttribute("id", "stickies-stickynote" + stickiesCount);
    
    var svgObject = document.createElementNS("http://www.w3.org/1999/xhtml","html:canvas");
    svgObject.setAttribute("style", "width: 100%; height:100%;");
    svgObject.setAttribute("width", "400px");
    svgObject.setAttribute("height", "400px");
    svgObject.setAttribute("id", "stickies-drawingsurface" + stickiesCount);
    mainDiv.appendChild(svgObject);
    
    var mainForm = document.createElementNS("http://www.w3.org/1999/xhtml", "html:form");
    mainForm.setAttribute("style", "padding: 9px 8px; position: relative; top: -100%; background-color: transparent;");
    mainForm.setAttribute("name", "stickiesnoteform" + stickiesCount);
    
    var specialHeight = parseInt(stickyheight, 10);
    
    var mainTextArea = document.createElementNS("http://www.w3.org/1999/xhtml", "html:textarea");
    var textAreaStyle = "border: 1px none black; background: inherit; color: " + stickytextcolor + "; font-family: helvetica, sans-serif; font-size: " + internotePreferences.getFontSize() + "pt; width: 100%; height: " + (specialHeight - 19) + "px; ";

    if(!useScrollbar)
    	textAreaStyle += "overflow: hidden;";
    
    mainTextArea.setAttribute("style", textAreaStyle);
    mainTextArea.setAttribute("name", "stickiesnote");
    mainTextArea.setAttribute("id", "stickies-notetext" + stickiesCount);
    mainTextArea.setAttribute("wrap", "yes");
    mainTextArea.setAttribute("autocomplete", "off");
    mainTextArea.setAttribute("oninput", "saveOneSticky()");
    mainTextArea.setAttribute("timeout", "250");
    mainTextArea.setAttribute("type", "timed");
    var stickyTextData = document.createTextNode(stickytext);
    mainTextArea.appendChild(stickyTextData);
    mainForm.appendChild(mainTextArea);
    
    var hiddenColorValue = document.createElementNS("http://www.w3.org/1999/xhtml", "html:input");
    hiddenColorValue.setAttribute("type", "hidden");
    hiddenColorValue.setAttribute("value", stickycolor);
    hiddenColorValue.setAttribute("name", "stickiescolor");
    hiddenColorValue.setAttribute("id", "stickies-color");
    mainForm.appendChild(hiddenColorValue);
    
    var hiddenFlipValue = document.createElementNS("http://www.w3.org/1999/xhtml", "html:input");
    hiddenFlipValue.setAttribute("type", "hidden");
    hiddenFlipValue.setAttribute("value", "0");
    hiddenFlipValue.setAttribute("name", "stickiesflipped");
    hiddenFlipValue.setAttribute("id", "stickies-flipped");
    mainForm.appendChild(hiddenFlipValue);
    
    var hiddenDims = document.createElementNS("http://www.w3.org/1999/xhtml", "html:input");
    hiddenDims.setAttribute("type", "hidden");
    hiddenDims.setAttribute("value", "0");
    hiddenDims.setAttribute("name", "stickiesdims");
    hiddenDims.setAttribute("id", "stickies-dims");
    mainForm.appendChild(hiddenDims);
    
    var hiddenSct = document.createElementNS("http://www.w3.org/1999/xhtml", "html:input");
    hiddenSct.setAttribute("type", "hidden");
    hiddenSct.setAttribute("value", sct);
    hiddenSct.setAttribute("name", "stickiescount");
    hiddenSct.setAttribute("id", "stickies-count");
    mainForm.appendChild(hiddenSct);      
    
    mainDiv.appendChild(mainForm); 

    var closeDiv = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
    closeDiv.setAttribute("style", "width: 15px; height: 15px; position: absolute; top: 0px; right: 0px; cursor: crosshair;");
    closeDiv.setAttribute("id", "stickies-close" + stickiesCount);
    mainDiv.appendChild(closeDiv);
    
    /*var shadeDiv = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
    shadeDiv.setAttribute("style", "width: 15px; height: 15px; position: absolute; top: 0px; right: 17px; cursor: s-resize;");
    shadeDiv.setAttribute("id", "stickies-shade" + stickiesCount);
    mainDiv.appendChild(shadeDiv);*/
    
    var resizeDiv = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
    resizeDiv.setAttribute("style", "width: 15px; height: 15px; position: absolute; bottom: 0px; right: 0px; cursor:se-resize; z-index: 1005;");
    resizeDiv.setAttribute("id", "stickies-resize" + stickiesCount);
    mainDiv.appendChild(resizeDiv);
    
    var flipDiv = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
    flipDiv.setAttribute("style", "width: 15px; height: 15px; position: absolute; bottom: 0px; left: 0px; cursor: pointer;");
    flipDiv.setAttribute("id", "stickies-flip" + stickiesCount);
    mainDiv.appendChild(flipDiv);
    
    if(stickyhighlightable)
    {
    	var widthDoubleSide = parseInt(stickywidth, 10) - 32;
    	var widthSingleSide = parseInt(stickywidth, 10) - 16;
    	
    	var heightDoubleSide = parseInt(stickyheight, 10) - 32;
    	var heightSingleSide = parseInt(stickyheight, 10) - 16;
    	
    	// must adjust these for different sizes
	    var leftMoveDiv = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
	    leftMoveDiv.setAttribute("style", "width: 7px; height: " + heightSingleSide + "px; position: absolute; top: 0px; left: 0px; cursor: move;");
	    leftMoveDiv.setAttribute("id", "stickies-left" + stickiesCount);
	    mainDiv.appendChild(leftMoveDiv);
	    
	    var rightMoveDiv = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
	    rightMoveDiv.setAttribute("style", "width: 7px; height: " + heightDoubleSide + "px; position: absolute; top: 16px; right: 0px; cursor: move;");
	    rightMoveDiv.setAttribute("id", "stickies-right" + stickiesCount);
	    mainDiv.appendChild(rightMoveDiv);
	    
	    var topMoveDiv = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
	    topMoveDiv.setAttribute("style", "width: " + widthSingleSide + "px; height: 7px; position: absolute; top: 0px; left: 0px; cursor: move;");
	    topMoveDiv.setAttribute("id", "stickies-top" + stickiesCount);
	    mainDiv.appendChild(topMoveDiv);
	    
	    var bottomMoveDiv = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
	    bottomMoveDiv.setAttribute("style", "width: " + widthDoubleSide + "px; height: 7px; position: absolute; bottom: 0px; left: 16px; cursor: move;");
	    bottomMoveDiv.setAttribute("id", "stickies-bottom" + stickiesCount);
	    mainDiv.appendChild(bottomMoveDiv);
	}

    myBody.appendChild(mainDiv);
        
    stickiesCount++;
    
 	updateStickyCount();
    
    if(dosave)
    	saveOneSticky();
    
    internoteAnimation.stickiesInitializeNote(mainDiv);
}

function updateStickyCount()
{
	var stickycount = 0;
    for(var i = 0; i < stickiesCount; i++)
    {
        if(document.getElementById("stickies-stickynote" + i))
        {
	    	stickycount++;
	    }
    }
    
    if(stickycount == 1)
    	document.getElementById("internote-popup-label").value = stickycount + " Internote";
    else
    	document.getElementById("internote-popup-label").value = stickycount + " Internotes";
}

function stickiesNSLocalFile(path)
{
    const LOCALFILE_CTRID = "@mozilla.org/file/local;1";
    const nsILocalFile = Components.interfaces.nsILocalFile;

    var localFile = Components.classes[LOCALFILE_CTRID].createInstance(nsILocalFile);
    localFile.initWithPath(path);
    return localFile;
}

function removeIndexes(oldURL)
{
	var newURL = oldURL;
	newURL = newURL.replace(/(index|home|default)\.(html|htm|asp|php|cgi|cfm|aspx)$/i, "");
	newURL = newURL.replace(/\/$/, "");
	return newURL;
}

function saveOneSticky()
{
	if(internoteDisabled) return;
	
    var chromedir = Components.classes["@mozilla.org/file/directory_service;1"].createInstance(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsIFile).path;
    
    if(chromedir.match(/\\/))
        chromedir += "\\";
    else
        chromedir += "/";
        
    // make sure chrome directory exists - if not, create it!
    var chromedirtest = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	chromedirtest.initWithPath(chromedir);
	if (!chromedirtest.exists())
		chromedirtest.create(0x01, 0666);
	
	var streamt = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
	var siStream = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
	
	var inputdata = "";
	
	if(stickiesNSLocalFile(chromedir + "stickies").exists)
	{
		try
		{
			streamt.init(stickiesNSLocalFile(chromedir + "stickies"), 0x01, 0, 0);
			siStream.init(streamt);
			inputdata = siStream.read(-1);
			streamt.close;
		}
		catch(e)
		{
		}
	}
    
    var browser = gBrowser.getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex);
    
    var ds = document;
    var dsw = browser.contentWindow;
        
    var currentCount = stickiesCount;
    
    if(currentPage == "" || !currentPage)
    	currentPage = removeIndexes(dsw.location.href);
    	
   	if(currentPageMatch == "" || !currentPageMatch)
		currentPageMatch = removeIndexes(dsw.location.href).replace(/[^a-zA-Z0-9]/g, "") + "$";
    	
   	//inputdata.replace("/" + currentPage + "[^\n]*\n/g", "");
   	//alert(inputdata);
   	
   	var inputArray = inputdata.split("\n");
   	inputdata = "";
   	
   	/*for (var line in inputArray)
   	{
   		var cline = inputArray[line];
   		//alert(currentPage + "\n\n\n" + cline);
   		if(cline.indexOf(currentPage + "`") == -1)
   			inputdata += cline + "\n";
   	}*/
   	
   	for (var line in inputArray)
   	{
   		var cline = inputArray[line];
   		var curl = removeIndexes(cline.split("`")[0]).replace(/[^a-zA-Z0-9]/g, "");
//alert(curl + "\n\n\n" + currentPageMatch);
   		if(!curl.match(currentPageMatch))
   		{
   			inputdata += cline + "\n";
   		}
	}

//alert(inputdata);
   	
   	if(inputdata == "\n")
   		inputdata = "";
   		
    //alert(inputdata);
    
    var i;
    var stickiesString = '';
    for(i = 0; i < currentCount; i++)
    {
        if(ds.getElementById("stickies-stickynote" + i))
        {
            var myText = ds.getElementById("stickies-stickynote" + i).getElementsByTagName("textarea").item(0).value;
            var newStickyText = myText.replace(/`/g, "'");
            newStickyText = newStickyText.replace(/\n/g, "<br>");
            var myLeft = ds.getElementById("stickies-stickynote" + i).style.left;
            var myTop = (parseInt((ds.getElementById("stickies-stickynote" + i).style.top), 10) - (document.getElementById("content").browsers.item(0).boxObject.y) + dsw.scrollY) + "px";
            var myWidth = ds.getElementById("stickies-stickynote" + i).style.width;
            var myHeight = ds.getElementById("stickies-stickynote" + i).style.height;
            var myColor = ds.getElementById("stickies-stickynote" + i).getElementsByTagName("input").item(0).value;
            var myTextColor = ds.getElementById("stickies-stickynote" + i).getElementsByTagName("textarea").item(0).style.color;
            var myUrl = (stickyUrls[parseInt(ds.getElementById("stickies-stickynote" + i).getElementsByTagName('input').item(3).value, 10)]);
//alert(myText);
            if(!myUrl || myUrl == "")
            {
				myUrl = removeIndexes(dsw.location.href);
				stickiesString += myUrl + "`" + newStickyText + "`" + myLeft + "`" + myTop + "`" + myWidth + "`" + myHeight + "`" + myColor + "`" + myTextColor;
			}
			else
			{
				if(myUrl.indexOf(".*") != -1)
					stickiesString = myUrl + "`" + newStickyText + "`" + myLeft + "`" + myTop + "`" + myWidth + "`" + myHeight + "`" + myColor + "`" + myTextColor + "\n" + stickiesString;
				else
            		stickiesString += myUrl + "`" + newStickyText + "`" + myLeft + "`" + myTop + "`" + myWidth + "`" + myHeight + "`" + myColor + "`" + myTextColor;
            }
            
            // we don't want to add a newline on to the last element, so... don't!
            if(!(i == currentCount-1))
                stickiesString += "\n";
        }
    }
    
    // remove blank lines
    var outputArray = stickiesString.split("\n");
   	var outputdata = "";
   	
   	for (var line in outputArray)
   	{
   		var cline = outputArray[line];
   		if(cline != "")
   			outputdata += cline + "\n";
   	}
   	        
    var stream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
    
    var convstream = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);

    var localfile = stickiesNSLocalFile(chromedir + "stickies");
    stream.init(localfile, 0x02 | 0x08 | 0x20, 0664, 0);
	convstream.init(stream, "UTF8", 0, 0x0000);
    convstream.writeString(inputdata + outputdata);
    convstream.close();
    stream.close();

    stickiesDataArray = new Array();
    
    return;
}

var stickiesDataArray;

function setupLoadedStickies()
{
	if(stickiesDataArray)
	{
	    for (var line in stickiesDataArray)
	    {
	        if(stickiesDataArray[line])
	        {
	            var attributeArray = stickiesDataArray[line].split("`");
	            stickyUrls[line] = (attributeArray[0]);
	            // fix newline characters
	            attributeArray[1] = attributeArray[1].replace(/<br>/g, "\n");
	            newStickyWithContents(attributeArray[1], attributeArray[2], attributeArray[3], attributeArray[4], attributeArray[5], attributeArray[6], attributeArray[7], 0, line);
	        }
	    }
	}
	
    stickiesDataArray = new Array();
    inloading=false;
}

function loadStickies(newLocation)
{
	if(internoteDisabled) return;
	
	var browser = gBrowser.getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex);
    
    var ds = document;
    var dsw = browser.contentWindow;
    
	if(inloading) return;
	inloading = true;
	
    stickiesDataArray = new Array();
    
    var chromedir = Components.classes['@mozilla.org/file/directory_service;1'].createInstance(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsIFile).path;
    
    var chromedirtest = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	chromedirtest.initWithPath(chromedir);
	if (!chromedirtest.exists())
		chromedirtest.create(0x01, 0666);
    
    if(chromedir.match(/\\/))
        chromedir += "\\";
    else
        chromedir += "/";
    
	var i = 0;
		
	var entries = stickiesNSLocalFile(chromedir).directoryEntries;
	//while(entries.hasMoreElements())
	{
		var entry = stickiesNSLocalFile(chromedir + "stickies");
		entry.QueryInterface(Components.interfaces.nsIFile);
		//if(entry.path.match(/stickies$/))
		{
			var localfile = stickiesNSLocalFile(entry.path);
			
			if(localfile.exists())
		    {
		    	var stream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
     
    			//var siStream = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
    			
    			var siStream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);

    
				stream.init(localfile, 0x01, 0, 0);
				//siStream.init(stream);
				siStream.init(stream, "UTF8", 1024, Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
				//var data = siStream.read(-1);
				var data = "";
				
				var str = {};
				while (siStream.readString(4096, str) != 0)
				{
					data += str.value;
				}
				
				var splitstickies = data.split("\n");
				currentPage = "";
				
				for (var ssi in splitstickies)
				{
					var newloc = removeIndexes(newLocation);
					//alert(splitstickies[ssi]);
					var stickyloc = splitstickies[ssi].split("`")[0];
					if(stickyloc != "")
					{
						var cleansloc = stickyloc;
						var matchall = (stickyloc.match(/\.\*/)) ? true : false;
						if(matchall)
							stickyloc = stickyloc.replace(/[^a-zA-Z0-9]/g, "") + ".*";
						else
							stickyloc = stickyloc.replace(/[^a-zA-Z0-9]/g, "") + "$";
						newloc = newloc.replace(/[^a-zA-Z0-9]/g, "");
						
						//alert(newloc + "\n\n\n" + stickyloc);			
						if(newloc.match(stickyloc))// || (cleansloc.(/[^a-zA-Z0-9]/g, "") == newLocation.replace(/[^a-zA-Z0-9]/g, "")))
						{
							//currentFile = entry.path;
							currentPage = cleansloc;
							currentPageMatch = stickyloc;
						}
						
						if(currentPage == "" || !currentPage)
	    					currentPage = removeIndexes(dsw.location.href);
	    					
	    				if(currentPageMatch == "" || !currentPageMatch)
	    					currentPageMatch = removeIndexes(dsw.location.href).replace(/[^a-zA-Z0-9]/g, "") + "$";
	    	
						//alert("CurrentPage: " + currentPage);
					}
				}
				//alert("CPM: " + currentPageMatch);
				keepLoadingStickies(localfile, newLocation);
				//}
				
				siStream.close();
				stream.close();
			}
		}
	}    
    return;
}

function keepLoadingStickies(localfile, myurl)
{   
	var stream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
     
    //var siStream = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
    
    var siStream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);

   
    var data = '';
    if(localfile.exists())
    {
	    stream.init(localfile, 0x01, 0, 0);
	    siStream.init(stream, "UTF8", 1024, Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
	    data = "";
				
		var str = {};
		while (siStream.readString(4096, str) != 0)
		{
			data += str.value;
		}
	    
	    var splitstickies = data.split("\n");
	    data = "";
	    
	    for (var line in splitstickies)
	   	{
	   		var cline = splitstickies[line];
	   		var curl = removeIndexes(cline.split("`")[0]).replace(/[^a-zA-Z0-9]/g, "");
	   		
	   		var stickyloc = cline.split("`")[0];

	   		var matchall = (stickyloc.match(/\.\*/)) ? true : false;
			if(matchall)
				stickyloc = stickyloc.replace(/[^a-zA-Z0-9]/g, "") + ".*";
			else
				stickyloc = stickyloc.replace(/[^a-zA-Z0-9]/g, "") + "$";
			
	   		var my2url = removeIndexes(myurl).replace(/[^a-zA-Z0-9]/g, "");
	   		
	   		if(my2url.match(stickyloc))
	   		{
	   			data += cline + "\n";
	   		}
	   	}
	    
	    siStream.close();
	    stream.close();
	    
	    if(internotePreferences.detectFirstRun())
	    {
   			data = data + myurl + "`" + document.getElementById('internote-strings').getString("WelcomeNote");
   		}
   	}
   	else
   	{
   		if(internotePreferences.detectFirstRun())
   			data = myurl + "`" + document.getElementById('internote-strings').getString("WelcomeNote");
   		else
   			return;
   	}
   	
   	stickiesDataArray = data.split("\n");
        
    return;
}

function clearAllNotes()
{
	 var currentCount = stickiesCount;
    
    var i;
    var stickiesString = '';
    for(i = 0; i < currentCount; i++)
    {
        if(document.getElementById("stickies-stickynote" + i))
        {
        	var currentNote = document.getElementById("stickies-stickynote" + i);
        	currentNote.parentNode.removeChild(currentNote);
        }
    }
    
    stickiesCount = 0;
    
    document.getElementById("internote-popup-label").value = "0 Internotes";
}

function stickiesInsertContents(e)
{
	var browser = getBrowser().getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex);
	
	window.clearInterval(CSI);
    clearAllNotes();

    if(browser.contentWindow.location.href != "about:blank")
    {
    	currentPage = "";
    	currentPageMatch = "";
    	stickyUrls = new Array();
		loadStickies(browser.contentWindow.location.href);
	
	    stickiesCount = 0;
	    setupLoadedStickies();
	    stickiesCurrentScroll = gBrowser.getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex).contentWindow.scrollY;
	    CSI = window.setInterval("checkScroll()", 10);
	}
	else
	{
		var currentCount = stickiesCount;
    
    	var i;
    	var stickiesString = '';
    	for(i = 0; i < currentCount; i++)
    	{
    		var stickyElement = document.getElementById("stickies-stickynote" + i);
    		stickiesDraw(stickyElement);
    	}
	}
	
	stickiesUpdateAll(0);
    
    stickiesPreviousURL = browser.contentWindow.location.href;
}

function disableInternote()
{
	internoteDisabled = !internoteDisabled;
	if(internoteDisabled)
	{
		clearAllNotes();
		document.getElementById("internote-disable-label").label = document.getElementById('internote-strings').getString("EnableInternote");
	}
	else
	{
		stickiesInsertContents(null);
		document.getElementById("internote-disable-label").label = document.getElementById('internote-strings').getString("DisableInternote");
	}
}

function getPlatform()
{
	var platform = new String(navigator.platform);
	var platsring = "";
	if(!platform.search(/^Mac/)) 
	   platsring = "mac";
	else if(!platform.search(/^Win/))
	   platsring = "win";
	else 
	   platsring = "unix";
	
	return platsring; 
}

var stickiesCurrentScroll;

function stickiesUpdateAll(difference)
{
	var currentCount = stickiesCount;
    
    var i;
    var stickiesString = '';
    for(i = 0; i < currentCount; i++)
    {
    	var stickyElement = document.getElementById("stickies-stickynote" + i);
        if(stickyElement)
		{
			var newLoc = (parseInt(stickyElement.style.top,  10) + difference);

			if(newLoc < document.getElementById("content").browsers.item(0).boxObject.y || (newLoc + parseInt(stickyElement.style.height,  10))  >= (document.getElementById("content").browsers.item(0).boxObject.y + document.getElementById("content").browsers.item(0).boxObject.height))
				stickyElement.style.display = "none";
			else
				stickyElement.style.display = "";

			stickyElement.style.top = newLoc + "px";
		}
	}
}

function checkScroll()
{
	var newScrollPos = gBrowser.getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex).contentWindow.scrollY;

	if(stickiesCurrentScroll != newScrollPos)
	{
		stickiesUpdateAll((stickiesCurrentScroll - newScrollPos));
		stickiesCurrentScroll = newScrollPos;
	}
}

window.addEventListener("load", function()
{
	var platform = getPlatform();
	var dss = document.styleSheets;
	
	if(platform == "mac")
	{
		for(var i=0; i<dss.length; ++i)
		{
			if(dss[i].href=="chrome://internote/skin/overlay.css")
				dss[i].disabled = true;
			else if(dss[i].href=="chrome://internote/skin/overlay_mac.css")
				dss[i].disabled = false;
		}   
	}
	else
	{
		for(var i=0; i<dss.length; ++i){
		
			if(dss[i].href=="chrome://internote/skin/overlay_mac.css")
				dss[i].disabled = true;
			else if(dss[i].href=="chrome://internote/skin/overlay.css")
				dss[i].disabled = false;
		}
	}
	
	updateAllNotes();
	
	if(!internotePreferences.getUseStatusbar())
	{
		document.getElementById("internote-panel").parentNode.removeChild(document.getElementById("internote-panel"));
	}

    getBrowser().addProgressListener(gMyBrowserProgressListener, Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);
    
    var container = gBrowser.mPanelContainer;
	container.addEventListener("select", stickiesInsertContents, false);
    
}, false);

addEventListener("pageshow", stickiesCheckInsertContents, false);
getBrowser().mTabContainer.addEventListener("DOMNodeRemoved", stickiesInsertContentsTab, true);

function stickiesInsertContentsTab(event)
{
	if(event.target.localName != "tab")
		return;
	stickiesInsertContents;
}

function stickiesCheckInsertContents()
{
	if(stickiesCount == 0)
		stickiesInsertContents(null);
	/*else
	{
		var currentCount = stickiesCount;
    
    	var i;
    	var stickiesString = '';
    	for(i = 0; i < currentCount; i++)
    	{
    		var stickyElement = document.getElementById("stickies-stickynote" + i);
    		stickiesDraw(stickyElement);
    	}
	}*/
}

var gMyBrowserProgressListener = {
    QueryInterface : function(aIID) {
        if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
            aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
            aIID.equals(Components.interfaces.nsISupports))
                return this;
        throw Components.results.NS_NOINTERFACE;
    },
    
    onLocationChange : function(a,b,c)
    {
    	if(stickiesPreviousURL != c.spec.toString())
    	{
    		clearAllNotes();
    		setTimeout("stickiesCheckInsertContents()", 500);
    	}
    },

    onStateChange : function(a,b,c,d){},
    onProgressChange : function(a,b,c,d,e,f){},
    onStatusChange : function(a,b,c,d){},
    onSecurityChange : function(a,b,c){},
    onLinkIconAvailable : function(a){}
};

function updateAllNotes()
{
	var chromedir = Components.classes["@mozilla.org/file/directory_service;1"].createInstance(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsIFile).path;
    
    if(chromedir.match(/\\/))
        chromedir += "\\";
    else
        chromedir += "/";
        
    // make sure chrome directory exists - if not, create it!
    var chromedirtest = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	chromedirtest.initWithPath(chromedir);
	if (!chromedirtest.exists())
		chromedirtest.create(0x01, 0666);
		
	var totaldata = "";
		
	var entries = stickiesNSLocalFile(chromedir).directoryEntries;
	while(entries.hasMoreElements())
	{
		var streamt = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
		var siStream = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
	
		var entry = entries.getNext();
		entry.QueryInterface(Components.interfaces.nsIFile);
		if(entry.path.match(/stickies.+/))
		{
			var stickyfile = entry;
			if(stickyfile.exists)
			{
				var inputdata = "";
				try
				{
					streamt.init(stickyfile, 0x01, 0, 0);
					siStream.init(streamt);
					inputdata = siStream.read(-1);
					siStream.close();
					streamt.close();
				}
				catch(e)
				{
				}
				var inparray = inputdata.split("\n");
				var curl;
				for(var line in inparray)
				{
					var cline = inparray[line];
					if(line == 0)
						curl = cline;
					else
						totaldata += curl + "`" + cline + "\n";
				}
				entry.remove(false);
			}
		}
	}
	
	var streamt = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
	var siStream = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
	
	var inputdata = "";
	
	if(stickiesNSLocalFile(chromedir + "stickies").exists)
	{
		try
		{
			streamt.init(stickiesNSLocalFile(chromedir + "stickies"), 0x01, 0, 0);
			siStream.init(streamt);
			inputdata = siStream.read(-1);
			streamt.close;
		}
		catch(e)
		{
		}
	}
	
	totaldata += inputdata;
		
	if(totaldata != "")
    {
        var stream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);

        var localfile = stickiesNSLocalFile(chromedir + "stickies");
        stream.init(localfile, 0x02 | 0x08 | 0x20, 0664, 0);
        stream.write(totaldata, totaldata.length);
        stream.close();
    }
    
    return;
}