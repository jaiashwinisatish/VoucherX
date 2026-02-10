// Validate required field
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate positive price
export const isValidPrice = (price: number): boolean => {
  return !isNaN(price) && price > 0;
};

// Validate expiry date (must be future)
export const isFutureDate = (date: string): boolean => {
  const today = new Date();
  const selected = new Date(date);

  // Remove time for accurate comparison
  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);

  return selected > today;
};
