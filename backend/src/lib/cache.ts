import NodeCache from 'node-cache';

// Shared in-memory cache singleton
// - Search suggestions: TTL 5 minutes
// - AI responses: TTL 1 hour
const cache = new NodeCache({
  checkperiod: 120, // Check for expired keys every 2 minutes
});

export default cache;
