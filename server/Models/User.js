const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    Wishlist: [{ type: Schema.Types.ObjectId, ref: 'Gift' }],
    Friend_requests: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', UserSchema);
