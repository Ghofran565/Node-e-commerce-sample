import HandleError from './handleError.js';
import nodemailer from 'nodemailer';

export const sendEmailCode = async (email) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	});
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: '👋 Hello from Node.js 🚀',
		text: `This is a test email sent from Node.js using nodemailer. 📧💻 your email is ${email}`,
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return next(
				new HandleError(
					'Couldnt send the email. havent you done sth criminal ?',
					500
				)
			);
		} else {
			console.log('✅ Email sent:', info.response); //maybe wanna not use
		}
	});
};

export const verifyEmailCode = async (email, code) => {
	return next(
		new HandleError(
			`email : ${email} , code : ${code} , I'm sorry but verifying email code part hasn't setted up yet.`,
			500
		)
	);
};
