// Internote Manager Javascript
// 2006 - Tim Horton

function entryBoxHandleUpdate()
{
	setTimeout('internoteManager.updateCurrent()', 50);
}

var internoteManager = {

nyi : function ()
{
	alert("Feature Not Yet Implemented.");
},

stickiesBackgroundColorSwabs : new Array("#FFFF99", "#FF9956", "#57BCD9", "#B0FF56", "#CB98FF", "#ECE5FC"),
stickiesTextColorSwabs : new Array("#000000", "#7F5300", "#00FF00", "#FF0000", "#ADADAD", "#FFFFFF"),

stickiesData : new Array(),
searchMapping : new Array(),

convertHexToCSS : function(color)
{
    color = color.replace(/#(.*)/, "$1")
    var colorone = color.replace(/(..).*/, "$1");
    var colortwo = color.replace(/..(..).*/, "$1");
    var colorthree = color.replace(/....(..).*/, "$1");

    return "rgb(" + parseInt(colorone, 16) + ", " + parseInt(colortwo, 16) + ", " + parseInt(colorthree, 16) + ")";
},

initInternoteManager : function ()
{
	document.getElementById("colorEntryBox").addEventListener("ValueChange", entryBoxHandleUpdate, false);
	document.getElementById("textColorEntryBox").addEventListener("ValueChange", entryBoxHandleUpdate, false);
	
    var chromedir = internoteUtilities.getSaveDirectory();
    
	var entry = internoteUtilities.createNSLocalFile(chromedir + "stickies");
	this.loadStickies(entry.path);
	this.setupLoadedStickies();
	
	var i = 0;
		
	var makeVD = "this.treeView.visibleData = [";
	var lastURL = "";
	while(this.stickiesData[i])
	{
		this.stickiesData[i][8] = this.stickiesData[i][0].replace(/^[a-zA-Z]*:\/\//g, "");
		if(this.stickiesData[i][8] != lastURL)
			makeVD += "[\"" + this.stickiesData[i][8] + "\", true, false, " + i + "],";
		
		lastURL = this.stickiesData[i][8];
		i++;
	}
	makeVD = makeVD.substring(0, makeVD.length-1);
	makeVD += "];";

	eval(makeVD);
	
	this.treeView.urldata = this.treeView.visibleData;
	
	i = 0;
	var makeCD = "this.treeView.childData = {";
	lastURL = "";
	while(this.stickiesData[i])
	{
		if(this.stickiesData[i][8] != lastURL)
		{
			if(lastURL != "")
				makeCD += "],";
			makeCD += "\"" + this.stickiesData[i][8] + "\": [" + i;
		}
		else
		{
			makeCD += "," + i;
		}
		
		lastURL = this.stickiesData[i][8];
		i++;
	}
	makeCD += "]};";
	
	eval(makeCD);
	
	document.getElementById("elementList").view = this.treeView;
},

stickiesDataArray : "",

setupLoadedStickies : function ()
{
    if(this.stickiesDataArray)
    {
        for (var line in this.stickiesDataArray)
        {
        	var stickyURL;
            if(this.stickiesDataArray[line])
            {
                var attributeArray = this.stickiesDataArray[line].split("`");
                
                // fix newline characters
                attributeArray[1] = attributeArray[1].replace(/<br>/g, "\n");
                
                this.stickiesData.push(attributeArray);
            }
        }
    }
    this.stickiesDataArray = new Array();
},

onDialogAccept : function ()
{
	this.saveAllStickies();
	
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
	var enumerator = wm.getEnumerator("navigator:browser");
	while(enumerator.hasMoreElements())
	{
		var win = enumerator.getNext();
		win.disableInternote();
		win.disableInternote();
	}
},

removeIndexes : function(oldURL)
{
	var newURL = oldURL;
	newURL = newURL.replace(/(index|home|default)\.(html|htm|asp|php|cgi|cfm|aspx)$/i, "");
	newURL = newURL.replace(/\/$/, "");
	return newURL;
},

saveAllStickies : function ()
{	
	var chromedir = internoteUtilities.getSaveDirectory();
    internoteUtilities.saveStringToFilename(this.generateStringOfNotes(), chromedir + "stickies");
},

loadStickies : function(newLocation)
{
	this.stickiesDataArray = new Array();
	    
    if(internoteUtilities.createNSLocalFile(newLocation).exists())
	    var data = internoteUtilities.readStringFromFilename(newLocation);
   	else
   		return false;
    
    this.stickiesDataArray = data.split("\n");
        
    return true;
},

loadData : function ()
{
	var currentIndex = document.getElementById("elementList").currentIndex;
	
	var dIsContainer = this.treeView.isContainer(currentIndex);
	
	if(!dIsContainer && !((currentIndex < 0) || (!this.treeView.visibleData[currentIndex])))
	{
		var noteIndex = this.treeView.visibleData[currentIndex][3];
		document.getElementById("noteText").value = this.stickiesData[noteIndex][1];
		document.getElementById("noteURL").value = this.stickiesData[noteIndex][0];
		document.getElementById("colorEntryBox").value = this.stickiesBackgroundColorSwabs.indexOf(this.stickiesData[noteIndex][6]);
		
		for(var i = 0; i < this.stickiesTextColorSwabs.length; i++)
		if(this.convertHexToCSS(this.stickiesTextColorSwabs[i]) == this.stickiesData[noteIndex][7])
			document.getElementById("textColorEntryBox").value = i;
		
		document.getElementById("noteText").removeAttribute("disabled");
		document.getElementById("noteURL").removeAttribute("disabled");
		document.getElementById("colorEntryBox").removeAttribute("disabled");
		document.getElementById("textColorEntryBox").removeAttribute("disabled");
		document.getElementById("deleteNote").removeAttribute("disabled");
		document.getElementById("resetNoteLoc").removeAttribute("disabled");
	}
	else
	{
		document.getElementById("noteText").value = "";
		document.getElementById("noteURL").value = "";
		document.getElementById("colorEntryBox").value = 0;
		document.getElementById("textColorEntryBox").value = 0;
		
		document.getElementById("noteText").setAttribute("disabled", "true");
		document.getElementById("noteURL").setAttribute("disabled", "true");
		document.getElementById("colorEntryBox").setAttribute("disabled", "true");
		document.getElementById("textColorEntryBox").setAttribute("disabled", "true");
		document.getElementById("deleteNote").setAttribute("disabled", "true");
		document.getElementById("resetNoteLoc").setAttribute("disabled", "true");
	}
	
	if(dIsContainer)
	{
		if(!this.treeView.isContainerOpen(currentIndex))
			this.treeView.toggleOpenState(currentIndex);
		if(!this.treeView.isContainer(currentIndex + 1))
		{
			this.treeView.selection.timedSelect(currentIndex + 1, 1000);
		}
	}
},

loadSearchData : function ()
{
	var currentIndex = document.getElementById("resultsList").currentIndex;
	var noteIndex = this.searchMapping[currentIndex];
	
	if(this.stickiesData[noteIndex])
	{
		document.getElementById("noteText").value = this.stickiesData[noteIndex][1];
		document.getElementById("noteURL").value = this.stickiesData[noteIndex][0];
		document.getElementById("colorEntryBox").value = this.stickiesBackgroundColorSwabs.indexOf(this.stickiesData[noteIndex][6]);
		
		for(var i = 0; i < this.stickiesTextColorSwabs.length; i++)
		if(this.convertHexToCSS(this.stickiesTextColorSwabs[i]) == this.stickiesData[noteIndex][7])
			document.getElementById("textColorEntryBox").value = i;
		
		document.getElementById("noteText").removeAttribute("disabled");
		document.getElementById("noteURL").removeAttribute("disabled");
		document.getElementById("colorEntryBox").removeAttribute("disabled");
		document.getElementById("textColorEntryBox").removeAttribute("disabled");
		document.getElementById("deleteNote").removeAttribute("disabled");
		document.getElementById("resetNoteLoc").removeAttribute("disabled");
	}
},

updateCurrent : function ()
{
	var noteUrlVal = document.getElementById("noteURL").value;
	var noteTextVal = document.getElementById("noteText").value;
	var noteColorVal = document.getElementById("colorEntryBox").value;
	var textColorVal = document.getElementById("textColorEntryBox").value;
	
	var currentIndex = document.getElementById("elementList").currentIndex;
	
	if((currentIndex < 0) || (!internoteManager.treeView.visibleData[currentIndex])) return;

	if(!internoteManager.treeView.isContainer(currentIndex))
	{
		var noteIndex = internoteManager.treeView.visibleData[currentIndex][3];
		
		internoteManager.stickiesData[noteIndex][1] = noteTextVal;
		internoteManager.stickiesData[noteIndex][6] = internoteManager.stickiesBackgroundColorSwabs[noteColorVal];
		internoteManager.stickiesData[noteIndex][7] = internoteManager.convertHexToCSS(internoteManager.stickiesTextColorSwabs[textColorVal]);
		internoteManager.stickiesData[noteIndex][0] = noteUrlVal;
		
		internoteManager.treeView.visibleData[currentIndex][0] = noteTextVal;
		internoteManager.treeView.treeBox.invalidate();
	}
},

deleteNote : function ()
{
	if(this.treeView.isContainer(currentIndex)) return;
	
	var totalnum = 0;
	var start = new Object();
	var end = new Object();
	var numRanges = this.treeView.selection.getRangeCount();
	
	var openNotes = new Array();
	
	for (var t=0; t<numRanges; t++)
	{
		this.treeView.selection.getRangeAt(t,start,end);
		for (var v=start.value; v<=end.value; v++)
		{
			openNotes.push(v);
			totalnum++;
		}
	}
	
	var i;
	var num = 0;
	for(var i = 0; i < totalnum; i++)
	{
		var noteIndex = this.treeView.visibleData[openNotes[i] - num][3];
		var currentIndex = openNotes[i] - num;
		
		//alert(i-num);
		
		var childNotes = this.treeView.childData[this.treeView.visibleData[this.treeView.getParentIndex(currentIndex)][0]];
	
		for(cnote in childNotes)
		{
			if(childNotes[cnote])
				if(childNotes[cnote] == noteIndex)
					childNotes = childNotes.slice(0, cnote).concat(childNotes.slice(cnote+1));
		}
		
		this.treeView.childData[this.treeView.visibleData[this.treeView.getParentIndex(currentIndex)][0]] = childNotes;
		
		this.treeView.visibleData = this.treeView.visibleData.slice(0, currentIndex).concat(this.treeView.visibleData.slice(currentIndex+1));
		this.treeView.treeBox.rowCountChanged(currentIndex, -1);
		
		this.checkForOrphans();
		this.stickiesData[noteIndex] = null;
		num++;
	}
	this.loadData();
	return;
},

resetNoteLocation : function ()
{
	if(this.treeView.isContainer(currentIndex)) return;
	
	var currentIndex = document.getElementById("elementList").currentIndex;
	var noteIndex = this.treeView.visibleData[currentIndex][3];
	
	this.stickiesData[noteIndex][2] = 0;
	this.stickiesData[noteIndex][3] = 0;
	
	return;
},

checkForOrphans : function ()
{
	// check for containers with no children, and delete them!

	for(var currentIndex = 0; currentIndex <= this.treeView.visibleData.length; currentIndex++)
	{
		if(this.treeView.isContainer(currentIndex))
		{
			var isCNext = this.treeView.isContainer(currentIndex + 1);
			if(!isCNext) isCNext = false;
			
			if((isCNext || (currentIndex == this.treeView.visibleData.length - 1)) && this.treeView.isContainerOpen(currentIndex))
			{
				this.treeView.visibleData = this.treeView.visibleData.slice(0, currentIndex).concat(this.treeView.visibleData.slice(currentIndex+1));
				this.treeView.treeBox.rowCountChanged(currentIndex, -1);
			}
		}
	}
},

openURL : function ()
{
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
	var noteurl = document.getElementById("noteURL").value;
	var openInNewWindow = false;
	
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("browser.link.");
    if(prefs.getPrefType("open_external") !=0)
    {
        var bloe = prefs.getIntPref("open_external");
        if(bloe == 1) openInNewWindow = false;
        if(bloe == 2) openInNewWindow = true;
        if(bloe == 3) openInNewWindow = false;
    }
	
	if(noteurl)
	{
		noteurl = noteurl.replace(/\.\*$/, "");
		
		var recentWindow = wm.getMostRecentWindow("navigator:browser");
		if(recentWindow && !openInNewWindow)
		{
			recentWindow.delayedOpenTab(noteurl);
		}
		else
		{
			window.open(noteurl);
		}

		document.getElementById("internoteManager").acceptDialog();
	}
},

exportNotes : function ()
{
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Save Internote File", nsIFilePicker.modeSave);
	
	var res = fp.show();
	if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace)
	{
		internoteUtilities.saveStringToFilename(this.generateStringOfNotes(), fp.file.path);
	}
},

exportNotesHTML : function ()
{
	var noteHTML = this.generateHTMLOfNotes();
	
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Save HTML File", nsIFilePicker.modeSave);
	fp.defaultExtension = "html";
	fp.appendFilters(nsIFilePicker.filterHTML);
	
	var res = fp.show();
	if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace)
	{
		var fn = fp.file.path;
		if(!fn.match(/\.html^/))
			fn += ".html";
		
		internoteUtilities.saveStringToFilename(noteHTML, fn);
	}
},

exportNotesText : function ()
{
	var noteText = this.generateTextOfNotes();
	
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Save Text File", nsIFilePicker.modeSave);
	fp.defaultExtension = "txt";
	fp.appendFilters(nsIFilePicker.filterText);
	
	var res = fp.show();
	if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace)
	{
		var fn = fp.file.path;
		if(!fn.match(/\.txt^/))
			fn += ".txt";
		
		internoteUtilities.saveStringToFilename(noteText, fn);
	}
},

exportNotesBookmark : function ()
{
	var noteText = this.generateBookmarksOfNotes();
	
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Save Bookmark File", nsIFilePicker.modeSave);
	fp.defaultExtension = "html";
	fp.appendFilters(nsIFilePicker.filterHTML);
	
	var res = fp.show();
	if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace)
	{
		var fn = fp.file.path;
		if(!fn.match(/\.html^/))
			fn += ".html";
		
		internoteUtilities.saveStringToFilename(noteText, fn);
	}
},

printNotes : function ()
{
	this.generateHTMLOfNotes();
	
	var frame = document.getElementById("printbrowser").contentWindow;
	var req = frame.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
	var wbprint = req.getInterface(Components.interfaces.nsIWebBrowserPrint);
	var settings = PrintUtils.getPrintSettings();
	try
	{
		wbprint.print(settings, null);
	}
	catch(e)
	{
	}
},

updateSearchResults : function ()
{
	var searchTerm = document.getElementById("searchFilter").value;
	var searchResultsPane = document.getElementById("searchResultChildren");
	
	if(searchTerm != "")
		document.getElementById("resultsList").style.display = "";
	else
		document.getElementById("resultsList").style.display = "none";
	
	document.getElementById("noteText").value = "";
	document.getElementById("noteURL").value = "";
	document.getElementById("colorEntryBox").value = 0;
	document.getElementById("textColorEntryBox").value = 0;
	
	document.getElementById("noteText").setAttribute("disabled", "true");
	document.getElementById("noteURL").setAttribute("disabled", "true");
	document.getElementById("colorEntryBox").setAttribute("disabled", "true");
	document.getElementById("textColorEntryBox").setAttribute("disabled", "true");
	document.getElementById("deleteNote").setAttribute("disabled", "true");
	
	this.searchMapping = new Array();
	
	while(searchResultsPane.hasChildNodes())
	{
		searchResultsPane.removeChild(searchResultsPane.firstChild);
	}	
	
	for(sticky in this.stickiesData)
	{
		var localSticky = this.stickiesData[sticky];
		if(localSticky)
		{
			if(localSticky[1].toLowerCase().match(searchTerm.toLowerCase()))
			{
				var ti = document.createElement("treeitem");
				var tr = document.createElement("treerow");
				var tc = document.createElement("treecell");
				tc.setAttribute("label", localSticky[1]);
				tr.appendChild(tc);
				ti.appendChild(tr);
				searchResultsPane.appendChild(ti);
				this.searchMapping.push(sticky);
			}
		}
	}
},

generateHTMLOfNotes : function ()
{
	var myDoc = document.getElementById("printbrowser").contentDocument;
	
	myDoc.open();
	myDoc.close();
	
	myDoc.title="Internote";
	var notehtml = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:html");
	var notebody = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:body");
	var notediv = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:div");
	notediv.setAttribute("style", "width: 100%; font-family: sans-serif;");
	
	var bigtable;
	var wholetr;
	
	var curl = "";
	
	var start = new Object();
	var end = new Object();
	var numRanges = this.treeView.selection.getRangeCount();
	
	for (var t=0; t<numRanges; t++)
	{
		this.treeView.selection.getRangeAt(t,start,end);
		for (var v=start.value; v<=end.value; v++)
		{
			var sticky = this.treeView.visibleData[v][3];
			var localSticky = this.stickiesData[sticky];
			
			if(curl != localSticky[0])
			{
				if(curl != "")
				{
					notediv.appendChild(bigtable);
				}
				
				bigtable = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:div");
				bigtable.setAttribute("style", "border: 1px solid gray; padding: 15px; margin: 5px;");
				bigtable.setAttribute("width", "100%");
				wholetr = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:div");
				wholetr.setAttribute("style", "color: gray; margin-bottom: 10px; border-bottom: 1px dashed lightgray; font-size: 12px;");
				wholetr.appendChild(myDoc.createTextNode(localSticky[0]));
				wholetr.appendChild(myDoc.createElement("br"));
				bigtable.appendChild(wholetr);
			}
			
			curl = localSticky[0];
			
			if(localSticky)
			{
				var myStickyText = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:pre");
				myStickyText.setAttribute("style", "border-left: 3px solid " + localSticky[6] + "; padding: 5px 0px 5px 10px; margin-left: 10px; font-family: sans-serif sans;");
				myStickyText.appendChild(myDoc.createTextNode(localSticky[1]));
				bigtable.appendChild(myStickyText);
			}
		}
	}
	
	if(numRanges == 0)
	{
		for(sticky in this.stickiesData)
		{
			var localSticky = this.stickiesData[sticky];
			
			if(curl != localSticky[0])
			{
				if(curl != "")
				{
					notediv.appendChild(bigtable);
				}
				
				bigtable = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:div");
				bigtable.setAttribute("style", "border: 1px solid gray; padding: 15px; margin: 5px;");
				bigtable.setAttribute("width", "100%");
				wholetr = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:div");
				wholetr.setAttribute("style", "color: gray; margin-bottom: 10px; border-bottom: 1px dashed lightgray; font-size: 12px;");
				wholetr.appendChild(myDoc.createTextNode(localSticky[0]));
				wholetr.appendChild(myDoc.createElement("br"));
				bigtable.appendChild(wholetr);
			}
			
			curl = localSticky[0];
			
			if(localSticky)
			{
				var myStickyText = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:pre");
				myStickyText.setAttribute("style", "border-left: 3px solid " + localSticky[6] + "; padding: 5px 0px 5px 10px; margin-left: 10px; font-family: sans-serif sans;");
				myStickyText.appendChild(myDoc.createTextNode(localSticky[1]));
				bigtable.appendChild(myStickyText);
			}
		}
	}
	
	notediv.appendChild(bigtable);
	notebody.appendChild(notediv);
	notehtml.appendChild(notebody);
	myDoc.body.appendChild(notehtml);
	
	return myDoc.body.innerHTML;
},

generateStringOfNotes : function ()
{
	this.updateCurrent();
	
	var curl = "";
	var stickiesString = "";
	var sticky;
	
	for(sticky in this.stickiesData)
	{
		var localSticky = this.stickiesData[sticky];
		
		if(localSticky)
		{
			curl = localSticky[0];
		
			var newStickyText = localSticky[1].replace(/`/g, "'");
			newStickyText = newStickyText.replace(/\n/g, "<br>");
		
			var defaultNoteColor = localSticky[6];
			if(defaultNoteColor == "0") defaultNoteColor = "#FFFF99";
			if(defaultNoteColor == "1") defaultNoteColor = "#FF9956";
			if(defaultNoteColor == "2") defaultNoteColor = "#57BCD9";
			if(defaultNoteColor == "3") defaultNoteColor = "#B0FF56";
			if(defaultNoteColor == "4") defaultNoteColor = "#CB98FF";
			if(defaultNoteColor == "5") defaultNoteColor = "#ECE5FC";
			
			var defaultTextColor = localSticky[7];
			if(defaultTextColor == "0") defaultTextColor = "#000000";
			if(defaultTextColor == "1") defaultTextColor = "#7F5300";
			if(defaultTextColor == "2") defaultTextColor = "#00FF00";
			if(defaultTextColor == "3") defaultTextColor = "#FF0000";
			if(defaultTextColor == "4") defaultTextColor = "#ADADAD";
			if(defaultTextColor == "5") defaultTextColor = "#FFFFFF";
		
			stickiesString += curl + "`" + newStickyText + "`" + localSticky[2] + "`" + localSticky[3] + "`" + localSticky[4] + "`" + localSticky[5] + "`" + defaultNoteColor + "`" + defaultTextColor + "\n";
		}
	}
	
	return stickiesString;
},

generateTextOfNotes : function ()
{
	this.updateCurrent();
	
	var curl = "";
	var stickiesString = "";
	var sticky;
	
	for(sticky in this.stickiesData)
	{
		var localSticky = this.stickiesData[sticky];
		
		if(localSticky)
		{
			curl = localSticky[0];
		
			var newStickyText = localSticky[1].replace(/`/g, "'");
			newStickyText = newStickyText.replace(/\n/g, "<br>");
		
			stickiesString += curl + ": " + newStickyText + "\n";
		}
	}
	
	return stickiesString;
},

generateBookmarksOfNotes : function ()
{
	this.updateCurrent();
	
	var curl = "";
	var stickiesString = "<!DOCTYPE NETSCAPE-Bookmark-file-1>\n\t<HTML>\n\t<META HTTP-EQUIV='Content-Type' CONTENT='text/html; charset=UTF-8'>\n\t<Title>Bookmarks</Title>\n\t<H1>Bookmarks</H1>\n\t<DT><H3 FOLDED>Bookmarks</H3>\n\t<DL><p>\n";
	var sticky;
	
	for(sticky in this.stickiesData)
	{
		var localSticky = this.stickiesData[sticky];
		
		if(localSticky)
		{
			curl = localSticky[0];
		
			var newStickyText = localSticky[1].replace(/`/g, "'");
			newStickyText = newStickyText.replace(/\n/g, "<br>");
		
			stickiesString += "\t\t<DT><A HREF=\"" + curl + "\">" + newStickyText + "</A>\n";
		}
	}
	
	stickiesString += "\t</DL><p>\n</HTML>";
	
	return stickiesString;
},

treeView : {
  urldata: null,
  visibleData: null,
  childData: null,
  treeBox: null,
  selection: null,

  get rowCount()                     { return this.visibleData.length; },
  setTree: function(treeBox)         { this.treeBox = treeBox; },
  getCellText: function(idx, column) { return this.visibleData[idx][0]; },
  isContainer: function(idx)         { try {if(this.visibleData[idx]) return this.visibleData[idx][1]; else return false;} catch(e) {return false;} },
  isContainerOpen: function(idx)     { try {if(this.visibleData[idx]) return this.visibleData[idx][2]; else return false;} catch(e) {return false;} },
  isContainerEmpty: function(idx)    { return false; },
  isSeparator: function(idx)         { return false; },
  isSorted: function ()               { return false; },
  isEditable: function(idx, column)  { return false; },

  getParentIndex: function(idx) {
    if (this.isContainer(idx)) return -1;
    for (var t = idx - 1; t >= 0 ; t--) {
      if (this.isContainer(t)) return t;
    }
    return 0;
  },
  
  getLevel: function(idx) {
    if (this.isContainer(idx)) return 0;
    return 1;
  },
  hasNextSibling: function(idx, after) {
    var thisLevel = this.getLevel(idx);
    for (var t = idx + 1; t < this.visibleData.length; t++) {
      var nextLevel = this.getLevel(t)
      if (nextLevel == thisLevel) return true;
      else if (nextLevel < thisLevel) return false;
    }
    return false;
  },
  toggleOpenState: function(idx) {
    var item = this.visibleData[idx];
    if (!item[1]) return;

    if (item[2]) {
      item[2] = false;

      var thisLevel = this.getLevel(idx);
      var deletecount = 0;
      for (var t = idx + 1; t < this.visibleData.length; t++) {
        if (this.getLevel(t) > thisLevel) deletecount++;
        else break;
      }
      if (deletecount) {
        this.visibleData.splice(idx + 1, deletecount);
        this.treeBox.rowCountChanged(idx + 1, -deletecount);
      }
    }
    else {
      item[2] = true;

      var label = this.visibleData[idx][0];
      var toinsert = this.childData[label];
      for (var i = 0; i < toinsert.length; i++) {
        this.visibleData.splice(idx + i + 1, 0, [internoteManager.stickiesData[toinsert[i]][1], false, false, toinsert[i]]);
      }
      this.treeBox.rowCountChanged(idx + 1, toinsert.length);
    }
    this.treeBox.invalidate();
  },

  getImageSrc: function(idx, column) {},
  getProgressMode : function(idx,column) {},
  getCellValue: function(idx, column) {},
  cycleHeader: function(col, elem) {},
  selectionChanged: function () {},
  cycleCell: function(idx, column) {},
  performAction: function(action) {},
  performActionOnCell: function(action, index, column) {},
  getRowProperties: function(idx, column, prop) {},
  getCellProperties: function(idx, column, prop) {},
  getColumnProperties: function(column, element, prop) {}
}

};