/*!
 * color-palette v1.1.1 - Simple color picker. A user can choose to take a color from palette.
 * Copyright 2016 hironobu-igawa
 * license MIT
 */
var ColorPalette;
(function(module) {
  'use strict';

  module.Element = (function() {
    function Element(content) {
      if (!(this instanceof Element)) {
        var obj = new $;
        $.apply(obj, arguments);
        return obj;
      }

      if (content == null) {
        this.elements = [];
        return;
      }

      if (content instanceof HTMLElement || content instanceof HTMLDocument) {
        this.elements = [content];
        return;
      }

      if (content instanceof Element) {
        this.elements = Array.prototype.slice.apply(content.elements);
        return;
      }

      if (content[0] instanceof HTMLElement || content[0] instanceof HTMLDocument) {
        this.elements = Array.prototype.slice.apply(content);
        return;
      }

      if (typeof content == 'string' || content instanceof String) {
        if (content[0] === '<' && content[content.length - 1] === '>') {
          var element = document.createElement('div');
          element.innerHTML = content;
          this.elements = Array.prototype.slice.apply(element.children);
          return;
        }
        this.elements = Array.prototype.slice.apply(document.querySelectorAll(content));
        return;
      }

      this.elements = [];
    }
    
    Element.prototype.get = function(key) {
      return this.elements[key];
    };

    Element.prototype.on = function(type, listener) {
      return this.each(function() { this.addEventListener(type, listener); });
    };

    Element.prototype.off = function(type, listener) {
      return this.each(function() { this.removeEventListener(type, listener); });
    };

    Element.prototype.append = function(content) {
      return this.each(function() {
        var element = this;
        $(content).each(function() {element.appendChild(this)});
      });
    };

    Element.prototype.appendTo = function(content) {
      $(content).append(this);
      return $(this);
    };

    Element.prototype.after = function(content) {
      return this.each(function() {
        var e = this;
        $(content).each(function() {e.parentNode.insertBefore(this, e.nextSibling)});
      });
    };

    Element.prototype.remove = function() {
      return this.each(function() {this.parentNode.removeChild(this)});
    };

    Element.prototype.parent = function() {
      return $(!this.isBlank() ? this.get(0).parentNode : null);
    };

    Element.prototype.addClass = function(className) {
      return this.each(function() {this.classList.add(className)});
    };

    Element.prototype.hasClass = function(className) {
      return this.elements.some(function(e) {
        return e.classList.contains(className)
      });
    };

    Element.prototype.css = function(key, value) {
      key = key.replace(/[-_](.)/g, function(m, g) { return g.toUpperCase(); });
      if (value === undefined)
        return !this.isBlank() ? this.get(0).style[key] : undefined;

      if (this.isBlank()) return $(this);
      return this.each(function() {this.style[key] = value});
    };

    Element.prototype.data = function(key, value) {
      key = key.replace(/[-_](.)/g, function(m, g) { return g.toUpperCase(); });
      if (value === undefined)
        return !this.isBlank() ? this.get(0).dataset[key] : undefined;

      if (this.isBlank()) return $(this);
      return this.each(function() {this.dataset[key] = value});
    };

    Element.prototype.val = function(value) {
      if (arguments.length === 0) return !this.isBlank() ? this.get(0).value : undefined;
      return this.each(function() {this.value = value});
    };

    Element.prototype.trigger = function(eventName) {
      return this.each(function() {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
        this.dispatchEvent(event);
      });
    };

    Element.prototype.change = function() {
      return this.trigger('change');
    };

    Element.prototype.each = function(callback) {
      this.elements.forEach(function(e) {callback.call(e)});
      return $(this);
    };

    Element.prototype.isBlank = function() {
      return this.elements == null || this.elements.length === 0;
    };

    return Element;
  }());

  var $ = ColorPalette.Element;
})(ColorPalette || (ColorPalette = {}));

var ColorPalette;
(function (module) {
  'use strict';

  module.BackgroundChanger = (function() {
    function BackgroundChanger($target) {
      this.$target = $target;
      this.$target.on('change', this.change.bind(this));
    }

    BackgroundChanger.init = function($target) {
      return new BackgroundChanger($target);
    };

    BackgroundChanger.prototype.change = function() {
      if (!this.isActive()) return;
      this.$target
        .css('background-color', this.color)
        .css('color', this.isBright() ? '#000000' : '#FFFFFF');
    };

    BackgroundChanger.prototype.isActive = function() {
      return module.settings.backgroundChangeFlag || false;
    };

    BackgroundChanger.prototype.isBright = function() {
      var red = parseInt(this.color.substr(1, 2), 16);
      var green = parseInt(this.color.substr(3, 2), 16);
      var blue = parseInt(this.color.substr(5, 2), 16);
      var max = Math.max(red, green, blue);
      var min = Math.min(red, green, blue);
      var saturation = ((max - min) / max) * 100;
      var value = (max / 255) * 100;
      return value - saturation >= 50;
    };

    Object.defineProperty(BackgroundChanger.prototype, 'color', {
      get: function() {
        var value = this.$target.val();
        return module.RGB.isValid(value) ? value : '#FFFFFF';
      }
    });

    return BackgroundChanger;
  }());
})(ColorPalette || (ColorPalette = {}));

var ColorPalette;
(function (module) {
  'use strict';

  module.ColorPalette = (function () {
    function ColorPalette(content) {
      this.$target = $(content);
      this.backgroundChanger = module.BackgroundChanger.init(this.$target);
      this.backgroundChanger.change();
      this.closeListeners = [];
    }

    ColorPalette.prototype.open = function () {
      var _this = this;
      setTimeout(function() {
        if (_this.isOpen()) return;
        _this.initPaletteElement();
      }, 20);
    };

    ColorPalette.prototype.close = function () {
      var _this = this;
      setTimeout(function() {
        if (!_this.isOpen()) return;
        _this.destroyPaletteElement();
      }, 20);
    };

    ColorPalette.prototype.select = function (color) {
      this.$target.val(color);
      this.$target.change();
    };

    ColorPalette.prototype.selectOtherColor = function () {
      var _this = this;
      module.OtherColor.select(function (color) {
        if (!module.RGB.isValid(color)) return;
        _this.select(color);
      });
      _this.close();
    };

    ColorPalette.prototype.initPaletteElement = function () {
      var _this = this;
      var $balloon = null;
      var $standardColors = null;

      var initBalloon = function() {
        $balloon = $('<div>').addClass('color-palette-balloon');
        _this.$target.after($balloon);

        var close1 = function(e) {
          for (var t = e.srcElement; t != null; t = t.parentElement)
            if (t === $balloon.get(0) || t === _this.$target.get(0)) return;
          _this.close();
        };
        $(document).on('click', close1);

        var close2 = function() {
          _this.close();
        };
        $(document).on('scroll', close2);

        _this.closeListeners.push(function() {
          $(document).off('click', close1);
          $(document).off('scroll', close2);
        });
      };

      var afterInitBalloon = function() {
        $balloon
          .css('left', _this.xOffset + 'px')
          .css('top', _this.yOffset + 'px');
      };

      var initStandardColors = function() {
        if (module.OtherColor.isActive()) {
          $('<span>' + module.messages.standardColor + '</span>')
            .addClass('color-palette-standard-colors-title')
            .appendTo($balloon);
        }

        $standardColors = $('<ul>')
          .addClass('color-palette-standard-colors-table')
          .appendTo($balloon);
        module.colors.forEach(function (colors) {
          var $row = $('<ul>')
            .addClass('color-palette-standard-colors-row')
            .appendTo($('<li>').appendTo($standardColors));

          colors.forEach(function (color) {
            $('<li>')
              .css('background-color', color)
              .data('color', color)
              .on('click', _this.select.bind(_this, color))
              .appendTo($row);
          });
        });
      };

      var initOtherColors = function() {
        if (!module.OtherColor.isActive()) return;

        $('<span>' + module.messages.history + '</span>')
          .addClass('color-palette-history-title')
          .appendTo($balloon);

        var $history = $('<ul>')
          .addClass('color-palette-history')
          .css('width', $standardColors.get(0).offsetWidth + 'px')
          .appendTo($balloon);
        module.OtherColor.query().forEach(function (color) {
          $('<li>')
            .css('background-color', color)
            .data('color', color)
            .on('click', _this.select.bind(_this, color))
            .appendTo($history);
        });

        $('<button type="button" tabindex="-1">' + module.messages.selectOtherColor + '</button>')
          .addClass('color-palette-history-select-other-color')
          .on('click', _this.selectOtherColor.bind(_this))
          .appendTo($balloon);
      };

      initBalloon();
      initStandardColors();
      initOtherColors();

      this.$palette = $balloon;

      afterInitBalloon();
    };

    ColorPalette.prototype.destroyPaletteElement = function () {
      this.$palette.remove();
      this.$palette = null;
      this.closeListeners.forEach(function(listener) {listener()});
      this.closeListeners = [];
    };

    ColorPalette.prototype.isOpen = function () {
      return !!this.$palette;
    };

    Object.defineProperty(ColorPalette.prototype, 'xOffset', {
      get: function() {
        var target = this.$target.get(0);
        if (target == null) return 0;
        var rect = target.getBoundingClientRect();
        return rect.left;
      }
    });

    Object.defineProperty(ColorPalette.prototype, 'yOffset', {
      get: function() {
        var target = this.$target.get(0);
        if (target == null) return 0;
        var palette = this.$palette.get(0);
        if (palette == null) return 0;
        var rect = target.getBoundingClientRect();
        var targetHeight = Number(target.offsetHeight);
        var paletteHeight = Number(palette.offsetHeight);
        var yOffset = rect.top + targetHeight;
        return yOffset + paletteHeight <= window.innerHeight
          ? yOffset + 1
          : Math.max(yOffset - paletteHeight - targetHeight - 1, 0);
      }
    });

    return ColorPalette;
  }());

  var $ = module.Element;
})(ColorPalette || (ColorPalette = {}));

var ColorPalette;
(function (module) {
  'use strict';

  Object.defineProperty(module, 'colors', {
    get: function () {
      return module.settings.colors;
    }
  });
})(ColorPalette || (ColorPalette = {}));

var ColorPalette;
(function (module) {
  'use strict';

  module.init = function (param) {
    var $target = $(param);
    if ($target.elements.length > 1) {
      return $target.elements.map(function(e) {return module.init(e)});
    }
    var palette = new module.ColorPalette(param);
    if (!palette.$target.hasClass('color-palette-initialized')) {
      palette.$target.on('focus', function () {palette.open()});
      palette.$target.addClass('color-palette-initialized');
    }
    return palette;
  };

  var $ = module.Element;
})(ColorPalette || (ColorPalette = {}));

var ColorPalette;
(function (module) {
  'use strict';

  Object.defineProperty(module, 'messages', {
    get: function () {
      return module.settings.messages[module.settings.lang] || {};
    }
  });
})(ColorPalette || (ColorPalette = {}));

var ColorPalette;
(function (module) {
  'use strict';

  module.OtherColor = (function() {
    function OtherColor() {}

    OtherColor.query = function () {
      return OtherColor.histories;
    };

    OtherColor.save = function(color) {
      if (OtherColor.histories.some(function(c) {return c === color})) OtherColor.remove(color);
      OtherColor.histories = [color]
        .concat(OtherColor.histories)
        .slice(0, OtherColor.limit)
    };

    OtherColor.remove = function(color) {
      OtherColor.histories = OtherColor.histories.filter(function(c) {return c !== color});
    };

    OtherColor.select = function(done) {
      module.settings.selectOtherColor(function(color) {
        if (module.RGB.isValid(color)) OtherColor.save(color);
        done(color);
      });
    };

    OtherColor.isActive = function() {
      return module.settings.otherColorFlag || false;
    };

    Object.defineProperty(OtherColor, 'histories', {
      get: function () {
        return JSON.parse(localStorage.colorPaletteOtherColorHistories || '[]');
      },
      set: function (histories) {
        localStorage.colorPaletteOtherColorHistories = JSON.stringify(histories);
      }
    });

    Object.defineProperty(OtherColor, 'limit', {
      get: function () {
        return module.settings.otherColorLimit;
      }
    });

    return OtherColor;
  }());
})(ColorPalette || (ColorPalette = {}));

var ColorPalette;
(function (module) {
  'use strict';

  module.RGB = (function() {
    function RGB() {}

    RGB.isValid = function(color) {
      return (color && color.match) ? color.match(/^#[0-9a-fA-F]{6}$/) : false;
    };

    return RGB;
  }());
})(ColorPalette || (ColorPalette = {}));

var ColorPalette;
(function (module) {
  'use strict';

  module.settings = {
    colors: [
      ['#E60012', '#F39800', '#FFF100', '#8FC31F', '#009944', '#009E96'],
      ['#00A0E9', '#0068B7', '#1D2088', '#920783', '#E4007F', '#E5004F'],
      ['#000000', '#FFFFFF']
    ],
    lang: 'default',
    messages: {
      default: {
        standardColor: 'Standard Color',
        history: 'History',
        selectOtherColor: 'Other color...'
      }
    },
    backgroundChangeFlag: true,
    otherColorFlag: false,
    otherColorLimit: 6,
    selectOtherColor: function(done) {
      done(prompt('Please enter the RGB. example: "#00FFFF"'));
    }
  };
})(ColorPalette || (ColorPalette = {}));
