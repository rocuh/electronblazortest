const {app, BrowserWindow} = require('electron')
  const path = require('path')
  const url = require('url')
  const http = require("http");
  const  fs = require('fs');
  
 
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  
  
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    var server = http.createServer(requestHandler).listen(9529, '127.0.0.1');

    mainWindow.loadURL('http://localhost:9529/');
    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.setTitle(app.getName());
    });
    mainWindow.on('closed', function() {
        mainWindow = null;
        server.close();
    });
});

function requestHandler(req, res) {
    var
        file    = req.url == '/' ? '/index.html' : req.url,
        root    = __dirname,
        page404 = root + '/index.html';

	console.dir(root + file);
		
    getFile((root + file), res, page404);
};

function getFile(filePath, res, page404) {

    fs.exists(filePath, function(exists) {
        if(exists) {
            fs.readFile(filePath, function(err, contents) {
                if(!err) {
                    res.end(contents);
                } else {
                    console.dir(err);
                }
            });
        } else {
            fs.readFile(page404, function(err, contents) {
                if(!err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(contents);
                } else {
                    console.dir(err);
                }
            });
        }
    });
};
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.