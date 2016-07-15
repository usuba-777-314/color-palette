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
