import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // File uploaded successfully
        console.log("File is uploaded on Cloudinary", response.url);
        fs.unlinkSync(localFilePath);
        // console.log(response);
        return response;
    } catch (error) {
        // Remove the locally saved temp file as the upload failed
        fs.unlinkSync(localFilePath);
        return null;
    }
};

// cloudinary.uploader.upload(
//     "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//     { public_id: "olympic_flag" },
//     function (error, result) {
//         console.log(result);
//     }
// ); 

export { uploadOnCloudinary };
