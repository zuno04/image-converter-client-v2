import React from "react";

import { generateZip } from "../libraries/jzip";

function FileRenderDownload({ converted }) {
  const downloadImagesZip = () => {
    generateZip(converted);
  };

  return (
    <div className="col-md-5">
      {/* Converted image area */}
      <div id="reduced-image-container" className="reduced-image-area">
        <ul>
          {converted.map((image, i) => (
            <li key={i}>
              <a
                download={image.image_name}
                href={image.image_data}
                title="Download converted image"
              >
                {image.image_name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button
        href="#download"
        id="download_result"
        className={`btn btn-primary mt-5 ${
          converted.length === 0 ? "disabled" : ""
        }`}
        title="Download converted image"
        disabled={converted.length === 0}
        onClick={() => downloadImagesZip()}
      >
        Download All
      </button>
    </div>
  );
}

export default FileRenderDownload;
