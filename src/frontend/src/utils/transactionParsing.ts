import type { ParsedTransaction } from '../types/transactions';

/**
 * Sample INR amount regex patterns:
 * - ₹200 or ₹200.00
 * - Rs. 200 or Rs.200.00 or Rs 200
 * - INR 1,250 or INR 1250.00
 * 
 * Pattern: /(?:₹|Rs\.?|INR)\s*([0-9,]+(?:\.[0-9]{2})?)/i
 */

const AMOUNT_PATTERNS = [
  /₹\s*([0-9,]+(?:\.[0-9]{2})?)/i,
  /Rs\.?\s*([0-9,]+(?:\.[0-9]{2})?)/i,
  /INR\s*([0-9,]+(?:\.[0-9]{2})?)/i,
];

const CREDIT_KEYWORDS = [
  'credited',
  'received',
  'deposited',
  'credit',
  'added',
  'success',
  'successful',
];

const DEBIT_KEYWORDS = [
  'debited',
  'debit',
  'paid',
  'sent',
  'withdrawn',
  'failed',
  'declined',
  'rejected',
];

const SOURCE_PATTERNS = [
  { pattern: /gpay|google\s*pay/i, name: 'GPay' },
  { pattern: /phonepe|phone\s*pe/i, name: 'PhonePe' },
  { pattern: /paytm/i, name: 'Paytm' },
  { pattern: /amazon\s*pay/i, name: 'Amazon Pay' },
  { pattern: /upi/i, name: 'UPI' },
  { pattern: /bank|a\/c|account/i, name: 'Bank SMS' },
];

/**
 * Parse a transaction message and extract credit transaction details.
 * Returns null if the message is not a credit transaction.
 */
export function parseTransactionMessage(message: string): ParsedTransaction | null {
  if (!message || typeof message !== 'string') {
    return null;
  }

  const lowerMessage = message.toLowerCase();

  // Check if it's a debit/failure - reject these
  const isDebit = DEBIT_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
  if (isDebit) {
    return null;
  }

  // Check if it's a credit transaction
  const isCredit = CREDIT_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
  if (!isCredit) {
    return null;
  }

  // Extract amount
  let amount: number | null = null;
  for (const pattern of AMOUNT_PATTERNS) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const amountStr = match[1].replace(/,/g, '');
      amount = parseFloat(amountStr);
      if (!isNaN(amount)) {
        break;
      }
    }
  }

  if (!amount || amount <= 0) {
    return null;
  }

  // Extract source
  let source = 'Unknown';
  for (const { pattern, name } of SOURCE_PATTERNS) {
    if (pattern.test(message)) {
      source = name;
      break;
    }
  }

  // Try to extract sender (look for patterns like "from NAME" or "by NAME")
  let sender: string | undefined;
  const senderPatterns = [
    /(?:from|by)\s+([A-Za-z\s]+?)(?:\s+on|\s+to|\s+via|$)/i,
    /(?:sender|payer):\s*([A-Za-z\s]+?)(?:\s|$)/i,
  ];
  
  for (const pattern of senderPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      sender = match[1].trim();
      if (sender.length > 2 && sender.length < 50) {
        break;
      }
    }
  }

  // Try to extract timestamp (look for date patterns)
  let timestamp: string | undefined;
  const datePatterns = [
    /(\d{1,2}[-/]\w{3}[-/]\d{2,4})/i, // 11-Feb-26
    /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i, // 11/02/26
  ];

  for (const pattern of datePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      try {
        const parsed = new Date(match[1]);
        if (!isNaN(parsed.getTime())) {
          timestamp = parsed.toISOString();
          break;
        }
      } catch {
        // Invalid date, continue
      }
    }
  }

  return {
    amount,
    sender,
    timestamp,
    source,
  };
}
