import React, { useState } from "react";
import imageCompression from "browser-image-compression";

import loader from "./loader.gif";

const ConvertAction = ({ images, setConverted }) => {
  const [processing, setProcessing] = useState(false);

  const convertBlobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = reject;

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(blob);
    });

  const convertImage = async (imageFiles) => {
    let compressedImagesFiles = [];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const compressedFile = await imageCompression(imageFiles[i], options);

        const base64Image = await convertBlobToBase64(compressedFile);

        compressedImagesFiles.push({
          image_name: "Reduced_" + compressedFile.name,
          image_data: base64Image,
        });
      }

      return compressedImagesFiles;
    } catch (error) {
      console.log(error);
    }
  };

  //
  const upload = async () => {
    setProcessing(true);

    convertImage(images).then((res) => {
      // console.log(res[0].image_data);
      setConverted(res);
      setProcessing(false);
    });
  };

  return (
    <div className="col-md-2 mx-auto">
      <div className="text-center">
        {processing === false ? (
          <button
            onClick={(e) => upload()}
            type="button"
            className="btn btn-info"
            disabled={images.length === 0}
          >
            Convert
          </button>
        ) : (
          <img src={loader} alt="loading..." width="50" height="50" />
        )}
      </div>
    </div>
  );
};

export default ConvertAction;
