import multer from "multer";
import path from "path";
import crypto from 'crypto';

const multerConfig = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: multer.diskStorage({
        destination: (req: any, file:any, cb:any) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req: any, file:any, cb:any) => {
            crypto.randomBytes(16, (err:any, hash:any)=> {
                if (err) cb(err);

                const fileName = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, fileName);
            })
        }
    }),
    limits: {

    },
    fileFilter: (req:any, file:any, cb:any) => {
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
        } else {
            cb(new Error('Invalid File Type'));
        }
    }
}

export { multerConfig }