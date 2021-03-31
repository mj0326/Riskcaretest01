module.exports = function(target) {

	return {
		expand : true,
		src : ['**/*.svg'],
		cwd: 'client/svg/',
		dest : 'client/sass/import/svg',

		options : {
			mode : {
				css: {
					sprite: '../images/'+target+'_sprite.svg',
					render: {
						scss: true
					},
					bust: false
				}
			}
		}
	}
};
