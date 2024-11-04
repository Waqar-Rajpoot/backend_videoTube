import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null
        
        // console.log("my given property!!!",filePath);

        // Upload an image
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        });
        // file has been uploaded successfully
        // console.log(response); // assignment to explore it
        
        fs.unlinkSync(filePath);
        return response
 
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath) // remove local saved file if operation is failed
        }
        return null;
    }
}

export {uploadOnCloudinary}


