import express from 'express';
import { File } from '../../models';
import { default as verifyMiddleware } from '../middleware';
import fs from 'fs';
import { resolve } from 'path';
import { ObjectId } from 'mongodb';
import { default as fileFetchFuncs } from '../fetch_funcs/files';
var router = express.Router();

router.get('/get', async function (req, res) {
  return res.status(200).json(await fileFetchFuncs.getAllFiles());
});

router.post('/upload_file', verifyMiddleware, ({ user,
  body }, res, next) => {
    let { userId: uploadedBy } = user,  { fileToUpload, fileType, fileContent } = body;
  let fileName = fileToUpload.split('\\').pop(), newFile = new File({
      fileName, fileType, uploadedBy,
      createdDate: new Date(), modifiedDate: new Date()
    }), filepath = resolve(__dirname, `./public/uploads/${fileType}`, fileName);
  fs.writeFile(
    filepath,
    Buffer.from(fileContent, 'base64'), { flag: 'a+' }, (err) => {
      if (err) next(err);
      else newFile.save(function (error) {
        if (error) return next(error);
        else res.status(200).end();
      });
    }
  );
});

router.delete('/delete_file/:fileType/:id',
  ({ user, params: { id, fileType } }, res, next) => {
    if (user) return File.findOneAndRemove({
      _id: ObjectId(id), fileType
    }).then(function({ fileName }) {
      let fp = resolve(__dirname, `./public/uploads/${fileType}`, fileName);
      fs.unlinkSync(fp);
      return res.redirect('/admin/file_mgmt');
    }).catch(err => next(err));
    else
      return res.status(500).redirect('/login').end();
  });

export default router;
