const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// In orderController.js - createOrder function
exports.createOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod, notes } = req.body;
        
        // Get user ID from token (req.user is set by auth middleware)
        const userId = req.user ? req.user.id : null;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        console.log('Creating order for user:', userId);
        console.log('Order items:', items);

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide order items'
            });
        }

        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid total amount'
            });
        }

        // Create order items array
        // In createOrder function, update the order items creation:
const orderItems = items.map(item => ({
    productId: item.productId.toString(), // Convert to string
    name: item.name || `Product ${item.productId}`,
    price: item.price || 0,
    quantity: item.quantity || 1,
    image: item.image || 'default-product.jpg'
}));

        // Create the order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount,
            shippingAddress: shippingAddress || {},
            paymentMethod: paymentMethod || 'card',
            notes: notes || '',
            status: 'pending',
            paymentStatus: 'pending'
        });

        console.log('Order saved to database:', order._id);

        // Populate user info for response
        const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

        res.status(201).json({
            success: true,
            message: 'Order created successfully!',
            data: populatedOrder
        });

    } catch (error) {
        console.error('Order creation error:', error);
        next(error);
    }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('items.productId', 'name image price category');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('items.productId', 'name image price description');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns the order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('user', 'name email');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        next(error);
    }
};