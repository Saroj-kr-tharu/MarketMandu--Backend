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
          subject: 'Welcome to Power11 - Your Arena Awaits!',
          body:
            'Hey {{username}},\n\n' +
            'Welcome to Power11! This is where strategy meets skill.\n\n' +
            'What you can do:\n' +
            '- Create your fantasy team\n' +
            '- Join daily & mega contests\n' +
            '- Win exciting rewards\n\n' +
            'Let the games begin!\n\n' +
            '— Team Power11\n\n' +
            'Need help? support@power11.com',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        },

        {
          eventType: 'FORGOT_PASSWORD',
          channel: 'EMAIL',
          subject: 'Reset Your Power11 Password',
          body:
            'Hey {{username}},\n\n' +
            'We received a request to reset your password.\n\n' +
            'Reset link:\n{{reset_link}}\n\n' +
            'This link will expire in 1 hour.\n\n' +
            'If this was not you, please ignore this email.\n\n' +
            '— Team Power11',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        },

        {
          eventType: 'RESET_PASSWORD',
          channel: 'EMAIL',
          subject: 'Your Power11 Password Was Reset',
          body:
            'Hey {{username}},\n\n' +
            'Your Power11 account password has been successfully reset.\n\n' +
            'If you did not perform this action, please contact support immediately.\n\n' +
            '— Team Power11',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        },

        {
          eventType: 'WALLET_CREDITED',
          channel: 'EMAIL',
          subject: 'Your Power11 Wallet Has Been Credited',
          body:
            'Hey {{username}},\n\n' +
            'Your wallet has been credited successfully.\n\n' +
            'Details:\n' +
            '- Amount: {{amount}}\n' +
            '- Transaction ID: {{transaction_id}}\n\n' +
            'You can now join contests or tournaments.\n\n' +
            '— Team Power11',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        },

        {
          eventType: 'WITHDRAW_REQUESTED',
          channel: 'EMAIL',
          subject: 'Withdrawal Request Received',
          body:
            'Hey {{username}},\n\n' +
            'We have received your withdrawal request.\n\n' +
            'Details:\n' +
            '- Amount: {{withdraw_amount}}\n' +
            '- Transaction ID: {{transaction_id}}\n' +
            '- Status: Processing\n\n' +
            'Processing usually takes 24–48 hours.\n\n' +
            '— Team Power11',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        },

        {
          eventType: 'WITHDRAW_APPROVED',
          channel: 'EMAIL',
          subject: 'Withdrawal Approved',
          body:
            'Hey {{username}},\n\n' +
            'Good news! Your withdrawal request has been approved.\n\n' +
            'Details:\n' +
            '- Amount: {{withdraw_amount}}\n' +
            '- Transaction ID: {{transaction_id}}\n\n' +
            'The amount will be credited to your bank within 2–5 business days.\n\n' +
            '— Team Power11',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        },

        {
          eventType: 'WITHDRAW_REJECTED',
          channel: 'EMAIL',
          subject: 'Withdrawal Request Update',
          body:
            'Hey {{username}},\n\n' +
            'Unfortunately, your withdrawal request was rejected.\n\n' +
            'Details:\n' +
            '- Amount: {{withdraw_amount}}\n' +
            '- Transaction ID: {{transaction_id}}\n' +
            '- Reason: {{reason}}\n\n' +
            'The amount has been returned to your wallet.\n\n' +
            '— Team Power11',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        },

        {
          eventType: 'CONTEST_WON',
          channel: 'EMAIL',
          subject: 'Congratulations! You Won a Contest',
          body:
            'Hey {{username}},\n\n' +
            'Congratulations on winning your contest!\n\n' +
            'Winning Details:\n' +
            '- Rank: {{rank}}\n' +
            '- Amount: {{amount}}\n' +
            '- Transaction ID: {{transaction_id}}\n\n' +
            'The winnings have been credited to your wallet.\n\n' +
            '— Team Power11',
          isActive: true,
          version: 1,
          createdAt: now,
          updatedAt: now
        },

        
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
            'WALLET_CREDITED',
            'WITHDRAW_REQUESTED',
            'WITHDRAW_APPROVED',
            'WITHDRAW_REJECTED',
            'CONTEST_WON'
          ]
        }
      },
      {}
    );
  }
};