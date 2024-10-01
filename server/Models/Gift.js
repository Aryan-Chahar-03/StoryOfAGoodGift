const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Set category to enum.
const GiftSchema = new Schema({
    name: { type: String, required: true },
    imageURL : {type : String},
    category: { type: String ,enum: ['Category1','Category2','Category3']},
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Gift', GiftSchema);
