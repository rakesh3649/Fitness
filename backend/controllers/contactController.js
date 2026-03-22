const Contact = require('../models/Contact');
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

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, subject, message'
            });
        }

        // Save to database
        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        // Send emails only if transporter is configured
        if (transporter) {
            try {
                // Send confirmation email to user
                const userMailOptions = {
                    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                    to: email,
                    subject: 'Thank you for contacting FitnessGym',
                    html: `
                        <h2>Dear ${name},</h2>
                        <p>Thank you for contacting FitnessGym. We have received your message and will get back to you within 24 hours.</p>
                        <p><strong>Your Message:</strong></p>
                        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
                        <br>
                        <p>Best regards,</p>
                        <p><strong>The FitnessGym Team</strong></p>
                    `
                };

                // Send notification email to admin
                const adminMailOptions = {
                    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER,
                    subject: `New Contact Form: ${subject}`,
                    html: `
                        <h2>📧 New Contact Form Submission</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong></p>
                        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
                        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                    `
                };

                await transporter.sendMail(userMailOptions);
                await transporter.sendMail(adminMailOptions);
            } catch (emailError) {
                console.warn('⚠️ Email sending failed (but contact was saved):', emailError.message);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully!',
            data: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                createdAt: contact.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all contact submissions (admin)
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContactStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['pending', 'read', 'replied', 'archived'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact status updated',
            data: contact
        });
    } catch (error) {
        next(error);
    }
};