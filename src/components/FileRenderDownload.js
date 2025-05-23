import React from "react";

import { generateZip } from "../libraries/jzip";

function FileRenderDownload({ converted }) {
  const downloadImagesZip = () => {
    generateZip(converted);
  };

  return (
    <div className="col-lg-5 col-md-12 mb-3"> {/* Responsive columns: stacks on md and below, side-by-side on lg. Added margin bottom for stacked view */}
      {converted.length > 0 && (
        <div className="file-list-area mb-3"> {/* Added mb-3 for spacing from button */}
          <h5>Converted Files</h5>
          <ul>
            {converted.map((image, i) => (
              <li key={i}>
                <a
                  download={image.image_name}
                  href={`data:image/jpg;base64,${image.image_data}`}
                  title={`Download ${image.image_name}`}
                  className="file-name" // Use existing class for consistency
                >
                  {image.image_name}
                </a>
                {/* Optional: Add a small download icon next to each file if desired */}
                {/* <i className="fa fa-download action-icon" style={{color: '#007bff'}}></i> */}
              </li>
            ))}
          </ul>
        </div>
      )}
      {converted.length > 0 && ( // Only show button if there are files
        <button
          id="download_result"
          className={`btn btn-primary download-all-btn ${ // Added new class
            converted.length === 0 ? "disabled" : ""
          }`}
          title="Download all converted images as ZIP"
          disabled={converted.length === 0}
          onClick={() => downloadImagesZip()}
        >
          <i className="fa fa-download mr-2"></i> Download All as ZIP
        </button>
      )}
    </div>
  );
}

export default FileRenderDownload;
