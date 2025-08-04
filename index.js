const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const outletRoutes = require('./routes/outletRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const checkinRouter = require('./routes/checkin');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/productRoutes');
const diskonRoutes = require('./routes/diskon');
const bonusRoutes = require('./routes/bonus');
const cabangRoutes = require('./routes/cabang');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

//routes
app.use('/uploads', express.static('uploads'));
app.use('/api/uploads', uploadRoutes);
app.use('/api/checkin', checkinRouter);
app.use('/api/auth', authRoutes); // ini WAJIB ada!
app.use('/api/outlets', outletRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/diskon', diskonRoutes);
app.use('/api/bonus', bonusRoutes);
app.use('/api/cabang', cabangRoutes);

mongoose.connect(process.env.MONGO_URI, {
})
.then(() => {
  console.log('✅ MongoDB connected');
  console.log("🧪 URI sedang dipakai:", process.env.MONGO_URI);

  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));

