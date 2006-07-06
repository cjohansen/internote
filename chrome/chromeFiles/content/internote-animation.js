// Internote Animation Javascript
// 2006 - Tim Horton

var internoteAnimation = {

stickiesGetTransparency : function()
{
    return internotePreferences.getDefaultTransparency();
},

stickiesGetAnimation : function()
{
    return internotePreferences.getDefaultAnimation();
},

animationQueue : [],

stickiesNoteSettings : function(newTop, newLeft, newWidth, newHeight)
{
	this.targetTop = newTop;
   	this.targetLeft = newLeft;
	this.targetWidth = newWidth;
	this.targetHeight = newHeight;
},

stickiesNoteAnimation : function(animationID, animationContainer, noteSettings)
{
	this.animID = animationID;
   	this.animValue = 0;
	this.animStart = 0;
	this.animEnd = 1;
	this.animSkip = .03;
	this.animEq = "";
	this.animSet = "";
	this.animClean = "";
	this.animComp = "";
	this.animEl = animationContainer;
	this.target = noteSettings;
},

stickiesNoteAnimationOld : function(animationID, animationContainer)
{
    this.animationID = animationID;
    this.animationContainer = animationContainer;
    this.animationValue = 0;
    this.animationValueTarget = internoteAnimation.stickiesGetTransparency();
    this.payloadValue = new Array;
},

stickiesShowNote : function(container)
{
    if(this.stickiesGetAnimation())
    {
    	var newNote = new this.stickiesNoteSettings(parseInt(container.style.top, 10),parseInt(container.style.left, 10),parseInt(container.style.width, 10),parseInt(container.style.height, 10));
        var newAnim = new this.stickiesNoteAnimation(0, container, newNote);
        	        
      		newAnim.animEq = "var y = (1.0 / (1 + Math.exp((-x*12)+6))) * animation.target.targetHeight";
		newAnim.animSet = "animation.animEl.style.height = y + 'px'; animation.animEl.style.top = (animation.target.targetTop + (animation.target.targetHeight - y)/2) + 'px';";
		newAnim.animClean = "animation.animEl.style.height = animation.target.targetHeight + 'px'; animation.animEl.style.top = animation.target.targetTop + 'px'; stickiesDraw(animation.animEl);";
		newAnim.animComp = "var comp = (animation.animValue >= animation.animEnd)";
		
		newAnim.animSkip = .03 * (parseInt(container.style.height, 10) / 150);
        
        var newAnimID = this.animationQueue.push(newAnim) - 1;
        
        stickiesDraw(container);
        container.style.height = "0px";

        var stickiesAnimationID = window.setInterval("internoteAnimation.stickiesAnimateIn('" + newAnimID + "')", 5);
        newAnim.animID = stickiesAnimationID;
        
    }
    else
    {
        stickiesDraw(container);
    }

    container.style.opacity = "1";
       container.style.display = "";
},

stickiesAnimateIn : function(id)
{
    var animation = this.animationQueue[id];

   	var x = animation.animValue;
	eval(animation.animEq);
	eval(animation.animSet);
	eval(animation.animComp);
	
	if(comp)
	{
		window.clearInterval(animation.animID);
		eval(animation.animClean);
	}
	
	animation.animValue += animation.animSkip;
},

stickiesCloseNote : function(container)
{
	if(this.stickiesGetAnimation())
    {
    	var newNote = new this.stickiesNoteSettings(parseInt(container.style.top, 10),parseInt(container.style.left, 10),parseInt(container.style.width, 10),parseInt(container.style.height, 10));
        var newAnim = new this.stickiesNoteAnimation(0, container, newNote);
        
      		newAnim.animEq = "var y = (1.0 / (1 + Math.exp((-x*12)+6))) * animation.target.targetHeight";
      		newAnim.animValue = 1;
      		newAnim.animStart = 1;
      		newAnim.animEnd = 0;
      		newAnim.animSkip = -.03 * (parseInt(container.style.height, 10) / 150);
      		//newAnim.animEq = "var y = (x) * animation.target.targetHeight";
		newAnim.animSet = "animation.animEl.style.height = y + 'px'; animation.animEl.style.top = (animation.target.targetTop + (animation.target.targetHeight - y)/2) + 'px';";
		newAnim.animClean = "animation.animEl.style.height = animation.target.targetHeight + 'px'; animation.animEl.style.top = animation.target.targetTop + 'px'; animation.animEl.parentNode.removeChild(animation.animEl); saveOneSticky();";
		newAnim.animComp = "var comp = (animation.animValue <= animation.animEnd)";
        
        var newAnimID = this.animationQueue.push(newAnim) - 1;
        
        var stickiesAnimationID = window.setInterval("internoteAnimation.stickiesAnimateOut('" + newAnimID + "')", 5);
        newAnim.animID = stickiesAnimationID;
        container.style.opacity = "1";
    }
    else
    {
        container.parentNode.removeChild(container);
    }
},

stickiesAnimateOut : function(id)
{
    var animation = this.animationQueue[id];

   	var x = animation.animValue;
	eval(animation.animEq);
	eval(animation.animSet);
	eval(animation.animComp);

	if(comp)
	{
		window.clearInterval(animation.animID);
		eval(animation.animClean);
	}
	
	animation.animValue += animation.animSkip;
},

stickiesShadeNoteOut : function(container)
{
	if(this.stickiesGetAnimation())
    {
    	var newNote = new this.stickiesNoteSettings(parseInt(container.style.top, 10),parseInt(container.style.left, 10),parseInt(container.style.width, 10),parseInt(container.style.height, 10));
        var newAnim = new this.stickiesNoteAnimation(0, container, newNote);
        
      		newAnim.animEq = "var y = (1.0 / (1 + Math.exp((-x*12)+6))) * animation.target.targetHeight";
      		newAnim.animValue = 1;
      		newAnim.animStart = 1;
      		newAnim.animEnd = 0;
      		newAnim.animSkip = -.03 * (parseInt(container.style.height, 10) / 150);
      		//newAnim.animEq = "var y = (x) * animation.target.targetHeight";
		newAnim.animSet = "animation.animEl.style.height = y + 'px'; animation.animEl.style.top = (animation.target.targetTop + (animation.target.targetHeight - y)/2) + 'px';";
		newAnim.animClean = "animation.animEl.style.height = '20px';";
		newAnim.animComp = "var comp = (y <= 20);";
		container.getElementsByTagName('input').item(2).value = parseInt(container.style.top, 10) + "`" + parseInt(container.style.height, 10);
        
        var newAnimID = this.animationQueue.push(newAnim) - 1;
        
        var stickiesAnimationID = window.setInterval("internoteAnimation.stickiesAnimateShade('" + newAnimID + "')", 5);
        newAnim.animID = stickiesAnimationID;
        container.style.opacity = "1";
    }
    else
    {
        //container.parentNode.removeChild(container);
    }
},

stickiesShadeNoteIn : function(container)
{
    if(this.stickiesGetAnimation())
    {
    	var newNote = new this.stickiesNoteSettings(parseInt(container.getElementsByTagName('input').item(2).value.split("`")[0], 10),parseInt(container.style.left, 10),parseInt(container.style.width, 10),parseInt(container.getElementsByTagName('input').item(2).value.split("`")[1], 10));
        var newAnim = new this.stickiesNoteAnimation(0, container, newNote);
        	        
      		newAnim.animEq = "var y = (1.0 / (1 + Math.exp((-x*12)+6))) * animation.target.targetHeight";
		newAnim.animSet = "animation.animEl.style.height = y + 'px'; animation.animEl.style.top = (animation.target.targetTop + (animation.target.targetHeight - y)/2) + 'px';";
		newAnim.animClean = "animation.animEl.style.height = animation.target.targetHeight + 'px'; animation.animEl.style.top = animation.target.targetTop + 'px'; stickiesDraw(animation.animEl);";
		newAnim.animComp = "var comp = (animation.animValue >= animation.animEnd)";
		
		newAnim.animSkip = .03 * (parseInt(container.getElementsByTagName('input').item(2).value.split("`")[1], 10) / 150);
        
        var newAnimID = this.animationQueue.push(newAnim) - 1;
        
        stickiesDraw(container);
        container.style.height = "0px";

        var stickiesAnimationID = window.setInterval("internoteAnimation.stickiesAnimateShade('" + newAnimID + "')", 5);
        newAnim.animID = stickiesAnimationID;
        
    }
    else
    {
        stickiesDraw(container);
    }

    container.style.opacity = "1";
       container.style.display = "";
},

stickiesAnimateShade : function(id)
{
    var animation = this.animationQueue[id];

   	var x = animation.animValue;
	eval(animation.animEq);
	eval(animation.animSet);
	eval(animation.animComp);

	if(comp)
	{
		window.clearInterval(animation.animID);
		eval(animation.animClean);
	}
	
	animation.animValue += animation.animSkip;
},

stickiesInitializeNote : function(el)
{
	var mainEL = el;
	
	try
	{
    	if(mainEL)
    	{
			if((mainEL.id).match(/stickies-stickynote[0-9]+/))
			{
				internoteAnimation.stickiesShowNote(mainEL);
			}
		}
	}
	catch(e)
	{
	}
},

stickiesFlipNote : function(container)
{   
    if(this.stickiesGetAnimation())
    {
        var newAnim = new this.stickiesNoteAnimationOld(0, container);
        newAnim.animationValue = parseInt(container.style.width, 10);
        
        // save the width and flip state - we'll need these to restore them at the end
        newAnim.payloadValue[0] = parseInt(container.style.width, 10);
        newAnim.payloadValue[1] = parseInt(container.style.left, 10);
        newAnim.payloadValue[2] = getStickyFlipped(container);
        
        newAnim.animationValueTarget = 1;
        // push returns length instead of new item's index
        var newAnimID = this.animationQueue.push(newAnim) - 1;
        
        var stickiesAnimationID = window.setInterval("internoteAnimation.stickiesAnimateFlipFirst('" + newAnimID + "')", 5);
        newAnim.animationID = stickiesAnimationID;
    }
    else
    {
        setStickyFlipped(container, !getStickyFlipped(container));
        stickiesDraw(container);
    }
},

stickiesAnimateFlipFirst : function(id)
{
    var sna = this.animationQueue[id];
    
    sna.animationContainer.style.width = sna.animationValue + "px";
    // shift the x position so it looks like the note is rotating around an axis
    sna.animationContainer.style.left = (sna.payloadValue[1] + (sna.payloadValue[0] - sna.animationValue) / 2) + "px";
        
    sna.animationValue -= (7 * (sna.payloadValue[0] / 150));
    
    if(sna.animationValue <= sna.animationValueTarget)
    {
        sna.animationContainer.style.width = "1px";
        window.clearInterval(sna.animationID);
        sna.animationValue = sna.animationValueTarget;
        
        var newAnim = new this.stickiesNoteAnimationOld(0, sna.animationContainer);
        newAnim.animationValue = 0;
        newAnim.animationValueTarget = sna.payloadValue[0];
        newAnim.payloadValue[0] = sna.payloadValue[0];
        newAnim.payloadValue[1] = sna.payloadValue[1];
        // push returns length instead of new item's index
        var newAnimID = this.animationQueue.push(newAnim) - 1;
        
        setStickyFlipped(sna.animationContainer, !sna.payloadValue[2]);
        // draw colorpickers (if needed) - first, set to full size, so scaling works right!
        sna.animationContainer.style.display = "none";
        sna.animationContainer.style.opacity = 0;
        sna.animationContainer.style.width = sna.payloadValue[0];
        stickiesDraw(sna.animationContainer);
        sna.animationContainer.style.width = 0;
        sna.animationContainer.style.opacity = (this.stickiesGetTransparency() == true) ? "1" : "0";
        
        var stickiesAnimationID = window.setInterval("internoteAnimation.stickiesAnimateFlipSecond('" + newAnimID + "')", 5);
        newAnim.animationID = stickiesAnimationID;
    }
},

stickiesAnimateFlipSecond : function(id)
{
    var sna = this.animationQueue[id];
    
    sna.animationContainer.style.width = sna.animationValue + "px";
    // shift the x position so it looks like the note is rotating around an axis
    sna.animationContainer.style.left = (sna.payloadValue[1] - (sna.animationValue - sna.payloadValue[0]) / 2) + "px";
    sna.animationContainer.style.display = "";
        
    sna.animationValue += (7 * (sna.payloadValue[0] / 150));
        
    if(sna.animationValue >= sna.animationValueTarget)
    {
        sna.animationContainer.style.width = sna.payloadValue[0] + "px";
        sna.animationContainer.style.left = sna.payloadValue[1] + "px";
        window.clearInterval(sna.animationID);
        sna.animationValue = sna.animationValueTarget;
        sna.animationContainer.getElementsByTagName("textarea").item(0).style.opacity = 1;
        stickiesDraw(sna.animationContainer);
    }
}

};