import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    categories: {
      positive: 0,
      neutral: 0,
      negative: 0
    },
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });

  useEffect(() => {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    const totalFeedbacks = feedbacks.length;
    const averageRating = totalFeedbacks > 0
      ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalFeedbacks
      : 0;
    
    // Calculate rating distribution
    const ratingDistribution = {
      5: feedbacks.filter(f => f.rating === 5).length,
      4: feedbacks.filter(f => f.rating === 4).length,
      3: feedbacks.filter(f => f.rating === 3).length,
      2: feedbacks.filter(f => f.rating === 2).length,
      1: feedbacks.filter(f => f.rating === 1).length
    };
    
    const categories = {
      positive: feedbacks.filter(f => f.rating >= 4).length,
      neutral: feedbacks.filter(f => f.rating === 3).length,
      negative: feedbacks.filter(f => f.rating <= 2).length
    };

    setStats({ 
      totalFeedbacks, 
      averageRating, 
      categories,
      ratingDistribution
    });
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Feedbacks</h3>
          <p className="stat-value">{stats.totalFeedbacks}</p>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <div className="rating-display">
            <p className="stat-value">{stats.averageRating.toFixed(1)}</p>
            <div className="rating-stars">
              {'★'.repeat(Math.round(stats.averageRating))}
              {'☆'.repeat(5 - Math.round(stats.averageRating))}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <h3>Feedback Categories</h3>
          <div className="category-stats">
            <div className="category positive">
              <span>Positive (4-5 Stars)</span>
              <span>{stats.categories.positive}</span>
            </div>
            <div className="category neutral">
              <span>Neutral (3 Stars)</span>
              <span>{stats.categories.neutral}</span>
            </div>
            <div className="category negative">
              <span>Negative (1-2 Stars)</span>
              <span>{stats.categories.negative}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rating-distribution">
        <h3>Rating Distribution</h3>
        <div className="distribution-bars">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.ratingDistribution[rating];
            const percentage = (count / stats.totalFeedbacks) * 100;
            return (
              <div key={rating} className="distribution-bar">
                <div className="bar-label">
                  <span className="star-rating">{'★'.repeat(rating)}</span>
                  <span className="rating-count">{count} ratings</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getRatingColor(rating)
                    }}
                  />
                </div>
                <div className="bar-percentage">{percentage.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getRatingColor(rating) {
  const colors = {
    5: '#28a745',
    4: '#28a745',
    3: '#ffc107',
    2: '#dc3545',
    1: '#dc3545'
  };
  return colors[rating] || '#6c757d';
}

export default Dashboard; 