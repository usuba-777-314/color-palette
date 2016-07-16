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
