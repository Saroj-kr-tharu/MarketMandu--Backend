'use strict';

const now = new Date();
const endDate = new Date(now);
endDate.setDate(endDate.getDate() + 15);

const banners = [
  {
    title: 'Free Delivery Sales',
    imageUrl: 'https://d1l8ti7xj3tpl6.cloudfront.net/3dc00c04f6d0463893a2132ef3691997',
    redirectUrl: 'http://localhost:4200/search?q=Computers&page=1&max=0',
    isActive: true,
    priority: 1,
    startDate: now,
    endDate: endDate,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Flash Sale - Up to 720% Off',
    imageUrl: 'https://d1l8ti7xj3tpl6.cloudfront.net/85f2749610b57b1f9180727b75fe9b06',
    redirectUrl: 'http://localhost:4200/search?q=Audio&page=1&max=0',
    isActive: true,
    priority: 1,
    startDate: now,
    endDate: endDate,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Best Price Guarenteed',
    imageUrl: 'https://d1l8ti7xj3tpl6.cloudfront.net/5cfc07e2cff1bfc4b3a75c97d26a6631',
    redirectUrl: 'http://localhost:4200/search?q=Computer%20Accessories&page=1&max=0',
    isActive: true,
    priority: 1,
    startDate: now,
    endDate: endDate,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Must Buy Deals',
    imageUrl: 'https://d1l8ti7xj3tpl6.cloudfront.net/bae16ff5992c4bc58babdbf562da262f',
    redirectUrl: 'http://localhost:4200/search?q=TV&page=1&max=0',
    isActive: true,
    priority: 1,
    startDate: now,
    endDate: endDate,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: '50% Off',
    imageUrl: 'https://d1l8ti7xj3tpl6.cloudfront.net/edf9ecb68fdf31ab2448602cb2d98160',
    redirectUrl: 'http://localhost:4200/search?q=Sports&page=1&max=0',
    isActive: true,
    priority: 1,
    startDate: now,
    endDate: endDate,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Beauty Station 20% Off',
    imageUrl: 'https://d1l8ti7xj3tpl6.cloudfront.net/79946dfb5fc1e43e923143308dd3aff0',
    redirectUrl: 'http://localhost:4200/search?q=Gaming&page=1&max=0',
    isActive: true,
    priority: 1,
    startDate: now,
    endDate: endDate,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'Early Birds --- 50% OFF',
    imageUrl: 'https://d1l8ti7xj3tpl6.cloudfront.net/8d2ba754cf5247ce8bf9493aff819a3e',
    redirectUrl: 'http://localhost:4200/search?q=Home%20Appliances&page=1&max=0',
    isActive: true,
    priority: 1,
    startDate: now,
    endDate: endDate,
    createdAt: now,
    updatedAt: now,
  },
  {
    title: 'New Arrival Sale',
    imageUrl: 'https://d1l8ti7xj3tpl6.cloudfront.net/f6024f145fd831042acedf51a8ccda55',
    redirectUrl: 'http://localhost:4200/search?q=Electronics&page=1&max=0',
    isActive: true,
    priority: 1,
    startDate: now,
    endDate: endDate,
    createdAt: now,
    updatedAt: now,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch all existing banner titles in one query
    const existing = await queryInterface.sequelize.query(
      `SELECT title FROM "Banners"`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const existingTitles = new Set(existing.map((row) => row.title));

    const newBanners = banners.filter((b) => !existingTitles.has(b.title));

    if (newBanners.length === 0) {
      console.log('Banners already seeded — skipping.');
      return;
    }

    await queryInterface.bulkInsert('Banners', newBanners, {});
    console.log(`Seeded ${newBanners.length} new banner(s).`);
  },

  async down(queryInterface, Sequelize) {
    const titles = banners.map((b) => b.title);
    await queryInterface.bulkDelete('Banners', { title: titles }, {});
  },
};