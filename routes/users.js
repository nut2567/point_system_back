const express = require('express');
const jwt = require('jsonwebtoken');
const { rewards, users } = require('../mockData');
const router = express.Router();

// Secret key สำหรับการ sign token
const secretKey = 'P@55w0rD';

// POST /users/login

router.post('/login', function (req, res) {
  const { username, password } = req.body;

  // ค้นหาผู้ใช้จาก mock data
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // สร้าง JWT token โดยใส่ข้อมูลผู้ใช้ลงใน token
    const token = jwt.sign({ userInfo: user }, secretKey, { expiresIn: '1h' });

    // ส่ง token และข้อมูลผู้ใช้กลับไปที่ client
    res.json({ message: 'Login successful', token: token });
  } else {
    // กรณี username หรือ password ไม่ถูกต้อง
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// ฟังก์ชันตรวจสอบ JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // แยก Bearer และ token
  console.log(token)

  if (!token) return res.status(403).json({ message: 'No token provided.' });

  jwt.verify(token, secretKey, function (err, decoded) {
    console.log(err)
    if (err) {
      // ตรวจสอบประเภทของข้อผิดพลาด
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired!' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Invalid token!' });
      } else if (err.name === 'NotBeforeError') {
        return res.status(403).json({ message: 'Token not active yet!' });
      } else {
        return res.status(403).json({ message: 'Failed to authenticate token!' });
      }
    }
    // หาก token ถูกต้อง สามารถดึงข้อมูลจาก token มาใช้งานต่อได้
    console.log(decoded)
    req.user = decoded.userInfo.username;
    next();
  });
}

router.get('/profile', verifyToken, function (req, res) {

  // ค้นหาผู้ใช้จาก mock data
  const user = users.find(u => u.username === req.user);
  console.log(req.user)
  if (!user) {
    return res.status(404).json({ message: 'User not found!' });
  }
  res.json(user);
});

// ตัวอย่าง API ที่ต้องใช้การ Authen
router.put('/Redeem', (req, res, next) => {

  const { username, Redeem_id } = req.body;

  const user = users.find(u => u.username === username);
  console.log(req.user)
  if (!user) {
    return res.status(404).json({ message: 'User not found!' });
  }
  // ค้นหาผู้ใช้จาก mock data
  const reward = rewards.find(u => u.id == Redeem_id);
  if (!reward) {
    return res.status(404).json({ message: 'rewards not found!' });
  }


  let foundReward = users.some(
    (item) => {
      if (item.username === username) {
        return item.coupong.some(u => u.reward_id == Redeem_id);
      }
    }
  );
  if (foundReward) {
    return res.status(200).json({ user: user, message: 'already reward' });
  }

  user.coupong.push({ reward_id: reward.id })
  user.points -=  reward.points
  res.status(200).json({ user: user, message: 'added Redeem' });
});



module.exports = router;
