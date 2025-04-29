import React, { useState, useEffect } from 'react';
import './Analytics.css';

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    recentFeedbacks: []
  });

  useEffect(() => {
    // Load feedback data from localStorage
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    
    // Calculate analytics
    const totalFeedbacks = feedbacks.length;
    const averageRating = totalFeedbacks > 0 
      ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedbacks 
      : 0;
    
    const ratingDistribution = feedbacks.reduce((acc, curr) => {
      acc[curr.rating] = (acc[curr.rating] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    const recentFeedbacks = feedbacks
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    setAnalyticsData({
      totalFeedbacks,
      averageRating,
      ratingDistribution,
      recentFeedbacks
    });
  }, []);

  return (
    <div className="analytics-container">
      <h1>Analytics Dashboard</h1>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Feedbacks</h3>
          <p className="analytics-number">{analyticsData.totalFeedbacks}</p>
        </div>
        
        <div className="analytics-card">
          <h3>Average Rating</h3>
          <p className="analytics-number">{analyticsData.averageRating.toFixed(1)}</p>
        </div>
      </div>

      <div className="rating-distribution">
        <h2>Rating Distribution</h2>
        <div className="distribution-bars">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="distribution-bar">
              <span className="rating-label">{rating} ★</span>
              <div className="bar-container">
                <div 
                  className="bar" 
                  style={{ 
                    width: `${(analyticsData.ratingDistribution[rating] / analyticsData.totalFeedbacks) * 100}%` 
                  }}
                ></div>
              </div>
              <span className="count">{analyticsData.ratingDistribution[rating]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-feedbacks">
        <h2>Recent Feedbacks</h2>
        <div className="feedback-list">
          {analyticsData.recentFeedbacks.map(feedback => (
            <div key={feedback.id} className="feedback-item">
              <div className="feedback-header">
                <span className="customer-name">{feedback.customerName}</span>
                <span className="rating">{feedback.rating} ★</span>
              </div>
              <p className="feedback-message">{feedback.message}</p>
              <span className="feedback-date">
                {new Date(feedback.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics; 