module.exports = function(grunt) {
    // SASS Config
    var sassConfig = require('./sass.config.js');

    // SPRITE SMITH Config
    var spriteConfig = require('./sprite.config.js');

    // SVG SPRITE Config
    var svgConfig = require('./svg.config.js');

    // AUTOPREFIXER Config
    var autoprefixerConfig = require('./autoprefixer.config.js');

    // COPY Config
    var copyConfig = require('./copy.config.js');

    // GRUNT
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            'default': sassConfig('riskcare'),
            'build': sassConfig('riskcare',true)
        },

        sprite: {
            'default': spriteConfig('riskcare','2')
        },

        svg_sprite: {
            'default': svgConfig('riskcare')
        },

        copy: {
            'default': copyConfig()
        },

        autoprefixer: {
            //'default': autoprefixerConfig('riskcare'),
            'build': autoprefixerConfig('riskcare',true)
        },

        watch: {
            all: {
                files: [
                    'client/images/*.png',
                    'client/svg/*.svg',
                    'client/sass/**/*.scss'
                ],
                tasks: ['sprite', 'svg_sprite', 'copy', 'sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-svg-sprite');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['sprite', 'svg_sprite', 'copy', 'sass', 'autoprefixer']);
};
