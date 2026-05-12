'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = '$2b$10$kPyqVStUIqV2LiIu6ofrwelkgdxM.m23uC.TgIrJWM71NIJGTu4.y';
    
    const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiYUBnbWFpbC5jb20iLCJpZCI6Ijk2MTA4NDc0LWRmZTMtNDYzNi04NjJkLTJmNDUzOTM1ZWE0MSJ9LCJpYXQiOjE3Njg3NTQ5MTMsImV4cCI6MTc2OTM1OTcxM30.hTya9C-KeDgO0edMAiZGrrC1jotMQWNmF7epmAhfdL0';

    await queryInterface.bulkInsert('Users', [
      {
        id: '96108474-dfe3-4636-862d-2f453935ea41',
        email: 'a@gmail.com',
        username: 'admin',
        password: hashedPassword,
        refreshToken: refreshToken,
        role: 'ADMIN',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'a1b2c3d4-e5f6-4789-a012-3456789abcde',
        email: 'c1@gmail.com',
        username: 'johndoe',
        password: hashedPassword,
        refreshToken: refreshToken,
        role: 'CUSTOMER',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '8aef89d2-7cde-4702-86bb-b328aef01234',
        email: 'c@gmail.com',
        username: 'customer_c',
        password: hashedPassword,
        refreshToken: refreshToken, 
        role: 'CUSTOMER',
        isActive: true, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
    ], { 
      ignoreDuplicates: true 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: {
        [Sequelize.Op.in]: [
          'a@gmail.com',
          'c1@gmail.com',
          'c@gmail.com',
        ]
      }
    }, {});
  }
};