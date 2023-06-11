export const allowedPhotosFileTypes = ["image/jpg", "image/jpeg", "image/png"];

export const hasInvalidFileType = (arr, allowedFileTypes) => {
    return arr.some((obj) => {
      const fileType = obj.mimetype || obj.type; // Obtaining the property both in backend and frontend
  
      return !allowedFileTypes.includes(fileType);
    });
  };
  