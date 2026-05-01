const amqp = require("amqplib");

const {
  EXCHANGE_NAME,
  MESSAGE_BROKER_URL,
  REMINDER_BINDING_KEY,
  CHANNEL_NAME,
  ECOOMERCE_QUEUE
} = require("../config/serverConfig");

const createChannel = async () => {
  try {
      const connection = await amqp.connect(MESSAGE_BROKER_URL);
      const channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
      return channel;
    } catch (error) {
      console.log("Failed to connect with rabbitmq ", error)
      setTimeout(createChannel, 5000);
      // throw error;
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
    console.log("publishedMsg => ", error)
    throw error;
  }
};



const subscribeMessage = async (channel, service, binding_key) => {
  try {
      const applicationQueue = await channel.assertQueue(ECOOMERCE_QUEUE);
      channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);
      channel.consume(applicationQueue.queue, (msg) => {
        // console.log("In subscribeMessage funciton");
        // console.log("Received data =>", msg.content.toString());
        const payload = JSON.parse(msg.content.toString());
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
