'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { QueryTypes } = Sequelize;

    const products = [
      // ─── Electronics ───────────────────────────────────────────
      {
        name: 'iPhone 15 Pro Max',
        description: 'Apple iPhone 15 Pro Max with A17 Pro chip, titanium design, 6.7-inch Super Retina XDR display, 48MP camera system with 5x optical zoom, and USB-C connectivity.',
        price: 1199.99,
        category: 'Electronics',
        brand: 'Apple',
        stock: 45,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
          'https://images.unsplash.com/photo-1696446701796-da61339901c7?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 342,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android flagship with built-in S Pen, 200MP quad-camera, Snapdragon 8 Gen 3, 6.8-inch QHD+ Dynamic AMOLED 2X display, and 5000mAh battery.',
        price: 1299.99,
        category: 'Electronics',
        brand: 'Samsung',
        stock: 38,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1706439235789-8d0f3f217c83?w=800&q=80',
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 289,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Google Pixel 8 Pro',
        description: 'Google Pixel 8 Pro with Tensor G3 chip, 6.7-inch LTPO OLED display, 50MP triple camera with AI-powered photography, 7 years of OS updates, and temperature sensor.',
        price: 999.99,
        category: 'Electronics',
        brand: 'Google',
        stock: 52,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 187,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kindle Paperwhite (16GB)',
        description: 'The thinnest, lightest Kindle Paperwhite with a 6.8-inch glare-free display, adjustable warm light, wireless charging, 16GB storage, and up to 12 weeks of battery life.',
        price: 189.99,
        category: 'Electronics',
        brand: 'Amazon',
        stock: 78,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1592503254549-d83d24a4dfab?w=800&q=80',
          'https://images.unsplash.com/photo-1512668079310-ea4a7ae81b74?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 1456,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ─── Computers ─────────────────────────────────────────────
      {
        name: 'MacBook Pro 14" M3 Pro',
        description: 'MacBook Pro with M3 Pro chip, 18GB unified memory, 512GB SSD, Liquid Retina XDR display, up to 18 hours battery life, and a full suite of pro ports including HDMI and SD card.',
        price: 1999.99,
        category: 'Computers',
        brand: 'Apple',
        stock: 28,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
          'https://images.unsplash.com/photo-1611186871525-d66aef4a8e72?w=800&q=80'
        ]),
        ratings: 4.9,
        totalRatings: 198,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dell XPS 15 (2024)',
        description: 'Dell XPS 15 with Intel Core i9-13900H, NVIDIA RTX 4070, 32GB RAM, 1TB SSD, 15.6-inch 3.5K OLED InfinityEdge touchscreen, and premium CNC aluminum chassis.',
        price: 2199.99,
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
        name: 'ASUS ROG Zephyrus G16',
        description: 'Gaming laptop with AMD Ryzen 9 8945HS, NVIDIA RTX 4080, 32GB DDR5, 2TB SSD, 16-inch 240Hz QHD+ ROG Nebula display, and per-key RGB keyboard.',
        price: 2499.99,
        category: 'Computers',
        brand: 'ASUS',
        stock: 17,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
          'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 112,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ─── Tablets ───────────────────────────────────────────────
      {
        name: 'iPad Pro 12.9" M2',
        description: 'iPad Pro with M2 chip, stunning 12.9-inch Liquid Retina XDR display with ProMotion, Wi-Fi 6E, Bluetooth 5.3, support for Apple Pencil 2 and Magic Keyboard, and Thunderbolt port.',
        price: 1099.99,
        category: 'Tablets',
        brand: 'Apple',
        stock: 41,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
          'https://images.unsplash.com/photo-1603189817218-3b9f15671c6b?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 267,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Samsung Galaxy Tab S9 Ultra',
        description: 'Samsung\'s largest premium tablet with a 14.6-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, S Pen included, 12GB RAM, 256GB storage, and IP68 water resistance.',
        price: 1099.99,
        category: 'Tablets',
        brand: 'Samsung',
        stock: 34,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1632634571989-f6012beb75fd?w=800&q=80',
          'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 189,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ─── Audio ─────────────────────────────────────────────────
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading wireless noise-canceling headphones with 8 microphones, Auto NC Optimizer, 30-hour battery, multipoint connection, and crystal clear hands-free calling.',
        price: 349.99,
        category: 'Audio',
        brand: 'Sony',
        stock: 67,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
        ]),
        ratings: 4.9,
        totalRatings: 521,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bose QuietComfort Ultra Earbuds',
        description: 'Bose\'s best ever earbuds with CustomTune technology, world-class noise cancellation, immersive audio with head tracking, IPX4 rating, and up to 24 hours total battery.',
        price: 299.99,
        category: 'Audio',
        brand: 'Bose',
        stock: 84,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 378,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bose SoundLink Max',
        description: 'Portable Bluetooth speaker with deep bass, 360-degree sound, IP67 waterproof rating, 20-hour battery life, built-in speakerphone, and premium woven fabric design.',
        price: 399.99,
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

      // ─── Cameras ───────────────────────────────────────────────
      {
        name: 'Canon EOS R6 Mark II',
        description: 'Full-frame mirrorless camera with 24.2MP CMOS sensor, DIGIC X processor, up to 40fps continuous shooting, subject-tracking AF with deep learning, 4K 60p video, and dual card slots.',
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
        description: 'Versatile action camera with 5.3K60 video, 27MP photos, HyperSmooth 6.0 stabilization, Max Lens Mod support, 70-minute waterproof, and Enduro battery for extended cold-weather performance.',
        price: 399.99,
        category: 'Cameras',
        brand: 'GoPro',
        stock: 52,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
          'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 389,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sony ZV-E10 II',
        description: 'APS-C vlog camera with 26MP back-illuminated sensor, 4K 60p video, real-time subject recognition AF, built-in ND filter, directional 3-capsule microphone, and flip-out touchscreen.',
        price: 849.99,
        category: 'Cameras',
        brand: 'Sony',
        stock: 29,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?w=800&q=80',
          'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 98,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ─── Wearables ─────────────────────────────────────────────
      {
        name: 'Apple Watch Series 9 (45mm)',
        description: 'Apple Watch Series 9 with S9 SiP chip, Double Tap gesture, always-on Retina display, blood oxygen, ECG, crash detection, temperature sensing, and carbon neutral option.',
        price: 429.99,
        category: 'Wearables',
        brand: 'Apple',
        stock: 73,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80',
          'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 612,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Samsung Galaxy Watch 6 Classic (47mm)',
        description: 'Premium smartwatch with iconic rotating bezel, 1.5-inch Super AMOLED display, advanced health monitoring including body composition, sleep coaching, and Wear OS 4 with Google apps.',
        price: 399.99,
        category: 'Wearables',
        brand: 'Samsung',
        stock: 58,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 445,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fitbit Charge 6',
        description: 'Advanced fitness tracker with built-in GPS, Google Maps and Wallet integration, 40+ exercise modes, heart rate zones, stress management score, sleep profile, and 7-day battery life.',
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

      // ─── Gaming ────────────────────────────────────────────────
      {
        name: 'PlayStation 5 Slim',
        description: 'Sony\'s updated PS5 with a slimmer, lighter design, 1TB SSD storage, detachable disc drive, 4K gaming with ray tracing, 120fps support, and the innovative DualSense haptic controller.',
        price: 499.99,
        category: 'Gaming',
        brand: 'Sony',
        stock: 31,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
          'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80'
        ]),
        ratings: 4.9,
        totalRatings: 892,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Xbox Series X',
        description: 'Microsoft\'s most powerful console with 12 teraflops of GPU performance, 4K gaming at 120fps, Quick Resume for multiple games, 1TB custom NVMe SSD, and Xbox Game Pass compatibility.',
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
        name: 'Nintendo Switch OLED',
        description: 'Nintendo Switch OLED model with a vibrant 7-inch OLED screen, wide adjustable stand, 64GB internal storage, enhanced audio, and a wired LAN port in the dock for online play.',
        price: 349.99,
        category: 'Gaming',
        brand: 'Nintendo',
        stock: 63,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
          'https://images.unsplash.com/photo-1585694402869-fe4fbbfa7ae3?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 1123,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ─── TVs ───────────────────────────────────────────────────
      {
        name: 'LG C3 OLED 65"',
        description: 'LG\'s best-selling OLED TV with self-lit pixels, Dolby Vision IQ, Dolby Atmos, 4K 120Hz with VRR, NVIDIA G-Sync compatible, four HDMI 2.1 ports, and webOS 23 smart platform.',
        price: 1799.99,
        category: 'TVs',
        brand: 'LG',
        stock: 18,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
          'https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=800&q=80'
        ]),
        ratings: 4.9,
        totalRatings: 223,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Samsung QN90C Neo QLED 55"',
        description: 'Samsung Neo QLED 4K TV with Mini LED backlighting, Quantum HDR 32x, Motion Xcelerator 144Hz, Object Tracking Sound+, Tizen smart OS, and 4 HDMI ports including one HDMI 2.1.',
        price: 1299.99,
        category: 'TVs',
        brand: 'Samsung',
        stock: 24,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1593359863503-f598f2d60623?w=800&q=80',
          'https://images.unsplash.com/photo-1540546048585-4a9a6be4a3dc?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 178,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ─── Computer Accessories ──────────────────────────────────
      {
        name: 'Logitech MX Master 3S',
        description: 'Advanced wireless mouse with ultra-fast MagSpeed scroll wheel, 8,000 DPI optical sensor, quiet clicks, ergonomic design, USB-C charging, and connect up to 3 devices simultaneously.',
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
        name: 'Razer BlackWidow V4 Pro',
        description: 'Wireless mechanical gaming keyboard with Razer Yellow optical switches, per-key RGB Chroma lighting, magnetic wrist rest, dedicated media controls, and up to 200 hours battery life.',
        price: 229.99,
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
        name: 'LG 27" UltraGear 4K Monitor',
        description: 'LG 27" IPS display with 4K UHD resolution, 144Hz refresh rate, 1ms GtG response time, NVIDIA G-Sync compatible, USB-C 90W power delivery, and HDR600 certification.',
        price: 649.99,
        category: 'Computer Accessories',
        brand: 'LG',
        stock: 36,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1527443224154-c4a573d5e33e?w=800&q=80',
          'https://images.unsplash.com/photo-1593640408182-31c228ede3b9?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 445,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ─── Home Appliances ───────────────────────────────────────
      {
        name: 'Dyson V15 Detect Absolute',
        description: 'Most powerful Dyson cordless vacuum with laser dust detection, LCD screen showing particle count, HEPA filtration, up to 60 minutes runtime, and includes 10 accessories for all floor types.',
        price: 749.99,
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
        name: 'Dyson Airwrap Multi-Styler',
        description: 'Dyson Airwrap Complete with Coanda airflow to style and dry hair simultaneously, includes 6 attachments for curls, waves, and smoothing, works on all hair types, with travel pouch.',
        price: 599.99,
        category: 'Home Appliances',
        brand: 'Dyson',
        stock: 55,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
          'https://images.unsplash.com/photo-1519219788971-8d9797e0928e?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 789,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ─── Kitchen Appliances ────────────────────────────────────
      {
        name: 'Ninja Foodi 9-in-1 Air Fryer',
        description: 'Ninja Foodi with TenderCrisp technology combining pressure cooker and air fryer, 8-quart capacity, 9 cooking functions, 45% faster cooking, and dishwasher-safe ceramic-coated pot.',
        price: 199.99,
        category: 'Kitchen Appliances',
        brand: 'Ninja',
        stock: 96,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1585237672377-e95d9611b2c7?w=800&q=80',
          'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 1289,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Instant Pot Duo Plus 9-in-1',
        description: '9-in-1 multi-cooker combining pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, warmer, and sterilizer. 6-quart capacity with 15 smart programs and stainless steel inner pot.',
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
        name: 'Breville Barista Express',
        description: 'Espresso machine with built-in conical burr grinder, dose control grinding, digital temperature control (PID), manual microfoam milk texturing, and 67oz removable water tank.',
        price: 699.99,
        category: 'Kitchen Appliances',
        brand: 'Breville',
        stock: 33,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
          'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 967,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ─── Furniture ─────────────────────────────────────────────
      {
        name: 'Herman Miller Aeron Chair (Size B)',
        description: 'Iconic ergonomic office chair with PostureFit SL back support, 8Z Pellicle suspension, fully adjustable arms, tilt limiter with seat angle, and forward tilt capability for active sitting.',
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

      // ─── Sports ────────────────────────────────────────────────
      {
        name: 'Nike Air Zoom Pegasus 40',
        description: 'Nike\'s iconic everyday running shoe with React foam midsole, Zoom Air unit in the forefoot, breathable engineered mesh upper, durable rubber outsole, and reflective details for visibility.',
        price: 139.99,
        category: 'Sports',
        brand: 'Nike',
        stock: 124,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 892,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Adidas Ultraboost 23',
        description: 'Premium running shoes with 60% recycled content Primeknit+ upper, responsive Boost midsole, Continental rubber outsole, Linear Energy Push system, and TORSION SYSTEM for midfoot support.',
        price: 189.99,
        category: 'Sports',
        brand: 'Adidas',
        stock: 108,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?w=800&q=80',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 743,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // ─── Smart Home ────────────────────────────────────────────
      {
        name: 'Ring Video Doorbell Pro 2',
        description: 'Advanced smart doorbell with Head-to-Toe HD+ Video, 3D Motion Detection with Bird\'s Eye View, dual-band Wi-Fi, two-way talk with noise cancellation, and Alexa integration.',
        price: 249.99,
        category: 'Smart Home',
        brand: 'Ring',
        stock: 67,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
        ]),
        ratings: 4.6,
        totalRatings: 1567,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Philips Hue Starter Kit (4 Bulbs)',
        description: 'Smart lighting starter kit with 4x A19 White & Color Ambiance bulbs (16 million colors), Hue Bridge, supports Alexa, Google Assistant, Apple HomeKit, and remote control via Hue app.',
        price: 199.99,
        category: 'Smart Home',
        brand: 'Philips',
        stock: 89,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=800&q=80',
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80'
        ]),
        ratings: 4.7,
        totalRatings: 2341,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nest Learning Thermostat (4th Gen)',
        description: 'Google\'s smartest thermostat with Farsight display, Matter support, auto-schedule learning, Home/Away Assist, energy history, remote control via Google Home app, and works with Alexa.',
        price: 279.99,
        category: 'Smart Home',
        brand: 'Google',
        stock: 74,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
          'https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?w=800&q=80'
        ]),
        ratings: 4.8,
        totalRatings: 1876,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const ProductModel = queryInterface.sequelize.define('Product', {
      name: Sequelize.STRING,
      description: Sequelize.TEXT,
      price: Sequelize.DECIMAL,
      category: Sequelize.STRING,
      brand: Sequelize.STRING,
      stock: Sequelize.INTEGER,
      images: Sequelize.TEXT,
      ratings: Sequelize.FLOAT,
      totalRatings: Sequelize.INTEGER,
      isActive: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    }, {
      tableName: 'Products',
      timestamps: false,
    });

    let created = 0;
    let skipped = 0;

    for (const product of products) {
      const [instance, wasCreated] = await ProductModel.findOrCreate({
        where: { name: product.name, brand: product.brand },
        defaults: product,
      });

      if (wasCreated) created++;
      else skipped++;
    }

    console.log(`Seeding complete: ${created} inserted, ${skipped} skipped (already existed).`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};