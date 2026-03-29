const redis = require('redis'); 
const {REDIS_URL} = require('./server.config')

const client = redis.createClient({ url: REDIS_URL });
client.connect().then(() => console.log("Redis Service Contented"));

module.exports = client;