import { format, formatDistanceToNow } from "date-fns";

export const formatDate = () => {
  const pattern = "EEE, d MMM y k:mm:ss";
  const formatted = format(Date.now(), pattern);
  return `${formatted} GMT`;
};

export const formatDateAgo = (date: number) => {
  const formatted = formatDistanceToNow(new Date(date), {
    includeSeconds: false,
  });

  return `${formatted} ago`;
};

export const getContrastColor = (background: string) => {
  // Convert background color to RGB
  const r = parseInt(background.substring(1, 3), 16);
  const g = parseInt(background.substring(3, 5), 16);
  const b = parseInt(background.substring(5, 7), 16);

  // Calculate relative luminance
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Choose text color based on luminance
  return luminance > 0.5 ? "#000000" : "#ffffff"; // Black for light background, white for dark background
};

export const formatPhoneNumber = (phoneNumber: string) => {
  // Remove all non-digit characters from the input
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Capture groups to format the number
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  // If the input matches the expected format
  if (match) {
      // Format the phone number
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  // Return the original input if it doesn't match the expected format
  return phoneNumber;
}

