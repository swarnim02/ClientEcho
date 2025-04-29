import React, { useState, useEffect } from 'react';
import { generateRandomCustomers, generateRandomFeedbacks } from '../utils/randomData';
import './CustomerPage.css';

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: ''
  });

  useEffect(() => {
    // Check if we already have customers in localStorage
    let storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    let storedFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    
    // If no customers exist, generate random ones
    if (storedCustomers.length === 0) {
      storedCustomers = generateRandomCustomers(50);
      localStorage.setItem('customers', JSON.stringify(storedCustomers));
      
      // Generate feedbacks for the customers
      const feedbacks = generateRandomFeedbacks(storedCustomers);
      localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    }
    
    setCustomers(storedCustomers);
  }, []);

  const handleAddCustomer = (e) => {
    e.preventDefault();
    const customer = {
      id: Date.now(),
      ...newCustomer,
      joinDate: new Date().toISOString(),
      feedbackCount: 0,
      averageRating: 0
    };

    const updatedCustomers = [...customers, customer];
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    
    // Reset form
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      state: ''
    });
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredCustomers = customers
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.joinDate) - new Date(a.joinDate);
      return 0;
    });

  return (
    <div className="customer-page">
      <header className="page-header">
        <h1>Customer Management</h1>
        <p>Manage and view customer information</p>
      </header>

      <div className="add-customer-section">
        <button 
          className="add-customer-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Customer'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-customer-form">
          <h2>Add New Customer</h2>
          <form onSubmit={handleAddCustomer}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCustomer.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newCustomer.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={newCustomer.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={newCustomer.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={newCustomer.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Add Customer</button>
          </form>
        </div>
      )}

      <div className="customer-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sort-box">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Join Date</option>
          </select>
        </div>
      </div>

      <div className="customer-list">
        {filteredCustomers.length === 0 ? (
          <p className="no-customers">No customers found</p>
        ) : (
          filteredCustomers.map(customer => (
            <div key={customer.id} className="customer-card">
              <div className="customer-info">
                <h3>{customer.name}</h3>
                <p className="customer-email">{customer.email}</p>
                <p className="customer-phone">{customer.phone}</p>
                <p className="customer-address">{customer.address}</p>
                <p className="customer-state">{customer.state}</p>
                <p className="customer-join-date">
                  Joined: {new Date(customer.joinDate).toLocaleDateString()}
                </p>
              </div>
              <div className="customer-stats">
                <div className="stat">
                  <span className="stat-label">Feedbacks</span>
                  <span className="stat-value">{customer.feedbackCount}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Avg. Rating</span>
                  <span className="stat-value">{customer.averageRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CustomerPage; 