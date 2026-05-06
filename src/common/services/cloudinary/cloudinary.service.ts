import "multer";

import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: "dadznnsst",
      api_key: "954227249973249",
      api_secret: "NVGzsJjRl0u2EyG5PR87WBkFWr4",
    });
    // this.testConnection();
  }

  // async testConnection() {
  //   try {
  //     const res = await cloudinary.uploader.upload(
  //       "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  //     );
  //     console.log("UPLOAD OK >>>", res.secure_url);
  //   } catch (err) {
  //     console.error("UPLOAD ERROR >>>", err);
  //   }
  // }

  async upload(
    file: Express.Multer.File,
    name: string,
  ): Promise<{ url: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: name,
          folder: "avatars",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }

          resolve({
            url: result.secure_url,
          });
        },
      );
      stream.end(file.buffer);
    });
  }
}
