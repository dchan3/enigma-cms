import express from 'express';
import File from '../../models/File';
import { default as verifyMiddleware } from '../middleware';
import fs from 'fs';
import path from 'path';

var router = express.Router();

router.post('/upload_file', verifyMiddleware, (req, res, next) => {
  let fn = req.body.fileToUpload.split('\\').pop(), newFile = new File({
      fileName: fn,
      fileType: req.body.fileType,
      createdDate: new Date(),
      modifiedDate: new Date(),
      uploadedBy: req.user.userId
    }), filepath = path.resolve(__dirname,
      `./public/uploads/${req.body.fileType}`, fn);
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
