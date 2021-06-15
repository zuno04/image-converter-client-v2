import React, { useState } from "react";
import "font-awesome/css/font-awesome.min.css";

const FileUpload = ({ setImages, setConverted }) => {
  const [names, setNames] = useState([]);

  const readURL = async (uploadedFiles) => {
    setConverted([]);
    setNames([...Object.values(uploadedFiles)]);
    setImages([...Object.values(uploadedFiles)]);
  };

  const removeItem = (event) => {
    const id = event.target.id;
    setNames([...names.filter((obj) => obj.name !== id)]);
    setImages([...names.filter((obj) => obj.name !== id)]);
  };

  return (
    <div className="col-md-5">
      {/* Upload image input */}
      <div className="input-group mb-3 px-2 py-2 rounded-pill bg-white shadow-sm">
        <label
          id="upload-label"
          htmlFor="upload"
          className="font-weight-light text-muted"
        >
          Choose file(s)
        </label>
        <input
          id="upload"
          type="file"
          //   encType="multipart/form-data"
          onChange={(e) => readURL(e.target.files)}
          className="form-control border-0"
          multiple
        />
        <div className="input-group-append">
          <label
            htmlFor="upload"
            className="btn btn-light m-0 rounded-pill px-4"
          >
            {" "}
            <i className="fa fa-cloud-upload mr-2 text-muted"></i>
          </label>
        </div>
      </div>
      {/* Uploaded image area */}
      <p className="font-italic text-white text-center">Uploaded images list</p>
      <div className="image-area mt-4">
        <ul>
          {names.map((image, i) => (
            <li key={i}>
              {image.name}{" "}
              <i
                id={image.name}
                className="fa fa-trash-o text-danger"
                style={{ cursor: "pointer" }}
                onClick={(e) => removeItem(e)}
              ></i>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
