"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import CartProduct from "@/components/shared/cart/CartProduct";
import { useCartContext } from "@/contexts/CartContext";
import useSweetAlert from "@/hooks/useSweetAlert";
import countTotalPrice from "@/libs/countTotalPrice";
import Link from "next/link";
import { initializePaymobPayment } from "@/utils/loadPaymob";
import getStripe from "@/utils/loadStripe";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PriceDisplay from "@/components/shared/PriceDisplay";
import PaymentMethodSelector from "@/components/shared/PaymentMethodSelector";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getCountryInfoByCurrency } from "@/utils/currencyToCountry";
import BillingInfoForm from "@/components/shared/cart/BillingInfoForm";

const CartPrimary = () => {
  const { cartProducts: currentProducts, clearCart } = useCartContext();
  const creteAlert = useSweetAlert();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paymob");
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(null);
  const router = useRouter();
  const { currency } = useCurrency();

  const cartProducts = currentProducts || [];
  
  // Convert SAR prices to selected currency for display
  const RATES = {
    SAR: 1,
    USD: 0.27,
    AED: 0.97,
    PKR: 74.66,
    CAD: 0.37,
  };
  
  const totalPrice = Number(
    cartProducts.reduce((sum, product) => {
      const sarPrice = parseFloat(product.price) || 0;
      const convertedPrice = sarPrice * (RATES[currency] || 1);
      return sum + convertedPrice;
    }, 0)
  );
  
  const isCartProduct = cartProducts.length > 0;
  const userId = session?.user?.id;

  const handleUpdateCart = () => {
    if (isCartProduct) {
      creteAlert("success", "Success! Cart updated.");
    } else {
      creteAlert("error", "Cart is empty. Nothing to update.");
    }
  };

  const handleClearCart = () => {
    if (isCartProduct) {
      clearCart();
    } else {
      creteAlert("error", "Cart is already empty.");
    }
  };

  const handleStripeCheckout = async (items, userEmail) => {
    const stripe = await getStripe();
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        email: userEmail,
        userId,
      }),
    });

    if (!response.ok)
      throw new Error("Failed to create Stripe checkout session");
    const { sessionId } = await response.json();
    if (sessionId) {
      await stripe.redirectToCheckout({ sessionId });
    } else {
      throw new Error("Failed to initialize Stripe payment");
    }
  };

  const handlePaymobCheckout = async (items, userEmail, phone) => {
    const firstName = session?.user?.name?.split(" ")[0] || "Customer";
    const lastName =
      session?.user?.name?.split(" ").slice(1).join(" ") || "User";

    // Get country info from selected currency
    const countryInfo = getCountryInfoByCurrency(currency);

    // Show billing form instead of prompts
    setPendingCheckout({
      items,
      userEmail,
      phone,
      firstName,
      lastName,
      countryInfo,
    });
    setShowBillingForm(true);
  };

  const handleBillingFormSubmit = async (billingData) => {
    if (!pendingCheckout) return;

    const { items, userEmail, phone, firstName, lastName, countryInfo } =
      pendingCheckout;

    try {
      setLoading(true);
      const response = await fetch("/api/paymob/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          userId,
          email: userEmail,
          phone: billingData.billingPhone.trim(),
          firstName: firstName,
          lastName: lastName,
          address: billingData.billingAddress.trim(),
          city: billingData.billingCity.trim(),
          country: countryInfo.name,
          countryCode: countryInfo.code,
          billingAddress: billingData.billingAddress.trim(),
          billingCity: billingData.billingCity.trim(),
          billingPhone: billingData.billingPhone.trim(),
          currency: currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Paymob Error Response:", data);
        throw new Error(
          data.details ||
            data.error ||
            "Failed to create Paymob checkout session"
        );
      }

      if (data.iframeUrl) {
        setShowBillingForm(false);
        setPendingCheckout(null);
        window.location.href = data.iframeUrl;
        return data;
      } else {
        throw new Error(data.error || "Failed to initialize Paymob payment");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      creteAlert(
        "error",
        `Payment Error: ${error.message || "Please try again"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBillingFormCancel = () => {
    setShowBillingForm(false);
    setPendingCheckout(null);
  };

  const handleCheckout = async () => {
    if (!session) {
      creteAlert("error", "You need to sign in to proceed with checkout.");
      router.push("/login");
      return;
    }

    if (!isCartProduct) {
      creteAlert("error", "Cart is empty. Please add items to the cart.");
      return;
    }

    setLoading(true);

    try {
      const items = cartProducts.map((product) => {
        const sarPrice = parseFloat(product.price);
        const RATES = {
          SAR: 1,
          USD: 0.27,
          AED: 0.97,
          PKR: 74.66,
          CAD: 0.37,
        };
        const convertedPrice = sarPrice * (RATES[currency] || 1);
        return {
          name: product.title,
          price: convertedPrice.toFixed(2),
          image: product.thumbnail,
          quantity: 1,
          courseId: product.courseId,
        };
      });

      const userEmail = session.user.email;

      if (paymentMethod === "stripe") {
        await handleStripeCheckout(items, userEmail);
      } else {
        await handlePaymobCheckout(items, userEmail);
      }
    } catch (error) {
      creteAlert(
        "error",
        error.message || "Failed to proceed to checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section>
        <div className="container py-50px lg:py-60px 2xl:py-20 3xl:py-100px">
          {/* Cart table */}
          <div className="text-contentColor dark:text-contentColor-dark text-size-10 md:text-base overflow-auto">
            <table className="table-fixed md:table-auto leading-1.8 text-center w-150 md:w-full overflow-auto border border-borderColor dark:border-borderColor-dark box-content md:box-border">
              <thead>
                <tr className="md:text-sm text-blackColor dark:text-blackColor-dark uppercase font-medium border-b border-borderColor dark:border-borderColor-dark">
                  <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                    Image
                  </th>
                  <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                    Product
                  </th>
                  <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                    Price
                  </th>
                  <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                    Quantity
                  </th>
                  <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                    Total
                  </th>
                  <th className="pt-13px pb-9px md:py-22px px-5 md:px-25px leading-1.8 max-w-25 whitespace-nowrap">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isCartProduct ? (
                  <tr className="relative">
                    <td className="p-5 md:p-10 " colSpan="6">
                      <p className="w-full h-full flex items-center justify-center md:text-xl font-bold capitalize opacity-70 ">
                        Your cart is empty.
                      </p>
                    </td>
                  </tr>
                ) : (
                  cartProducts.map((product, idx) => (
                    <CartProduct key={idx} product={product} />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Cart action buttons */}
          <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-5 gap-y-10px pt-22px pb-9 md:pt-30px md:pb-55px">
            <div>
              <Link
                href={"/courses"}
                className="text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 px-5 py-18px md:px-10 bg-blackColor dark:bg-blackColor-dark hover:bg-primaryColor dark:hover:bg-primaryColor"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
            {isCartProduct && (
              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-5 gap-y-10px">
                <button
                  onClick={handleUpdateCart}
                  className="text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 px-5 py-18px md:px-10 bg-blackColor dark:bg-blackColor-dark hover:bg-primaryColor dark:hover:bg-primaryColor"
                >
                  UPDATE CART
                </button>
                <button
                  onClick={handleClearCart}
                  className="text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 px-5 py-18px md:px-10 bg-blackColor dark:bg-blackColor-dark hover:bg-primaryColor dark:hover:bg-primaryColor"
                >
                  CLEAR CART
                </button>
              </div>
            )}
          </div>

          {/* Cart summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-30px">
            <div>
              <div className="px-30px pt-45px pb-50px leading-1.8 border border-borderColor dark:border-borderColor-dark rounded-5px">
                <div className="flex gap-x-4">
                  <h3 className="text-lg whitespace-nowrap font-medium text-blackColor dark:text-blackColor-dark mb-22px">
                    <span className="leading-1.2">
                      Review Course Details and Total Fees
                    </span>
                  </h3>
                  <div className="h-1px w-full bg-borderColor2 dark:bg-borderColor2-dark mt-2"></div>
                </div>
                <p className="text-contentColor dark:text-contentColor-dark mb-15px">
                  This emphasizes the course-specific aspect of the purchase and
                  creates a more student-friendly tone.
                </p>
              </div>
            </div>
            <div>
              <div className="px-30px pt-45px pb-50px leading-1.8 border border-borderColor dark:border-borderColor-dark rounded-5px">
                <div className="flex gap-x-4">
                  <h3 className="text-lg whitespace-nowrap font-medium text-blackColor dark:text-blackColor-dark mb-22px">
                    <span className="leading-1.2">Cart Note</span>
                  </h3>
                  <div className="h-1px w-full bg-borderColor2 dark:bg-borderColor2-dark mt-2"></div>
                </div>
                <p className="text-contentColor dark:text-contentColor-dark mb-15px">
                  Special instructions for seller
                </p>
                <form>
                  <div className="mb-5">
                    <textarea
                      className="text-xs text-blackColor py-11px px-15px w-full rounded box-border border border-borderColor2 dark:border-borderColor2-dark"
                      cols="30"
                      rows="4"
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
            <div>
              <div className="px-30px pt-45px pb-50px leading-1.8 border border-borderColor dark:border-borderColor-dark rounded-5px">
                <div className="flex gap-x-4">
                  <h3 className="text-lg whitespace-nowrap font-medium text-blackColor dark:text-blackColor-dark mb-9">
                    <span className="leading-1.2">Cart Total</span>
                  </h3>
                  <div className="h-1px w-full bg-borderColor2 dark:bg-borderColor2-dark mt-2"></div>
                </div>
                <h4 className="text-sm font-bold text-blackColor dark:text-blackColor-dark mb-5 flex justify-between items-center">
                  <span className="leading-1.2">Cart Totals</span>
                  <span className="leading-1.2 text-lg font-medium">
                    <PriceDisplay usdPrice={totalPrice || 0} />
                  </span>
                </h4>

                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />
                <div>
                  <button
                    type="button"
                    className="text-size-13 text-whiteColor dark:text-whiteColor-dark dark:hover:text-whiteColor leading-1 px-5 py-18px md:px-10 bg-blackColor dark:bg-blackColor-dark hover:bg-primaryColor dark:hover:bg-primaryColor w-full"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : `Check Out Now`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showBillingForm && pendingCheckout && (
        <BillingInfoForm
          countryInfo={pendingCheckout.countryInfo}
          onSubmit={handleBillingFormSubmit}
          onCancel={handleBillingFormCancel}
        />
      )}
    </>
  );
};

export default CartPrimary;
