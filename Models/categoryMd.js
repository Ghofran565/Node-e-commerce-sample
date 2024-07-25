//* 2:53:09 5th session of node video

//!TODO chenging the sms was to mail
//TODO checking the user MD CN Route also


const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: process.env.EMAIL_USER,
     pass: process.env.EMAIL_PASSWORD
   }
 });
 const mailOptions = {
   from: process.env.EMAIL_USER,
   to: 'mym25340mmm@gmail.com',
   subject: '👋 Hello from Node.js 🚀',
   text: 'This is a test email sent from Node.js using nodemailer. 📧💻'
 };
 transporter.sendMail(mailOptions, (error, info) => {
   if (error) {
     console.error('❌ Error:', error.message);
   } else {
     console.log('✅ Email sent:', info.response);
   }
 });
 