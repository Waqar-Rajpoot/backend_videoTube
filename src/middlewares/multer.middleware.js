import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        // console.log(file);  // assignment for explore it  
    }
})

export const upload = multer({

    storage,
    
    // assignment to explore it
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // 5MB
//     }
//  }).single('video');  // Form field name in HTML form  // assignment for explore it  // 'video' is the name of the file input field in the HTML form  // 'video' is the name of the field in the req.file object  // 'video' is the name of the uploaded file in the filesystem  // 'video' is the name of the uploaded file in the req.body object  // 'video' is the name of the uploaded file in the req.params object  // 'video' is the name of the uploaded file in the req.query object  // 'video' is the name of the uploaded file in the req.file object  // 'video' is the name of the uploaded file in the req.files array  // 'video' is the name of the

})
 