import React, { useState, useEffect } from 'react';
import './AnalyticsPage.css';

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalCustomers: 0,
    totalFeedbacks: 0,
    averageRating: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    monthlyStats: [],
    customerEngagement: {
      activeCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0
    },
    topCustomers: [],
    customerSatisfaction: {
      verySatisfied: 0,
      satisfied: 0,
      neutral: 0,
      dissatisfied: 0,
      veryDissatisfied: 0
    },
    stateDistribution: {},
    regionDistribution: {
      North: 0,
      South: 0,
      East: 0,
      West: 0,
      Central: 0
    }
  });

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      // Load data from localStorage
      const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      const customers = JSON.parse(localStorage.getItem('customers') || '[]');

      // Calculate state distribution
      const stateDistribution = customers.reduce((acc, customer) => {
        if (customer.state) {
          acc[customer.state] = (acc[customer.state] || 0) + 1;
        }
        return acc;
      }, {});

      // Calculate region distribution with proper initialization
      const regionDistribution = {
        North: 0,
        South: 0,
        East: 0,
        West: 0,
        Central: 0
      };

      customers.forEach(customer => {
        if (customer.state) {
          const region = getRegionFromState(customer.state);
          if (regionDistribution.hasOwnProperty(region)) {
            regionDistribution[region]++;
          }
        }
      });

      // Calculate basic stats
      const totalFeedbacks = feedbacks.length;
      const totalCustomers = customers.length;
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

      // Calculate customer satisfaction levels
      const customerSatisfaction = {
        verySatisfied: ratingDistribution[5],
        satisfied: ratingDistribution[4],
        neutral: ratingDistribution[3],
        dissatisfied: ratingDistribution[2],
        veryDissatisfied: ratingDistribution[1]
      };

      // Calculate yearly stats
      const yearlyStats = calculateYearlyStats(feedbacks, selectedYear);

      // Calculate customer engagement
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const activeCustomers = new Set(feedbacks
        .filter(f => new Date(f.date) > lastMonth)
        .map(f => f.customerId)
      ).size;

      const newCustomers = customers
        .filter(c => new Date(c.joinDate) > lastMonth)
        .length;

      const returningCustomers = customers
        .filter(c => c.feedbackCount > 1)
        .length;

      // Get top customers by feedback count
      const topCustomers = [...customers]
        .sort((a, b) => b.feedbackCount - a.feedbackCount)
        .slice(0, 5);

      setAnalytics({
        totalCustomers,
        totalFeedbacks,
        averageRating,
        ratingDistribution,
        monthlyStats: yearlyStats,
        customerEngagement: {
          activeCustomers,
          newCustomers,
          returningCustomers
        },
        topCustomers,
        customerSatisfaction,
        stateDistribution,
        regionDistribution
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear]);

  const calculateYearlyStats = (feedbacks, year) => {
    const months = {};
    feedbacks.forEach(feedback => {
      const date = new Date(feedback.date);
      if (date.getFullYear() === year) {
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!months[monthKey]) {
          months[monthKey] = {
            count: 0,
            averageRating: 0,
            totalRating: 0,
            uniqueCustomers: new Set()
          };
        }
        months[monthKey].count++;
        months[monthKey].totalRating += feedback.rating;
        months[monthKey].averageRating = months[monthKey].totalRating / months[monthKey].count;
        months[monthKey].uniqueCustomers.add(feedback.customerId);
      }
    });
    return Object.entries(months)
      .map(([month, stats]) => ({
        month,
        count: stats.count,
        averageRating: stats.averageRating,
        uniqueCustomers: stats.uniqueCustomers.size
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const getRegionFromState = (state) => {
    const regions = {
      North: ['Delhi', 'Haryana', 'Punjab', 'Uttarakhand'],
      South: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Kerala', 'Telangana'],
      East: ['West Bengal', 'Bihar', 'Odisha', 'Jharkhand'],
      West: ['Maharashtra', 'Gujarat'],
      Central: ['Madhya Pradesh', 'Chhattisgarh', 'Uttar Pradesh', 'Rajasthan']
    };

    for (const [region, states] of Object.entries(regions)) {
      if (states.includes(state)) {
        return region;
      }
    }
    return 'Other';
  };

  return (
    <div className="analytics-page">
      <header className="page-header">
        <h1>Analytics</h1>
        <p>Customer feedback insights and statistics</p>
      </header>

      {isLoading ? (
        <div className="loading">Loading analytics...</div>
      ) : (
        <>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Total Customers</h3>
              <p className="stat-value">{analytics.totalCustomers}</p>
            </div>
            <div className="analytics-card">
              <h3>Total Feedbacks</h3>
              <p className="stat-value">{analytics.totalFeedbacks}</p>
            </div>
            <div className="analytics-card">
              <h3>Average Rating</h3>
              <div className="rating-display">
                <p className="stat-value">{analytics.averageRating.toFixed(1)}</p>
                <div className="rating-stars">
                  {'★'.repeat(Math.round(analytics.averageRating))}
                  {'☆'.repeat(5 - Math.round(analytics.averageRating))}
                </div>
              </div>
            </div>
          </div>

          <div className="customer-engagement">
            <h2>Customer Engagement</h2>
            <div className="engagement-grid">
              <div className="engagement-card">
                <h3>Active Customers</h3>
                <p className="stat-value">{analytics.customerEngagement.activeCustomers}</p>
                <p className="stat-label">Last 30 days</p>
              </div>
              <div className="engagement-card">
                <h3>New Customers</h3>
                <p className="stat-value">{analytics.customerEngagement.newCustomers}</p>
                <p className="stat-label">Last 30 days</p>
              </div>
              <div className="engagement-card">
                <h3>Returning Customers</h3>
                <p className="stat-value">{analytics.customerEngagement.returningCustomers}</p>
                <p className="stat-label">Multiple feedbacks</p>
              </div>
            </div>
          </div>

          <div className="rating-distribution">
            <h2>Rating Distribution</h2>
            <div className="distribution-bars">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = analytics.ratingDistribution[rating];
                const percentage = (count / analytics.totalFeedbacks) * 100;
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

          <div className="customer-satisfaction">
            <h2>Customer Satisfaction</h2>
            <div className="satisfaction-grid">
              <div className="satisfaction-card very-satisfied">
                <h3>Very Satisfied</h3>
                <p className="stat-value">{analytics.customerSatisfaction.verySatisfied}</p>
                <p className="stat-label">5 Stars</p>
              </div>
              <div className="satisfaction-card satisfied">
                <h3>Satisfied</h3>
                <p className="stat-value">{analytics.customerSatisfaction.satisfied}</p>
                <p className="stat-label">4 Stars</p>
              </div>
              <div className="satisfaction-card neutral">
                <h3>Neutral</h3>
                <p className="stat-value">{analytics.customerSatisfaction.neutral}</p>
                <p className="stat-label">3 Stars</p>
              </div>
              <div className="satisfaction-card dissatisfied">
                <h3>Dissatisfied</h3>
                <p className="stat-value">{analytics.customerSatisfaction.dissatisfied}</p>
                <p className="stat-label">2 Stars</p>
              </div>
              <div className="satisfaction-card very-dissatisfied">
                <h3>Very Dissatisfied</h3>
                <p className="stat-value">{analytics.customerSatisfaction.veryDissatisfied}</p>
                <p className="stat-label">1 Star</p>
              </div>
            </div>
          </div>

          <div className="monthly-stats">
            <h2>Yearly Statistics</h2>
            <div className="year-selector">
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {[2020, 2021, 2022, 2023, 2024].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="stats-table">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Feedbacks</th>
                    <th>Unique Customers</th>
                    <th>Average Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.monthlyStats && analytics.monthlyStats.map(stat => (
                    <tr key={stat.month}>
                      <td>{new Date(stat.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</td>
                      <td>{stat.count}</td>
                      <td>{stat.uniqueCustomers}</td>
                      <td>{stat.averageRating.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="region-distribution">
            <h2>Region-wise Customer Distribution</h2>
            <div className="region-grid">
              {Object.entries(analytics.regionDistribution)
                .sort((a, b) => b[1] - a[1])
                .map(([region, count]) => (
                  <div key={region} className="region-card">
                    <h3>{region}</h3>
                    <div className="region-stats">
                      <div className="stat-item">
                        <p className="stat-value">{((count / analytics.totalCustomers) * 100).toFixed(1)}%</p>
                        <p className="stat-label">of Total Customers</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
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

export default AnalyticsPage; 