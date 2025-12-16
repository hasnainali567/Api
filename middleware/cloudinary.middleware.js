// import { v2 as cloudinary } from 'cloudinary'
// import fs from 'fs';

// cloudinary.config({
//     api_key: '274572193187646',
//     api_secret: '-nP9cXc1wssB6iFfndUaS-9hoEw',
//     cloud_name:'devnvel1v',
//     sign_url: ,
// })
// const uploadToCloudinary = async (filePath) => {
//     try {
//         if(!filePath) {
//             return new Error('no filePath provided');
//         }
//         await cloudinary.uploader.upload(filePath);
//         fs.unlinkSync(filePath)

//     } catch (error) {
//         console.error(error);
//         fs.unlinkSync(filePath)
//     }
// }

// export default uploadToCloudinary;