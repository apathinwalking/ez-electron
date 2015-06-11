var app = require('app');
var BrowserWindow = require('browser-window');
var config = require('./config.json'); //TODO: more config options
var knex = require('knex')({client:'pg',connection:config.pg_conn_str});
var Dboa = require('dboa-js');

var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

app.on('ready', function() {

    //communication channel with renderer process
    var ipc = require('ipc');

    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/views/index.html');

    // Open the devtools.
    //mainWindow.openDevTools();

    // Emitted when the window is closed
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    mainWindow.webContents.on('did-finish-load', function(){
        console.log("Loaded web contents");
        dboa.initialize().then(function(){
            console.log(dboa);
            return dboa.getTablesInSchema('public');
        }).then(function(tables){
            console.log(tables);
            mainWindow.webContents.send("from-server",tables);
        })

    });
});