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
