const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "Please enter your email"],
        },

        password: {
            type: String,
            select: false,
            required: [true, "Please enter password"],
        },

        addresses: [
            {
                fullName: {
                    type: String,
                    required: [true, "Please enter your name"],
                },

                mobileNumber: {
                    type: String,
                    required: [true, "Please enter your mobile number"],
                    min: [10, "Please enter a valid mobile number"],
                    max: [10, "Please enter a valid mobile number"],
                },

                pincode: {
                    type: String,
                    min: [6, "Please enter a valid pincode"],
                    max: [6, "Please enter a valid pincode"],
                },

                addressLine1: {
                    type: String,
                    required: true,
                },

                addressLine2: {
                    type: String,
                },

                city: {
                    type: String,
                    required: true,
                },
                state: {
                    type: String,
                    required: true,
                },

                default: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = new mongoose.model("User", userSchema);

module.exports = User;
