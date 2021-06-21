import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file: any, next) => {
            const hash = crypto.randomBytes(6).toString('hex');

            file.key = `${hash}-${file.originalname}`;

            next(null, file.key);
        }
    })
}