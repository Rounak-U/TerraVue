const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        sender: { type: String, enum: ['user', 'admin'], required: true },
        body: { type: String, required: true },
        admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const supportTicketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    category: { type: String, enum: ['Billing', 'Itinerary', 'Account', 'Technical', 'Other'], default: 'Other' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    message: { type: String, required: true },
    messages: { type: [messageSchema], default: [] },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
    resolutionNotes: { type: String },
    lastResponseAt: { type: Date },
    lastRespondedBy: { type: String, enum: ['user', 'admin'] },
    lastResponderAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    lastResponderUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

supportTicketSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
