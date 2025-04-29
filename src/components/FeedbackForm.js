import React, { useState, useEffect } from 'react';
import './FeedbackForm.css';

function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    // Load customers from localStorage
    const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(storedCustomers);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Feedback message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Get existing data
      const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      const customers = JSON.parse(localStorage.getItem('customers') || '[]');

      // Create new feedback
      const newFeedback = {
        id: Date.now(),
        customerId: selectedCustomer ? selectedCustomer.id : null,
        customerName: formData.name,
        customerEmail: formData.email,
        rating: formData.rating,
        message: formData.message,
        date: new Date().toISOString()
      };

      // Add feedback to storage
      feedbacks.push(newFeedback);
      localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

      // Update customer stats if it's an existing customer
      if (selectedCustomer) {
        const customerIndex = customers.findIndex(c => c.id === selectedCustomer.id);
        if (customerIndex !== -1) {
          const customer = customers[customerIndex];
          const customerFeedbacks = feedbacks.filter(f => f.customerId === customer.id);
          
          customers[customerIndex] = {
            ...customer,
            feedbackCount: customerFeedbacks.length,
            averageRating: customerFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / customerFeedbacks.length
          };
        }
      } else {
        // Create new customer if it's a new submission
        const newCustomer = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          joinDate: new Date().toISOString(),
          feedbackCount: 1,
          averageRating: formData.rating
        };
        customers.push(newCustomer);
      }

      // Update customers in storage
      localStorage.setItem('customers', JSON.stringify(customers));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        rating: 5,
        message: ''
      });
      setSelectedCustomer(null);
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomerSelect = (e) => {
    const customerId = e.target.value;
    if (customerId) {
      const customer = customers.find(c => c.id === parseInt(customerId));
      setSelectedCustomer(customer);
      setFormData(prev => ({
        ...prev,
        name: customer.name,
        email: customer.email
      }));
    } else {
      setSelectedCustomer(null);
      setFormData(prev => ({
        ...prev,
        name: '',
        email: ''
      }));
    }
  };

  return (
    <div className="feedback-form">
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customer-select">Select Customer (Optional)</label>
          <select
            id="customer-select"
            value={selectedCustomer ? selectedCustomer.id : ''}
            onChange={handleCustomerSelect}
          >
            <option value="">New Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            disabled={selectedCustomer !== null}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            disabled={selectedCustomer !== null}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`star ${formData.rating >= star ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="message">Feedback Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? 'error' : ''}
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>

        <button type="submit" className="submit-button">Submit Feedback</button>
      </form>
    </div>
  );
}

export default FeedbackForm; 