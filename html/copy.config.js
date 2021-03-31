module.exports = function() {

  return {
    expand: true,
    src: 'client/sass/import/svg/images/*.svg',
    dest: 'client/dist/images',
    flatten: true,
    filter: 'isFile'
  }

};
