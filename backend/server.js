require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Order = require('./models/Order');
const { sendEmailNotification, sendWhatsAppNotification } = require('./services/notification');

const app = express();
const PORT = process.env.PORT || 5000;

// Local JSON Persistence fallback configuration
const fallbackDataDir = path.join(__dirname, 'data');
const fallbackFilePath = path.join(fallbackDataDir, 'orders.json');
if (!fs.existsSync(fallbackDataDir)) {
  fs.mkdirSync(fallbackDataDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

let isMongoConnected = false;

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ds_safety';
console.log('Connecting to MongoDB...');
mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    isMongoConnected = true;
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    console.log('WARNING: Server will fall back to local JSON file persistence at: ' + fallbackFilePath);
  });

// Track mongoose connection state changes
mongoose.connection.on('connected', () => { isMongoConnected = true; });
mongoose.connection.on('disconnected', () => { isMongoConnected = false; });

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    database: isMongoConnected ? 'MongoDB' : 'Local JSON Fallback',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Create Order / Enquiry endpoint
app.post('/orders', async (req, res) => {
  try {
    const { orderId, date, time, customerDetails, products } = req.body;

    // Simple validations
    if (!orderId || !customerDetails || !products || !products.length) {
      return res.status(400).json({ error: 'Missing required order fields.' });
    }

    if (!customerDetails.name || !customerDetails.company || !customerDetails.phone || !customerDetails.address) {
      return res.status(400).json({ error: 'Missing required customer contact details.' });
    }

    const orderPayload = {
      orderId,
      date,
      time,
      customerDetails,
      products,
      createdAt: new Date()
    };

    let savedOrder;

    if (isMongoConnected) {
      // 1a. Save to MongoDB
      const newOrder = new Order(orderPayload);
      savedOrder = await newOrder.save();
      console.log(`[Database: MongoDB] Order saved: ${savedOrder.orderId}`);
    } else {
      // 1b. Fallback: Save to Local JSON File
      let localOrders = [];
      if (fs.existsSync(fallbackFilePath)) {
        try {
          const fileData = fs.readFileSync(fallbackFilePath, 'utf8');
          localOrders = JSON.parse(fileData);
        } catch (e) {
          console.error('Error reading local orders file, resetting:', e);
        }
      }

      // Check for duplicate Order ID in fallback database
      if (localOrders.some(o => o.orderId === orderId)) {
        return res.status(400).json({ error: 'Duplicate Order ID detected in local database.' });
      }

      localOrders.push(orderPayload);
      fs.writeFileSync(fallbackFilePath, JSON.stringify(localOrders, null, 2), 'utf8');
      savedOrder = orderPayload;
      console.log(`[Database: JSON Fallback] Order saved: ${savedOrder.orderId}`);
    }

    // 2. Trigger Admin Notifications (Email & WhatsApp)
    Promise.allSettled([
      sendEmailNotification(savedOrder),
      sendWhatsAppNotification(savedOrder)
    ]).then((results) => {
      const emailResult = results[0];
      const whatsappResult = results[1];

      if (emailResult.status === 'fulfilled') {
        console.log(`[Notification Success] Email trigger completed.`);
      } else {
        console.error(`[Notification Failure] Email failed:`, emailResult.reason);
      }

      if (whatsappResult.status === 'fulfilled') {
        console.log(`[Notification Success] WhatsApp trigger completed.`);
      } else {
        console.error(`[Notification Failure] WhatsApp failed:`, whatsappResult.reason);
      }
    });

    // 3. Return Success
    res.status(201).json({
      message: isMongoConnected 
        ? 'Order saved in MongoDB. Notifications triggered.' 
        : 'Order saved in Local JSON Database. Notifications triggered.',
      order: savedOrder
    });

  } catch (error) {
    console.error('Error saving order:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate Order ID detected.' });
    }
    res.status(500).json({ error: 'Internal server error while processing order.' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`DS Engineering Enterprises Safety Server is running on port ${PORT}`);
  console.log(`Health endpoint: http://localhost:${PORT}/health`);
  console.log(`Orders endpoint: http://localhost:${PORT}/orders`);
});
