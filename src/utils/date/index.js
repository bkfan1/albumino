export const compareDates = (a, b) => {
    const dateA = a.metadata.datetime ? new Date(a.metadata.datetime) : new Date(a.uploaded_at);
    const dateB = b.metadata.datetime ? new Date(b.metadata.datetime) : new Date(b.uploaded_at);
  
    return dateB - dateA; // Orden descendente (dateB - dateA en lugar de dateA - dateB)
  };