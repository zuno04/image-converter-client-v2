import React from 'react';

const ImagePreviewModal = ({ isOpen, onClose, imageUrl, imageName }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent click through to backdrop */}
        <button className="modal-close-btn" onClick={onClose}>
          &times; {/* HTML entity for X */}
        </button>
        <img src={imageUrl} alt={imageName || 'Image Preview'} className="modal-image" />
        {imageName && <p className="modal-image-name">{imageName}</p>}
      </div>
    </div>
  );
};

export default ImagePreviewModal;
