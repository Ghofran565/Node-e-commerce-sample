import HandleError from "./handleError.js";
import nodemailer from "nodemailer";
import crypto from "crypto"

export const sendEmailCode = async (email) => {
  ///generating auth code
  const generatedCode = crypto.randomInt(10000,99999).toString();


  

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "👋 Hello from Node.js 🚀",
    text: `This is a test email sent from Node.js using nodemailer. 📧💻 your email is ${email} , your code is ${generatedCode}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return next(
        new HandleError(
          "Couldnt send the email. haven't you done something criminal?",
          500
        )
      );
    } else {
      console.log("✅ Email sent:", info.response); //maybe wanna not use

      lengthAuthArray = authArray.length();

      authArray.push({ email, code: generatedCode });

      if (lengthAuthArray > authArray.length()) {
        console.log("✅ pushed to auth array successfully");
      } else {
        console.log("pushed to auth array was unsuccessful");
      }
    }
  });
};

export const verifyEmailCode = async (email, code) => {
  const findemail = authArray.find((auth) => auth.email === email);
  if (!findemail) {
    return next(
      new HandleError(
        "Email unauthorized. Please request sending an email first.",
        401
      )
    );
  }
  if (!findemail.code == code && !findemail.email == email) {
    return { success: false, authorized: false, message: "Wrong code." };
  } else {
    return {
      success: true,
      authorized: true,
      message: "Email authorized successfully.",
    };
  }
};
