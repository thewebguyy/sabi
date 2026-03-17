export const formatPhoneNumber = (phone: string): string => {
  // Remove non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 0, replace with 234
  if (cleaned.startsWith('0')) {
    return '234' + cleaned.substring(1);
  }
  
  // If it starts with 234, return as is
  if (cleaned.startsWith('234')) {
    return cleaned;
  }
  
  // Default to adding 234 if it seems like a local number
  if (cleaned.length === 10) {
    return '234' + cleaned;
  }
  
  return cleaned;
};

export const getWhatsAppLink = (phone: string, message?: string): string => {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${formattedPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};
