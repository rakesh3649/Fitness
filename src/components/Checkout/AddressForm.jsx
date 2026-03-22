import React, { useState } from 'react';
import './AddressForm.scss';

const AddressForm = ({ onSave, onCancel, initialAddress = {} }) => {
  const [formData, setFormData] = useState({
    fullName: initialAddress.fullName || '',
    phone: initialAddress.phone || '',
    street: initialAddress.street || '',
    city: initialAddress.city || '',
    state: initialAddress.state || '',
    country: initialAddress.country || 'India',
    zipCode: initialAddress.zipCode || '',
    addressType: initialAddress.addressType || 'home'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    else if (!/^\d{6}$/.test(formData.zipCode)) newErrors.zipCode = 'Enter a valid 6-digit ZIP code';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const addressTypes = [
    { value: 'home', label: '🏠 Home', description: 'Delivery during day time' },
    { value: 'work', label: '💼 Work', description: 'Delivery during office hours' },
    { value: 'other', label: '📍 Other', description: 'Custom delivery instructions' }
  ];

  return (
    <div className="address-form-container">
      <h3 className="form-title">Shipping Address</h3>
      <p className="form-subtitle">Enter your delivery address</p>

      <form onSubmit={handleSubmit} className="address-form">
        {/* Address Type Selection */}
        <div className="form-section">
          <label className="section-label">Address Type</label>
          <div className="address-type-buttons">
            {addressTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`type-btn ${formData.addressType === type.value ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, addressType: type.value })}
              >
                <span className="type-icon">{type.label.split(' ')[0]}</span>
                <span className="type-label">{type.label.split(' ')[1]}</span>
                <span className="type-desc">{type.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Personal Details */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        </div>

        {/* Street Address */}
        <div className="form-group">
          <label htmlFor="street">Street Address *</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="House no., Building, Street, Area"
            className={errors.street ? 'error' : ''}
          />
          {errors.street && <span className="error-text">{errors.street}</span>}
        </div>

        {/* City, State, ZIP */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="state">State *</label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? 'error' : ''}
            >
              <option value="">Select State</option>
              <option value="Delhi">Delhi</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Other">Other</option>
            </select>
            {errors.state && <span className="error-text">{errors.state}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">ZIP Code *</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="6-digit PIN code"
              maxLength="6"
              className={errors.zipCode ? 'error' : ''}
            />
            {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
          </div>
        </div>

        {/* Country */}
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            readOnly
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-save">
            Save Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;