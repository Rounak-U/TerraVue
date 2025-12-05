const mongoose = require('mongoose');

const CONNECTION_LABEL = {
  atlas: 'MongoDB Atlas cluster',
  local: 'local MongoDB instance'
};

const logServerSelectionHint = (err) => {
  if (err?.name !== 'MongooseServerSelectionError') {
    return;
  }

  console.error(
    '\nMongoDB Atlas refused the connection. Common fixes include:\n' +
      '  • Add your current IP (or 0.0.0.0/0 for dev) to the Atlas network access list.\n' +
      '  • Double-check the username/password in the connection string.\n' +
      '  • Ensure the cluster allows TLS/SSL from your environment.\n'
  );
};

const connectDB = async () => {
  const preferLocal = (process.env.MONGO_PREFER_LOCAL || '').toLowerCase() === 'true';
  const atlasUri = process.env.MONGO_URI?.trim();
  const localUri = (process.env.MONGO_URI_LOCAL || 'mongodb://127.0.0.1:27017/terravue').trim();

  const orderedUris = preferLocal ? [localUri, atlasUri] : [atlasUri, localUri];
  const seen = new Set();
  const filteredUris = orderedUris.filter((uri) => uri && !seen.has(uri) && seen.add(uri));

  if (filteredUris.length === 0) {
    throw new Error('No MongoDB URI provided. Set MONGO_URI or MONGO_URI_LOCAL in your .env file.');
  }

  let lastError;

  for (const uri of filteredUris) {
    const label = uri.startsWith('mongodb+srv') ? CONNECTION_LABEL.atlas : CONNECTION_LABEL.local;
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`Connected to ${label}`);
      return;
    } catch (err) {
      lastError = err;
      console.error(`Failed to connect to ${label}: ${err.message}`);
      logServerSelectionHint(err);
    }
  }

  throw lastError;
};

module.exports = connectDB;
