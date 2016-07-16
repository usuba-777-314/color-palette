/*!
 * color-palette v0.0.0 - Simple color picker. A user can choose to take a color from palette.
 * Copyright 2015 hironobu-igawa
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

  Object.defineProperty(module, 'backgroundChangeFlag', {
    get: function () {
      return module.settings.backgroundChangeFlag;
    }
  });
})(ColorPalette || (ColorPalette = {}));

var ColorPalette;
(function (module) {
  'use strict';

  module.ColorPalette = (function () {
    function ColorPalette(content) {
      var _this = this;
      this.$target = $(content);

      this.$target.on('change', function() {
        if (!module.backgroundChangeFlag) return;
        _this.$target
          .css('background-color', _this.color)
          .css('color', _this.isBright() ? '#000000' : '#FFFFFF');
      });
    }

    ColorPalette.prototype.open = function () {
      if (this.isOpen()) return;
      setTimeout(this.initPaletteElement.bind(this), 20);
    };

    ColorPalette.prototype.close = function () {
      if (!this.isOpen()) return;
      setTimeout(this.destroyPaletteElement.bind(this), 20);
    };

    ColorPalette.prototype.select = function (color) {
      this.$target.val(color);
      this.$target.change();
    };

    ColorPalette.prototype.initPaletteElement = function () {
      var _this = this;
      var $balloon = null;

      var initBalloon = function() {
        $balloon = $('<div>')
          .addClass('color-palette-balloon')
          .css('left', _this.xOffset + 'px')
          .css('top', _this.yOffset + 'px');

        var close1 = function(e) {
          for (var t = e.srcElement; t != null; t = t.parentElement)
            if (t === $balloon.get(0) || t === _this.$target.get(0)) return;
          _this.close();
          clearEvent();
        };
        $(document).on('click', close1);

        var close2 = function() {
          _this.close();
          clearEvent();
        };
        $(document).on('scroll', close2);

        var clearEvent = function() {
          $(document).off('click', close1);
          $(document).off('scroll', close2);
        };
      };

      var initStandardColors = function() {
        $('<span>' + module.messages.standardColor + '</span>')
          .addClass('color-palette-standard-colors-title')
          .appendTo($balloon);

        var $standardColors = $('<ul>')
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

      initBalloon();
      initStandardColors();

      this.$palette = $balloon;
      this.$target.after(this.$palette);
    };

    ColorPalette.prototype.destroyPaletteElement = function () {
      this.$palette.remove();
      this.$palette = null;
    };

    ColorPalette.prototype.isOpen = function () {
      return !!this.$palette;
    };

    ColorPalette.prototype.isBright = function() {
      var red = parseInt(this.color.substr(1, 2), 16);
      var green = parseInt(this.color.substr(3, 2), 16);
      var blue = parseInt(this.color.substr(5, 2), 16);
      var max = Math.max(red, green, blue);
      var min = Math.min(red, green, blue);
      var saturation = ((max - min) / max) * 100;
      var value = (max / 255) * 100;
      return value - saturation >= 50;
    };

    Object.defineProperty(ColorPalette.prototype, 'color', {
      get: function() {
        var value = this.$target.val();
        return value.match(/^#[0-9a-fA-F]{6}$/) ? value : '#FFFFFF';
      }
    });

    Object.defineProperty(ColorPalette.prototype, 'xOffset', {
      get: function() {
        var target = this.$target.get(0);
        if (target == null) return 0;
        var rect = target.getBoundingClientRect();
        return rect.left + window.pageXOffset;
      }
    });

    Object.defineProperty(ColorPalette.prototype, 'yOffset', {
      get: function() {
        var target = this.$target.get(0);
        if (target == null) return 0;
        var rect = target.getBoundingClientRect();
        return rect.top + window.pageYOffset + Number(target.offsetHeight) + 1;
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
    var palette = new module.ColorPalette(param);
    palette.$target.on('focus', function () {palette.open()});
    return palette;
  };
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

  module.settings = {
    colors: [
      ['#E60012', '#F39800', '#FFF100', '#8FC31F', '#009944', '#009E96'],
      ['#00A0E9', '#0068B7', '#1D2088', '#920783', '#E4007F', '#E5004F'],
      ['#000000', '#FFFFFF']
    ],
    lang: 'default',
    messages: {
      default: {
        standardColor: 'Standard Color'
      }
    },
    backgroundChangeFlag: true
  };
})(ColorPalette || (ColorPalette = {}));
