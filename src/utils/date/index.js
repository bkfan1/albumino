import moment from "moment";

export const compareDates = (a, b) => {
  const dateA = a.metadata.datetime
    ? new Date(a.metadata.datetime)
    : new Date(a.uploaded_at);
  const dateB = b.metadata.datetime
    ? new Date(b.metadata.datetime)
    : new Date(b.uploaded_at);

  return dateB - dateA; // Descending order (dateB - dateA instead of dateA - dateB)
};

export const convertToISO8601 = (dateStr) => {
  const format = "YYYY:MM:DD HH:mm:ss";
  const momentDate = moment(dateStr, format);
  const iso8601Date = momentDate.toISOString();

  return iso8601Date;
};