// Internote Preferences Javascript
// 2006 - Tim Horton

var internotePreferences = {
getFontSize : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("fontsize") !=0)
    {
        var defaultFontSize = prefs.getCharPref("fontsize");
        if(defaultFontSize == "10") return 10;
        if(defaultFontSize == "12") return 12;
        if(defaultFontSize == "14") return 14;
        if(defaultFontSize == "16") return 16;
        if(defaultFontSize == "18") return 18;
        return prefs.getCharPref("fontsize");
    }
    else
    {
        return 12;
    }
},

getUseStatusbar : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("usestatusbar") !=0)
    {
        if(prefs.getBoolPref("usestatusbar"))
            return true;
        else
            return false;
    }
    else
    {
        return true;
    }
},

getDefaultTransparency : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("transparency") !=0)
    {
        if(prefs.getBoolPref("transparency"))
            return true;
        else
            return false;
    }
    else
    {
        return false;
    }
},

getDefaultHighlightable : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("highlightable") !=0)
    {
        if(prefs.getBoolPref("highlightable"))
            return true;
        else
            return false;
    }
    else
    {
        return false;
    }
},

getScrollbar : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("usescrollbar") !=0)
    {
        if(prefs.getBoolPref("usescrollbar"))
            return true;
        else
            return false;
    }
    else
    {
        return false;
    }
},

getDefaultColor : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("defaultcolor") !=0)
    {
        var defaultColor = prefs.getCharPref("defaultcolor");
        if(defaultColor == "0") return "#FFFF99";
        if(defaultColor == "1") return "#FF9956";
        if(defaultColor == "2") return "#57BCD9";
        if(defaultColor == "3") return "#B0FF56";
        if(defaultColor == "4") return "#CB98FF";
        if(defaultColor == "5") return "#ECE5FC";
        return prefs.getCharPref("defaultcolor");
    }
    else
    {
        return "yellow";
    }
},

getDefaultTextColor : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("defaulttextcolor") !=0)
    {
        var defaultColor = prefs.getCharPref("defaulttextcolor");
        if(defaultColor == "0") return "#000000";
        if(defaultColor == "1") return "#7F5300";
        if(defaultColor == "2") return "#00FF00";
        if(defaultColor == "3") return "#FF0000";
        if(defaultColor == "4") return "#ADADAD";
        if(defaultColor == "5") return "#FFFFFF";
        return prefs.getCharPref("defaulttextcolor");
    }
    else
    {
        return "black";
    }
},

getDefaultPosition : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("defaultposition") !=0)
    {
        return prefs.getCharPref("defaultposition");
    }
    else
    {
        return "0";
    }
},

getDefaultSize : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("defaultsize") !=0)
    {
        return prefs.getCharPref("defaultsize");
    }
    else
    {
        return "0";
    }
},

getDefaultSaveLocation : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("savelocation") !=0)
    {
        return prefs.getCharPref("savelocation");
    }
    else
    {
        return "";
    }
},

getSetSaveLocation : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("changelocation") !=0)
    {
        if(prefs.getBoolPref("changelocation"))
            return true;
        else
            return false;
    }
    else
    {
        return false;
    }
},

getAskBeforeDelete : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("askbeforedelete") !=0)
    {
        if(prefs.getBoolPref("askbeforedelete"))
            return true;
        else
            return false;
    }
    else
    {
        return false;
    }
},

detectFirstRun : function()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).
                getBranch("internote.");
    if(prefs.getPrefType("firstrun") != 0)
    {
        if(!prefs.getBoolPref("firstrun"))
        {
            prefs.setBoolPref("firstrun", true);
            return true;
        }
        else
        {
            return false;
        }
    }
    
    prefs.setBoolPref("firstrun", true);
    return true;
},

refreshWindows : function()
{
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
	var enumerator = wm.getEnumerator("navigator:browser");
	while(enumerator.hasMoreElements())
	{
		var win = enumerator.getNext();
		win.disableInternote();
		win.disableInternote();
	}
},

chooseSaveLocation : function ()
{
	const nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, document.getElementById('internote-strings').getString("chooselocation"), nsIFilePicker.modeGetFolder);
	
	const nsILocalFile = Components.interfaces.nsILocalFile;
	var customDirPref = this.getDefaultSaveLocation();
	if (customDirPref.value)
		fp.displayDirectory = customDirPref.value;
		
	fp.appendFilters(nsIFilePicker.filterAll);
	if (fp.show() == nsIFilePicker.returnOK)
	{
		var file = fp.file.QueryInterface(nsILocalFile);
		var mypath = file.path;
		/*if(mypath.match(/\\/))
			mypath.replace(/.*\\([^\\]*)/, "$1");
		else
			mypath.replace(/.*\/([^\/]+)$/, "$1");*/
		
		document.getElementById("saveFolderField").value = mypath;
		
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("internote.");
		prefs.setCharPref("savelocation", file.path);
	}
	
	internotePreferences.moveActiveFolder(0);
},

moveActiveFolder : function (movetype)
{
	try
	{
		var defaultsave = internotePreferences.getDefaultSaveLocation();
		
		if(defaultsave == "")
			return;
			
		var chromedir = Components.classes["@mozilla.org/file/directory_service;1"].createInstance(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsIFile).path;
		
		if(chromedir.match(/\\/))
			chromedir += "\\";
		else
			chromedir += "/";
			
		if(defaultsave.match(/\\/))
			defaultsave += "\\";
		else
			defaultsave += "/";
		
		if(movetype == 0)
		{
			internoteUtilities.saveStringToFilename(internoteUtilities.readStringFromFilename(chromedir + "stickies"), internoteUtilities.getSaveDirectory() + "stickies");
		}
		else
		{
			internoteUtilities.saveStringToFilename(internoteUtilities.readStringFromFilename(defaultsave + "stickies"), chromedir + "stickies");
		}
	}
	catch(e)
	{
		alert(e);
	}
},

loadPrefs : function ()
{
	document.getElementById("saveFolderField").value = this.getDefaultSaveLocation();
	this.updateActiveFolderChooser();
},

updateActiveFolderChooser : function ()
{
	var active = document.getElementById("changelocationCheckBox").checked;
	var opac = (active == true) ? 1 : 0;
	document.getElementById("saveFolderField").style.opacity = opac;
	document.getElementById("chooseFolder").style.opacity = opac;
},

updateActiveFolderChooserClick : function ()
{
	var active = document.getElementById("changelocationCheckBox").checked;
	var opac = (active == true) ? 1 : 0;
	document.getElementById("saveFolderField").style.opacity = opac;
	document.getElementById("chooseFolder").style.opacity = opac;
	internotePreferences.moveActiveFolder(1-opac);
},

updateActiveFolderChooserSlow : function ()
{
	setTimeout('internotePreferences.updateActiveFolderChooserClick()', 100);
},

saveSettings : function ()
{
	this.refreshWindows();
}
};