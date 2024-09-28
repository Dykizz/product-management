const { default: mongoose } = require("mongoose");
const generate = require('../helpers/genarate');
const forgetSchema = new mongoose.Schema(
    {
        email : { type: String, required: true },
        otp : {
            type : String,
            default : generate.randomOTP()
        },
        expireAt: { type: Date, required: true }
    }, { timestamps: true }
);
forgetSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
const ForgetAccount = mongoose.model("ForgetAccount",forgetSchema,"forget-account");

module.exports = ForgetAccount;