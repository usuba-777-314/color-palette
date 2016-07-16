var ColorPalette;
(function (module) {
  'use strict';

  Object.defineProperty(module, 'messages', {
    get: function () {
      return module.settings.messages[module.settings.lang] || {};
    }
  });
})(ColorPalette || (ColorPalette = {}));
