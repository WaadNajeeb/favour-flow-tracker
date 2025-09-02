const express = require('express');
const router = express.Router();
const Favour = require('../models/favour');
const User = require('../models/user');
const passport = require('passport');

const auth = passport.authenticate('jwt', { session: false });

const authOptional = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);

    if (user) {
      req.user = user; // attach logged in user if valid token
    }

    // Always continue, even without a user
    return next();
  })(req, res, next);
};

router.post('/bulk-create', async (req, res) => {
  try {
    const favours = req.body;

    if (!Array.isArray(favours) || favours.length === 0) {
      return res.status(400).json({ message: 'Request body must be a non-empty array of favour objects.' });
    }

    const createdFavours = await Favour.insertMany(favours);

    res.status(201).json({
      message: `${createdFavours.length} favours inserted successfully.`,
      favours: createdFavours
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const recentFavours = await Favour.find({
      status: 'Pending',
      from: { $ne: null }
    })
      .sort({ createdAt: -1 }) // newest first
      .limit(3)
      .populate('from', 'firstName lastName email avatar');

    res.json(recentFavours);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.get('/get/:id', async (req, res) => {
  try {
    const favourId = req.params.id;

    const favour = await Favour.findById(favourId)
      .populate('from', 'firstName lastName email avatar points')
      .populate('to', 'firstName lastName email avatar points')
      .populate('claimedBy', 'firstName lastName email avatar');

    if (!favour) {
      return res.status(404).json({ message: 'Favour not found' });
    }

    res.json(favour);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.get('/community-leaderboard', async (req, res) => {
  try {
    let leaderboard = await User.aggregate([
      { $match: { points: { $gt: 0 } } },

      {
        $lookup: {
          from: 'favours',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$claimedBy', '$$userId'] },
                    { $in: ['$status', ['Completed', 'Verified']] }
                  ]
                }
              }
            }
          ],
          as: 'completedFavours'
        }
      },

      {
        $addFields: {
          completedCount: { $size: '$completedFavours' }
        }
      },

      { $sort: { points: -1, completedCount: -1 } },

      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          avatar: 1,
          points: 1,
          userName: 1,
          completedCount: 1
        }
      },

      { $limit: 3 }
    ]);

    // Add rank & rankName in JS
    leaderboard = leaderboard.map((user, index) => {
      const rank = index + 1;
      let rankName;
      if (rank === 1) rankName = 'Top Contributor';
      else if (rank === 2) rankName = 'Active Helper';
      else if (rank === 3) rankName = 'Community Builder';
      else rankName = 'Helper';

      return { ...user, rank, rankName };
    });

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leaderboard = await User.aggregate([
      { $match: { points: { $gt: 0 } } },

      // Lookup favours completed by the user (they were "claimedBy")
      {
        $lookup: {
          from: 'favours',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$claimedBy', '$$userId'] },
                    { $in: ['$status', ['Completed', 'Verified']] }
                  ]
                }
              }
            }
          ],
          as: 'completedFavours'
        }
      },

      // Lookup favours they created and were completed
      {
        $lookup: {
          from: 'favours',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$from', '$$userId'] },
                    { $in: ['$status', ['Completed', 'Verified']] }
                  ]
                }
              }
            }
          ],
          as: 'createdCompletedFavours'
        }
      },

      {
        $addFields: {
          completedCount: { $size: '$completedFavours' },
          createdCompletedCount: { $size: '$createdCompletedFavours' }
        }
      },

      { $sort: { points: -1, completedCount: -1 } },

      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          avatar: 1,
          points: 1,
          userName: 1,
          completedCount: 1,
          createdCompletedCount: 1
        }
      },

      // 🚨 Skip the first 3 globally (top3 handled separately in UI)
      { $skip: skip + 3 },

      { $limit: limit }
    ]);

    // Add correct rank numbers (start from 4)
    const rankedLeaderboard = leaderboard.map((user, index) => {
      const rank = skip + index + 4; // start from 4
      let rankName;
      if (rank === 1) rankName = 'Top Contributor';
      else if (rank === 2) rankName = 'Active Helper';
      else if (rank === 3) rankName = 'Community Builder';
      else rankName = 'Helper';

      return { ...user, rank, rankName };
    });

    // total users excluding top 3
    const totalItems = await User.countDocuments({ points: { $gt: 0 } });
    const adjustedTotal = Math.max(totalItems - 3, 0);
    const totalPages = Math.ceil(adjustedTotal / limit);

    res.json({
      items: rankedLeaderboard,
      totalItems: adjustedTotal,
      currentPage: page,
      totalPages
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.post('/recalculate-points', async (req, res) => {
  try {
    // Step 1: Reset all points to 0
    await User.updateMany({}, { $set: { points: 0 } });

    // Step 2: Fetch all completed favours
    const favours = await Favour.find({ status: 'Completed' });

    // Step 3: Accumulate points in memory
    const pointsMap = {}; // userId -> points

    for (const favour of favours) {
      // Convert ObjectIds to strings for easy comparison
      const toId = favour.to ? String(favour.to) : null;
      const fromId = favour.from ? String(favour.from) : null;
      const claimedById = favour.claimedBy ? String(favour.claimedBy) : null;

      if (toId && toId === claimedById) {
        // Case 1: assigned person completed it
        pointsMap[toId] = (pointsMap[toId] || 0) + 100;
        if (fromId) pointsMap[fromId] = (pointsMap[fromId] || 0) + 50;
      } else if (!toId) {
        // Case 2: public favour
        if (claimedById) pointsMap[claimedById] = (pointsMap[claimedById] || 0) + 50;
        if (fromId) pointsMap[fromId] = (pointsMap[fromId] || 0) + 20;
      }
    }

    // Step 4: Update all users in batch
    const updatePromises = Object.entries(pointsMap).map(([userId, points]) =>
      User.findByIdAndUpdate(userId, { $inc: { points } })
    );

    await Promise.all(updatePromises);

    res.json({ success: true, message: 'Points recalculated successfully' });
  } catch (err) {
    console.error('Recalculate points failed:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});


const priorities = ['Low', 'Medium', 'High', 'Urgent'];
function getRandomPriority() {
  return priorities[Math.floor(Math.random() * priorities.length)];
}

// Endpoint: update all favours with random priority
router.post('/update-priority', async (req, res) => {
  try {
    const favours = await Favour.find({});
    let updatedCount = 0;

    for (const favour of favours) {

      if (!favour.priority) {
        favour.priority = getRandomPriority();
        await favour.save();
        updatedCount++;
      }

    }

    res.json({
      message: 'Priorities updated successfully',
      updated: updatedCount
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
function getPaginationParams(req) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
router.get('/getpublicrequest', async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    // Base query: only public favours with status 'Open'
    const query = { 
      to: null,
      status: 'Open' // only favours with status 'Open'
    };

    // Exclude current user’s requests if logged in
    if (req.user) {
      query.from = { $ne: req.user._id };
    }

    // Search filter (by name or description)
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i'); // case-insensitive
      query.$or = [
        { name: regex },
        { description: regex }
      ];
    }

    // Fetch favours + total count
    const [favours, totalItems] = await Promise.all([
      Favour.find(query)
        .populate('from', 'firstName lastName email avatar points')
        .populate('to', 'firstName lastName email avatar points')
        .populate('claimedBy', 'firstName lastName email avatar')
        .skip(skip)
        .limit(limit),
      Favour.countDocuments(query)
    ]);

    res.json({
      items: favours,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



module.exports = router;