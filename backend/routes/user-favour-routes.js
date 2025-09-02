const express = require('express');
const router = express.Router();
const Favour = require('../models/favour');
const User = require('../models/user');
const passport = require('passport');
const { route } = require('./utils-routes');

const auth = passport.authenticate('jwt', { session: false });

// ✅ Create favour
router.post('/create', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      rewards,
      to,             // person who will receive the favour
      proofRequired,
      dueTime,
      duration,
      durationType,
      requirements,
      additionalNotes,
      requiredBy,
      proofImage,
      favourType,
      priority
    } = req.body;

    const favourFor = to;
    const favour = new Favour({
      from: req.user._id,   // comes from auth middleware
      title,
      description,
      rewards,
      to: favourFor,             // person who will receive the favour
      proofRequired,
      dueTime,
      duration,
      durationType,
      requirements,
      additionalNotes,
      requiredBy,
      proofImage,
      favourType,
      priority
    });

    await favour.save();
    res.status(201).json({ success: true, result: favour });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.get('/my-favours', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const favours = await Favour.find({ from: userId });

    res.status(200).json(favours);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// // ✅ Edit favour
router.put('/update-favour/:id', auth, async (req, res) => {
  try {
    const favour = await Favour.findById(req.params.id);
    if (!favour) return res.status(404).json({ message: 'Favour not found' });

    // List of allowed fields to update
    const allowedUpdates = [
      'title',
      'description',
      'rewards',
      'to',
      'requiredBy',
      'dueTime',
      'proofRequired',
      'favourType',
      'additionalNotes',
      'requirements',
      'duration',
      'durationType',
      'priority'
    ];

    // Only update allowed fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        favour[field] = req.body[field];
      }
    });

    await favour.save();

    res.json({ success: true, favour });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
})

router.put('/redeem-favour/:id', auth, async (req, res) => {
  try {
    const favour = await Favour.findById(req.params.id);
    if (!favour) {
      return res.status(404).json({ message: 'Favour not found' });
    }

    // Update redeem details
    const { redeemDetails, imageUrl } = req.body;
    

    favour.redeemDetails = redeemDetails || favour.redeemDetails;
    favour.completedAt = new Date();
    favour.claimedBy = req.user._id;
    favour.claimedAt = new Date();
    favour.status = 'RequiresVerify';
    
    if (imageUrl) {
      favour.proofImage = imageUrl; // make sure schema has this field
    }

    await favour.save();

    res.json({ success: true, favour });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/verify-favour/:id', auth, async (req, res) => {
  try {
    const favour = await Favour.findById(req.params.id);
    if (!favour) {
      return res.status(404).json({ message: 'Favour not found' });
    }

    // Mark favour as verified
    favour.verifiedAt = new Date();
    favour.status = 'Completed';
    await favour.save();

    // Increment points
    const updates = [];

    if (favour.claimedBy) {
      // Adds 100 to the user's existing points
      updates.push(
        User.findByIdAndUpdate(favour.claimedBy, { $inc: { points: 100 } })
      );
    }

    if (favour.from) {
      // Adds 50 to the creator's existing points
      updates.push(
        User.findByIdAndUpdate(favour.from, { $inc: { points: 50 } })
      );
    }

    await Promise.all(updates);

    res.json({ success: true, favour });
  } catch (err) {
    console.error('Verify favour failed:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


function getPaginationParams(req) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// -------------------------
// I Owe (favours assigned TO me)
// -------------------------
router.get('/favour-assigned-to-me', auth, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const query = { to: req.user._id, status: { $in: ['Pending'] } };

    const favours = await Favour.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('from', 'firstName lastName userName email avatar')
      .populate('claimedBy', 'firstName lastName userName email avatar');

    const totalItems = await Favour.countDocuments(query);

    res.json({
      items: favours,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// -------------------------
// I Owed (favours I created for others)
// -------------------------
router.get('/favours-assigned-to-others', auth, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const query = { from: req.user._id, status: { $in: ['Pending'] } };

    const favours = await Favour.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('to', 'firstName lastName userName email avatar')
      .populate('claimedBy', 'firstName lastName userName email avatar');

    const totalItems = await Favour.countDocuments(query);

    res.json({
      items: favours,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// -------------------------
// Unassigned Favours (to = null, status = Open)
// -------------------------
router.get('/favours-unassigned', auth, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const query = { to: null, status: 'Open' };

    const favours = await Favour.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('from', 'firstName lastName userName email avatar');

    const totalItems = await Favour.countDocuments(query);

    res.json({
      items: favours,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// -------------------------
// I Completed (favours I claimed and finished)
// -------------------------
router.get('/favours-completed-by-me', auth, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const query = { claimedBy: req.user._id, status: 'Completed' };

    const favours = await Favour.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ completedAt: -1, updatedAt: -1 })
      .populate('from', 'firstName lastName userName email avatar')
      .populate('to', 'firstName lastName userName email avatar');

    const totalItems = await Favour.countDocuments(query);

    res.json({
      items: favours,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// -------------------------
// Completed For Me (favours others did for me)
// -------------------------
router.get('/favours-completed-by-others', auth, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const query = { from: req.user._id, claimedBy: { $ne: null }, status: 'Completed' };

    const favours = await Favour.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ completedAt: -1, updatedAt: -1 })
      .populate('claimedBy', 'firstName lastName userName email avatar')
      .populate('to', 'firstName lastName userName email avatar');

    const totalItems = await Favour.countDocuments(query);

    res.json({
      items: favours,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// -------------------------
// Requires Verification (favours I created that are completed but require verification)
// -------------------------
router.get('/favours-requires-verifications', auth, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const query = { from: req.user._id, status: 'RequiresVerify', claimedBy: { $ne: null } };

    const favours = await Favour.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 })
      .populate('claimedBy', 'firstName lastName userName email avatar')
      .populate('to', 'firstName lastName userName email avatar');

    const totalItems = await Favour.countDocuments(query);

    res.json({
      items: favours,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// -------------------------
// Requires Verification (favours I completed that need others to verify)
// -------------------------
router.get('/favours-requires-other-verify', auth, async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const query = { claimedBy: req.user._id, status: 'RequiresVerify' };

    const favours = await Favour.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 })
      .populate('from', 'firstName lastName userName email avatar')
      .populate('to', 'firstName lastName userName email avatar');

    const totalItems = await Favour.countDocuments(query);

    res.json({
      items: favours,
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/counts', auth, async (req, res) => {
  try {
    // i-owe → favours assigned TO me, pending or requires verification
    const iOwe = await Favour.countDocuments({
      to: req.user._id,
      status: { $in: ['Pending'] }
    });

    // i-owed → favours I created for others, pending or requires verification
    const iOwed = await Favour.countDocuments({
      from: req.user._id,
      status: { $in: ['Pending'] }
    });

    // i-completed → favours I claimed and finished
    const iCompleted = await Favour.countDocuments({
      claimedBy: req.user._id,
      status: 'Completed'
    });

    // completed-for-me → favours others did for me
    const completedForMe = await Favour.countDocuments({
      from: req.user._id,
      claimedBy: { $ne: null },
      status: 'Completed'
    });

    // favours I claimed that require verification by others
    const favoursRequiresVerify = await Favour.countDocuments({
      from: req.user._id,
      status: 'RequiresVerify'
    });

    // favours I created that require verification from others
    const favoursOtherRequiresVerify = await Favour.countDocuments({
      
      claimedBy: req.user._id,
      status: 'RequiresVerify'
    });

    res.json({
      iOwe,
      iOwed,
      iCompleted,
      completedForMe,
      favoursRequiresVerify,
      favoursOtherRequiresVerify
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});




module.exports = router;