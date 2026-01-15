"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const SuccessPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe');
  const [orderId, setOrderId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const method = searchParams.get('payment_method') || 'stripe';
      const order = searchParams.get('order_id');
      const success = searchParams.get('success');
      const hmac = searchParams.get('hmac');
      
      // For Paymob, check if payment was actually successful
      if (method === 'paymob') {
        // Check for explicit failure
        if (success === 'false') {
          setError("Payment was declined or cancelled. Please try again.");
          return;
        }
        
        // Require success=true or hmac for Paymob
        if (success !== 'true' && !hmac) {
          setError("Payment was not completed. Please try again.");
          return;
        }
      }
      
      setPaymentMethod(method);
      setOrderId(order);
      
      console.log(`${method.charAt(0).toUpperCase() + method.slice(1)} payment was successful!`);
      
      // Clear cart from localStorage if it exists
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cartProducts');
      }
    } catch (err) {
      setError("An error occurred while processing your payment.");
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-whiteColor dark:bg-blackColor">
        <div className="bg-whiteColor dark:bg-blackColor-dark p-10 rounded-lg shadow-md text-center border border-borderColor dark:border-borderColor-dark">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-5">Payment Error!</h1>
          <p className="text-lg text-contentColor dark:text-contentColor-dark mb-8">{error}</p>
          <Link href="/">
            <button className="bg-primaryColor text-whiteColor px-6 py-3 rounded-md hover:bg-primaryColor/90 transition-all">
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-whiteColor dark:bg-blackColor">
      <div className="bg-whiteColor dark:bg-blackColor-dark p-10 rounded-lg shadow-md text-center border border-borderColor dark:border-borderColor-dark max-w-md w-full mx-4">
        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-5">Payment Successful!</h1>
        
        <p className="text-lg text-contentColor dark:text-contentColor-dark mb-4">
          Thank you for your purchase! Your payment via {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} was successful.
        </p>
        
        {orderId && (
          <p className="text-sm text-contentColor dark:text-contentColor-dark mb-6">
            Order ID: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{orderId}</span>
          </p>
        )}
        
        <p className="text-sm text-contentColor dark:text-contentColor-dark mb-8">
          You can now access your purchased courses from your dashboard.
        </p>
        
        <div className="space-y-3">
          <Link href="/dashboards/student-dashboard" className="block">
            <button className="w-full bg-primaryColor text-whiteColor px-6 py-3 rounded-md hover:bg-primaryColor/90 transition-all">
              Go to Dashboard
            </button>
          </Link>
          
          <Link href="/courses" className="block">
            <button className="w-full bg-transparent text-primaryColor border border-primaryColor px-6 py-3 rounded-md hover:bg-primaryColor hover:text-whiteColor transition-all">
              Browse More Courses
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
