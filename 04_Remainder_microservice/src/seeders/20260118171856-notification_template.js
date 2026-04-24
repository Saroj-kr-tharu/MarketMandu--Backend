'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'notification_templates',
      [
        {
          eventType: 'USER_REGISTERED',
          channel: 'EMAIL',
          subject: 'Welcome to MarketMandu – Your Shopping Journey Starts Here!',
          body:
            'Hey {{username}},\n\n' +
            'Welcome to MarketMandu! We’re thrilled to have you join our community.\n\n' +
            'Here is what you can do right now:\n' +
            '- Discover curated products across all categories\n' +
            '- Add your must-haves to your wishlist\n' +
            '- Enjoy a fast, secure, and seamless checkout\n\n' +
            'Happy shopping!\n\n' +
            '— Team MarketMandu\n\n' +
            'Need help? support@marketmandu.com',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        },

        {
          eventType: 'FORGOT_PASSWORD',
          channel: 'EMAIL',
          subject: 'Reset Your MarketMandu Password',
          body:
            'Hey {{username}},\n\n' +
            'We received a request to reset your password.\n\n' +
            'Reset link:\n{{reset_link}}\n\n' +
            'This link will expire in 1 hour.\n\n' +
            'If this was not you, please ignore this email.\n\n' +
            '— Team MarketMandu',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        },

        {
          eventType: 'RESET_PASSWORD',
          channel: 'EMAIL',
          subject: 'Your MarketMandu Password Was Reset',
          body:
            'Hey {{username}},\n\n' +
            'Your MarketMandu account password has been successfully reset.\n\n' +
            'If you did not perform this action, please contact support immediately.\n\n' +
            '— Team MarketMandu',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        },

        {
          eventType: 'ORDER_CONFIRM',
          channel: 'EMAIL',
          subject: 'Order Confirmed!  #{{orderId}} MarketMandu',
          body:
            'Hey {{customerName}},\n\n' +
            'Thank you for your purchase! We’ve received your payment and your order is now being processed.\n\n' +
            'Order Summary:\n' +
            '- Order ID: {{orderId}}\n' +
            '- Total Amount: {{currency}} {{amount}}\n' +
            '- Transaction ID: {{transactionId}}\n' +
            '- Estimated Delivery: {{deliveryEstimatedDate}}\n\n' +
            'Shipping & Taxes:\n' +
            '- Shipping Fee: {{currency}} {{shipping_fee}}\n' +
            '- Tax: {{currency}} {{tax}}\n\n' +
            'We will notify you as soon as your items are on their way!\n\n' +
            '— Team MarketMandu',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        }

      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'notification_templates',
      {
        eventType: {
          [Sequelize.Op.in]: [
            'USER_REGISTERED',
            'FORGOT_PASSWORD',
            'RESET_PASSWORD',
            'ORDER_CONFIRM', 
          ]
        }
      },
      {}
    );
  }
};