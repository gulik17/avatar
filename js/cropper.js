function offsetPosition(element) {
  //РїРѕР»СѓС‡Р°РµРј С‚РµРєСѓС‰РёРµ РєРѕРѕСЂРґРёРЅР°С‚С‹ Р±Р»РѕРєР°
  var offsetL = (offsetT = 0);

  do {
    offsetL += element.offsetLeft;
    offsetT += element.offsetTop;
  } while ((element = element.offsetParent));

  return [offsetL, offsetT];
}

function MobileCropper(file, originalWidth, originalHeight, userSettings) {
  var settings = {
    id: userSettings.id,
  };

  var events = {
    onMyMouseUp: null,
  };

  var scale = 1,
    left,
    top,
    height,
    width,
    minusLeftSide,
    minusTopSide,
    minScale = 1;

  this.getInfo = function () {
    var light = getFixedInfo();

    var info = {
      originalWidth: originalWidth,
      originalHeight: originalHeight,
      workWidth: Math.round(width),
      workHeight: Math.round(height),
      thumbnailWidth: 250,
      thumbnailHeight: 250,
      x: null,
      y: null,
    };

    info.x = Math.round(light.x - left - minusLeftSide);
    info.y = Math.round(light.y - top - minusTopSide);

    if (info.x < 0) info.x = 0;
    else if (info.x > info.workWidth - 250) info.x = info.workWidth - 250;

    if (info.y < 0) info.y = 0;
    else if (info.y > info.workHeight - 250) info.y = info.workHeight - 250;

    return info;
  };

  this.cancel = function () {
    mainContainer.parentNode.removeChild(mainContainer);
    document.body.style.overflow = "auto";
  };

  var getFixedInfo = function () {
    var lightCoords = offsetPosition(lightBlock);

    return {
      x: lightCoords[0],
      xx: lightCoords[0] + lightBlock.clientWidth,
      y: lightCoords[1],
      yy: lightCoords[1] + lightBlock.clientHeight,
      w: lightBlock.clientWidth,
      h: lightBlock.clientHeight,
    };
  };

  var getPercentageBetweenNums = function (bigNum, littleNum) {
    return ((bigNum - littleNum) / bigNum) * 100;
  };

  var decreaseNumByPercentage = function (num, percentage) {
    return num - (num / 100) * percentage;
  };

  var increaseNumByPercentage = function (num, percentage) {
    return (num / 100) * percentage + num;
  };

  var zoom = function (in_or_out, scaleStep) {
    if (in_or_out == "both") scale = scaleStep;
    else if (in_or_out == "in") scale += scaleStep;
    else scale -= scaleStep;

    if (scale < minScale) scale = minScale;
    else if (scale > 3) scale = 3;

    height = Math.floor(originalHeight * scale);
    width = Math.floor(originalWidth * scale);

    minusLeftSide = Math.round((originalWidth - width) / 2); //Р’С‹С‡РµСЃР»СЏРµРј РЅР°СЃРєРѕР»СЊРєРѕ px Р±С‹Р»Р° РёР·РјРµРЅРµРЅР° Р»РµРІР°СЏ СЃС‚РѕСЂРѕРЅР° РёР·РѕР±СЂР°Р¶РµРЅРёСЏ
    minusTopSide = Math.round((originalHeight - height) / 2);

    //image.style.webkitTransition = 'transform 150ms';
    image.style.webkitTransform =
      image.style.mozTransform =
      image.style.msTransform =
      image.style.oTransform =
      image.style.transform =
        "scale(" + scale + ")";

    var light = getFixedInfo();

    var marginLeft = left + minusLeftSide,
      marginLeftPlusWidth = marginLeft + width;

    if (marginLeftPlusWidth < light.xx) {
      //Р•СЃР»Рё РёР·РѕР±СЂР°Р¶РµРЅРёРµ РІС‹С…РѕРґРёС‚ Р·Р° РєСЂР°Р№, С‚Рѕ СЃРґРІРёРіР°РµРј РµРіРѕ РЅР° РјРµСЃС‚Рѕ
      image.style.marginLeft = light.xx - originalWidth + minusLeftSide + "px";
    } else if (marginLeft > light.x) {
      image.style.marginLeft =
        light.xx - originalWidth + minusLeftSide - 250 + width + "px";
    }

    var marginTop = top + minusTopSide,
      marginTopPlusHeight = marginTop + height;

    if (marginTopPlusHeight < light.yy) {
      image.style.marginTop = light.yy - originalHeight + minusTopSide + "px";
    } else if (marginTop > light.y) {
      image.style.marginTop =
        light.yy - originalHeight + minusTopSide - 250 + height + "px";
    }
  };

  window.addEventListener(
    "orientationchange",
    function (e) {
      var light = getFixedInfo();

      top = Math.round(top - light.x + light.y);
      left = Math.round(left + light.x - light.y);

      image.style.transition = "none";
      image.style.marginTop = top + "px";
      image.style.marginLeft = left + "px";
    },
    false
  );

  var mainContainer = document.createElement("div");
  mainContainer.style.cssText =
    "position:fixed;top:0;left:0;right:0;bottom:0;background:black;overflow:hidden;";

  mainContainer.setAttribute("id", settings.id + "mainContainer");

  document.body.appendChild(mainContainer);
  document.body.style.overflow = "hidden";

  var zoomBtns = document.createElement("div");
  zoomBtns.style.cssText =
    "position:absolute; top: 50%; right:0;\
				background: rgba(0,0,0,.65);\
				border:solid 1px #cecece; border-radius: 4px;\
				margin: -30px 5px 0 0;\
				display: inline-block;\
				box-shadow: 0 0 1px #fff;\
				text-align: center;\
				z-index: 1000;";

  zoomBtns.setAttribute("id", settings.id + "zoomBtns");

  mainContainer.appendChild(zoomBtns);

  var zoomIn = document.createElement("div");
  zoomIn.style.cssText =
    "display: block;\
					font-size: 20px;\
					font-weight:bold;\
					padding: 10px 10px 2px 10px;\
					cursor:pointer;\
					color: white;";

  zoomIn.textContent = "+";
  zoomIn.setAttribute("id", settings.id + "zoomIn");

  zoomIn.addEventListener(
    "touchstart",
    function (e) {
      //e.preventDefault();
      e.stopPropagation();

      zoom("in", 0.2);
    },
    false
  );

  zoomBtns.appendChild(zoomIn);

  var zoomOut = zoomIn.cloneNode();
  zoomOut.textContent = "-";
  zoomOut.setAttribute("id", settings.id + "zoomOut");

  zoomOut.addEventListener(
    "touchstart",
    function (e) {
      e.stopPropagation();

      zoom("out", 0.2);
    },
    false
  );

  zoomBtns.appendChild(zoomOut);

  var lightBlock = document.createElement("div");
  lightBlock.style.cssText =
    "position:absolute; top: 50%; left: 50%;\
				width: 250px; height: 250px;\
				margin: -125px 0 0 -125px;\
				box-shadow: inset 0 0 0 1px rgba(255,255,255,.4), 0 0 0 1500px rgba(0,0,0,.4);\
				z-index:999;"; //transition: box-shadow .75s

  lightBlock.setAttribute("id", settings.id + "lightBlock");

  mainContainer.appendChild(lightBlock);

  var image = document.createElement("img");
  //image.style.position = "absolute";

  if (originalWidth > originalHeight && originalHeight > 250) {
    scale = minScale = decreaseNumByPercentage(
      1,
      getPercentageBetweenNums(originalHeight, 250)
    );
  } else if (originalWidth < originalHeight && originalWidth > 250) {
    scale = minScale = decreaseNumByPercentage(
      1,
      getPercentageBetweenNums(originalWidth, 250)
    );
  }
  //scale = 1;

  height = originalHeight * scale;
  width = originalWidth * scale;

  var lightBlockPos = offsetPosition(lightBlock);

  minusLeftSide = (originalWidth - width) / 2; //Р’С‹С‡РµСЃР»СЏРµРј РЅР°СЃРєРѕР»СЊРєРѕ px Р±С‹Р»Р° РёР·РјРµРЅРµРЅР° Р»РµРІР°СЏ СЃС‚РѕСЂРѕРЅР° РёР·РѕР±СЂР°Р¶РµРЅРёСЏ
  var fromLeftSideToCenter = lightBlockPos[0] - minusLeftSide;

  minusTopSide = (originalHeight - height) / 2;
  var fromTopSideToCenter = lightBlockPos[1] - minusTopSide;

  top = Math.round(fromTopSideToCenter - (height - 250) / 2);
  left = Math.round(fromLeftSideToCenter - (width - 250) / 2);

  //console.log(   left    );

  image.style.marginTop = top + "px";
  image.style.marginLeft = left + "px";
  image.style.transform = "scale(" + scale + ")";

  mainContainer.appendChild(image);

  var scaling = false;
  image.onload = function () {
    //mainContainer.addEventListener('mousedown', function(e)
    mainContainer.addEventListener(
      "touchstart",
      function (e) {
        e.preventDefault();
        e.stopPropagation();

        var tt = e.touches;

        /* if ( document.getElementById("lightBlock")) {
             var lightBlock = document.createElement('div');
             lightBlock.style.cssText = 'position:absolute; top: 0; left: 0;\
             z-index:9999;	color: white;';
             lightBlock.setAttribute("id", "lightBlock");
             
             mainContainer.appendChild(lightBlock);
             } */

        if (tt.length == 1) {
          moveImage(e);
        } //Р РµР°Р»РёР·Р°С†РёСЏ "Pinch"
        else {
          scaling = true;
          var distance = function (p1, p2) {
            //РћРїСЂРµРґРµР»РµРЅРёРµ СЂР°СЃСЃС‚РѕСЏРЅРёСЏ РјРµР¶РґСѓ РїР°Р»СЊС†Р°РјРё
            return Math.sqrt(
              Math.pow(p1.clientX - p2.clientX, 2) +
                Math.pow(p1.clientY - p2.clientY, 2)
            );
          };

          var dist = distance(tt[0], tt[1]);

          var letMeStart = function (e) {
            e.preventDefault();

            var scale_factor = 1.0;
            var tt = e.touches;

            //scale = distance(tt[0], tt[1]) / dist * scale_factor;

            if (dist < distance(tt[0], tt[1])) zoom("in", 0.1);
            else zoom("out", 0.1);
          };

          mainContainer.addEventListener("touchmove", letMeStart, false);

          events.onMyMouseUp = function () {
            scaling = false;
            mainContainer.removeEventListener("touchmove", letMeStart);
          };
        }
      },
      false
    );

    mainContainer.addEventListener(
      "touchend",
      function (e) //mainContainer.addEventListener('mouseup', function(e)
      {
        if (events.onMyMouseUp !== null) {
          events.onMyMouseUp(e);
          events.onMyMouseUp = null;
        }
      },
      false
    );

    if ("onwheel" in document) {
      // IE9+, FF17+
      var WHEEL = "wheel";
    } else if ("onmousewheel" in document) {
      // СѓСЃС‚Р°СЂРµРІС€РёР№ РІР°СЂРёР°РЅС‚ СЃРѕР±С‹С‚РёСЏ
      var WHEEL = "mousewheel";
    }

    mainContainer.addEventListener(
      WHEEL,
      function (e) {
        e.preventDefault();
        e.stopPropagation();

        var direction = e.deltaY || e.detail || e.wheelDelta;

        if (direction < 0) direction = "in";
        else direction = "out";

        zoom(direction, 0.05);
      },
      false
    );
  };

  image.src = file;

  function moveImage(e) {
    if (typeof e.changedTouches !== "undefined") e = e.changedTouches[0];

    var fixedX = e.clientX,
      fixedY = e.clientY,
      X = 0,
      Y = 0;

    var infoLightBlock = offsetPosition(lightBlock);

    var light = getFixedInfo();

    var effects = {
      horizontal: {
        enable: false,
        pixelOffset: 0,
        fixedX: null,
      },
      vertical: {
        enable: false,
        pixelOffset: 0,
        fixedY: null,
      },
    };

    events.onMyMouseUp = function () {
      image.style.transition = "margin 500ms";

      if (effects.horizontal.enable) {
        top -= effects.horizontal.pixelOffset;
        image.style.marginTop = Math.round(top) + "px";
      } else top += Y;

      if (effects.vertical.enable) {
        left -= effects.vertical.pixelOffset;
        image.style.marginLeft = Math.round(left) + "px";
      } else left += X;

      mainContainer.removeEventListener("touchmove", init);
      //mainContainer.removeEventListener('mousemove', init);

      init = null;
    };

    image.style.transition = "none";

    var init = function (e) {
      if (scaling) {
        mainContainer.removeEventListener("touchmove", init);
        //mainContainer.removeEventListener('mousemove', init);

        init = null;
      }

      e.preventDefault();

      if (typeof e.changedTouches !== "undefined") e = e.changedTouches[0];

      X = e.clientX - fixedX;
      Y = e.clientY - fixedY;

      realTop = top + minusTopSide + Y;
      realLeft = left + minusLeftSide + X;

      if (light.y < realTop || light.yy > realTop + height) {
        if (light.y < realTop) top = light.y - minusTopSide;
        else top = light.y + 250 - height - minusTopSide;

        Y = 0;
        fixedY = e.clientY;

        effects.horizontal.enable = true;

        if (effects.horizontal.fixedY == null)
          effects.horizontal.fixedY = e.clientY;

        effects.horizontal.pixelOffset =
          (e.clientY - effects.horizontal.fixedY) / 4;

        top += effects.horizontal.pixelOffset;
      } else effects.horizontal.enable = false;

      if (light.x < realLeft || light.xx > realLeft + width) {
        if (light.x < realLeft) left = light.x - minusLeftSide;
        else left = light.x + 250 - width - minusLeftSide;

        X = 0;
        fixedX = e.clientX;

        effects.vertical.enable = true;

        if (effects.vertical.fixedX == null)
          effects.vertical.fixedX = e.clientX;

        effects.vertical.pixelOffset =
          (e.clientX - effects.vertical.fixedX) / 4;

        left += effects.vertical.pixelOffset;
      } else effects.vertical.enable = false;

      image.style.marginTop = Math.round(top + Y) + "px";
      image.style.marginLeft = Math.round(left + X) + "px";
    };

    mainContainer.addEventListener("touchmove", init, false);
    //mainContainer.addEventListener('mousemove', init, false);
  }
}

var cropper = {
  info: null, //Р‘СѓРґРµС‚ С…СЂР°РЅРёС‚СЊ РІ СЃРµР±Рµ РґР°РЅРЅС‹Рµ С‚Р°РєРёРµ РєР°Рє РєРѕРѕСЂРґРёРЅР°С‚С‹, С€РёСЂРёРЅСѓ Рё РїСЂ.
  minW: 0, //РњРёРЅРёРјР°Р»СЊРЅР°СЏ С€РёСЂРёРЅР°
  minH: 0,
  deg: 0,
  settings: {
    id: null, //ID Р±Р»РѕРєР° РєСѓРґР° Р±СѓРґСѓС‚ РїРѕРјРµС‰РµРЅС‹ РІСЃРµ Р±Р»РѕРєРё РєСЂРѕРїРїРёРЅРіР°
    resize: "freeSelection", //saveProportions
    hooks: "", //straight | angular | empty
    tools: true,
  },
  events: {
    onClickBtn: null,
    onMyMouseUp: null,
  },
  getFixedInfo: function () {
    var darkBlock = document.getElementById(cropper.settings.id + "darkBlock"),
      lightBlock = document.getElementById(cropper.settings.id + "lightBlock"),
      darkCoords = offsetPosition(darkBlock),
      lightCoords = offsetPosition(lightBlock);

    return {
      dark: {
        block: darkBlock,
        x: darkCoords[0],
        xx: darkCoords[0] + darkBlock.clientWidth, //Р Р°СЃСЃС‚РѕСЏРЅРёРµ РѕС‚ РїСЂР°РІРѕР№ РіСЂР°РЅРёС†С‹ Р±Р»РѕРєР° darkBlock РґРѕ Р»РµРІРѕР№ РѕРєРЅР° Р±СЂР°СѓР·РµСЂР°
        y: darkCoords[1],
        yy: darkCoords[1] + darkBlock.clientHeight, //Р Р°СЃСЃС‚РѕСЏРЅРёРµ РѕС‚ РЅРёР¶РЅРµР№ РіСЂР°РЅРёС†С‹ Р±Р»РѕРєР° darkBlock РґРѕ РІРµСЂС…РЅРµР№ РѕРєРЅР° Р±СЂР°СѓР·РµСЂР°
        w: darkBlock.clientWidth,
        h: darkBlock.clientHeight,
      },
      light: {
        block: lightBlock,
        x: lightCoords[0],
        xx: lightCoords[0] + lightBlock.clientWidth,
        y: lightCoords[1],
        yy: lightCoords[1] + lightBlock.clientHeight,
        w: lightBlock.clientWidth,
        h: lightBlock.clientHeight,
      },
    };
  },
  prepareImgToCrop: function (
    minW,
    minH,
    file,
    originalWidth,
    originalHeight,
    userSettings
  ) {
    this.minW = minW;
    this.minH = minH;

    cropper.settings.id = userSettings.id;

    this.settings.preview = false;
    if (typeof userSettings.preview !== "undefined") {
      this.settings.preview = true;
    }

    if (typeof userSettings.resize !== "undefined") {
      this.settings.hooks = "angular";
      this.settings.resize = userSettings.resize;
    }

    if (typeof userSettings.tools !== "undefined") {
      this.settings.tools = userSettings.tools;
    }

    var wrap = document.getElementById(cropper.settings.id);

    var mainContainer = document.createElement("div");
    mainContainer.style.cssText =
      "background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABXSURBVHja7NUxCgAxCETRjOwVPaV3dLZYSJcikBQLfwpBEF4hqGyPRWxL+upsq2o1L6m753BE2I5xOQAAAAAAJ/Ls3vfM3Pof7AAAAADgF8ALAAD//wMAcyAsQAGJQToAAAAASUVORK5CYII=') left top repeat;\
			position: relative;\
			display: inline-block;\
			width: " +
      originalWidth +
      "px; height: " +
      originalHeight +
      "px";

    mainContainer.setAttribute("id", cropper.settings.id + "mainContainer");

    wrap.appendChild(mainContainer);

    var image = document.createElement("img");
    image.style.display = "block";
    image.setAttribute("id", cropper.settings.id + "bigImage");

    mainContainer.appendChild(image);

    image.onload = function () {
      var darkBlock = document.createElement("div");
      darkBlock.style.cssText =
        "position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);cursor:crosshair;";
      darkBlock.setAttribute("id", cropper.settings.id + "darkBlock");

      darkBlock.onmousedown = function (e) {
        cropper.hooks.highlight("up");
        cropper.customSelection(e);
      };

      mainContainer.appendChild(darkBlock);

      var dimension = Math.min(originalWidth, originalHeight);
      dimension -= (dimension / 100) * 20;

      var lightBlockWidth = dimension,
        lightBlockHeight = dimension;

      if (cropper.settings.resize == "saveProportions") {
        if (cropper.minW > cropper.minH) {
          //var percentage = ((cropper.minW - cropper.minH) / cropper.minW) * 100; //Р Р°Р·РЅРёС†Р° РІ РїСЂРѕС†РµРЅС‚Р°С… РјРµР¶РґСѓ РјРёРЅРёРјР°Р»СЊРЅРѕР№ С€РёСЂРёРЅРѕР№ Рё РІС‹СЃРѕС‚РѕР№
          //lightBlockHeight = dimension - (dimension / 100 * percentage); //РЈРјРµРЅСЊС€Р°РµРј РІС‹СЃРѕС‚Сѓ РЅР° Р·Р°РґР°РЅРЅС‹Р№ РїСЂРѕС†РµРЅС‚
          lightBlockHeight -= cropper.minW - cropper.minH;
        } else if (cropper.minW < cropper.minH) {
          lightBlockWidth -= cropper.minH - cropper.minW;
        }

        if (lightBlockWidth < cropper.minW || lightBlockHeight < cropper.minH) {
          //Р•СЃР»Рё РїРѕР»СѓС‡РµРЅРЅР°СЏ С€РёСЂРёРЅР° Рё/РёР»Рё РІС‹СЃРѕС‚Р° РјРµРЅСЊС€Рµ РјРёРЅРёРјР°Р»СЊРЅС‹С…
          lightBlockWidth = cropper.minW;
          lightBlockHeight = cropper.minH;
        }
      }

      var lightBlockTopPos = Math.round(
          originalHeight / 2 - lightBlockHeight / 2
        ),
        lightBlockLeftPos = Math.round(originalWidth / 2 - lightBlockWidth / 2);

      lightBlockWidth = Math.round(lightBlockWidth);
      lightBlockHeight = Math.round(lightBlockHeight);

      var lightBlock = document.createElement("div");
      lightBlock.style.cssText =
        "position:absolute;top:" +
        lightBlockTopPos +
        "px;left:" +
        lightBlockLeftPos +
        "px;width:" +
        lightBlockWidth +
        "px;height:" +
        lightBlockHeight +
        "px;";
      lightBlock.setAttribute("id", cropper.settings.id + "lightBlock");

      mainContainer.appendChild(lightBlock);

      var viewport = document.createElement("div");
      viewport.style.cssText =
        "cursor:move;position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;";

      /* 						viewport.ondblclick = function() {
             cropper.fullScreen();
             }; */

      viewport.onmousedown = function (e) {
        cropper.hooks.highlight("up");
        cropper.draganddrop(e);
      };

      document.body.onmouseup = function (e) {
        cropper.hooks.highlight("down");
        this.onmousemove = null;

        if (cropper.events.onMyMouseUp !== null) {
          cropper.events.onMyMouseUp(e);
          cropper.events.onMyMouseUp = null;
        }

        cropper.info = cropper.getInfo();
      };

      lightBlock.appendChild(viewport);

      var lightImage = image.cloneNode();
      lightImage.setAttribute("id", cropper.settings.id + "lightImage");
      lightImage.style.cssText =
        "position:absolute;top:-" +
        lightBlockTopPos +
        "px;left:-" +
        lightBlockLeftPos +
        "px;";

      viewport.appendChild(lightImage);

      if (cropper.settings.tools) {
        var photoRotate = document.createElement("div");
        photoRotate.className = "webCropper_photoRotate";
        photoRotate.style.cssText =
          "background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAATCAYAAAANgSQ9AAAB+UlEQVR4AdWW1a1dQQxFc+gxMzMzM2ML6SlQQLCQfOcvnBpCBdzvkz3SSmSN5jFbWg/G9va+6HnkRSRikYj0nCT0RDenRZAsEuWiWtSKOlEfglwtteX0xteuZSIiUV0oFN7lFwzXwwDEr00r8p/FctGWXzJcLxrptWl5z2aC+4GcWF5efqz/D8WO2LJwduhqjPCAeQauSyuxJlPeF6OmcF8siUkx5jFJbt/Uj6JRfI1aqW+yXozlBI39opmcpZnckqkfI1dyfVpnm5xEoJS8pZTcZNjkdWmdbdIvPG99yTVoPVyTmWgQE6ZwgrPs5kyef3aEcIuYMYUznJWIGJJrek8mRvOM2fJHQ/nPnz+f5164M+WqELcrrkn0Hx8fH5zHpKtz9aLJrj90q06aTU3y76WrFD3fv39/mRNfv359pbM+Btb9+fPnaR6OM74nw+H0zD7vc/NywvlwfvCV/n8mRbuY+fjx41sHT3m3aDzLoPLvQxvHnZ/DaCNz/Nnt9pmMefS1FI9CDwJ17NIRsSDWWWe7sCGmQrub8w1Tu0X/Anpt6DcybxS68VNs93ciSngGGqCaYeUIdfC+GkFojN8Doi10C+J8wKsfQacD3XLwZ5eIJHSfTEURZBRlNFSKGoQvfZ/kdw16Jd6cIkjRCEYUgobkWm/mpi+Iib8l/PafOQcjIgAAAABJRU5ErkJggg==') no-repeat -2px 3px;\
							display: inline-block;\
							width: 20px; height: 23px;\
							cursor: pointer;\
							opacity: 0.65;\
							position: absolute; bottom:0; right:20px";

        photoRotate.onclick = function () {
          cropper.photoRotate("left");
        };

        mainContainer.appendChild(photoRotate);

        photoRotate = photoRotate.cloneNode();
        photoRotate.style.backgroundPosition = "-22px 3px";
        photoRotate.style.right = "0";

        photoRotate.onclick = function () {
          cropper.photoRotate("right");
        };

        mainContainer.appendChild(photoRotate);
      }

      cropper.hooks.add(lightBlock);

      cropper.info = cropper.getInfo();

      if (cropper.settings.preview) {
        lightBlock.style.border = "1px solid hsla(0,0%,100%,.3)";
        viewport.style.borderRadius = "50%";

        var previewWrap = document.createElement("div");
        previewWrap.style.display = "inline-block";
        previewWrap.style.textAlign = "left";
        previewWrap.style.width = "100px";
        previewWrap.style.verticalAlign = "top";
        previewWrap.style.marginLeft = "20px";

        var preview = document.createElement("div");
        preview.style.display = "inline-block";
        preview.style.position = "relative";
        preview.style.borderRadius = "50%";
        preview.style.overflow = "hidden";
        preview.style.width = "100px";
        preview.style.height = "100px";
        preview.setAttribute("id", cropper.settings.id + "preview");

        var imagePreview = image.cloneNode();
        imagePreview.setAttribute("id", cropper.settings.id + "imagePreview");
        imagePreview.style.cssText =
          "position:absolute;top:0;left:0;width:auto;height:auto;";

        preview.appendChild(imagePreview);

        previewWrap.appendChild(preview);

        preview = preview.cloneNode();
        preview.style.width = "50px";
        preview.style.height = "50px";
        preview.style.marginTop = "15px";
        preview.setAttribute("id", cropper.settings.id + "preview2");

        imagePreview = imagePreview.cloneNode();
        imagePreview.setAttribute("id", cropper.settings.id + "imagePreview2");

        preview.appendChild(imagePreview);

        previewWrap.appendChild(preview);

        wrap.appendChild(previewWrap);

        var preview = document.getElementById(
          cropper.settings.id + "imagePreview"
        );
        var preview2 = document.getElementById(
          cropper.settings.id + "imagePreview2"
        );
        var originalW = image.clientWidth;
        var originalH = image.clientHeight;
        var info = cropper.getFixedInfo();
        var newWidth = info.dark.w - (info.light.x - info.dark.x);
        var newHeight = info.dark.h - (info.light.y - info.dark.y);
        var LI = document.getElementById(cropper.settings.id + "lightImage");

        if (originalH > originalW) {
          var percentage = ((newWidth - 100) / newWidth) * 100;
          percentage = originalW - (originalW / 100) * percentage;
          preview.style.width = percentage + "px";

          percentage = ((newWidth - 50) / newWidth) * 100;
          percentage = originalW - (originalW / 100) * percentage;

          preview2.style.width = percentage + "px";
        } else {
          var percentage = ((newHeight - 100) / newHeight) * 100;
          percentage = originalW - (originalW / 100) * percentage;

          preview.style.height = percentage + "px";

          percentage = ((newHeight - 50) / newHeight) * 100;
          percentage = originalW - (originalW / 100) * percentage;

          preview2.style.height = percentage + "px";
        }

        percentage =
          ((LI.clientHeight - info.light.h - (preview.clientHeight - 100)) /
            (LI.clientHeight - info.light.h)) *
          100;
        tmp = info.light.y - info.dark.y;

        percentage = tmp - (tmp / 100) * percentage;

        preview.style.top = "-" + percentage + "px";

        percentage =
          ((LI.clientWidth - info.light.w - (preview.clientWidth - 100)) /
            (LI.clientWidth - info.light.w)) *
          100;
        tmp = info.light.x - info.dark.x;
        percentage = tmp - (tmp / 100) * percentage;

        preview.style.left = "-" + percentage + "px";

        percentage =
          ((LI.clientHeight - info.light.h - (preview2.clientHeight - 50)) /
            (LI.clientHeight - info.light.h)) *
          100;
        tmp = info.light.y - info.dark.y;
        percentage = tmp - (tmp / 100) * percentage;

        preview2.style.top = "-" + percentage + "px";

        percentage =
          ((LI.clientWidth - info.light.w - (preview2.clientWidth - 50)) /
            (LI.clientWidth - info.light.w)) *
          100;
        tmp = info.light.x - info.dark.x;
        percentage = tmp - (tmp / 100) * percentage;

        preview2.style.left = "-" + percentage + "px";
      }
    };

    image.src = file;
  },
  customSelection: function (e) {
    if (cropper.settings.preview) return;

    e.preventDefault();

    var info = this.getFixedInfo();

    var fixedX = e.pageX - info.dark.x,
      fixedY = e.pageY - info.dark.y;

    (fixedPageX = e.pageX), (fixedPageY = e.pageY);

    var lightBlock = info.light.block;

    var LI = document.getElementById(cropper.settings.id + "lightImage");

    var tmp;
    var init = true;

    cropper.events.onMyMouseUp = function (e) {
      var info = cropper.getFixedInfo();

      var X, Y;
      //console.log(cropper.minW);
      if (!init) {
        //Р•СЃР»Рё Р±С‹Р» СЃРґРµР»Р°РЅ РЅРµ РїСЂРѕСЃС‚Рѕ РєР»РёРє, РЅРѕ РµС‰С‘ Рё РґРІРёР¶РµРЅРёРµ
        if (cropper.minW > info.light.w) {
          info.light.w = cropper.minW;
          info.light.block.style.width = cropper.minW + "px";
        }

        if (cropper.minH > info.light.h) {
          info.light.h = cropper.minH;
          info.light.block.style.height = cropper.minH + "px";
        }

        X = info.light.x - info.dark.x;
        Y = info.light.y - info.dark.y;
      } else {
        X = e.pageX - info.dark.x - info.light.w / 2;
        Y = e.pageY - info.dark.y - info.light.h / 2;
      }

      if (cropper.settings.resize == "saveProportions") {
        var newDimension = Math.max(info.light.w, info.light.h);

        if (newDimension > info.dark.w || newDimension > info.dark.h)
          newDimension = Math.min(info.light.w, info.light.h);

        if (cropper.minW > cropper.minH) {
          info.light.w = info.light.h = newDimension;

          info.light.h -= cropper.minW - cropper.minH; //РЈРјРµРЅСЊС€Р°РµРј РІС‹СЃРѕС‚Сѓ, С‡С‚РѕР±С‹ СЃРѕС…СЂР°РЅРёС‚СЊ РїСЂРѕРїРѕСЂС†РёРѕРЅР°Р»СЊРЅРѕСЃС‚СЊ
        } else if (cropper.minW < cropper.minH) {
          info.light.w = info.light.h = newDimension;

          info.light.w -= cropper.minH - cropper.minW;
        } else {
          info.light.w = info.light.h = newDimension;
        }

        info.light.block.style.width = info.light.w + "px";
        info.light.block.style.height = info.light.h + "px";
      }

      if (X < 0) X = 0; //Р•СЃР»Рё РІС‹С€РµР» Р·Р° Р»РµРІС‹Р№ РєСЂР°Р№
      else if (X > info.dark.w - info.light.w) X = info.dark.w - info.light.w; //Р•СЃР»Рё РІС‹С€РµР» Р·Р° РїСЂР°РІС‹Р№

      if (Y < 0) Y = 0;
      else if (Y > info.dark.h - info.light.h) Y = info.dark.h - info.light.h;

      lightBlock.style.top = Y + "px";
      LI.style.top = "-" + Y + "px";

      lightBlock.style.left = X + "px";
      LI.style.left = "-" + X + "px";
    };

    document.body.onmousemove = function (e) {
      if (init) {
        init = false;

        lightBlock.style.width = lightBlock.style.height = "0"; //РЎР±СЂР°СЃС‹РІР°РµС‚ С€РёСЂРёРЅСѓ Рё РІС‹СЃРѕС‚Сѓ

        lightBlock.style.top = fixedY + "px";
        lightBlock.style.left = fixedX + "px";

        LI.style.top = "-" + fixedY + "px";
        LI.style.left = "-" + fixedX + "px";
      }

      if (e.pageX > fixedPageX) {
        //Right
        if (e.pageX > info.dark.xx) tmp = info.dark.w - fixedX;
        else tmp = e.pageX - fixedPageX;

        lightBlock.style.width = tmp + "px";
      }

      if (e.pageY > fixedPageY) {
        //Down
        if (e.pageY > info.dark.yy) tmp = info.dark.h - fixedY;
        else tmp = e.pageY - fixedPageY;

        lightBlock.style.height = tmp + "px";
      }

      if (e.pageX < fixedPageX) {
        //Left
        if (e.pageX < info.dark.x) {
          tmp = fixedX;

          lightBlock.style.left = "0px";
          LI.style.left = "0px";
        } else {
          tmp = fixedPageX - e.pageX;

          lightBlock.style.left = e.pageX - info.dark.x + "px";
          LI.style.left = "-" + (e.pageX - info.dark.x) + "px";
        }

        lightBlock.style.width = tmp + "px";
      }

      if (e.pageY < fixedPageY) {
        //Top
        if (e.pageY < info.dark.y) {
          tmp = fixedY;

          lightBlock.style.top = "0px";
          LI.style.top = "0px";
        } else {
          tmp = fixedPageY - e.pageY;

          lightBlock.style.top = e.pageY - info.dark.y + "px";
          LI.style.top = "-" + (e.pageY - info.dark.y) + "px";
        }

        lightBlock.style.height = tmp + "px";
      }
    };
  },
  photoRotate: function (direction) {
    if (direction == "right") {
      this.deg += 90;
      if (this.deg == 360) this.deg = 0;
    } else {
      this.deg -= 90;
      if (this.deg < 0) this.deg = 270;
    }

    var LI = document.getElementById(cropper.settings.id + "lightImage");

    var info = this.getFixedInfo();

    if (direction == "right") {
      var shift1 = info.light.x - info.dark.x; //Left
      var shift2 = info.dark.yy - info.light.yy; //Bottom
    } else {
      var shift1 = info.dark.xx - info.light.xx; //Right
      var shift2 = info.light.y - info.dark.y; //Top
    }

    info.light.block.style.width = info.light.h + "px";
    info.light.block.style.height = info.light.w + "px";

    var newMinWidth = this.minH,
      newMinHeight = this.minW;

    this.minW = newMinWidth;
    this.minH = newMinHeight;

    info.light.block.style.top = shift1 + "px";
    info.light.block.style.left = shift2 + "px";

    LI.style.top = "-" + shift1 + "px";
    LI.style.left = "-" + shift2 + "px";

    var bigImage = document.getElementById(cropper.settings.id + "bigImage");

    var h = bigImage.clientWidth,
      w = bigImage.clientHeight;

    if (this.deg == 90 || this.deg == 270) {
      //РќР° 90 Рё 270 РіСЂР°РґСѓСЃР°С… РјРµРЅСЏРµРј РјРµСЃС‚Р°РјРё СЂР°Р·РјРµСЂС‹ С€РёСЂРёРЅС‹ Рё РІС‹СЃРѕС‚С‹
      h = bigImage.clientHeight;
      w = bigImage.clientWidth;
    }

    var mainContainer = document.getElementById(
      cropper.settings.id + "mainContainer"
    );
    mainContainer.style.width = h + "px";
    mainContainer.style.height = w + "px";

    if (h > w && bigImage.clientHeight > bigImage.clientWidth) {
      //Р•СЃР»Рё РїРѕСЂС‚СЂРµС‚
      bigImage.style.marginTop = "-" + (h - w) / 2 + "px";
      bigImage.style.marginLeft = (h - w) / 2 + "px";

      LI.style.marginTop = "-" + (h - w) / 2 + "px";
      LI.style.marginLeft = (h - w) / 2 + "px";
    } else if (h < w && bigImage.clientHeight < bigImage.clientWidth) {
      //Р•СЃР»Рё Р°Р»СЊР±РѕРј
      bigImage.style.marginTop = (w - h) / 2 + "px";
      bigImage.style.marginLeft = "-" + (w - h) / 2 + "px";

      LI.style.marginTop = (w - h) / 2 + "px";
      LI.style.marginLeft = "-" + (w - h) / 2 + "px";
    } else {
      bigImage.style.marginTop = "0";
      bigImage.style.marginLeft = "0";

      LI.style.marginTop = "0";
      LI.style.marginLeft = "0";
    }

    var transform_rotate =
      "transform: rotate(" +
      this.deg +
      "deg);-ms-transform: rotate(" +
      this.deg +
      "deg);-moz-transform: rotate(" +
      this.deg +
      "deg);-webkit-transform: rotate(" +
      this.deg +
      "deg);-o-transform: rotate(" +
      this.deg +
      "deg);";

    bigImage.style.cssText = bigImage.style.cssText + transform_rotate;
    LI.style.cssText = LI.style.cssText + transform_rotate;
  },
  draganddrop: function (e) {
    e.preventDefault();

    var info = this.getFixedInfo();

    var fixedPosX = e.pageX - info.light.x, //Р Р°СЃСЃС‚РѕСЏРЅРёРµ РѕС‚ РєСѓСЂСЃРѕСЂР° РјС‹С€Рё РґРѕ Р»РµРІРѕР№ РіСЂР°РЅРёС†С‹ lightBlock
      fixedPosY = e.pageY - info.light.y,
      xCoordinate,
      yCoordinate,
      LI = document.getElementById(cropper.settings.id + "lightImage");

    document.body.onmousemove = function (e) {
      xCoordinate = e.pageX - info.dark.x - fixedPosX; //Р Р°СЃСЃС‚РѕСЏРЅРёРµ РѕС‚ Р»РµРІРѕР№ РіСЂР°РЅРёС†С‹ darkBlock РґРѕ Р»РµРІРѕР№ РіСЂР°РЅРёС†С‹ ligthBlock
      yCoordinate = e.pageY - info.dark.y - fixedPosY;

      if (e.pageX - fixedPosX < info.dark.x) {
        //Р—Р°РїСЂРµС‰Р°РµРј РїРµСЂРµРјРµС‰Р°С‚СЊ Р±Р»РѕРє Р·Р° Р»РµРІСѓСЋ РѕР±Р»Р°СЃС‚СЊ РІРёРґРёРјРѕСЃС‚Рё
        xCoordinate = 0;
      } else if (
        e.pageX + (info.light.w - fixedPosX) >
        info.dark.x + info.dark.w
      ) {
        //Р•СЃР»Рё Р±Р»РѕРє ligthBlock РІС‹С…РѕРґРёС‚ Р·Р° РїСЂРµРґРµР»С‹ РїСЂР°РІРѕР№ РіСЂР°РЅРёС†С‹ Р±Р»РѕРєР° darkBlock
        xCoordinate = info.dark.w - info.light.w;
      }

      info.light.block.style.left = xCoordinate + "px";
      LI.style.left = "-" + xCoordinate + "px";

      if (cropper.settings.preview) {
        var preview = document.getElementById(
          cropper.settings.id + "imagePreview"
        );
        var preview2 = document.getElementById(
          cropper.settings.id + "imagePreview2"
        );

        var percentage =
          ((LI.clientWidth - info.light.w - (preview.clientWidth - 100)) /
            (LI.clientWidth - info.light.w)) *
          100;
        percentage = xCoordinate - (xCoordinate / 100) * percentage;

        preview.style.left = "-" + percentage + "px";

        percentage =
          ((LI.clientWidth - info.light.w - (preview2.clientWidth - 50)) /
            (LI.clientWidth - info.light.w)) *
          100;
        percentage = xCoordinate - (xCoordinate / 100) * percentage;

        preview2.style.left = "-" + percentage + "px";
      }

      if (e.pageY - fixedPosY < info.dark.y) {
        yCoordinate = 0;
      } else if (
        e.pageY + (info.light.h - fixedPosY) >
        info.dark.y + info.dark.h
      ) {
        yCoordinate = info.dark.h - info.light.h;
      }

      info.light.block.style.top = yCoordinate + "px";
      LI.style.top = "-" + yCoordinate + "px";

      if (cropper.settings.preview) {
        percentage =
          ((LI.clientHeight - info.light.h - (preview.clientHeight - 100)) /
            (LI.clientHeight - info.light.h)) *
          100;
        percentage = yCoordinate - (yCoordinate / 100) * percentage;
        preview.style.top = "-" + percentage + "px";
        percentage =
          ((LI.clientHeight - info.light.h - (preview2.clientHeight - 50)) /
            (LI.clientHeight - info.light.h)) *
          100;
        percentage = yCoordinate - (yCoordinate / 100) * percentage;
        preview2.style.top = "-" + percentage + "px";
      }
    };
  },
  hooks: {
    highlight: function (mode) {
      var i = 0,
        square;
      while (true) {
        square = document.getElementById(cropper.settings.id + "hook" + i);
        if (!square) break;
        if (mode == "up") square.style.opacity = "0.7";
        else square.style.opacity = "0.3";
        i++;
      }
    },
    /*
     * @param string mode straight | angular | empty
     */
    add: function (container) {
      var angularSides = [
        "cursor:nw-resize;top:-5px;left:-5px;", //Р’РІРµСЂС… Рё РІР»РµРІРѕ
        "cursor:ne-resize;top:-5px;right:-5px;", //Р’РІРµСЂС… Рё РІРїСЂР°РІРѕ
        "cursor:se-resize;right:-5px;bottom:-5px;", //Р’РЅРёР· Рё РІРїСЂР°РІРѕ
        "cursor:sw-resize;left:-5px;bottom:-5px;", //Р’РЅРёР· Рё РІР»РµРІРѕ
      ];

      var straightSides = [
        "cursor:n-resize;top:0;left:50%;margin:-5px 0 0 -5px;", //Р’РІРµСЂС…
        "cursor:e-resize;top:50%;right:0;margin:-5px -5px 0 0;", //Р’РїСЂР°РІРѕ
        "cursor:s-resize;bottom:0;left:50%;margin:0 0 -5px -5px;", //Р’РЅРёР·
        "cursor:w-resize;top:50%;left:0;margin:-5px 0 0 -5px;", //Р’Р»РµРІРѕ
      ];

      var squares;

      if (cropper.settings.hooks == "straight") squares = straightSides;
      else if (cropper.settings.hooks == "angular") squares = angularSides;
      else squares = angularSides.concat(straightSides);

      var square;

      for (var i = 0; i < squares.length; i++) {
        square = document.createElement("div");
        square.style.cssText =
          squares[i] +
          "width:10px;height:10px;background:#f2f2f2;position:absolute;box-shadow: 0 0 0 1px rgba(0,0,0,.2);opacity: 0.3;";

        square.setAttribute("id", cropper.settings.id + "hook" + i);

        square.onmousedown = function (e) {
          cropper.hooks.highlight("up");
          cropper.resize.start(e);
        };

        container.appendChild(square);
      }
    },
  },
  resize: {
    start: function (e, mode) {
      e.preventDefault();

      var direction = {
        top: false,
        right: false,
        bottom: false,
        left: false,
      };

      var cursor = e.target.style.cursor;

      if (cursor == "se-resize") direction.right = direction.bottom = true;
      else if (cursor == "n-resize") direction.top = true;
      else if (cursor == "nw-resize") direction.left = direction.top = true;
      else if (cursor == "e-resize") direction.right = true;
      else if (cursor == "sw-resize") direction.left = direction.bottom = true;
      else if (cursor == "s-resize") direction.bottom = true;
      else if (cursor == "ne-resize") direction.right = direction.top = true;
      else if (cursor == "w-resize") direction.left = true;

      var info = cropper.getFixedInfo();

      var topSideOffset = info.light.y - info.dark.y,
        rightSideOffset = info.dark.xx - info.light.xx,
        bottomSideOffset = info.dark.yy - info.light.yy,
        leftSideOffset = info.light.x - info.dark.x,
        fixedPageX = e.pageX,
        fixedPageY = e.pageY;

      var LI = document.getElementById(cropper.settings.id + "lightImage");

      var tmp;

      var minWidth = cropper.minW,
        maxWidth,
        newWidth = null,
        minHeight = cropper.minH,
        maxHeight,
        newHeight = null;

      if (cropper.settings.preview) {
        var preview = document.getElementById(
          cropper.settings.id + "imagePreview"
        );
        var preview2 = document.getElementById(
          cropper.settings.id + "imagePreview2"
        );
        var originalW = LI.clientWidth;
        var originalH = LI.clientHeight;
      }

      document.body.onmousemove = function (e) {
        if (direction.right) {
          maxWidth = rightSideOffset;
          newWidth = e.pageX - fixedPageX;

          if (
            newWidth + info.light.w < 0 &&
            cropper.settings.resize != "saveProportions"
          ) {
            direction.right = false;
            direction.left = true;
            fixedPageX -= info.light.w;
            info.light.w = minWidth;
          }
        }

        if (direction.bottom) {
          maxHeight = bottomSideOffset;
          newHeight = e.pageY - fixedPageY;

          if (
            newHeight + info.light.h < 0 &&
            cropper.settings.resize != "saveProportions"
          ) {
            direction.bottom = false;
            direction.top = true;
            fixedPageY -= info.light.h;
            info.light.h = minHeight;
          }
        }

        if (direction.left) {
          maxWidth = leftSideOffset;
          newWidth = fixedPageX - e.pageX;

          if (
            newWidth + info.light.w < 0 &&
            cropper.settings.resize != "saveProportions"
          ) {
            direction.right = true;
            direction.left = false;
            fixedPageX += info.light.w;
            info.light.w = minWidth;
          }
        }

        if (direction.top) {
          maxHeight = topSideOffset;
          newHeight = fixedPageY - e.pageY;

          if (
            newHeight + info.light.h < 0 &&
            cropper.settings.resize != "saveProportions"
          ) {
            direction.bottom = true;
            direction.top = false;
            fixedPageY += info.light.h;
            info.light.h = minHeight;
          }
        }

        if (cropper.settings.resize == "saveProportions") {
          newWidth = newHeight = Math.max(newWidth, newHeight);

          if (newWidth > maxWidth)
            newWidth = newHeight = Math.min(maxWidth, maxHeight);
          else if (newHeight > maxHeight)
            newWidth = newHeight = Math.min(maxWidth, maxHeight);

          newWidth += info.light.w;
          maxWidth += info.light.w;

          newHeight += info.light.h;
          maxHeight += info.light.h;

          if (newWidth < minWidth) newWidth = minWidth;
          if (newHeight < minHeight) newHeight = minHeight;
          if (cropper.settings.preview) {
            var dinfo = cropper.getFixedInfo();
            if (originalH > originalW) {
              var percentage = ((newWidth - 100) / newWidth) * 100;
              percentage = originalW - (originalW / 100) * percentage;
              //	console.log(percentage);
              //preview.style.width = (originalW - (newWidth - 100)) +"px";
              preview.style.width = percentage + "px";

              percentage = ((newWidth - 50) / newWidth) * 100;
              percentage = originalW - (originalW / 100) * percentage;
              console.log(percentage);
              //preview2.style.width = (originalW - (newWidth - 50)) +"px";
              preview2.style.width = percentage + "px";
            } else {
              var percentage = ((newHeight - 100) / newHeight) * 100;
              percentage = originalW - (originalW / 100) * percentage;

              preview.style.height = percentage + "px";

              percentage = ((newHeight - 50) / newHeight) * 100;
              percentage = originalW - (originalW / 100) * percentage;

              preview2.style.height = percentage + "px";
            }

            percentage =
              ((LI.clientHeight - newHeight - (preview.clientHeight - 100)) /
                (LI.clientHeight - newHeight)) *
              100;
            tmp = dinfo.light.y - info.dark.y;
            percentage = tmp - (tmp / 100) * percentage;
            console.log(percentage);
            //if ( percentage > 0 ) percentage = 0;

            preview.style.top = "-" + percentage + "px";

            percentage =
              ((LI.clientWidth - newWidth - (preview.clientWidth - 100)) /
                (LI.clientWidth - newWidth)) *
              100;
            tmp = dinfo.light.x - info.dark.x;
            percentage = tmp - (tmp / 100) * percentage;
            //if ( percentage > 0 ) percentage = 0;

            preview.style.left = "-" + percentage + "px";

            percentage =
              ((LI.clientHeight - newHeight - (preview2.clientHeight - 50)) /
                (LI.clientHeight - newHeight)) *
              100;
            tmp = dinfo.light.y - info.dark.y;
            percentage = tmp - (tmp / 100) * percentage;
            //if ( percentage > 0 ) percentage = 0;

            preview2.style.top = "-" + percentage + "px";

            percentage =
              ((LI.clientWidth - newWidth - (preview2.clientWidth - 50)) /
                (LI.clientWidth - newWidth)) *
              100;
            tmp = dinfo.light.x - info.dark.x;
            percentage = tmp - (tmp / 100) * percentage;
            //if ( percentage > 0 ) percentage = 0;

            preview2.style.left = "-" + percentage + "px";
          }

          info.light.block.style.width = newWidth + "px";
          info.light.block.style.height = newHeight + "px";
        } else {
          if (newWidth != null) {
            newWidth += info.light.w;
            maxWidth += info.light.w;

            if (newWidth > maxWidth) newWidth = maxWidth;
            else if (newWidth < minWidth) newWidth = minWidth;

            info.light.block.style.width = newWidth + "px";
          }

          if (newHeight != null) {
            newHeight += info.light.h;
            maxHeight += info.light.h;

            if (newHeight > maxHeight) newHeight = maxHeight;
            else if (newHeight < minHeight) newHeight = minHeight;

            info.light.block.style.height = newHeight + "px";
          }
        }

        if (direction.left) {
          //РЎРјРµС‰РµРЅРёРµ lightBlock Рё lightImage
          tmp = maxWidth - newWidth;

          info.light.block.style.left = tmp + "px";
          LI.style.left = "-" + tmp + "px";
        }

        if (direction.top) {
          tmp = maxHeight - newHeight;

          info.light.block.style.top = tmp + "px";
          LI.style.top = "-" + tmp + "px";
        }
      };
    },
  },
  /* fullScreen: function()//РџСЂРё РґРІРѕР№РЅРѕРј РєР»РёРєРµ СЂР°Р·РІРѕСЂР°С‡РёРІР°РµРј РѕРєРЅРѕ РЅР° РІСЃСЋ РєР°СЂС‚РёРЅРєСѓ
     {
     var dark = document.getElementById(cropper.settings.id +"darkBlock"),
     light = document.getElementById(cropper.settings.id +"lightBlock"),
     maxDistance = Math.min((dark.clientWidth - light.clientWidth), (dark.clientHeight - light.clientHeight));
     
     
     light.style.width = (light.clientWidth + maxDistance) +"px";
     light.style.height = (light.clientHeight + maxDistance) +"px";
     light.style.top = light.style.left = "0";
     
     
     var LI = document.getElementById(cropper.settings.id +"lightImage");
     LI.style.left = LI.style.top = "0";
     }, */

  getInfo: function () {
    var info = this.getFixedInfo();

    return {
      w: info.light.w,
      h: info.light.h,
      x: info.light.x - info.dark.x,
      y: info.light.y - info.dark.y,
      deg: this.deg,
    };
  },
};
