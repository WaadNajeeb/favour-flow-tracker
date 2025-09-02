const express = require('express');
const router = express.Router();
const multer = require('multer');
require('dotenv').config();
const { uploadImageToGCS, deleteImageFromGCS } = require('../utils/gcs');
const passport = require('passport');
const User = require('../models/user');

const auth = passport.authenticate('jwt', { session: false });
const { createCanvas } = require('canvas');
let avatarholder = require('avatarholder');

// Multer setup to store files in memory
const upload = multer({ storage: multer.memoryStorage() });


// LOGIN
// REGISTER
router.post(
  '/upload-profile-picture',
  auth,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      // Accept optional image name from request body
      const imageName = req.body.name || req.file.originalname;

      // Upload image to GCS (or your storage)
      const publicUrl = await uploadImageToGCS(req.file, imageName);

      res.status(200).json({
        imageUrl: publicUrl,
        name: imageName,
      });
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
);

router.delete(
  '/delete-profile-picture',
  auth,
  async (req, res) => {
    try {
      const { name } = req.body; // image name to delete
      if (!name) {
        return res.status(400).json({ error: 'Image name is required' });
      }
      await deleteImageFromGCS(name);

      res.status(200).json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Delete failed' });
    }
  }
);

router.get('/get-profile', async (req, res) => {
  try {
    // Example: get user name from query or use default
    const firstName = 'Mary';
    const lastName = 'Cooper';

    // Get initials
    const initials = "Omer Samoel";
    let image = avatarholder.generateAvatar(initials, {
        font:100,
          size: 600,
    });
    // Use initials as the value for jdenticon
    const size = generateInitialsImage(initials);
    res.status(200).json({ imageUrl: image });
  } catch (error) {
    res.status(500).json({ error: 'Avatar generation failed' });
  }
});


router.put('/fix-avatars', async (req, res) => {
  try {
    const users = await User.find({});
    let updatedCount = 0;

    for (const user of users) {
      // if avatar already points to GCS bucket, skip
      if (user.avatar && user.avatar.startsWith("https://storage.googleapis.com/favours-flow/")) {
        continue;
      }

      // generate new avatar
      const newAvatar = avatarholder.generateAvatar(user.firstName + " " + user.lastName);

      user.avatar = newAvatar;
      await user.save();
      updatedCount++;
    }

    res.json({
      message: `Avatars updated successfully`,
      updatedUsers: updatedCount
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


function generateInitialsImage(fullName, size = 100, bgColor = '#007bff', textColor = '#ffffff') {
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');

        // Extract initials
        const nameParts = fullName.split(' ').filter(part => part.length > 0);
        let initials = '';
        if (nameParts.length > 0) {
            initials += nameParts[0].charAt(0);
            if (nameParts.length > 1) {
                initials += nameParts[nameParts.length - 1].charAt(0);
            }
        }
        initials = initials.toUpperCase();

        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);

        // Draw text
        ctx.fillStyle = textColor;
        ctx.font = `${size * 0.7}px sans-serif`; // Adjust font size based on image size
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, size / 2, size / 2);

        // Save the image
        const buffer = canvas.toBuffer('image/png');

        return buffer
    }


// router.get('/get-users', auth, async (req, res) => {
//   try {

//     const userId = req.user._id;

//     // Get all users except the logged-in one, selecting only required fields
//     const users = await User.find(
//       { _id: { $ne: userId } }, // exclude current user
//       'firstName lastName avatar' // select specific fields
//     );

//     // Combine firstName and lastName into fullName
//     const formattedUsers = users.map(user => ({
//       id: `${user._id}`,
//       fullName: `${user.firstName} ${user.lastName}`,
//       avatar: user.avatar
//     }));

//     res.status(200).json(formattedUsers);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });


router.get('/get-users', async (req, res) => {
  try {

    const userId = '689353bbf0423eb5c09a9e21';

    // Get all users except the logged-in one, selecting only required fields
    const users = await User.find(
      { _id: { $ne: userId } }, // exclude current user
      'firstName lastName avatar' // select specific fields
    );

    // Combine firstName and lastName into fullName
    const formattedUsers = users.map(user => ({
      id: `${user._id}`,
      fullName: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar
    }));

    res.status(200).json(formattedUsers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;