const bcrypt = require("bcrypt");
const { findByCredentials, generateAuthToken, sendEmail } = require("../../middleware/auth");
const User = require("../../model/user/index");
const OTP = require('../../model/otpModel');

require("dotenv").config();

// This is a test API
exports.test = async (req, res) => {
  try {
    res.status(200).json({msg: "Server is Listening Good"});
  } catch (e) {
    res.status(400).send(e?.message);
  }
};

exports.checkEmailAndSendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({email});
    if(user){
      throw new Error("Email already exists");
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP to user's email
    const body = {
      subject: 'Reset Password OTP',
      text: `Your OTP for password reset is: ${otp}`
    }
    sendEmail(email, otp, body);

    return res.status(200).json({ message: "OTP sent to your email" });
  }catch(e){
    console.error(error);
    return res.status(500).json({ message: e.message });
  }
}

// This is a create user API
exports.create = async (req, res) => {
  try {
    const data = req.body;

    if (!data?.username) {
      throw new Error("UserName is required");
    }
    if (!data?.email) {
      throw new Error("Email is required");
    }
    if (!data?.password) {
      throw new Error("Password is required");
    }
    if (!data?.otp) {
      throw new Error("Otp is required");
    }

    const findExistingUser = await User.findOne({ email: data.email });

    if (findExistingUser) {
      throw new Error("Email already exists");
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email: data?.email }).sort({ createdAt: -1 }).limit(1);
    console.log(response);
    if (response.length === 0 || data?.otp !== response[0].otp) {
      throw new Error("The OTP is not valid");
    }

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    const user = new User(data);
    
    const dbResponse = await user.save();
    console.log("dbResponse", dbResponse);
    const token = await generateAuthToken(dbResponse._id);

    if (!token) {
      throw new Error("Invalid Email or Password");
    }

    res.status(201).send({ user: user, token: token });
    // const token = await generateAuthToken(user._id);

    // if (!token) {
    //   throw new Error("Invalid Email or Password");
    // }
    // res.status(201).send(user);
  } catch (e) {
    console.log(e);
    res.status(400).send({message: e?.message});
  }
};

exports.socialLogin = async (req, res) => {
  try{
    const body = req.body;
    if(!body?.email || !body?.loginType) throw new Error("All Field is required");
    let user = await User.findOne({ email: body?.email });
    if(body?.loginType === "google"){
      if (!user) {
        user = await User.create({
          username: body?.username,
          email: body?.email,
          googleId: body?.googleId,
          loginType: body?.loginType,
          avatar: body?.avatar
        });
      }else{
        user.username = body?.username,
        user.googleId = body?.googleId;
        user.avatar = body?.avatar;
        user.loginType = body?.loginType;
        await user.save();
      }
    }else if(body?.loginType === "facebook"){
      if (!user) {
        user = await User.create({
          username: body?.username,
          email: body?.email,
          googleId: body?.googleId
        });
      }else{
        user.facebookId = body?.facebookId;
        await user.save();
      }
    }
    const token = await generateAuthToken(user._id);

    if (!token) {
      throw new Error("Invalid Email or Password");
    }
    
    console.log(user);
    res.status(201).send({ user: user, token: token });
  }catch (e) {
    console.log(e);
    res.status(400).send({message: e?.message});
  }
}

// This is a login API
exports.login = async (req, res) => {
  try {
    const data = req.body;

    if (!data?.email) {
      throw new Error("Email is required");
    }
    if (!data?.password) {
      throw new Error("Password is required");
    }

    const user = await findByCredentials(data.email, data.password);

    if (!user) {
      throw new Error("Invalid Email or Password");
    }

    const token = await generateAuthToken(user._id);

    if (!token) {
      throw new Error("Invalid Email or Password");
    }

    user.loginType = "normal";
    await user.save();

    res.status(201).send({ user: user, token: token });
  } catch (e) {
    res.status(400).send({message: e?.message});
  }
};



// Step 1: Generate and send OTP to user's email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Save OTP to user document
      const user = await User.findOneAndUpdate({ email }, { $set: { resetPasswordOTP: otp } }, { new: true });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Send OTP to user's email
      const body = {
        subject: 'Reset Password OTP',
        text: `Your OTP for password reset is: ${otp}`
      }
      sendEmail(email, otp, body);

      return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
  }
};

// Step 2: Verify OTP
exports.verifyOTP =  async (req, res) => {
  const { email, otp } = req.body;

  try {
      // Find user by email and OTP
      const user = await User.findOne({ email, resetPasswordOTP: otp });

      if (!user) {
          return res.status(400).json({ message: "Invalid OTP" });
      }

      return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
  }
};

// Step 3: Reset Password
exports.resetPassword =  async (req, res) => {
  const { email, newPassword } = req.body;

  try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      const user =  await User.findOneAndUpdate({ email }, { $set: { password: hashedPassword, resetPasswordOTP: null } });

      return res.status(200).json({ message: "Password reset successfully", user: user });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
  }
};

