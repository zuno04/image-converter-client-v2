# Advanced Image Converter & Client-Side Transformer

This web application allows you to upload multiple images, apply various client-side transformations (rotation, grayscale, format conversion), set your default processing preferences, and then (notionally) send them to a backend for size reduction before downloading. It features a modern, responsive UI with image previews and persistent user preferences.

## Overview

The Advanced Image Converter provides a user-friendly interface for quick image manipulations directly in your browser. All transformations like rotation, grayscale effects, and output format changes are processed client-side, meaning your original images are not sent to any server until you initiate the "Convert" action. User preferences for default settings are conveniently stored in your browser's `localStorage`.

The original backend functionality focuses on reducing image size (up to 10x while keeping ~75% quality) via a FastAPI-based API. This frontend enhances the user experience by adding powerful pre-processing capabilities.

## Key Features

*   **Modern & Responsive UI/UX:** A clean, updated interface that works well on desktops, tablets, and mobile devices.
*   **Image Upload:** Supports uploading multiple image files.
*   **Image Previews:**
    *   **Thumbnail Previews:** Displays small thumbnail previews of uploaded images.
    *   **Enlarged Image Modal:** Click on a thumbnail to view a larger preview in a modal window.
*   **Client-Side Image Transformations (Per-Image Controls):**
    *   **Rotation:** Rotate images by 90°, 180°, or 270° clockwise.
    *   **Grayscale:** Convert images to grayscale and back to color.
    *   **Output Format Selection:** Choose to output images as PNG, JPEG, or WEBP. The filename and file type are updated accordingly.
    *   These transformations are applied directly in your browser *before* the image is sent for backend processing.
*   **Persistent User Preferences:**
    *   Set default values for output format, rotation, and grayscale application for all newly uploaded images.
    *   Preferences are saved in your browser's `localStorage`, so they persist across sessions.
    *   Easily manage these settings via the "Default Upload Preferences" section.
*   **Backend Image Reduction:**
    *   The "Convert" button sends the (client-side transformed) images to a backend API.
    *   The backend is responsible for image size reduction (as per the original README description).
*   **Download Transformed Images:** After backend processing, download the images, typically as a ZIP file.

## How to Use

1.  **Set Your Default Preferences (Optional):**
    *   Locate the **"Default Upload Preferences"** section, usually displayed near the top of the application.
    *   Choose your desired default settings:
        *   **Output Format:** Select PNG, JPEG, or WEBP.
        *   **Rotation:** Choose 0°, 90°, 180°, or 270°.
        *   **Grayscale:** Check the box if you want images to be converted to grayscale by default.
    *   Click **"Save Preferences"**. These settings will be applied to all new images you upload.
    *   Click **"Reset to Defaults"** to clear your custom preferences and revert to the application's original defaults.

2.  **Upload Images:**
    *   Click the **"Choose Files"** button.
    *   Select one or more images from your device.
    *   Thumbnails of your selected images will appear in the "Uploaded Files" list, with any default preferences automatically applied.

3.  **Preview Images:**
    *   **Thumbnails:** Small previews reflecting current transformations are shown in the list.
    *   **Larger Preview:** Click on any thumbnail to open a modal window displaying a larger version of the currently transformed image. Click the '×' button or anywhere on the backdrop to close the modal.

4.  **Apply Transformations (Per Image):**
    *   For each image in the "Uploaded Files" list, you have several controls:
        *   **Output Format Dropdown:** Select the desired output format (PNG, JPEG, WEBP) for that specific image. The filename will update to reflect the new extension.
        *   **Grayscale Toggle (<i class="fa fa-adjust"></i> icon):** Click this icon to toggle the grayscale effect on and off. The icon changes color when active.
        *   **Rotate (<i class="fa fa-repeat"></i> icon):** Click this icon to rotate the image 90° clockwise. Each click applies an additional 90° rotation.
        *   **Delete (<i class="fa fa-trash-o"></i> icon):** Click this icon to remove the image from the list.
    *   All transformations are applied client-side, and the preview updates instantly. The underlying file data (type, name, content) is also updated.

5.  **Convert Images:**
    *   Once you have uploaded and transformed your images as desired, click the **"Convert"** button.
    *   This action sends the currently displayed (and transformed) versions of your images to the backend API for size reduction.

6.  **Download Results:**
    *   After the backend processing is complete, the transformed and size-reduced images will appear in the "Converted Files" list.
    *   Click **"Download All as ZIP"** to download all processed images. Individual image download links may also be provided.

## Technical Stack

*   **Frontend:** React.js
*   **Styling:** Bootstrap 4, Font Awesome (for icons), custom CSS.
*   **Client-Side Image Processing:** HTML5 Canvas API for image transformations (rotation, grayscale, format conversion).
*   **Client-Side Preferences:** Browser `localStorage`.
*   **Backend API Interaction:** (As per original README) Interacts with a FastAPI-based Python backend for image size reduction.

## Development Setup

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
    *(Or `yarn install` if you use Yarn)*
3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    *(Or `yarn start`)*
    This will typically open the application in your default web browser at `http://localhost:3000`.

4.  **Backend Server:**
    Ensure the FastAPI backend server (for image reduction) is running, typically on `http://localhost:5000` as per standard project configurations, if you intend to test the full "Convert" and download functionality.

## License

(Assumed MIT License, please update if different)
This project is licensed under the MIT License. See the `LICENSE` file for details.
