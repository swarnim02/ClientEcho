import React, { useState, useEffect } from 'react';
import './FeedbackList.css';

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [filters, setFilters] = useState({
    rating: 'all',
    search: ''
  });

  useEffect(() => {
    const storedFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    setFeedbacks(storedFeedbacks);
    setFilteredFeedbacks(storedFeedbacks);
  }, []);

  useEffect(() => {
    let filtered = [...feedbacks];
    
    // Filter by rating
    if (filters.rating !== 'all') {
      filtered = filtered.filter(f => f.rating === parseInt(filters.rating));
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(searchTerm) ||
        f.message.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredFeedbacks(filtered);
  }, [filters, feedbacks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'positive';
    if (rating === 3) return 'neutral';
    return 'negative';
  };

  return (
    <div className="feedback-list">
      <h2>Feedback List</h2>
      
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="rating-filter">Filter by Rating:</label>
          <select
            id="rating-filter"
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search">Search:</label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by name or message..."
          />
        </div>
      </div>

      <div className="feedback-items">
        {filteredFeedbacks.length === 0 ? (
          <p className="no-feedback">No feedback found</p>
        ) : (
          filteredFeedbacks.map(feedback => (
            <div key={feedback.id} className="feedback-item">
              <div className="feedback-header">
                <h3>{feedback.name}</h3>
                <span className={`rating ${getRatingColor(feedback.rating)}`}>
                  {'★'.repeat(feedback.rating)}
                </span>
              </div>
              <p className="feedback-date">
                {new Date(feedback.date).toLocaleDateString()}
              </p>
              <p className="feedback-message">{feedback.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FeedbackList; 