
const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getMyOrders, 
    getOrderById, 
    getAllOrders, 
    updateOrderStatus 
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

// Fix: Use protect instead of auth, and move the function to controller
router.put('/:id/payment', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, orderStatus } = req.body;
    
    // You need to import Order model
    const Order = require('../models/Order');
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    order.paymentStatus = paymentStatus || order.paymentStatus;
    order.orderStatus = orderStatus || order.orderStatus;
    order.updatedAt = Date.now();
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Payment status updated',
      data: order
    });
    
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;