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
