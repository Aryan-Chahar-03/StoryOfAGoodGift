const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    event_name: { type: String, required: true },
    event_description: { type: String },
    event_date: { type: Date, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // The user who created the event
    invited_users: [{ type: Schema.Types.ObjectId, ref: 'User' }]  // Array of invited User IDs
});

module.exports = mongoose.model('Event', EventSchema);
