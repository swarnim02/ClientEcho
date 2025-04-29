const firstNames = [
  'John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava',
  'Alexander', 'Isabella', 'Benjamin', 'Mia', 'Elijah', 'Charlotte', 'Lucas',
  'Amelia', 'Mason', 'Harper', 'Logan', 'Evelyn', 'Jacob', 'Abigail', 'Jackson',
  'Emily', 'Sebastian', 'Elizabeth', 'Jack', 'Sofia', 'Owen', 'Avery'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

const feedbackMessages = [
  "Great service! Very satisfied with the experience.",
  "The product quality exceeded my expectations.",
  "Good service, but could be improved in some areas.",
  "Excellent customer support and quick response.",
  "The product met my needs perfectly.",
  "Average experience, nothing special.",
  "Very disappointed with the service quality.",
  "Would recommend to others, good value for money.",
  "The product was not as described.",
  "Amazing experience, will definitely come back!",
  "Service was slow but the end result was good.",
  "Not worth the price, expected better quality.",
  "Very professional and helpful staff.",
  "The product arrived damaged, but was quickly replaced.",
  "Good overall experience, minor issues.",
  "Excellent product, poor delivery service.",
  "Very happy with the purchase and service.",
  "Could improve in customer communication.",
  "Great value for money, highly recommended.",
  "The service was below average."
];

const indianStates = {
  North: ['Delhi', 'Haryana', 'Punjab', 'Uttarakhand'],
  South: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Kerala', 'Telangana'],
  East: ['West Bengal', 'Bihar', 'Odisha', 'Jharkhand'],
  West: ['Maharashtra', 'Gujarat'],
  Central: ['Madhya Pradesh', 'Chhattisgarh', 'Uttar Pradesh', 'Rajasthan']
};

function generateRandomName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

function generateRandomEmail(name) {
  const [firstName, lastName] = name.toLowerCase().split(' ');
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName}.${lastName}@${domain}`;
}

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomRating() {
  return Math.floor(Math.random() * 5) + 1;
}

function getRandomState() {
  // Get all regions
  const regions = Object.keys(indianStates);
  // Randomly select a region
  const randomRegion = regions[Math.floor(Math.random() * regions.length)];
  // Get states for the selected region
  const states = indianStates[randomRegion];
  // Randomly select a state from the region
  return states[Math.floor(Math.random() * states.length)];
}

export function generateRandomCustomers(count) {
  const customers = [];
  const startDate = new Date(2020, 0, 1);
  const endDate = new Date();

  for (let i = 0; i < count; i++) {
    const name = generateRandomName();
    const joinDate = generateRandomDate(startDate, endDate);
    const feedbackCount = Math.floor(Math.random() * 10);
    const averageRating = feedbackCount > 0 
      ? (Math.random() * 2 + 3).toFixed(1) 
      : 0;
    const state = getRandomState();

    customers.push({
      id: i + 1,
      name,
      email: generateRandomEmail(name),
      joinDate: joinDate.toISOString(),
      feedbackCount,
      averageRating: parseFloat(averageRating),
      state
    });
  }

  return customers;
}

export function generateRandomFeedbacks(customers) {
  const feedbacks = [];
  const startDate = new Date(2020, 0, 1);
  const endDate = new Date();

  customers.forEach(customer => {
    const feedbackCount = customer.feedbackCount;
    for (let i = 0; i < feedbackCount; i++) {
      const rating = generateRandomRating();
      const date = generateRandomDate(startDate, endDate);
      const message = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];

      feedbacks.push({
        id: feedbacks.length + 1,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        rating,
        message,
        date: date.toISOString()
      });
    }
  });

  return feedbacks;
} 