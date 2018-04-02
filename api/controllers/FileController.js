/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var uuid = require('node-uuid'),
  path = require('path');

module.exports = {



  /**
   * `FileController.upload()`
   *
   * Upload file(s) to the server's disk.
   */
  upload: function (req, res) {

    // e.g.
    // 0 => infinite
    // 240000 => 4 minutes (240,000 miliseconds)
    // etc.
    //
    // Node defaults to 2 minutes.
    res.setTimeout(0);

    var base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");
    var fileName = uuid.v4() + '.jpg';

    require("fs").writeFile(sails.config.appPath + "/assets/images/" +  fileName, base64Data, 'base64', function(err) {
      return res.json({fileName: fileName});
    });

    //req.file('avatar')
    //  .upload({
    //    // You can apply a file upload limit (in bytes)
    //    maxBytes: 10000000,
    //    dirname: sails.config.appPath + "/assets/images/",
    //    saveAs: function(file, cb) {
    //      var filename = file.filename,
    //        newName = uuid.v4() + path.extname(filename);
    //      file.filename = newName;
    //      return cb(null, newName);
    //    }
    //  }, function whenDone(err, uploadedFiles) {
    //    if (err) return res.send(500, err);
    //    else return res.json({
    //      files: uploadedFiles,
    //      textParams: req.params.all()
    //    });
    //  });
  },

  /**
   * `FileController.s3upload()`
   *
   * Upload file(s) to an S3 bucket.
   *
   * NOTE:
   * If this is a really big file, you'll want to change
   * the TCP connection timeout.  This is demonstrated as the
   * first line of the action below.
   */
  s3upload: function (req, res) {

    // e.g.
    // 0 => infinite
    // 240000 => 4 minutes (240,000 miliseconds)
    // etc.
    //
    // Node defaults to 2 minutes.
    res.setTimeout(0);

    req.file('avatar').upload({
      adapter: require('skipper-s3'),
      bucket: process.env.BUCKET,
      key: process.env.KEY,
      secret: process.env.SECRET
    }, function whenDone(err, uploadedFiles) {
      if (err) return res.serverError(err);
      else return res.json({
        files: uploadedFiles,
        textParams: req.params.all()
      });
    });
  },


  /**
   * FileController.download()
   *
   * Download a file from the server's disk.
   */
  download: function (req, res) {
    require('fs').createReadStream(sails.config.appPath + "/assets/images/" + req.param('path'))
      .on('error', function (err) {
        return res.serverError(err);
      })
      .pipe(res);
  }
};

