module.exports = function(target, isBuild) {

  return {
      options: {
          outputStyle: 'compressed',
          sourceMap: isBuild ? true : false,
          sourceMapEmbed: isBuild ? true : false
      },
      files: [{
          src: 'client/sass/style.scss',
          dest: 'client/dist/css/'+target+'.css'
          //dest: isBuild ? 'client/dist/css/'+target+'.css' : 'client/dist/css/style.css'
      }]
  };
};
