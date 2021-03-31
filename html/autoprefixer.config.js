module.exports = function(target, isBuild) {

  return {
      options: {
          browsers: ['last 2 versions', 'ie >= 11', 'Firefox >= 20'],
          safe: true,
          map: isBuild ? true : false
      },
      files: [{
          src: 'client/dist/css/'+target+'.css',
          dest: 'client/dist/css/'+target+'.css'
      }]
  };
};
