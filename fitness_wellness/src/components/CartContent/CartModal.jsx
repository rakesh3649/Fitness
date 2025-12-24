
import "./CartContent.scss";
import { motion } from "framer-motion";
import AnimationVariants from "../AnimationVariants/AnimationVariants";
import { FaCheckCircle, FaCreditCard, FaReceipt } from "react-icons/fa";

const CartModal = ({ isOpen, closeModal }) => {
  // Get order details from localStorage
  const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || '{}');
  
  const getPaymentMethodText = (method) => {
    switch(method) {
      case 'card': return 'Credit/Debit Card';
      case 'upi': return 'UPI';
      case 'netbanking': return 'Net Banking';
      case 'cod': return 'Cash on Delivery';
      default: return 'Online Payment';
    }
  };

  return (
    isOpen && (
      <motion.div
        variants={AnimationVariants.overlayAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        key="modal"
        className="cart__modal-overlay">
        <motion.div
          variants={AnimationVariants.modalAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          className="cart__modal">
          
          <FaCheckCircle className="success-icon" />
          <h2 className="cart__modal-title">Order Confirmed!</h2>
          
          <div className="order-details">
            <div className="order-info">
              <FaReceipt className="info-icon" />
              <div className="info-text">
                <p className="info-label">Order ID</p>
                <p className="info-value">{lastOrder.orderId || 'N/A'}</p>
              </div>
            </div>
            
            <div className="order-info">
              <FaCreditCard className="info-icon" />
              <div className="info-text">
                <p className="info-label">Payment Method</p>
                <p className="info-value">{getPaymentMethodText(lastOrder.paymentMethod)}</p>
              </div>
            </div>
            
            {lastOrder.transactionId && (
              <div className="order-info">
                <div className="info-text">
                  <p className="info-label">Transaction ID</p>
                  <p className="info-value transaction-id">{lastOrder.transactionId}</p>
                </div>
              </div>
            )}
            
            <div className="order-info">
              <div className="info-text">
                <p className="info-label">Total Amount</p>
                <p className="info-value total-amount">₹{lastOrder.total ? lastOrder.total.toFixed(0) : '0'}</p>
              </div>
            </div>
            
            <div className="order-info">
              <div className="info-text">
                <p className="info-label">Order Date</p>
                <p className="info-value">{lastOrder.date || new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="order-notes">
              <p className="notes-label">Notes:</p>
              <p className="notes-text">Order from FitnessGym website</p>
              <p className="notes-text">Your order has been confirmed and will be processed shortly.</p>
              <p className="notes-text">You will receive a confirmation email with tracking details.</p>
            </div>
          </div>
          
          <p className="cart__modal-text">Thank you for your purchase!</p>
          <button className="cart__modal-btn" onClick={closeModal}>
            Continue Shopping
          </button>
        </motion.div>
      </motion.div>
    )
  );
};

export default CartModal;