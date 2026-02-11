/**
 * UPI payment utilities
 */

const UPI_ID = 'taranseetharaman273@oksbi';

export function openUpiPayment(): void {
  // UPI intent URL format
  // upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR&tn=NOTE
  
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: 'Voice UPI Alert',
    cu: 'INR',
    tn: 'Buy Me a Coffee - Voice UPI Alert Support',
  });

  const upiUrl = `upi://pay?${params.toString()}`;
  
  // Try to open UPI intent
  window.location.href = upiUrl;
  
  // Fallback: show alert with UPI ID for manual payment
  setTimeout(() => {
    alert(
      `If the UPI app didn't open, you can manually send payment to:\n\nUPI ID: ${UPI_ID}\n\nThank you for your support! ☕`
    );
  }, 1000);
}
