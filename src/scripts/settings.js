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
