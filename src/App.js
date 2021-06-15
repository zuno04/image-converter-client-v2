import React, { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import FileRenderDownload from "./components/FileRenderDownload";
import FileUpload from "./components/FileUpload";
import ConvertAction from "./components/ConvertAction";

function App() {
  const [images, setImages] = useState([]);
  const [converted, setConverted] = useState([]);

  console.log("images:::", images);

  useEffect(() => {
    // console.log(converted);
  }, [converted]);

  return (
    <div id="top" className="container mt-5">
      <div>
        <header className="text-white text-center">
          <h1>Welcome to Image reducer</h1>
          <p>
            Upload your images and reduce their size without loosing quality.
          </p>
        </header>
      </div>
      <div className="row mt-5">
        {/* upload */}
        <FileUpload setImages={setImages} setConverted={setConverted} />

        {/* Convert */}
        <ConvertAction images={images} setConverted={setConverted} />

        {/* Result */}
        <FileRenderDownload converted={converted} />
      </div>
    </div>
  );
}

export default App;
