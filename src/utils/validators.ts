export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidSaudiPhone = (phone: string): boolean => {
  // Validates Saudi Arabia mobile numbers: +9665xxxxxxxx, 9665xxxxxxxx, 05xxxxxxxx, or 5xxxxxxxx
  const saPhoneRegex = /^(?:\+?966|0)?5\d{8}$/;
  return saPhoneRegex.test(phone);
};
