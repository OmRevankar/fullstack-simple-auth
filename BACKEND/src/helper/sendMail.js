import {  createTransport } from "nodemailer";
import { registrationMail } from "./registrationMail.js";

const transporter = createTransport({
  host: "smtp.gmail.com",
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "yoomlalfc@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(to,fullName) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'yoomlalfc@gmail.com', // sender address
    to, // list of receivers
    subject: "Congratulations on registering to OM Bhai", // Subject line
    text: `Hello ${fullName} , This is your registration confirmation email !`, // plain text body
    html: registrationMail(fullName) // html body
  })
}

export default sendMail

