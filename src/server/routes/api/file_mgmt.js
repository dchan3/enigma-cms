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
  let newFile = new File({
    fileName: req.params.fileName,
    fileType: req.params.fileType,
    additionalInfo: req.params.additionalInfo,
    createdDate: new Date(),
    modifiedDate: new Date()
  });
  fs.writeFile(
    path.resolve(__dirname__, 'public/uploads/', req.params.fileName,
      req.body.contents, (err) => {
        if (err) next(err);
        else newFile.save(function (error) {
          if (error) return next(error);
          else res.status(200).end();
        });
      }));
});

export default router;