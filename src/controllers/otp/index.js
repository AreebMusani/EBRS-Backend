const User = require("../../model/user");
const OTP = require("../../model/otpModel");
const { sendEmail } = require("../../middleware/auth");

exports.sendEmailVerification = async (req, res) => {
  const { email } = req.body;
  try {
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set the subject and body for the OTP email
    const subject = "Verification Email";
    const body = {
      html: `<h1>Please confirm your OTP</h1>
                <p>Here is your OTP code: <b>${otp}</b></p>`,
    };

    // Create OTP document with email, otp, subject, and body
    const otpPayload = {
      email: email,
      otp: otp
    };
    const otpBody = await OTP.create(otpPayload);
    // Send email with OTP
    await sendEmail(email,otp, { subject, ...body });
    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      otp,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: e.message });
  }
};


