
import React, { useState } from 'react';
import './PaymentMethod.scss';
import { FaCreditCard, FaMobileAlt, FaUniversity, FaMoneyBillWave } from 'react-icons/fa';

const PaymentMethod = ({ onSelectPayment, selectedMethod }) => {
  const paymentMethods = [
    {
      id: 'card',
      title: 'Credit/Debit Card',
      icon: <FaCreditCard />,
      description: 'Pay with your Visa, MasterCard, or Rupay',
      popular: true
    },
    {
      id: 'upi',
      title: 'UPI',
      icon: <FaMobileAlt />,
      description: 'Pay using Google Pay, PhonePe, Paytm',
      popular: true
    },
    {
      id: 'netbanking',
      title: 'Net Banking',
      icon: <FaUniversity />,
      description: 'Pay directly from your bank account'
    },
    {
      id: 'cod',
      title: 'Cash on Delivery',
      icon: <FaMoneyBillWave />,
      description: 'Pay when your order is delivered'
    }
  ];

  return (
    <div className="payment-method">
      <h3 className="payment-title">Payment Method</h3>
      <p className="payment-subtitle">Select your preferred payment option</p>
      
      <div className="payment-options">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-option ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => onSelectPayment(method.id)}
          >
            <div className="option-header">
              <div className="option-icon">{method.icon}</div>
              <div className="option-info">
                <h4 className="option-title">{method.title}</h4>
                <p className="option-description">{method.description}</p>
              </div>
              {method.popular && (
                <span className="popular-badge">Popular</span>
              )}
            </div>
            <div className="option-radio">
              <input
                type="radio"
                name="paymentMethod"
                id={method.id}
                checked={selectedMethod === method.id}
                onChange={() => onSelectPayment(method.id)}
              />
              <label htmlFor={method.id}></label>
            </div>
          </div>
        ))}
      </div>
      
      {/* Card Details Form (shown when card is selected) */}
      {selectedMethod === 'card' && (
        <div className="card-details">
          <h4>Card Details</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456" 
                maxLength="19"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Card Holder Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input 
                type="text" 
                placeholder="MM/YY" 
                maxLength="5"
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input 
                type="password" 
                placeholder="123" 
                maxLength="3"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* UPI Details (shown when UPI is selected) */}
      {selectedMethod === 'upi' && (
        <div className="upi-details">
          <h4>Enter UPI ID</h4>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="username@upi" 
            />
            <p className="hint">Enter your UPI ID to proceed with payment</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;