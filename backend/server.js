const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env', '.env') });

const Form = require('./models/Form');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ieeeform';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

app.post('/api/forms', async (req, res) => {
  try {
    const { name, college, branch, email } = req.body;
    const form = new Form({ name, college, branch, email });
    const saved = await form.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.delete("/api/forms/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const deleted = await Form.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Form not found" });

    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/forms/:id error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
