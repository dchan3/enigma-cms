import express from 'express';
import File from '../../models/File';
import { default as verifyMiddleware } from '../middleware';
import fs from 'fs';
import path from 'path';

var router = express.Router();

// GET Requests
router.get('/get', (req, res, next) => {
  File.find({ }).then(files => {
    res.status(200).json(files);
  }).catch(err => next(err));
});

// POST Requests
router.post('/upload_file', verifyMiddleware, (req, res, next) => {
  var fn = req.body.fileToUpload.split('\\').pop()
  let newFile = new File({
    fileName: fn,
    fileType: req.body.fileType,
    createdDate: new Date(),
    modifiedDate: new Date(),
    uploadedBy: req.user.userId
  });
  var filepath = path.resolve(__dirname, './public/uploads/', fn);
  fs.writeFile(
    filepath,
    Buffer.from(req.body.fileContent, 'base64'), { flag: 'a+' }, (err) => {
      if (err) next(err);
      else newFile.save(function (error) {
        if (error) return next(error);
        else res.status(200).end();
      });
    }
  );
});

export default router;
