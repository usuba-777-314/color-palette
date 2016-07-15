var ColorPalette;
(function (module) {
  'use strict';

  module.init = function (param) {
    var palette = new module.ColorPalette(param);
    palette.$target.on('focus', function () {palette.open()});
    return palette;
  };
})(ColorPalette || (ColorPalette = {}));
