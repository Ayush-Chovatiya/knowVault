import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetOTP: {
      type: String,
    },
    resetOTPExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetOTP = otp;
  this.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

const User = mongoose.model("User", userSchema);
export default User;
