import React, { useState, useEffect } from 'react';
import { DEFAULT_PREFERENCES } from '../utils/preferences';

const PreferencesEditor = ({ currentPreferences, onSave, onClear }) => {
  const [formData, setFormData] = useState({ ...DEFAULT_PREFERENCES });

  useEffect(() => {
    // Ensure formData is synced if currentPreferences prop changes
    // (e.g., after loading or clearing)
    setFormData({ ...currentPreferences });
  }, [currentPreferences]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value, 10) : value)
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleReset = (e) => {
    e.preventDefault();
    onClear(); // This will trigger App.js to reload defaults and pass them as props
    // No need to setFormData to DEFAULT_PREFERENCES here directly, as it will be updated via useEffect
  };

  return (
    <div className="preferences-editor-container card mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Default Upload Preferences</h5>
        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="defaultOutputFormat">Output Format</label>
              <select
                id="defaultOutputFormat"
                name="defaultOutputFormat"
                className="form-control form-control-sm"
                value={formData.defaultOutputFormat}
                onChange={handleChange}
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="defaultRotation">Rotation</label>
              <select
                id="defaultRotation"
                name="defaultRotation"
                className="form-control form-control-sm"
                value={formData.defaultRotation}
                onChange={handleChange}
                type="number"
              >
                <option value={0}>0°</option>
                <option value={90}>90°</option>
                <option value={180}>180°</option>
                <option value={270}>270°</option>
              </select>
            </div>

            <div className="form-group col-md-4 d-flex align-items-end">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="defaultIsGrayscale"
                  name="defaultIsGrayscale"
                  checked={formData.defaultIsGrayscale}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="defaultIsGrayscale">
                  Grayscale
                </label>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <button type="submit" className="btn btn-primary btn-sm mr-2">Save Preferences</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>Reset to Defaults</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreferencesEditor;
