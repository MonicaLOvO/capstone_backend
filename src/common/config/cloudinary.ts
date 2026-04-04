import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string || "dr9xel4jn",
  api_key: process.env.CLOUDINARY_API_KEY as string || "171829632698342",
  api_secret: process.env.CLOUDINARY_API_SECRET as string || "WYbRi-hFaszLpCjRpylAxYraJRE",
});

export default cloudinary;