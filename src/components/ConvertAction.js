import React, { useState } from "react";
import axios from "axios";

import loader from "./loader.gif";

const ConvertAction = ({ images, setConverted }) => {
  const [processing, setProcessing] = useState(false);
  const [userError, setUserError] = useState(null); // New state for user-friendly error messages

  const upload = async () => {
    setProcessing(true);
    setUserError(null); // Clear previous errors on new attempt

    const url = "http://localhost:5000/api/reduce_image/";

    let data = new FormData();

    for (let i = 0; i < images.length; i++) {
      data.append("files", images[i]);
    }

    axios({
      method: "post",
      url,
      data,
      headers: {
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        // "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const result_img_url = "http://localhost:5000/api/images/";

        axios
          .get(result_img_url, {
            params: {
              filenames: JSON.stringify(response.data["filenames"]),
            },
          })
          .then((res) => {
            setConverted(res.data.converted_images);
            setProcessing(false);
          })
          .catch((err) => { // Catch error from the second GET request
            console.error("Error fetching converted images:", err);
            setUserError("Failed to retrieve converted images. Please try again.");
            setProcessing(false); // Ensure loader stops
          });
      })
      .catch((error) => {
        console.error("Error during image conversion:", error);
        // Provide a more specific message if possible, otherwise a generic one
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setUserError(`Conversion failed: ${error.response.data.message || "Server error"}. Please try again.`);
        } else if (error.request) {
          // The request was made but no response was received
          setUserError("Conversion failed: No response from server. Check your network.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setUserError("Conversion failed: Error setting up request. Please try again.");
        }
        setProcessing(false); // Ensure loader stops
      });
  };

  return (
    <div className="col-lg-2 col-md-12 mb-3 text-center">
      <div className="d-flex flex-column justify-content-center align-items-center h-100"> {/* flex-column to stack button and error */}
        {!processing ? (
          <>
            <button
              onClick={(e) => upload()}
              type="button"
              className="btn btn-info btn-convert" // Added a specific class for the convert button
              disabled={images.length === 0}
            >
              Convert
            </button>
            {userError && (
              <div className="error-message mt-2">
                {userError}
              </div>
            )}
          </>
        ) : (
          <div className="loading-indicator">
            <img src={loader} alt="Processing..." />
            <p>Processing...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConvertAction;
