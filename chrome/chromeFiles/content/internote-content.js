// Internote Content Javascript
// 2006 - Tim Horton

var stickiesCurrentX, stickiesCurrentY;
var stickiesInitialLeft, stickiesInitialTop;
var stickiesResizeFromRight, stickiesResizeFromBottom;
var stickiesIsResizing = 0;
var stickyIsDragging = 0;
var stickiesEL;
var stickyRedrawWait = 0;
var stickiesIsScroll = 0;

var stickyNoteHeader = new Image();
stickyNoteHeader.src = "chrome://internote/locale/note.png";
var stickyTextHeader = new Image();
stickyTextHeader.src = "chrome://internote/locale/text.png";
var stickyFlipButton = new Image();
stickyFlipButton.src = "chrome://internote/content/arrow.png";

var stickiesBackgroundColorSwabs = new Array("#FFFF99", "#FF9956", "#57BCD9", "#B0FF56", "#CB98FF", "#ECE5FC");
var stickiesTextColorSwabs = new Array("#000000", "#7F5300", "#00FF00", "#FF0000", "#ADADAD", "#FFFFFF");

function stickiesGetTransparency()
{
    return internotePreferences.getDefaultTransparency();
}

stickyFlipButton.onload = function ()
{
    var countEl = document.getElementById("stickies-count");
    if(countEl)
    	var currentCount = parseInt(countEl.innerHTML, 10);
    else
    	currentCount = 0;
        
    for(var i = 0; i < currentCount; i++)
    {
        try
        {
            stickiesDraw(document.getElementById("stickies-stickynote" + i));
        }
        catch(e)
        {
        }
    }
}

// date is container.getElementsByTagName('input').item(5).value

function getStickyFlipped(container)
{
    return parseInt(container.getElementsByTagName('input').item(1).value, 10);
}

function setStickyFlipped(container, newValue)
{
    newValue = (newValue == true) ? "1" : "0";
    
    container.getElementsByTagName('input').item(1).value = newValue;
}
    
function stickiesDraw(container)
{
	var elid = container.id;
  	if(elid)
  	{
    	elid = "stickies-stickynote" + elid.replace(/stickies-[A-Za-z]+([0-9]+)/, "$1");
    	container = document.getElementById(elid);
    	stickiesEL = container;
    }
    

    container.getElementsByTagName('textarea').item(0).style.display = (getStickyFlipped(stickiesEL) == 0) ? "" : "none";
    
	var textcolor = container.getElementsByTagName('textarea').item(0).style.color;
    var color = container.getElementsByTagName('input').item(0).value;
       
    var canvas = container.firstChild;
    
    var context = canvas.getContext("2d");
    
    var cHeight = parseInt(container.style.height, 10);
    var cWidth = parseInt(container.style.width, 10);
    
    var cLeft = parseInt(container.style.left, 10);
    var cTop = parseInt(container.style.top, 10);
    
    var canvasWidth = parseInt(canvas.width, 10);
    var canvasHeight = parseInt(canvas.height, 10);
        
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    
    context.save();
        
        context.scale(canvasWidth/cWidth, canvasHeight/cHeight);
        
        // draw the background
        
        if((stickiesGetTransparency(container) == 1) && !stickyIsDragging)
        {
        	context.drawWindow(gBrowser.getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex).contentWindow, cLeft - document.getElementById("content").browsers.item(0).boxObject.x, (cTop - (document.getElementById("content").browsers.item(0).boxObject.y)) + gBrowser.getBrowserAtIndex(gBrowser.mTabContainer.selectedIndex).contentWindow.scrollY, 400, 400, "rgb(0,0,0)");
        }
        
        // draw a round border
        
        if((stickiesGetTransparency(container) == 1) && !stickyIsDragging)
        	context.globalAlpha = .9;
        
        context.lineJoin = "round";
        context.strokeStyle = color;
        context.lineWidth = 6;
        context.strokeRect(3,3,cWidth-6,cHeight-6);
        
        // draw the filled rectangle
        
        context.fillStyle = color;
        context.fillRect(6, 6, cWidth - 12, cHeight - 12);
        
        context.globalAlpha = 1.0;
        
        if(stickiesGetTransparency(container) == 1)
        {
            // draw glassy highlights (if transparency is on)
            
            context.globalCompositeOperation = "lighter";
            var gradient = context.createLinearGradient(0, 0, 0, cHeight);
            
            gradient.addColorStop(0, "rgba(180, 180, 180, .4)");
            gradient.addColorStop(.4, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(.85, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(1, "rgba(0, 0, 0, .2)");
            
            context.fillStyle = gradient;
            context.fillRect(2, 2, cWidth - 4, cHeight - 4);
        }
    
    context.restore();
        
    context.save();
    
        context.scale(canvasWidth/cWidth, canvasHeight/cHeight);
        context.translate(cWidth - 16, cHeight - 16);
        
        // draw the resize handle
        
        context.strokeStyle = "rgba(0,0,0,0.35)";
        context.beginPath();
        
        context.moveTo(2, 13);  context.lineTo(13, 2);
        context.moveTo(5, 13);  context.lineTo(13, 5);
        context.moveTo(8, 13);   context.lineTo(13, 8);
        context.moveTo(11, 13);   context.lineTo(13, 11);
        
        context.stroke();
    
    context.restore();
    
    context.save();
    
        context.scale(canvasWidth/cWidth, canvasHeight/cHeight);
        context.translate(cWidth - 10,10);
        
        // draw the close button
        
        context.lineWidth = 2;
        context.lineCap = "round";
        context.strokeStyle = "darkred";
        context.beginPath();
        context.moveTo(-3,-3);  context.lineTo(3,3);
        context.moveTo(3,-3);   context.lineTo(-3,3);
        context.stroke();
    
    context.restore();
    
    /*context.save();
    
        context.scale(canvasWidth/cWidth, canvasHeight/cHeight);
        context.translate(cWidth - 22,10);
        
        // draw the shade button
        
        context.lineWidth = 2;
        context.lineCap = "round";
        context.strokeStyle = "darkblue";
        context.beginPath();
        context.moveTo(-3,0);  context.lineTo(3,0);
        context.stroke();
    
    context.restore();*/
    
    context.save();
    
        context.scale(canvasWidth/cWidth, canvasHeight/cHeight);
        
        // draw the prefs button
        
        if(stickyFlipButton.complete)
            context.drawImage(stickyFlipButton, 4, cHeight-12, 11.25, 9);
        
        context.stroke();
    
    context.restore();
    
    if(getStickyFlipped(container) == 1)
    {
        context.save();
        
            context.scale((canvasWidth/cWidth) * 2, (canvasHeight/cHeight) * 2);
            
            // draw the color swab headers
            
            context.drawImage(stickyNoteHeader, 3, 9, stickyNoteHeader.width / 2, stickyNoteHeader.height / 2);
            context.drawImage(stickyTextHeader, 3, 28, stickyTextHeader.width / 2, stickyTextHeader.height / 2);
            
            // draw the color swabs
            
            for(var colorIndex = 0; colorIndex < 6; colorIndex++)
            {
                // hilight the selected color
                
                if(color == stickiesBackgroundColorSwabs[colorIndex])
                {
                    context.strokeStyle = "#000";
                    context.lineWidth = .9;
                }
                else
                {
                    context.strokeStyle = "#555";
                    context.lineWidth = .5;
                }
                
                var hPos = 11 * colorIndex + 6;
                context.fillStyle = stickiesBackgroundColorSwabs[colorIndex];
                context.fillRect(hPos, 18, 8, 8); context.strokeRect(hPos, 18, 8, 8);
            }
            
            context.strokeStyle = "#555";
            context.lineWidth = .5;
            
            for(colorIndex = 0; colorIndex < 6; colorIndex++)
            {
                // hilight the selected color
                if(textcolor == convertHexToCSS(stickiesTextColorSwabs[colorIndex]))
                {
                    context.strokeStyle = "#000";
                    context.lineWidth = .9;
                }
                else
                {
                    context.strokeStyle = "#555";
                    context.lineWidth = .5;
                }
                
                var hPos = 11 * colorIndex + 6;
                context.fillStyle = stickiesTextColorSwabs[colorIndex];
                context.fillRect(hPos, 37, 8, 8); context.strokeRect(hPos, 37, 8, 8);
            }
        
        context.restore();
    }
}

function convertHexToCSS(color)
{
    color = color.replace(/#(.*)/, "$1")
    var colorone = color.replace(/(..).*/, "$1");
    var colortwo = color.replace(/..(..).*/, "$1");
    var colorthree = color.replace(/....(..).*/, "$1");

    return "rgb(" + parseInt(colorone, 16) + ", " + parseInt(colortwo, 16) + ", " + parseInt(colorthree, 16) + ")";
}

function convertHexToCSSA(color, alpha)
{
    color = color.replace(/#(.*)/, "$1")
    var colorone = color.replace(/(..).*/, "$1");
    var colortwo = color.replace(/..(..).*/, "$1");
    var colorthree = color.replace(/....(..).*/, "$1");

    return "rgba(" + parseInt(colorone, 16) + ", " + parseInt(colortwo, 16) + ", " + parseInt(colorthree, 16) + ", " + alpha + ")";
}

function getBackgroundColorSwabFromPoint(x, y)
{
    // fix scaling of the boxes!
    x /= 2;
    y /= 2;
    
    for(var colorIndex = 0; colorIndex < 6; colorIndex++)
    {
        var hPos = 11*colorIndex + 6;
        
        if((x > hPos) && (x < hPos + 8) && (y > 18) && (y < 26))
            return stickiesBackgroundColorSwabs[colorIndex];
    }
    return "";
}

function getTextColorSwabFromPoint(x, y)
{
    // fix scaling of the boxes!
    x /= 2;
    y /= 2;
    
    for(var colorIndex = 0; colorIndex < 6; colorIndex++)
    {
        var hPos = 11*colorIndex + 6;
        
        if((x > hPos) && (x < hPos + 8) && (y > 35) && (y < 43))
            return stickiesTextColorSwabs[colorIndex];
    }
    return "";
}

function stickiesStartDrag(event)
{
	//var elid = event.target.parentNode.id;
    //stickiesEL = document.getElementById(elid);
  	//stickiesEL = event.target.parentNode;
  	
  	var elid = event.target.id;
  	
  	if(elid)
  	{
  		stickiesEL = event.target;
    	elid = "stickies-stickynote" + elid.replace(/stickies-[A-Za-z]+([0-9]+)/, "$1");
    	stickiesEL = document.getElementById(elid);
    }
    else
    {
    	elid = "stickies-stickynote" + event.target.name.replace(/stickiesnoteform([0-9]+)/, "$1");
    	stickiesEL = document.getElementById(elid);
    }
    
    stickiesEL.style.zIndex = getHighestNoteOrder() + 1;
    
    var x = event.clientX;
    var y = event.clientY;
    
    stickiesCurrentX = x;
    stickiesCurrentY = y;
    
    stickiesInitialLeft  = parseInt(stickiesEL.style.left, 10);
    stickiesInitialTop   = parseInt(stickiesEL.style.top,  10);
    
    var elHeight = parseInt(stickiesEL.style.height, 10);
    var elWidth = parseInt(stickiesEL.style.width, 10);
    
    if (isNaN(stickiesInitialLeft)) stickiesInitialLeft = 0;
    if (isNaN(stickiesInitialTop))  stickiesInitialTop  = 0;
    
    var internal_x = x - stickiesInitialLeft;
    var internal_y = y - stickiesInitialTop;
    
    if(internal_x > (elWidth - 25) && internal_x < (elWidth - 7) && internotePreferences.getScrollbar())
		stickiesIsScroll = 1;
	else
		stickiesIsScroll = 0;
    
    stickiesResizeFromRight = elWidth - internal_x;
    stickiesResizeFromBottom = elHeight - internal_y;
    
    if((internal_x > (elWidth-17)) && (internal_y > (elHeight-17)))
    {
        stickiesIsResizing = 1;
        document.addEventListener("mousemove", stickiesDragGo, true);
    	document.addEventListener("mouseup", stickiesDragStop, true);
    }
    else
    {
        stickiesIsResizing = 0;
    
	    if((internal_x > (elWidth-17)) && (internal_y < 17))
	    {
	    	if(stickiesAskBeforeDeletion())
	    	{
	    		stickiesEL.parentNode.removeChild(stickiesEL);
	    		stickiesEL.removeEventListener("mousedown", stickiesStartDrag, false);
	    		saveOneSticky();
	    	}
	    }
	    else
	    {
		   	if((internal_x < 17) && (internal_y > (elHeight-17)))
		    {
		        //internoteAnimation.stickiesFlipNote(stickiesEL);
		        setStickyFlipped(stickiesEL, !getStickyFlipped(stickiesEL));
		        saveOneSticky();
		        stickiesDraw(stickiesEL);
		    }
			else 
			{
				//if((internal_x > (elWidth-32)) && (internal_y < 17) && (internal_x < (elWidth-17)))
	    		{
	    			/*if(parseInt(stickiesEL.style.height, 10) == 20)
	    				internoteAnimation.stickiesShadeNoteIn(stickiesEL);
	    			else
	        			internoteAnimation.stickiesShadeNoteOut(stickiesEL);*/
	    		}
	    		//else
	    		{
					if(internotePreferences.getDefaultHighlightable())
				    {
				    	if((internal_x < 7) || (internal_x > (elWidth-(7+16))) || (internal_y < 7) || (internal_y > (elHeight-(7+16))))
					    {
					    	document.addEventListener("mousemove", stickiesDragGo, true);
					    	document.addEventListener("mouseup", stickiesDragStop, true);
					    }
					}
				    else
				    {
				    	document.addEventListener("mousemove", stickiesDragGo, true);
				    	document.addEventListener("mouseup", stickiesDragStop, true);
				    	
				    	//stickiesEL.style.display = "none";
				    }
				}
		    }
	    }
    }
    
    if(getBackgroundColorSwabFromPoint(internal_x, internal_y) != "" && getStickyFlipped(stickiesEL))
    {
        // change note's color
        stickiesEL.getElementsByTagName('input').item(0).value = getBackgroundColorSwabFromPoint(internal_x, internal_y);
        stickiesDraw(stickiesEL);
    }
    
    if(getTextColorSwabFromPoint(internal_x, internal_y) != "" && getStickyFlipped(stickiesEL))
    {
        // change note's text color
        stickiesEL.getElementsByTagName('textarea').item(0).style.color = getTextColorSwabFromPoint(internal_x, internal_y);
        stickiesDraw(stickiesEL);
    }
}

function stickiesDragGo(event)
{
	if(stickiesIsScroll)
		return true;
    
    var x, y;
    
    x = event.clientX;
    y = event.clientY;
    
    // stickiesEL.getElementsByTagName('textarea').item(0).value = x + "px, " + y + "px;";
    
    if((stickiesCurrentX == x) && (stickiesCurrentY == y)) return true;
    
    if(stickyIsDragging == 0)
    {
    	stickyIsDragging = 1;
		stickiesDraw(stickiesEL);
	}
    
	if(stickiesIsResizing == 1)
	{
        var cursorLeft, cursorTop;
        
        currentTop = parseInt(stickiesEL.style.top, 10);
        currentLeft = parseInt(stickiesEL.style.left, 10);
        
        cursorLeft = (x - currentLeft);
        cursorTop = (y - currentTop);
        
        elWidth = cursorLeft + stickiesResizeFromRight;
        elHeight = cursorTop + stickiesResizeFromBottom;
        
        // check if new width+height are outside of (150x150, 400x400)
        
        if(elWidth < 150)
        {
        	stickiesEL.style.width = "150px";
        }
        else
        {
        	if(elWidth > 400)
        	{
        		stickiesEL.style.width = "400px";
        	}
        	else
        	{
        		stickiesEL.style.width = elWidth + "px";
        	}
        }
        
        if(elHeight < 100)
        {
        	stickiesEL.style.height = "100px";
        	stickiesEL.getElementsByTagName('textarea').item(0).style.height = (100 - 24) + "px";
        }
        else
        {
        	if(elHeight > 400)
        	{
        		stickiesEL.style.height = "400px";
        		stickiesEL.getElementsByTagName('textarea').item(0).style.height = (400 - 24) + "px";
        	}
        	else
        	{
        		stickiesEL.style.height = elHeight + "px";
        		stickiesEL.getElementsByTagName('textarea').item(0).style.height = (elHeight - 24) + "px";
        	}
        }
        
        if(internotePreferences.getDefaultHighlightable())
        {
	        var widthDoubleSide = parseInt(stickiesEL.style.width, 10) - 32;
	    	var widthSingleSide = parseInt(stickiesEL.style.width, 10) - 16;
	    	
	    	var heightDoubleSide = parseInt(stickiesEL.style.height, 10) - 32;
	    	var heightSingleSide = parseInt(stickiesEL.style.height, 10) - 16;
	    	var stickynoteID = (stickiesEL.id).replace(/stickies-[a-zA-Z]+([0-9]+)/, "$1");
	    	document.getElementById("stickies-left" + stickynoteID).style.height = heightSingleSide + "px";
	    	document.getElementById("stickies-right" + stickynoteID).style.height = heightDoubleSide + "px";
	    	document.getElementById("stickies-top" + stickynoteID).style.width = widthSingleSide + "px";
	    	document.getElementById("stickies-bottom" + stickynoteID).style.width = widthDoubleSide + "px";
    	}
                
        if(!getStickyFlipped(stickiesEL))
        {
            if(stickyRedrawWait)
                stickiesDraw(stickiesEL);
        }
        else
            stickiesDraw(stickiesEL);
        
        stickyRedrawWait = (stickyRedrawWait == 1) ? 0 : 1;

	}
    else
    {
        //stickiesEL.style.opacity = 0.5;
			    	
        var eltop = parseInt(stickiesEL.style.top, 10);
        var elleft = parseInt(stickiesEL.style.left, 10);
        var elHeight = parseInt(stickiesEL.style.height, 10);
        var elWidth = parseInt(stickiesEL.style.width, 10);
        
        // don't go past the sides, but check for the scrollbar too
        
        var maxWidth = getBrowser().boxObject.x + getBrowser().contentDocument.documentElement.clientWidth;
        var maxHeight = getBrowser().boxObject.y + getBrowser().boxObject.height;
        
        if((stickiesInitialLeft + x - stickiesCurrentX) > (maxWidth - elWidth))
    	{
    		stickiesEL.style.left = (maxWidth - elWidth) + "px";
    	}
    	else if((stickiesInitialLeft + x - stickiesCurrentX) < (getBrowser().boxObject.x))
    	{
			stickiesEL.style.left = getBrowser().boxObject.x + "px";
    	}
    	else
    	{
    		if((stickiesInitialLeft + x - stickiesCurrentX) <= document.getElementById("content").browsers.item(0).boxObject.x)
	    	{
	    		stickiesEL.style.left = document.getElementById("content").browsers.item(0).boxObject.x + "px";
	    	}
	    	else
	    	{
	        	stickiesEL.style.left = (stickiesInitialLeft + x - stickiesCurrentX) + "px";
	    	}
    	}
    	
    	if((stickiesInitialTop + y - stickiesCurrentY) > (maxHeight - elHeight))
    	{
    		stickiesEL.style.top = (maxHeight - elHeight) + "px";
    	}
    	else
    	{
        	if((stickiesInitialTop + y - stickiesCurrentY) <= document.getElementById("content").browsers.item(0).boxObject.y)
	    	{
	    		stickiesEL.style.top = document.getElementById("content").browsers.item(0).boxObject.y + "px";
	    	}
	    	else
	    	{
	        	stickiesEL.style.top = (stickiesInitialTop + y - stickiesCurrentY) + "px";
	    	}
    	}
    }
    
    return 0;
}

function stickiesDragStop(event)
{
	stickyIsDragging = 0;
    stickiesDraw(stickiesEL);
    stickiesEL.style.opacity = 1;
    //stickiesEL.style.display = "";
    document.removeEventListener("mousemove", stickiesDragGo,   true);
    document.removeEventListener("mouseup",   stickiesDragStop, true);
    saveOneSticky();
}

function stickiesAskBeforeDeletion()
{
	if(!internotePreferences.getAskBeforeDelete())
	{
		return true;
	}
	else
	{
		return confirm(document.getElementById('internote-strings').getString("AskToSave"));
	}
	
	return true;
}