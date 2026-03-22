
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../ShopContext/ShopContext";
import CartModal from "./CartModal";
import AddressForm from "../Checkout/AddressForm";
import PaymentMethod from "../Checkout/PaymentMethod"; // New import
import "./CartContent.scss";
import { FaEdit, FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import shopData from "../ShopContent/ShopData";

const TotalAmount = () => {
  const { 
    totalAmount, 
    totalCartItems, 
    resetCart, 
    items 
  } = useContext(CartContext);
  
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); // New state for payment
  const [showPayment, setShowPayment] = useState(false); // New state to show payment section

  // Load saved addresses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      try {
        const addresses = JSON.parse(saved);
        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          setSelectedAddress(addresses[0]);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
    }
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOrderError('');
  };

  const handleSaveAddress = (address) => {
    const newAddress = {
      ...address,
      id: Date.now(),
      isDefault: savedAddresses.length === 0
    };

    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    setSelectedAddress(newAddress);
    setShowAddressForm(false);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      alert('Please select or add a shipping address');
      return;
    }
    setShowPayment(true);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert('Please select or add a shipping address');
      return;
    }

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      alert('Please login to complete your purchase. Redirecting to login page...');
      navigate('/login');
      return;
    }

    if (totalCartItems() === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsProcessing(true);
    setOrderError('');

    try {
      // Get user data
      let userData;
      try {
        userData = JSON.parse(user);
      } catch (e) {
        userData = { id: user, email: user };
      }

      // Prepare cart items from items object
      const cartItemsArray = Object.keys(items)
        .filter(itemId => items[itemId] > 0)
        .map(itemId => {
          const product = shopData.find(p => p.id.toString() === itemId.toString());
          if (!product) {
            console.warn(`Product with id ${itemId} not found in shopData`);
            return null;
          }
          
          return {
            productId: product.id.toString(),
            name: product.name,
            price: product.price,
            quantity: items[itemId],
            image: product.img
          };
        })
        .filter(item => item !== null);

      if (cartItemsArray.length === 0) {
        throw new Error('No valid items in cart');
      }

      // Calculate totals
      const subtotal = totalAmount();
      const shipping = 99;
      const total = subtotal + shipping;

      // Generate transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

      // Prepare order data with selected address and payment
      const orderData = {
        userId: userData.id || userData.email,
        userEmail: userData.email,
        items: cartItemsArray,
        subtotal: subtotal,
        shipping: shipping,
        totalAmount: total,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country,
          zipCode: selectedAddress.zipCode,
          addressType: selectedAddress.addressType
        },
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'processing',
        orderStatus: 'pending',
        orderNotes: "Order from FitnessGym website",
        transactionId: transactionId,
        paymentDetails: {
          method: paymentMethod,
          timestamp: new Date().toISOString(),
          amount: total.toString()
        }
      };

      console.log('Order data:', orderData);

      // Create order in database
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Order failed');
      }

      // If payment is not COD, show payment processing
      if (paymentMethod !== 'cod') {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update payment status
        const updateResponse = await fetch(`http://localhost:5000/api/orders/${result._id}/payment`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            paymentStatus: 'completed',
            orderStatus: 'confirmed'
          }),
        });
      }

      // Clear cart after successful order
      resetCart();
      
      // Store order details for success modal
      localStorage.setItem('lastOrder', JSON.stringify({
        orderId: result.orderId || result._id || transactionId,
        total: total,
        date: new Date().toLocaleDateString(),
        paymentMethod: paymentMethod,
        transactionId: transactionId
      }));
      
      // Show success modal
      openModal();

    } catch (error) {
      console.error('Checkout error:', error);
      setOrderError(error.message || 'Failed to process order. Please try again.');
      
      if (error.message.includes('network')) {
        setOrderError('Network error. Please check your connection and try again.');
      } else if (error.message.includes('token') || error.message.includes('auth')) {
        setOrderError('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart__info">
      <h3 className="cart__info-title">Order Summary</h3>
      
      {/* Shipping Address Section */}
      <div className="shipping-section">
        <div className="section-header">
          <FaMapMarkerAlt />
          <h4>Shipping Address</h4>
          <button 
            className="btn-add-address"
            onClick={() => setShowAddressForm(true)}
          >
            <FaPlus /> Add New
          </button>
        </div>

        {showAddressForm ? (
          <AddressForm
            onSave={handleSaveAddress}
            onCancel={() => setShowAddressForm(false)}
          />
        ) : (
          <>
            {/* Saved Addresses List */}
            {savedAddresses.length > 0 ? (
              <div className="address-list">
                {savedAddresses.map((address) => (
                  <div 
                    key={address.id}
                    className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                    onClick={() => handleSelectAddress(address)}
                  >
                    <div className="address-header">
                      <span className="address-type">
                        {address.addressType === 'home' ? '🏠' : 
                         address.addressType === 'work' ? '💼' : '📍'}
                        {address.addressType}
                      </span>
                      {address.isDefault && (
                        <span className="default-badge">Default</span>
                      )}
                    </div>
                    <div className="address-details">
                      <p><strong>{address.fullName}</strong> | {address.phone}</p>
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} - {address.zipCode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                    <button 
                      className="btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit functionality can be added here
                      }}
                    >
                      <FaEdit />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-address">
                <p>No saved addresses. Please add a shipping address.</p>
                <button 
                  className="btn-add-first"
                  onClick={() => setShowAddressForm(true)}
                >
                  <FaPlus /> Add Shipping Address
                </button>
              </div>
            )}

            {/* Payment Method Section */}
            {!showPayment ? (
              <>
                {/* Order Summary */}
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{totalAmount().toFixed(0)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>₹99</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span className="total-price">₹{(totalAmount() + 99).toFixed(0)}</span>
                  </div>
                </div>

                {orderError && (
                  <div className="cart__error">
                    {orderError}
                  </div>
                )}

                <div className="cart__buttons">
                  <button 
                    className="cart__btn" 
                    onClick={() => navigate("/shop")}
                    disabled={isProcessing}
                  >
                    Continue Shopping
                  </button>
                  <button 
                    className="cart__btn cart__btn-checkout" 
                    onClick={handleProceedToPayment}
                    disabled={isProcessing || totalCartItems() === 0 || !selectedAddress}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Payment Method Selection */}
                <PaymentMethod 
                  onSelectPayment={setPaymentMethod}
                  selectedMethod={paymentMethod}
                />

                {/* Order Summary */}
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{totalAmount().toFixed(0)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>₹99</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span className="total-price">₹{(totalAmount() + 99).toFixed(0)}</span>
                  </div>
                </div>

                {orderError && (
                  <div className="cart__error">
                    {orderError}
                  </div>
                )}

                <div className="cart__buttons">
                  <button 
                    className="cart__btn" 
                    onClick={() => setShowPayment(false)}
                    disabled={isProcessing}
                  >
                    Back to Address
                  </button>
                  <button 
                    className="cart__btn cart__btn-checkout" 
                    onClick={handleCheckout}
                    disabled={isProcessing || totalCartItems() === 0}
                  >
                    {isProcessing ? 'Processing...' : 
                      paymentMethod === 'cod' ? `Place Order (COD)` : `Pay ₹${(totalAmount() + 99).toFixed(0)}`}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      <CartModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default TotalAmount;