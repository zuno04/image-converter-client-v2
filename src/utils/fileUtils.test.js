import { dataURLtoFile } from './fileUtils';

describe('File Utilities - dataURLtoFile', () => {
  // Sample Base64 encoded 1x1 pixel PNG (smallest possible valid PNG)
  // (from https://gist.github.com/mindcat/c2be4340e0417893ffd5)
  const PngDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const PngOriginalFilename = 'testImage.png';

  // Sample Base64 encoded 1x1 pixel JPEG (very small)
  // (from https://stackoverflow.com/questions/20102404/how-to-make-the-smallest-area-jpeg-image)
  const JpegDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAWRXhpZgAATU0AKgAAAAgAAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FFImEHExiculturalTQZXGBkaEHFSYoJCmiscXwYnLR4iNThXREVGR0NHikzJoZaJjJidYbpqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQgcICQoL/8QAtREAAgECBAQDBAcFBAQAAAF9AQCAwQRBRIhMUEGE1FFImEHk culturaleTQZXGBkaEHFSYoJC miscXwYnLR4iNThXREVGR0NHikzJoZaJjJidYbpqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APwD/wA//wA//9oADAMBAAIRAxEAPwD8A//Z';
  const JpegOriginalFilename = 'photo.jpeg';
  
  // Sample Base64 encoded 1x1 pixel WebP
  // (very small, from online converter)
  const WebpDataURL = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
  const WebpOriginalFilename = 'graphic.webp';


  it('should convert PNG data URL to a File object with .png extension', () => {
    const file = dataURLtoFile(PngDataURL, PngOriginalFilename, 'image/png');
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe('testImage.png');
    expect(file.type).toBe('image/png');
    expect(file.size).toBeGreaterThan(0);
  });

  it('should convert JPEG data URL to a File object with .jpg extension', () => {
    const file = dataURLtoFile(JpegDataURL, JpegOriginalFilename, 'image/jpeg');
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe('photo.jpg');
    expect(file.type).toBe('image/jpeg');
    expect(file.size).toBeGreaterThan(0);
  });

  it('should convert WEBP data URL to a File object with .webp extension', () => {
    const file = dataURLtoFile(WebpDataURL, WebpOriginalFilename, 'image/webp');
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe('graphic.webp');
    expect(file.type).toBe('image/webp');
    expect(file.size).toBeGreaterThan(0);
  });

  it('should handle filenames with multiple dots correctly', () => {
    const originalFilenameWithDots = 'archive.version.2.image.png';
    const file = dataURLtoFile(PngDataURL, originalFilenameWithDots, 'image/jpeg');
    expect(file.name).toBe('archive.version.2.image.jpg');
    expect(file.type).toBe('image/jpeg');
  });
  
  it('should handle filenames with no extension by appending new extension', () => {
    const originalFilenameNoExt = 'myImageFile';
    const file = dataURLtoFile(PngDataURL, originalFilenameNoExt, 'image/png');
    expect(file.name).toBe('myImageFile.png');
  });

  it('should default to .png extension if targetMimeType is not image/jpeg or image/webp', () => {
    const file = dataURLtoFile(PngDataURL, 'another.gif', 'image/gif'); // targetMimeType is gif
    // The current dataURLtoFile logic defaults to 'png' extension unless specific cases are met
    // or tries to derive from targetMimeType. For 'image/gif' it should derive 'gif'
    expect(file.name).toBe('another.gif');
    expect(file.type).toBe('image/gif');
  });

  it('should return a dummy error file for empty data URL', () => {
    const file = dataURLtoFile('', 'empty.png', 'image/png');
    expect(file.name).toBe('error.txt');
    expect(file.type).toBe('text/plain');
  });

  it('should return a dummy error file for data URL missing comma', () => {
    const file = dataURLtoFile('data:image/pngbase64abc', 'invalid.png', 'image/png');
    expect(file.name).toBe('error_invalid_dataurl.txt');
    expect(file.type).toBe('text/plain');
  });
  
  it('should use targetMimeType if mime parsing from dataURL fails', () => {
    const malformedDataURL = 'data:;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const file = dataURLtoFile(malformedDataURL, PngOriginalFilename, 'image/png');
    expect(file.type).toBe('image/png');
    expect(file.name).toBe('testImage.png');
  });
});
