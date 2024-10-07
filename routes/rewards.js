// routes/rewards.js
const express = require('express');
const router = express.Router();
const { rewards, Product } = require('../mockData');

// API สำหรับ Get List รายการสิทธิพิเศษ
router.get('/', function(req, res) {
    res.json(rewards);
  });


// POST /rewards/redeem/:id
router.get('/:id', function(req, res) {
  const rewardId = parseInt(req.params.id);
  const reward = rewards.find(r => r.id === rewardId);
  
  if (!reward) {
    return res.status(404).json({ message: 'Reward not found' });
  }
  
  res.json(reward);
});



module.exports = router;
