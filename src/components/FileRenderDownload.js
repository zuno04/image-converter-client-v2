import React from "react";

function FileRenderDownload({ converted }) {
  return (
    <div className="col-md-5">
      {/* Converted image area */}
      <div id="reduced-image-container" className="reduced-image-area">
        <ul>
          {converted.map((image, i) => (
            <li key={i}>
              <a
                download={image.image_name}
                href={`data:image/jpg;base64,${image.image_data}`}
                title="Download converted image"
              >
                {image.image_name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <a
        href="#download"
        id="download_result"
        className="btn btn-primary mt-5"
        title="Download converted image"
      >
        Download All
      </a>
    </div>
  );
}

export default FileRenderDownload;
