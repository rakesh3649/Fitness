const Callback = require('../models/Callback');
const nodemailer = require('nodemailer');

// Create transporter for emails (if email credentials are provided)
let transporter;
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

// @desc    Request callback
// @route   POST /api/callback
// @access  Public
exports.requestCallback = async (req, res, next) => {
    try {
        const { name, phone } = req.body;

        // Validate required fields
        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both name and phone number'
            });
        }

        // Save to database
        const callback = await Callback.create({
            name,
            phone
        });

        // Send notification email if transporter is configured
        if (transporter) {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER,
                    subject: '📞 New Callback Request - FitnessGym',
                    html: `
                        <h2>New Callback Request Received</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        <p><strong>Requested at:</strong> ${new Date().toLocaleString()}</p>
                        <p style="color: #ff6b35; font-weight: bold;">Please contact the customer within 30 minutes.</p>
                        <br>
                        <p>Best regards,</p>
                        <p>FitnessGym System</p>
                    `
                };

                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.warn('⚠️ Email sending failed (but callback was saved):', emailError.message);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Callback request submitted successfully! We will contact you within 30 minutes.',
            data: {
                id: callback._id,
                name: callback.name,
                phone: callback.phone,
                status: callback.status,
                createdAt: callback.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all callback requests (admin)
// @route   GET /api/callback
// @access  Private/Admin
exports.getCallbacks = async (req, res, next) => {
    try {
        const callbacks = await Callback.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: callbacks.length,
            data: callbacks
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update callback status
// @route   PUT /api/callback/:id
// @access  Private/Admin
exports.updateCallbackStatus = async (req, res, next) => {
    try {
        const { status, notes } = req.body;
        
        // Validate status
        const validStatuses = ['pending', 'contacted', 'completed', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const callback = await Callback.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!callback) {
            return res.status(404).json({
                success: false,
                message: 'Callback request not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Callback status updated',
            data: callback
        });
    } catch (error) {
        next(error);
    }
};