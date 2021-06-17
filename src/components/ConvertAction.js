import React, { useState } from "react";
import axios from "axios";

import loader from "./loader.gif";

const ConvertAction = ({ images, setConverted }) => {
  const [processing, setProcessing] = useState(false);
  //
  const upload = async () => {
    setProcessing(true);

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
          });
      })
      .catch((error) => {
        console.error(error);
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
