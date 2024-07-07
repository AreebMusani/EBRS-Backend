const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
require("dotenv").config();
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.JWT_ENCRYPTION);

const User = require("../model/user");

const UserAuth = async (req, res, next) => {
  try {
    const header = req.header("Authorization") || "";
    const token = header.replace("Bearer ", "");
    const decryptedString = cryptr.decrypt(token);
    const decodedToken = jwt.verify(decryptedString, process.env.JWT_SECRET);

    let user = await User.findOne({
      _id: decodedToken._id,
    });

    if (!user) {
      console.log("!user");
      throw new Error("Authorization Failed.");
    }

    user = user.toJSON();
    req.user = user;
    next();
  } catch (e) {
    res.status(400).send("Authorization Failed.");
  }
};

const findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user || !user?.password) {
    throw new Error("Invalid Email or Password");
  }

  const isCredentialsMatched = await bcrypt.compare(password, user?.password);

  if (!isCredentialsMatched) {
    throw new Error("Invalid Password");
  }

  return user;
};

const generateAuthToken = async (_id) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  const payload = {
    _id: _id.toString(),
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const encryptedStr = cryptr.encrypt(token);

  return encryptedStr;
};

// Function to send email
async function sendEmail(email, otp, body) {
  // Configure nodemailer with your email provider
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    }
});

  const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      ...body
  };

  await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.error(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
  });
}

module.exports = {
  UserAuth,
  findByCredentials,
  generateAuthToken,
  sendEmail
};
