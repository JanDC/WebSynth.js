'use strict';

/*
 Config file
 */
const path = require('path');
const yaml = require('yamljs');

const domain = 'localhost:8080';
const assets = yaml.load('./assets.yml');

let js = {
    assets: {},
    aliases: {},
    glob: [],
};

/*
 Generate JavaScript paths to be used in webpack.
 */
Object.keys(assets.javascript).map(function (key) {

    /*
     Build our JavaScript entry points from the yaml file.
     see: https://webpack.js.org/configuration/entry-context/#entry
     */
    js.assets[key] = path.resolve(__dirname, assets.javascript[key].entry);

    /*
     Build our aliases used to import modules more easily.
     see: https://webpack.js.org/configuration/resolve/#resolve-alias
     */
    js.aliases[assets.javascript[key].alias.name] = path.resolve(__dirname, assets.javascript[key].alias.path);

    /*
     Build glob paths so we can watch all JavaScript files in the base folder of our entry point.
     By doing this we can trigger a webpack build and a browserSync reload after compilation.
     */
    js.glob.push(`${assets.javascript[key].base}/**/*.{js}`);
    js.glob.push(`${assets.javascript[key].entry}`);
    js.glob.push(`${assets.javascript[key].alias.path}`);
});


/*
 Export our configuration
 */
module.exports = {

    /*
     JavaScript settings
     */
    js: {
        entry: js.assets,
        dist: path.resolve(__dirname, 'web/dist/js/'),
        aliases: js.aliases,
        glob: js.glob,
    },
    support: {
        grid: false,
        browsers: [
            'last 2 version',
            '> 1%',
            'ie 8',
            'ie 9',
            'ios 6',
            'android 4'
        ]
    },
    /*
     BrowserSync settings
     */
    browsersync: {
        notify: false,
        open: false,
        proxy: {
            target: domain
        }
    },

    /*
     Files
     */
    files: [path.resolve(__dirname, '**/*.html'), path.resolve(__dirname, '**/*.handlebars'), path.resolve(__dirname, '**/*.twig'), '!' + path.resolve(__dirname, '**/node_modules/**/*')]
};