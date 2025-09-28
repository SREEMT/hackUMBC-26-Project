// backend/model/users.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    login: { type: String, alias: 'email', required: true }, 
    password: String,   // hashed in controller
    permission: Number, // e.g. 0 = normal user, 1 = admin
    creation: { type: Date, default: Date.now }
});

// Register model
const userModel = mongoose.model('User', userSchema);

// === CRUD FUNCTIONS ===

// Read all users
exports.readAll = async function () {
    let users = await userModel.find();
    // Later, you can add pagination: .sort({ login: 'asc' }).skip(0).limit(5)
    return users;
};

// Read one user by ID
exports.read = async function (id) {
    let user = await userModel.findById(id);
    return user;
};

// Create new user
exports.create = async function (newuser) {
    const user = new userModel(newuser);
    await user.save();
    return user;
};

// Delete one user by ID
exports.del = async function (id) {
    let user = await userModel.findByIdAndDelete(id);
    return user;
};

// Delete all users (only use in tests)
exports.deleteAll = async function () {
    await userModel.deleteMany();
};

exports.update = function(user){
    // https://mongoosejs.com/docs/api/query.html#Query.prototype.findOneAndUpdate()
    // https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate() 
}

// Find a user by login (for login auth)
exports.findLogin = async function (plogin) {
    let user = await userModel.findOne({ login: plogin });
    return user;
};
