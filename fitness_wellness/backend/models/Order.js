
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: {
        type: String
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
        addressType: {
            type: String,
            enum: ['home', 'work', 'other'],
            default: 'home'
        }
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'netbanking', 'cod'],
        default: 'card',
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderNotes: {
        type: String,
        default: 'Order from FitnessGym website'
    },
    transactionId: String,
    paymentDetails: {
        type: Map,
        of: String
    }
}, {
    timestamps: true // This adds createdAt and updatedAt automatically
});

orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);