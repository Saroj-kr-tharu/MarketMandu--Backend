'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = '$2b$10$8bZfdHOvKoOPDum4kbuASOFBINDefPjr0hUOfa0R6WaUiTVQ.VUhW';
    const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiYUBnbWFpbC5jb20iLCJpZCI6Ijk2MTA4NDc0LWRmZTMtNDYzNi04NjJkLTJmNDUzOTM1ZWE0MSJ9LCJpYXQiOjE3Njg3NTQ5MTMsImV4cCI6MTc2OTM1OTcxM30.hTya9C-KeDgO0edMAiZGrrC1jotMQWNmF7epmAhfdL0';

    await queryInterface.bulkInsert('Users', [
      {
        id: '96108474-dfe3-4636-862d-2f453935ea41',
        email: 'a@example.com',
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
        id: 'b2c3d4e5-f6a7-4890-b123-456789abcdef',
        email: 'c2@gmail.com',
        username: 'janesmith',
        password: hashedPassword,
        refreshToken: refreshToken,
        role: 'CUSTOMER',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], { 
      ignoreDuplicates: true // <--- THIS FIXES THE "ALREADY EXISTS" ERROR
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: {
        [Sequelize.Op.in]: [
          'a@example.com',
          'c1@gmail.com',
          'c2@gmail.com',
        ]
      }
    }, {});
  }
};