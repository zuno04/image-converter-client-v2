import React, { useState, useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import ImagePreviewModal from "./ImagePreviewModal";
import { dataURLtoFile } from "../utils/fileUtils"; // Import dataURLtoFile

// preferences prop will be passed from App.js
const FileUpload = ({ setImages, setConverted, preferences }) => {
  const [uploadedFilePreviews, setUploadedFilePreviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);

  const handleOpenModal = (imageUrl, imageName) => {
    setSelectedImageUrl(imageUrl);
    setSelectedImageName(imageName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImageUrl(null);
    setSelectedImageName(null);
  };

  const readURL = async (uploadedFilesArray) => {
    // 1. Revoke existing original object URLs to prevent memory leaks
    uploadedFilePreviews.forEach(item => URL.revokeObjectURL(item.originalPreviewUrl));
    setConverted([]); // Clear previous conversion results

    // 2. Create initial state for all new files
    const initialItems = uploadedFilesArray.map(file => {
      const originalPreviewUrl = URL.createObjectURL(file);
      return {
        file: file, // Original file object, used as key for original filename
        name: file.name, // This will be updated by applyTransformations
        originalPreviewUrl: originalPreviewUrl,
        currentPreviewUrl: originalPreviewUrl, // Placeholder, will be updated
        rotation: preferences.defaultRotation,
        isGrayscale: preferences.defaultIsGrayscale,
        outputFormat: preferences.defaultOutputFormat,
      };
    });

    // 3. Set this initial list to state FIRST. This is crucial so that applyTransformations
    // can find these items in the state when it's called.
    setUploadedFilePreviews(initialItems);

    // 4. Asynchronously apply transformations to each new item.
    // applyTransformations will update each item in place within uploadedFilePreviews state.
    const transformationPromises = initialItems.map(item =>
      // Pass originalPreviewUrl as the stable identifier
      applyTransformations(item.originalPreviewUrl, item.rotation, item.isGrayscale, item.outputFormat, true)
    );

    // Optional: Wait for all initial transformations if you need to do something after all are done.
    // For UI updates, individual updates from applyTransformations are usually fine.
    await Promise.all(transformationPromises);
    // `setImages` is called within `applyTransformations`'s state update callback,
    // so it will be called multiple times. This is generally fine for React.
    // If a single final update to App.js is desired, it would require more complex promise handling
    // to gather all transformed File objects and then call setImages once.
  };

  const removeItem = (originalUrlToRemove) => { // Changed to use originalPreviewUrl as key
    const itemToRemove = uploadedFilePreviews.find(item => item.originalPreviewUrl === originalUrlToRemove);
    if (itemToRemove) {
      URL.revokeObjectURL(itemToRemove.originalPreviewUrl);
      // No need to revoke itemToRemove.currentPreviewUrl if it's a data URL (which it will be after any transform)
    }

    setUploadedFilePreviews(prevPreviews => {
      const updatedPreviews = prevPreviews.filter(item => item.originalPreviewUrl !== originalUrlToRemove);
      setImages(updatedPreviews.map(item => item.file)); // Update parent with current files
      return updatedPreviews;
    });
  };
  
  useEffect(() => {
    // Cleanup object URLs on component unmount
    return () => {
      uploadedFilePreviews.forEach(item => URL.revokeObjectURL(item.originalPreviewUrl));
    };
  }, [uploadedFilePreviews]); // Rerun if uploadedFilePreviews array instance changes

  // Refactored to use originalPreviewUrl as the primary identifier
  // isInitialLoad flag signals that we should use item.file.name for original filename context if needed by dataURLtoFile,
  // and helps locate the item if the state update for initialItems hasn't fully settled.
  const applyTransformations = async (itemOriginalPreviewUrl, targetRotation, targetIsGrayscale, targetOutputFormat) => {
    const itemIndex = uploadedFilePreviews.findIndex(item => item.originalPreviewUrl === itemOriginalPreviewUrl);
    if (itemIndex === -1) {
      console.error("Item not found for transformation:", itemOriginalPreviewUrl);
      return; // Or handle more gracefully
    }

    // Get the most current state of the item, especially its original file name
    const itemToTransform = uploadedFilePreviews[itemIndex];
    const originalFilenameFromUpload = itemToTransform.file.name; // Always use the initially uploaded file's name as base

    const img = new Image();
    img.crossOrigin = "anonymous";

    // Promise wrapper for image loading
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => {
            console.error("Error loading original image for transformation:", itemToTransform.originalPreviewUrl);
            reject(new Error("Image load error"));
        };
        img.src = itemToTransform.originalPreviewUrl; // Always use original blob URL for transformations
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions based on rotation
    if (targetRotation === 90 || targetRotation === 270) {
      canvas.width = img.height;
      canvas.height = img.width;
    } else {
      canvas.width = img.width;
      canvas.height = img.height;
    }

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (targetRotation > 0) {
      ctx.rotate(targetRotation * Math.PI / 180);
    }
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    if (targetIsGrayscale) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; data[i + 1] = avg; data[i + 2] = avg;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // Generate new data URL and File object
    let newDataUrl;
    if (targetOutputFormat === 'image/jpeg') {
      newDataUrl = canvas.toDataURL(targetOutputFormat, 0.92); // Quality for JPEG
    } else {
      newDataUrl = canvas.toDataURL(targetOutputFormat); // For PNG, WEBP
    }
    
    const newFile = dataURLtoFile(newDataUrl, originalFilenameFromUpload, targetOutputFormat);

    // Prepare updated item state
    const updatedItem = {
      ...itemToTransform,
      currentPreviewUrl: newDataUrl,
      file: newFile, // This is the new File object for upload
      name: newFile.name, // Update name to reflect new extension
      rotation: targetRotation,
      isGrayscale: targetIsGrayscale,
      outputFormat: targetOutputFormat,
    };
    
    // Update state for this specific item
    setUploadedFilePreviews(prevPreviews => {
      const newPreviews = prevPreviews.map(item => 
        item.originalPreviewUrl === itemOriginalPreviewUrl ? updatedItem : item
      );
      setImages(newPreviews.map(p => p.file)); // Update parent App.js state
      return newPreviews;
    });
  };

  // Event handlers now use originalPreviewUrl to identify items
  const handleRotateImage = (itemOriginalPreviewUrl) => {
    const item = uploadedFilePreviews.find(p => p.originalPreviewUrl === itemOriginalPreviewUrl);
    if (!item) return;
    const newRotation = (item.rotation + 90) % 360;
    applyTransformations(itemOriginalPreviewUrl, newRotation, item.isGrayscale, item.outputFormat);
  };

  const handleToggleGrayscale = (itemOriginalPreviewUrl) => {
    const item = uploadedFilePreviews.find(p => p.originalPreviewUrl === itemOriginalPreviewUrl);
    if (!item) return;
    const newGrayscaleState = !item.isGrayscale;
    applyTransformations(itemOriginalPreviewUrl, item.rotation, newGrayscaleState, item.outputFormat);
  };

  const handleFormatChange = (itemOriginalPreviewUrl, newFormat) => {
    const item = uploadedFilePreviews.find(p => p.originalPreviewUrl === itemOriginalPreviewUrl);
    if (!item) return;
    applyTransformations(itemOriginalPreviewUrl, item.rotation, item.isGrayscale, newFormat);
  };

  return (
    <div className="col-lg-5 col-md-12 mb-3">
      <div className="file-upload-container text-center">
        {/* File input */}
        <input
          id="upload"
          type="file"
          onChange={(e) => readURL(Array.from(e.target.files))} // Convert FileList to array
          multiple
          // Hidden by CSS, label triggers it
        />
        <label htmlFor="upload" className="custom-file-upload-button">
          <i className="fa fa-cloud-upload"></i> Choose Files
        </label>

        {/* Uploaded image list */}
        {uploadedFilePreviews.length > 0 && (
          <div className="file-list-area mt-4">
            <h5>Uploaded Files</h5>
            <ul>
              {uploadedFilePreviews.map((item) => (
                <li key={item.name} className="file-list-item-container"> {/* Added class for potential flex layout of sub-items */}
                  <div className="file-item-preview-name">
                    <img
                      src={item.currentPreviewUrl}
                      alt={`Thumbnail of ${item.name}`}
                      className="thumbnail-preview"
                      onClick={() => handleOpenModal(item.currentPreviewUrl, item.name)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span className="file-name">{item.name}</span>
                  </div>
                  <div className="file-item-actions">
                    <select 
                      value={item.outputFormat} 
                      onChange={(e) => handleFormatChange(item.name, e.target.value)}
                      className="form-control form-control-sm output-format-select"
                    >
                      <option value="image/png">PNG</option>
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/webp">WEBP</option>
                    </select>
                    <i
                      className={`fa fa-adjust action-icon grayscale-icon ${item.isGrayscale ? 'active' : ''}`}
                    onClick={() => handleToggleGrayscale(item.name)}
                    title={item.isGrayscale ? "Remove Grayscale" : "Apply Grayscale"}
                  ></i>
                  <i 
                    className="fa fa-repeat action-icon rotate-icon"
                    onClick={() => handleRotateImage(item.name)}
                    title="Rotate 90° CW"
                  ></i>
                  <i
                    className="fa fa-trash-o action-icon" // Keep delete icon
                    onClick={() => removeItem(item.name)} // Pass name to removeItem
                    title="Remove file"
                  ></i>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ImagePreviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageUrl={selectedImageUrl}
        imageName={selectedImageName}
      />
    </div>
  );
};

export default FileUpload;
