"use strict";
const multer = require('multer');
const path = require('path');
const cryp = require('crypto');
module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req, file, cb) => {
            cryp.randomBytes(16, (err, hash) => {
                if (err)
                    cb(err);
                const fileName = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, fileName);
            });
        }
    }),
    limits: {},
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
            'image/tiff',
            'image/webp',
            'application/pdf',
            'application/',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'application/vnd.oasis.opendocument.presentation',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
            'video/mp4',
            'video/mpeg',
            'video/ogg',
            'video/webm',
            'video/3gpp',
            'audio/mpeg',
            'audio/ogg',
            'audio/webm',
            'audio/wav',
            'audio/3gpp',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid File Type'));
        }
    }
};
