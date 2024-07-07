// models/otpModel.js
const mongoose = require("mongoose");
const { sendEmail } = require("../../middleware/auth");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // The document will be automatically deleted after 5 minutes of its creation time
  },
});

// otpSchema.pre("save", async function (next) {
//   console.log("New document saved to the database");
//   // Only send an email when a new document is created
//   if (this.isNew) {
//     const { subject, body } = this._doc; // Access subject and body from the document being saved
//     console.log(this._doc);
//     // await sendEmail(this.email, this.otp, { subject, ...body });
//   }
//   next();
// });

module.exports = mongoose.model("OTP", otpSchema);
