const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Pre-save hook to hash the password if it's modified or new
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10); // Optional step to generate salt
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
        } catch (error) {
            return next(error);
        }
    }
    next(); // Always call next() to proceed with saving
});

// Method to compare the provided password with the hashed password
userSchema.methods.checkPassword = function (passwordAttempt) {
    return bcrypt.compare(passwordAttempt, this.password);
};

// Method to remove the password from the user object before sending it back
userSchema.methods.withoutPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
