"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';

const TestPaymobPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { data: session } = useSession();

  const testPaymobCheckout = async () => {
    if (!session) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const testItems = [
        {
          name: 'Test Course',
          price: '100.00',
          courseId: 'test-course-id',
          quantity: 1
        }
      ];

      const response = await fetch('/api/paymob/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: testItems, 
          userId: session.user.id, 
          email: session.user.email, 
          phone: '+966500000000'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult({ success: true, data });
        console.log('Paymob checkout response:', data);
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch (error) {
      console.error('Test error:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Paymob Integration</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Environment Variables Check</h2>
        <div className="space-y-2 text-sm">
          <div>Secret Key: {process.env.NEXT_PUBLIC_DEBUG ? 'Set' : 'Not visible in client'}</div>
          <div>Public Key: {process.env.NEXT_PUBLIC_DEBUG ? 'Set' : 'Not visible in client'}</div>
          <div>Integration ID: {process.env.NEXT_PUBLIC_DEBUG ? 'Set' : 'Not visible in client'}</div>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Test Checkout</h2>
        
        {!session ? (
          <p className="text-red-600">Please login to test Paymob integration</p>
        ) : (
          <div>
            <p className="mb-4">Logged in as: {session.user.email}</p>
            
            <button
              onClick={testPaymobCheckout}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Paymob Checkout'}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 rounded bg-gray-100 dark:bg-gray-700">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
            
            {result.success && result.data.iframeUrl && (
              <div className="mt-4">
                <a 
                  href={result.data.iframeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Open Payment Page
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPaymobPage;