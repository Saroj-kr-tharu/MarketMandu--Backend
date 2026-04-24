const amqp = require("amqplib");

const {
  EXCHANGE_NAME,
  MESSAGE_BROKER_URL,
  REMAINDER_QUEUE
} = require("../config/server.config");

const createChannel = async () => {
  try {

    console.log("Connecting to RabbitMQ at:", MESSAGE_BROKER_URL);
    const connection = await amqp.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
    
  } catch (error) {
    console.log('error => ', error);
    console.error("Failed to create channel. Retrying in 5 seconds...");
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await createChannel());
      }, 5000);
    });
  }
};

const publishMessage = async (channel, binding_key, message) => {
  try {
    await channel.assertQueue("REMINDER_EMAIL_QUEUE");
    await channel.publish(
      EXCHANGE_NAME,
      binding_key,
      Buffer.from(message)
    );
  } catch (error) {
    throw error;
  }
};

const subscribeMessage = async (channel, service, binding_key) => {
  try {
        const applicationQueue = await channel.assertQueue(REMAINDER_QUEUE)
        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);
        channel.consume(applicationQueue.queue, (msg) => {
        const payload = JSON.parse(msg.content.toString());
        // console.log("payload => ", payload)
        service(payload);
        channel.ack(msg);
      });
    } catch (error) {
      throw error;
    }
};

module.exports = {
  createChannel,
  publishMessage,
  subscribeMessage,
};



