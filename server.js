const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Lead model, Google Sheets, and Resend Email Service
const Lead = require('./models/Lead');
const { appendToGoogleSheet } = require('./googleSheets');
const { sendLeadNotification } = require('./resendEmail');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/property-advisor');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (helpers for your server)
app.use(cors()); // Allow React app to talk to backend
app.use(express.json()); // Understand JSON data
app.use(express.urlencoded({ extended: true })); // Understand form data

// Test route - to make sure server works
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working! 🎉' });
});

// Get all leads route
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      data: leads,
      count: leads.length
    });
  } catch (error) {
    console.error('❌ Error fetching leads:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch leads' 
    });
  }
});

// Lead submission route (this is what your React app will call)
app.post('/api/leads', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      propertyType,
      plotSize,
      plotSizeUnit,
      budget,
      location,
      timeline,
      additionalInfo 
    } = req.body;
    
    // Create a formatted requirements string from all the form data
    const requirements = `
Property Type: ${propertyType}
Budget Range: ${budget}
Plot Size: ${plotSize} ${plotSizeUnit}
Location: ${location}
Timeline: ${timeline}
Additional Info: ${additionalInfo || 'None provided'}
    `.trim();
    
    // Save to MongoDB using Lead model
    const lead = new Lead({
      name,
      email,
      phone,
      requirements,
      status: 'new'
    });
    
    await lead.save();
    
    // Also save to Google Sheets
    const leadData = { name, email, phone, requirements, status: 'new' };
    await appendToGoogleSheet(leadData);
    
    // Send email notification
    await sendLeadNotification(leadData);
    
    console.log('✅ Lead saved to MongoDB:', {
      name,
      email,
      phone,
      requirements,
      timestamp: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      message: 'Lead submitted successfully! We will contact you soon.' 
    });
    
  } catch (error) {
    console.error('❌ Error saving lead to MongoDB:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong. Please try again.' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log('📝 Test endpoint: http://localhost:5000/api/test');
  console.log('📧 Lead endpoint: http://localhost:5000/api/leads');
});