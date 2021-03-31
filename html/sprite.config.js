module.exports = function(target,ratio) {

  return {
    cssFormat: 'scss',
    imgPath: '../images/'+target+'_sprite.png',
    cssTemplate: 'client/sass/_sprite/sprite'+ratio+'x.scss.mustache',
    src: 'client/images/*.png',
    dest: 'client/dist/images/'+target+'_sprite.png',
    destCss: 'client/sass/import/common/sprite.scss',
    padding: 4
  };

};
