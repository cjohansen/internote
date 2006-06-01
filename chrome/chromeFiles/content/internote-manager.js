// Internote Manager Javascript
// 2006 - Tim Horton

function entryBoxHandleUpdate()
{
	setTimeout('internoteManager.updateCurrent()', 50);
}

var internoteManager = {

nyi : function()
{
	alert("Feature Not Yet Implemented.");
},

stickiesBackgroundColorSwabs : new Array("#FFFF99", "#FF9956", "#57BCD9", "#B0FF56", "#CB98FF", "#ECE5FC"),
stickiesTextColorSwabs : new Array("#000000", "#7F5300", "#00FF00", "#FF0000", "#ADADAD", "#FFFFFF"),

stickiesData : new Array(),
filenameForURL : new Object(),
searchMapping : new Array(),

convertHexToCSS : function(color)
{
    color = color.replace(/#(.*)/, "$1")
    var colorone = color.replace(/(..).*/, "$1");
    var colortwo = color.replace(/..(..).*/, "$1");
    var colorthree = color.replace(/....(..).*/, "$1");

    return "rgb(" + parseInt(colorone, 16) + ", " + parseInt(colortwo, 16) + ", " + parseInt(colorthree, 16) + ")";
},

stickiesNSLocalFile : function(path)
{
    const LOCALFILE_CTRID = "@mozilla.org/file/local;1";
    const nsILocalFile = Components.interfaces.nsILocalFile;

    var localFile = Components.classes[LOCALFILE_CTRID].createInstance(nsILocalFile);
    localFile.initWithPath(path);
    return localFile;
},

initInternoteManager : function()
{
	document.getElementById("colorEntryBox").addEventListener("ValueChange", entryBoxHandleUpdate, false);
	document.getElementById("textColorEntryBox").addEventListener("ValueChange", entryBoxHandleUpdate, false);
	
    var chromedir = Components.classes['@mozilla.org/file/directory_service;1'].createInstance(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsIFile).path;
    
    var chromedirtest = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	chromedirtest.initWithPath(chromedir);
	if (!chromedirtest.exists())
		chromedirtest.create(0x01, 0666);
    
    if(chromedir.match(/\\/))
        chromedir += "\\";
    else
        chromedir += "/";
    
	var entry = this.stickiesNSLocalFile(chromedir + "stickies");
	this.loadStickies(entry.path);
	this.setupLoadedStickies();
	
	var i = 0;
		
	var makeVD = "this.treeView.visibleData = [";
	var lastURL = "";
	while(this.stickiesData[i])
	{
		this.stickiesData[i][8] = this.stickiesData[i][0].replace(/^[a-zA-Z]*:\/\//g, "");
		if(this.stickiesData[i][8] != lastURL)
		{
			makeVD += "[\"" + this.stickiesData[i][8] + "\", true, false, " + i + "],";
		}
		
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
			{
				makeCD += "],";
			}
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

setupLoadedStickies : function()
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

onDialogAccept : function()
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

saveAllStickies : function()
{
	this.updateCurrent();
	
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
	
	var stream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
   
    var convstream = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);

    var localfile = this.stickiesNSLocalFile(chromedir + "stickies");
    stream.init(localfile, 0x02 | 0x08 | 0x20, 0664, 0);
	convstream.init(stream, "UTF8", 0, 0x0000);
    convstream.writeString(stickiesString);
    convstream.close();
    stream.close();

},

loadStickies : function(newLocation)
{
	this.stickiesDataArray = new Array();
    //var stream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
     
    //var siStream = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
    
    var stream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
     
	//var siStream = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
	
	var siStream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
    
    var localfile = this.stickiesNSLocalFile(newLocation);
    
    if(localfile.exists())
    {
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
		siStream.close();
		stream.close();
   	}
   	else
   	{
   		return false;
   	}
    
    this.stickiesDataArray = data.split("\n");
        
    return true;
},

loadData : function()
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
},

loadSearchData : function()
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

updateCurrent : function()
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

deleteNote : function()
{
	if(this.treeView.isContainer(currentIndex)) return;
	
	var currentIndex = document.getElementById("elementList").currentIndex;
	var noteIndex = this.treeView.visibleData[currentIndex][3];
	
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
	this.loadData();
	return;
},

resetNoteLocation : function()
{
	if(this.treeView.isContainer(currentIndex)) return;
	
	var currentIndex = document.getElementById("elementList").currentIndex;
	var noteIndex = this.treeView.visibleData[currentIndex][3];
	
	this.stickiesData[noteIndex][2] = 0;
	this.stickiesData[noteIndex][3] = 0;
	
	return;
},

checkForOrphans : function()
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

openURL : function()
{
	var noteurl = document.getElementById("noteURL").value;
	
	if(noteurl)
	{
		noteurl = noteurl.replace(/\.\*$/, "");
		window.arguments[0].getBrowser().getBrowserAtIndex(window.arguments[0].getBrowser().mTabContainer.selectedIndex).loadURI(noteurl);
		document.getElementById("internoteManager").acceptDialog();
	}
},

printNotes : function()
{
	var myDoc = document.getElementById("printbrowser").contentDocument;
	myDoc.title="Internote";
	var notehtml = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:html");
	var notebody = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:body");
	var notediv = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:div");
	notediv.setAttribute("style", "width: 100%; font-family: sans-serif;");
	
	var bigtable;
	var wholetr;
	
	var curl = "";
	
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
			bigtable.setAttribute("style", "border: 1px solid lightgray; padding: 15px; margin: 5px;");
			bigtable.setAttribute("width", "100%");
			wholetr = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:div");
			wholetr.setAttribute("style", "color: gray; margin-bottom: 10px; border-bottom: 1px solid #DDD; font-size: 12px;");
			wholetr.appendChild(myDoc.createTextNode(localSticky[0]));
			wholetr.appendChild(myDoc.createElement("br"));
			bigtable.appendChild(wholetr);
		}
		
		curl = localSticky[0];
		
		if(localSticky)
		{
			var myStickyText = myDoc.createElementNS("http://www.w3.org/1999/xhtml","html:pre");
			myStickyText.setAttribute("style", "border-left: 1px solid " + localSticky[6] + "; padding: 5px 0px 5px 10px; margin-left: 10px; font-family: sans-serif sans;");
			myStickyText.appendChild(myDoc.createTextNode(localSticky[1]));
			bigtable.appendChild(myStickyText);
		}
	}
	
	notediv.appendChild(bigtable);
	notebody.appendChild(notediv);
	notehtml.appendChild(notebody);
	myDoc.body.appendChild(notehtml);
	
	//document.getElementById("printbrowser").contentWindow.focus();
	var frame = document.getElementById("printbrowser").contentWindow;
	var req = frame.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
	var wbprint = req.getInterface(Components.interfaces.nsIWebBrowserPrint);
	var settings = PrintUtils.getPrintSettings(); // from chrome://global/content/printUtils.js
	try
	{
		wbprint.print(settings, null);
	}
	catch(e)
	{
	}
	
	//document.getElementById("printbrowser").setAttribute("hidden", "true");

	//document.getElementById("printbrowser").contentWindow.print();
},

exportNotes : function()
{
	this.nyi();
},

updateSearchResults : function()
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
  isSorted: function()               { return false; },
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
  selectionChanged: function() {},
  cycleCell: function(idx, column) {},
  performAction: function(action) {},
  performActionOnCell: function(action, index, column) {},
  getRowProperties: function(idx, column, prop) {},
  getCellProperties: function(idx, column, prop) {},
  getColumnProperties: function(column, element, prop) {}
}

};