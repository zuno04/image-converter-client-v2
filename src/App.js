import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import FileRenderDownload from "./components/FileRenderDownload";
import FileUpload from "./components/FileUpload";
import ConvertAction from "./components/ConvertAction";
import PreferencesEditor from "./components/PreferencesEditor"; // Import PreferencesEditor
import { loadPreferences, savePreferences, clearPreferences, DEFAULT_PREFERENCES } from "./utils/preferences"; // Import preference utils

function App() {
  const [images, setImages] = useState([]);
  const [converted, setConverted] = useState([]);
  const [preferences, setPreferences] = useState(loadPreferences());

  const handleSavePreferences = (newPrefs) => {
    savePreferences(newPrefs);
    setPreferences(newPrefs);
  };

  const handleClearAppSettings = () => { // Renamed to avoid conflict if clearPreferences was also a handler name
    clearPreferences();
    setPreferences({ ...DEFAULT_PREFERENCES }); // Reset state to defaults immediately
  };

  return (
    <div id="top" className="container mt-5">
      <div>
        <header>
          <h1>Welcome to Image reducer</h1>
          <p>
            Upload your images and reduce their size without loosing quality.
          </p>
        </header>
      </div>

      <PreferencesEditor 
        currentPreferences={preferences}
        onSave={handleSavePreferences}
        onClear={handleClearAppSettings}
      />

      <div className="row mt-5">
        {/* upload */}
        <FileUpload 
          setImages={setImages} 
          setConverted={setConverted} 
          preferences={preferences} // Pass preferences down
        />

        {/* Convert */}
        <ConvertAction images={images} setConverted={setConverted} />

        {/* Result */}
        <FileRenderDownload converted={converted} />
      </div>
    </div>
  );
}

export default App;
