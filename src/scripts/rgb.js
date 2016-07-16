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
