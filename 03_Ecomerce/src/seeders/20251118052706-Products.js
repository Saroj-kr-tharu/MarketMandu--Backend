'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const products = [
      {
        name: 'iPhone 15 Pro Max',
        description: 'Apple iPhone 15 Pro Max with A17 Pro chip, titanium design, 6.7-inch Super Retina XDR display, and advanced camera system',
        price: 1199.99,
        category: 'Electronics',
        brand: 'Apple',
        stock: 45,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1592286927505-b0e6d8d2e7b2?w=800&q=80',
          'https://images.unsplash.com/photo-1678652407570-89c797d7fafe?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 342,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen, 200MP camera, AI features, and stunning 6.8-inch Dynamic AMOLED display',
        price: 1299.99,
        category: 'Electronics',
        brand: 'Samsung',
        stock: 38,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 289,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery life',
        price: 399.99,
        category: 'Audio',
        brand: 'Sony',
        stock: 67,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
        ]),
        ratings: 4.9,
        totalRatings: 521,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'MacBook Pro 14" M3',
        description: 'Powerful laptop with M3 chip, Liquid Retina XDR display, up to 22 hours battery life, perfect for professionals',
        price: 1999.99,
        category: 'Computers',
        brand: 'Apple',
        stock: 28,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80'
        ]),
        ratings: 4.9,
        totalRatings: 198,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dell XPS 15',
        description: 'Premium Windows laptop with 13th Gen Intel Core i7, NVIDIA RTX 4050, and stunning InfinityEdge display',
        price: 1799.99,
        category: 'Computers',
        brand: 'Dell',
        stock: 22,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
          'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 156,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'iPad Pro 12.9" M2',
        description: 'Ultimate iPad experience with M2 chip, Liquid Retina XDR display, and support for Apple Pencil',
        price: 1099.99,
        category: 'Tablets',
        brand: 'Apple',
        stock: 41,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
          'https://images.unsplash.com/photo-1585790050230-5dd28404f966?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 267,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Canon EOS R6 Mark II',
        description: 'Full-frame mirrorless camera with 24.2MP sensor, 40fps continuous shooting, and advanced autofocus',
        price: 2499.99,
        category: 'Cameras',
        brand: 'Canon',
        stock: 15,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606980707146-b485a1f08e8f?w=800&q=80',
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80'
        ]),
        ratings: 4.9,
        totalRatings: 134,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'GoPro HERO12 Black',
        description: 'Action camera with 5.3K60 video, HyperSmooth 6.0 stabilization, and enhanced low-light performance',
        price: 399.99,
        category: 'Cameras',
        brand: 'GoPro',
        stock: 52,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800&q=80',
          'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 389,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Apple Watch Series 9',
        description: 'Advanced health and fitness smartwatch with always-on Retina display, ECG, and blood oxygen monitoring',
        price: 429.99,
        category: 'Wearables',
        brand: 'Apple',
        stock: 73,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
          'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 612,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Samsung Galaxy Watch 6',
        description: 'Premium Wear OS smartwatch with advanced health tracking, personalized insights, and sleek design',
        price: 349.99,
        category: 'Wearables',
        brand: 'Samsung',
        stock: 58,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 445,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bose QuietComfort Ultra Earbuds',
        description: 'Premium wireless earbuds with world-class noise cancellation, immersive audio, and comfortable fit',
        price: 299.99,
        category: 'Audio',
        brand: 'Bose',
        stock: 84,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
          'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 378,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'PlayStation 5',
        description: 'Next-gen gaming console with 4K gaming, ray tracing, ultra-fast SSD, and DualSense controller',
        price: 499.99,
        category: 'Gaming',
        brand: 'Sony',
        stock: 31,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
          'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800&q=80'
        ]),
        ratings: 4.9,
        totalRatings: 892,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Xbox Series X',
        description: 'Microsoft\'s most powerful console with 4K gaming at 120fps, quick resume, and Game Pass compatibility',
        price: 499.99,
        category: 'Gaming',
        brand: 'Microsoft',
        stock: 27,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
          'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 734,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'LG OLED TV 65"',
        description: 'Premium 4K OLED TV with perfect blacks, vibrant colors, Dolby Vision IQ, and gaming features',
        price: 1999.99,
        category: 'TVs',
        brand: 'LG',
        stock: 18,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
          'https://images.unsplash.com/photo-1593359863503-f598f2d60623?w=800&q=80'
        ]),
        ratings: 4.9,
        totalRatings: 223,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dyson V15 Detect',
        description: 'Cordless vacuum cleaner with laser detection, advanced filtration, and powerful suction',
        price: 649.99,
        category: 'Home Appliances',
        brand: 'Dyson',
        stock: 42,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
          'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 456,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ninja Air Fryer Pro',
        description: 'Large capacity air fryer with 8 cooking functions, digital controls, and dishwasher-safe basket',
        price: 129.99,
        category: 'Kitchen Appliances',
        brand: 'Ninja',
        stock: 96,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1585237672377-e95d9611b2c7?w=800&q=80',
          'https://images.unsplash.com/photo-1606802247580-56d72b807b89?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 1289,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Herman Miller Aeron Chair',
        description: 'Ergonomic office chair with PostureFit support, breathable mesh, and fully adjustable features',
        price: 1395.99,
        category: 'Furniture',
        brand: 'Herman Miller',
        stock: 14,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80'
        ]),
        ratings: 4.9,
        totalRatings: 167,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nike Air Zoom Pegasus 40',
        description: 'Responsive running shoes with Nike React foam, breathable mesh upper, and durable traction',
        price: 139.99,
        category: 'Sports',
        brand: 'Nike',
        stock: 124,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
          'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 892,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kindle Paperwhite',
        description: 'Premium e-reader with 6.8" glare-free display, adjustable warm light, wireless charging, and 32GB storage',
        price: 189.99,
        category: 'Electronics',
        brand: 'Amazon',
        stock: 78,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1592503254549-d83d24a4dfab?w=800&q=80',
          'https://images.unsplash.com/photo-1598390809671-203b80fe23cb?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 1456,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'Advanced wireless mouse with quiet clicks, 8K DPI sensor, ergonomic design, and multi-device connectivity',
        price: 99.99,
        category: 'Computer Accessories',
        brand: 'Logitech',
        stock: 142,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
          'https://images.unsplash.com/photo-1586920740099-e5ce48e18bb2?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 2134,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mechanical Gaming Keyboard RGB',
        description: 'Premium mechanical keyboard with Cherry MX switches, customizable RGB lighting, and aluminum frame',
        price: 159.99,
        category: 'Computer Accessories',
        brand: 'Razer',
        stock: 87,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
          'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 634,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bose SoundLink Flex',
        description: 'Portable Bluetooth speaker with waterproof design, 12-hour battery life, and powerful sound',
        price: 149.99,
        category: 'Audio',
        brand: 'Bose',
        stock: 112,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 789,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Instant Pot Duo Plus',
        description: '9-in-1 electric pressure cooker with 15 smart programs, 6-quart capacity, and stainless steel construction',
        price: 119.99,
        category: 'Kitchen Appliances',
        brand: 'Instant Pot',
        stock: 145,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
          'https://images.unsplash.com/photo-1556911073-38141963c9e0?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 2456,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fitbit Charge 6',
        description: 'Advanced fitness tracker with built-in GPS, heart rate monitoring, sleep tracking, and 7-day battery life',
        price: 159.99,
        category: 'Wearables',
        brand: 'Fitbit',
        stock: 93,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
          'https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=800&q=80'
        ]),
        ratings: 4.5,
        totalRatings: 1234,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ring Video Doorbell Pro',
        description: 'Smart doorbell with 1080p HD video, two-way talk, motion detection, and works with Alexa',
        price: 249.99,
        category: 'Smart Home',
        brand: 'Ring',
        stock: 67,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
          'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 1567,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Products', products, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};