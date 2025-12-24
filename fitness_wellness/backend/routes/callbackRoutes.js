const express = require('express');
const router = express.Router();
const { requestCallback, getCallbacks, updateCallbackStatus } = require('../controllers/callbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', requestCallback);
router.get('/', protect, authorize('admin'), getCallbacks);
router.put('/:id', protect, authorize('admin'), updateCallbackStatus);

module.exports = router;