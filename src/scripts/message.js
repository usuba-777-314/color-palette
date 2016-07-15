var ColorPalette;
(function (module) {
  'use strict';

  module.lang = 'default';

  module.langs = {
    default: {
      standardColor: 'Standard Color'
    }
  };

  Object.defineProperty(module, 'message', {
    get: function () {
      return module.langs[module.lang] || {};
    }
  });
})(ColorPalette || (ColorPalette = {}));
