import React from 'react';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import './FeedbackPage.css';

function FeedbackPage() {
  return (
    <div className="feedback-page">
      <header className="page-header">
        <h1>Customer Feedback</h1>
        <p>Submit and manage customer feedback</p>
      </header>
      <div className="feedback-content">
        <div className="feedback-form-section">
          <FeedbackForm />
        </div>
        <div className="feedback-list-section">
          <FeedbackList />
        </div>
      </div>
    </div>
  );
}

export default FeedbackPage; 