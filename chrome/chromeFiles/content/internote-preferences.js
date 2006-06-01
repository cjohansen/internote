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
	
	getDefaultAnimation : function()
	{
	    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
	                getService(Components.interfaces.nsIPrefService).
	                getBranch("internote.");
	    if(prefs.getPrefType("superfluous-animation") !=0)
	    {
	        if(prefs.getBoolPref("superfluous-animation"))
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
	}
};