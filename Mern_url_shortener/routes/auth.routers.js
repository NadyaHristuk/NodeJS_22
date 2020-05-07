const {Router} = require('express')
const bcrypt = require('bcryptjs')
require('dotenv').config();
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()


// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные при регистрации'
      })
    }

    const {email, password} = req.body

    const candidate = await User.findOne({ email })

    if (candidate) {
      return res.status(400).json({ message: 'Такой пользователь уже существует' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ email, password: hashedPassword })

    await user.save()

    res.status(201).json({ message: 'Пользователь создан' })

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные при входе в систему'
      })
    }

    const {email, password} = req.body

    const user = await User.findOne({ email })
    

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.jwtSecret,
      { expiresIn: '1h' }
    )
    
    const newUser = await User.findByIdAndUpdate(user._id, {$set: {token}}, {new: true} )
   
    res.json({ newUser })

  } catch (e) { 
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    console.log(e.message)
  }
})





const verifyToken = async (req, res, next) => {
  const authorization = req.get('Authorization');

  if(authorization === undefined) {
    return res.status(401).send('not Autorized');
  }
// const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"
  const token = authorization.replace('Bearer ', '');
  

  try{
    const userId = jwt.verify(token, process.env.jwtSecret).userId;
    
    const user = await User.findById(userId);
    
    if (!user){
      return res.status(401).send('not Autorize11111')
    }

    if (user.token === null) {
      return res.status(401).send('token is null')
    }

    req.user = user;
    next();
  } catch (e) {
    return res.status(500).json({message: e.message});
  }

}

const logout = async (req, res, next) => {
  const user = req.user;
  const logoutUser = await User.findByIdAndUpdate(user._id, {$set: {token: null}}, {new: true});
  res.json(logoutUser);
}

router.post('/logout', verifyToken, logout);


const getCurrent = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userID);
    res.status(200).json({email: user.email});
  } catch (err) {
      next (err)
  }
}

router.get('/current', verifyToken, getCurrent);


module.exports = {router, verifyToken};
