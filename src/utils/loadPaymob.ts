export const initializePaymobPayment = async (items: any[], userId: string, email: string, phone?: string) => {
  try {
    const response = await fetch('/api/paymob/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, userId, email, phone })
    });

    const data = await response.json();
    
    if (data.iframeUrl) {
      // Open payment iframe
      window.open(data.iframeUrl, '_blank', 'width=800,height=600');
      return data;
    }
    
    throw new Error('Payment initialization failed');
  } catch (error) {
    console.error('Paymob payment error:', error);
    throw error;
  }
};

export default initializePaymobPayment;