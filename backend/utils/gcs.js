const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCLOUD_PROJECT,
});

const bucket = storage.bucket(process.env.GCLOUD_BUCKET);

/**
 * Uploads an image file buffer to Google Cloud Storage
 * @param {object} file - File object from multer (req.file)
 * @param {string} [customName] - Optional custom filename
 * @returns {Promise<string>} - Public URL of uploaded image
 */
const uploadImageToGCS = (file, customName) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject('No file provided');

    // Use provided name or fallback to timestamp-based name
    const fileName = customName || `${Date.now()}-${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => reject(err));

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

/**
 * Deletes an image from Google Cloud Storage
 * @param {string} fileName - The name of the file in the bucket
 * @returns {Promise<void>}
 */
const deleteImageFromGCS = async (fileName) => {
  if (!fileName) throw new Error('No filename provided');

  const file = bucket.file(fileName);
  await file.delete();
};

module.exports = {
  uploadImageToGCS,
  deleteImageFromGCS,
};
