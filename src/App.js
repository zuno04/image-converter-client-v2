import React, { useState } from "react";

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
    <div id="top" className="container mx-auto mt-5 p-4">
      <header>
        <h1 className="text-3xl font-bold mb-2">Welcome to Image reducer</h1>
        <p className="text-gray-700 mb-4">
          Upload your images and reduce their size without loosing quality.
        </p>
      </header>

      <PreferencesEditor 
        currentPreferences={preferences}
        onSave={handleSavePreferences}
        onClear={handleClearAppSettings}
      />

      <div className="flex flex-col md:flex-row gap-4 mt-5">
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
