export const sanitize = (text: string) => {
  // Strip ANSI escape codes
  let result = text.replace(/\u001b\[[0-9]{1,2}m/g, "");

  // Strip non-ascii characters
  result = result.replace(/[^\x00-\x7F]/g, "");

  // Trim the error message to 1500 characters if its too long
  return result.length > 1500 ? result.slice(0, 1500) + "..." : result;
}