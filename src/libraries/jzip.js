import JSZip from "jszip";
import { saveAs } from "file-saver";

export const generateZip = (arr) => {
  let zip = JSZip();

  const download = () => {
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, "converted_images.zip");
    });
  };

  if (arr.length) {
    for (const element of arr) {
      zip.file(element.image_name, atob(element.image_data), {
        binary: true,
      });
    }

    arr = [];

    download();
  }
};
