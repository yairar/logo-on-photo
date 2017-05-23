var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');

var images = require("images");
 
var filename, originalFilename, outputFilename, logo_file_path;

/* POST upload */
router.post('/', function(req, res, next) {

var form = new multiparty.Form({uploadDir: './uploaded_files'});

form.parse(req, function(err, fields, files) {
    if (err) {
        res.writeHead(400, {'content-type': 'text/plain'});
        res.end("invalid request: " + err.message);
        return;
    }

    console.log(util.inspect(fields));
    console.log(util.inspect(files));

    logo_file_path = files.logo[0].path;
    console.log("Logo file: "+logo_file_path+', originalFilename: '+files.logo[0].originalFilename);

    filename = files.photos[0].path;
    originalFilename = files.photos[0].originalFilename;
    console.log('Photo filename: '+filename+', originalFilename: '+originalFilename);

	outputFilename = form.uploadDir+"/output.jpg";
    console.log("outputFilename: "+outputFilename);

    images(filename)                     //Load image from file  
	    .draw(images(logo_file_path), parseInt(fields.x, 10), parseInt(fields.y, 10))  //Drawn logo at coordinates (x,y) 
	    .saveAsync(outputFilename, {/*config obj*/}, saveFinished(res));
});

});


function saveFinished(res) {
	console.log('saveFinished called, outputFilename='+outputFilename);
	setTimeout(function() {
		res.download(outputFilename, originalFilename+'.jpg', function(err){
		if (err) {
		    // Handle error, but keep in mind the response may be partially-sent
		    // so check res.headersSent
		    console.log('error in download');
		    console.log(err);
		    res.redirect('/error');
		  } else {
		    // decrement a download credit, etc.
		    console.log('download succesful');
		    //res.redirect('/success');
		  }
		});
	}, 1000);
	
}

module.exports = router;
