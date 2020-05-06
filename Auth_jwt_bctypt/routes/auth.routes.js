const { Router } = require('express');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();

router.post(
	'/register',
	[
		check('email', 'Некорректный емейл').isEmail(),
		check('password', 'минимальная длинна пароля 6 символов').isLength({ min: 6 })
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array()
				});
			}

			const { email, password } = req.body;

			const candidate = await User.findOne({ email });

			if (candidate) {
				return res.status(400).json({ message: 'такой пользователь есть в базе' });
			}

			const hashPassword = await bcrypt.hash(password, 12);

			const user = new User({ email, password: hashPassword });

			await user.save();

			res.status(201).json({ message: 'user saved!' });
		} catch (e) {
			res.status(500).text('что-то пошло не так!');
		}
	}
);

router.post(
	'/login',
	[
		check('email', 'Некорректный емейл').isEmail(),
		check('password', 'минимальная длинна пароля 6 символов').isLength({ min: 6 })
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array()
				});
			}

			const { email, password } = req.body;

			const user = User.findOne({ email });

			if (!user) {
				return res.status(400).json({ message: 'нет такого юзера в базе' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ message: 'Неверный пароль!' });
			}

			const token = jwt.sign({ userId: user._id }, process.env.jwtSecret, { expiresIn: '1h' });

			res.json({ token });
		} catch (e) {
			res.status(500).text('что-то пошло не так!');
		}
	}
);

module.exports = router;
