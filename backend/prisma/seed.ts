import { PrismaClient, CarCategory, FuelType, TransmissionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORY_MAP: Record<string, CarCategory> = {
  Luxury: 'LUXURY',
  Electric: 'ELECTRIC',
  Sports: 'SEDAN',
  SUV: 'SUV',
  Economy: 'HATCHBACK',
  Van: 'VAN',
};

const FUEL_MAP: Record<string, FuelType> = {
  Petrol: 'PETROL',
  Diesel: 'DIESEL',
  Electric: 'ELECTRIC',
  Hybrid: 'HYBRID',
};

const TRANSMISSION_MAP: Record<string, TransmissionType> = {
  Automatic: 'AUTOMATIC',
  Manual: 'MANUAL',
};

const fleet = [
  {
    name: 'BMW 5 Series', brand: 'BMW', category: 'Luxury', year: 2023, price: 120, priceWeek: 700,
    rating: 4.8, reviews: 124, seats: 5, doors: 4, transmission: 'Automatic', fuel: 'Petrol',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80',
      'https://images.unsplash.com/photo-1617469767053-8f19eab68ac6?w=800&q=80',
    ],
    location: 'Accra', available: true,
    description: 'Experience luxury and performance with the BMW 5 Series. This premium sedan combines athletic performance with refined comfort, making every journey exceptional.',
  },
  {
    name: 'Tesla Model 3', brand: 'Tesla', category: 'Electric', year: 2024, price: 95, priceWeek: 550,
    rating: 4.9, reviews: 231, seats: 5, doors: 4, transmission: 'Automatic', fuel: 'Electric',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
      'https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=800&q=80',
      'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?w=800&q=80',
    ],
    location: 'Kumasi', available: true,
    description: 'The future of driving is here. Tesla Model 3 offers zero emissions, cutting-edge technology, and exhilarating performance in a sleek, minimalist package.',
  },
  {
    name: 'Porsche 911', brand: 'Porsche', category: 'Sports', year: 2024, price: 250, priceWeek: 1500,
    rating: 5.0, reviews: 87, seats: 4, doors: 2, transmission: 'Automatic', fuel: 'Petrol',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
      'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80',
    ],
    location: 'Takoradi', available: true,
    description: 'Iconic. Thrilling. Timeless. The Porsche 911 delivers an unmatched driving experience that has captivated enthusiasts for over 60 years.',
  },
  {
    name: 'Range Rover Sport', brand: 'Land Rover', category: 'SUV', year: 2023, price: 175, priceWeek: 1000,
    rating: 4.7, reviews: 156, seats: 7, doors: 5, transmission: 'Automatic', fuel: 'Diesel',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c3feb3a81?w=800&q=80',
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&q=80',
    ],
    location: 'Tema', available: true,
    description: 'Dominate any terrain in absolute luxury. The Range Rover Sport combines imposing presence with world-class comfort and capability.',
  },
  {
    name: 'Mercedes-Benz E-Class', brand: 'Mercedes-Benz', category: 'Luxury', year: 2024, price: 145, priceWeek: 840,
    rating: 4.8, reviews: 198, seats: 5, doors: 4, transmission: 'Automatic', fuel: 'Petrol',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    ],
    location: 'Accra', available: false,
    description: 'The pinnacle of automotive elegance. The Mercedes-Benz E-Class redefines what it means to travel in comfort and style.',
  },
  {
    name: 'Audi RS7', brand: 'Audi', category: 'Sports', year: 2024, price: 220, priceWeek: 1280,
    rating: 4.9, reviews: 73, seats: 5, doors: 4, transmission: 'Automatic', fuel: 'Petrol',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    ],
    location: 'Sekondi', available: true,
    description: 'A four-door supercar. The Audi RS7 blurs the line between family hauler and performance machine with stunning design and brutal power.',
  },
  {
    name: 'Toyota Corolla', brand: 'Toyota', category: 'Economy', year: 2024, price: 45, priceWeek: 270,
    rating: 4.6, reviews: 312, seats: 5, doors: 4, transmission: 'Automatic', fuel: 'Petrol',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&q=80',
      'https://images.unsplash.com/photo-1627454820692-c52266015477?w=800&q=80',
    ],
    location: 'Accra', available: true,
    description: 'Reliable and economical. The Toyota Corolla is perfect for budget-conscious travelers who value reliability and fuel efficiency.',
  },
  {
    name: 'Honda Civic', brand: 'Honda', category: 'Economy', year: 2023, price: 50, priceWeek: 300,
    rating: 4.7, reviews: 287, seats: 5, doors: 4, transmission: 'Manual', fuel: 'Petrol',
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3422964/pexels-photo-3422964.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    location: 'Kumasi', available: true,
    description: 'Sporty and fun to drive. The Honda Civic combines practicality with engaging driving dynamics at an affordable price.',
  },
  {
    name: 'Hyundai i20', brand: 'Hyundai', category: 'Economy', year: 2024, price: 40, priceWeek: 240,
    rating: 4.5, reviews: 198, seats: 5, doors: 4, transmission: 'Automatic', fuel: 'Petrol',
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/3422964/pexels-photo-3422964.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    location: 'Tema', available: true,
    description: 'Smart and efficient. The Hyundai i20 is ideal for city driving with modern styling and exceptional fuel economy.',
  },
  {
    name: 'Honda Odyssey', brand: 'Honda', category: 'Van', year: 2024, price: 85, priceWeek: 510,
    rating: 4.8, reviews: 156, seats: 7, doors: 4, transmission: 'Automatic', fuel: 'Petrol',
    image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
    ],
    location: 'Takoradi', available: true,
    description: 'Perfect for family trips. The Honda Odyssey offers comfort, space, and reliability for up to 7 passengers.',
  },
  {
    name: 'Chrysler Pacifica', brand: 'Chrysler', category: 'Van', year: 2024, price: 95, priceWeek: 570,
    rating: 4.9, reviews: 203, seats: 8, doors: 4, transmission: 'Automatic', fuel: 'Petrol',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
    ],
    location: 'Sekondi', available: true,
    description: 'The ultimate family vehicle. The Chrysler Pacifica combines luxury, technology, and space for unforgettable journeys.',
  },
  {
    name: 'Toyota Sienna', brand: 'Toyota', category: 'Van', year: 2024, price: 80, priceWeek: 480,
    rating: 4.7, reviews: 167, seats: 7, doors: 4, transmission: 'Automatic', fuel: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
      'https://images.unsplash.com/photo-1533473359331-35a97e5a50d3?w=800&q=80',
    ],
    location: 'Cape Coast', available: true,
    description: 'Eco-friendly family van. The Toyota Sienna offers hybrid efficiency without compromising on space and comfort.',
  },
];

const sparePartsSeed = [
  { name: 'Air Filter', category: 'Engine', brand: 'Bosch', price: 450, image: 'https://images.unsplash.com/photo-1488092049451-1a4f4a6f2b7b?w=400&q=80', description: 'Premium engine air filter for all vehicle types', quantity: 50, rating: 4.5, reviews: 23 },
  { name: 'Oil Filter', category: 'Engine', brand: 'Mann Filter', price: 350, image: 'https://images.unsplash.com/photo-1601584942957-c4d77ef3b1d0?w=400&q=80', description: 'High-quality oil filter with advanced filtration', quantity: 75, rating: 4.7, reviews: 45 },
  { name: 'Spark Plugs Set', category: 'Engine', brand: 'NGK', price: 550, image: 'https://images.unsplash.com/photo-1581092160562-40fed08a0db1?w=400&q=80', description: 'Set of 4 spark plugs for optimal engine performance', quantity: 40, rating: 4.8, reviews: 67 },
  { name: 'Timing Belt', category: 'Engine', brand: 'Gates', price: 1200, image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&q=80', description: 'Heavy-duty timing belt for engine synchronization', quantity: 25, rating: 4.6, reviews: 34 },
  { name: 'Fuel Pump', category: 'Engine', brand: 'Pierburg', price: 1800, image: 'https://images.unsplash.com/photo-1531746790731-6c087642384e?w=400&q=80', description: 'Electric fuel pump with pressure regulator', quantity: 0, rating: 4.4, reviews: 28 },
  { name: 'Brake Pads Set', category: 'Brakes', brand: 'Akebono', price: 650, image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&q=80', description: 'Complete brake pad set for front or rear', quantity: 60, rating: 4.9, reviews: 89 },
  { name: 'Brake Rotors Pair', category: 'Brakes', brand: 'Brembo', price: 950, image: 'https://images.unsplash.com/photo-1556838221-8b0552f839b0?w=400&q=80', description: 'Premium brake rotors with ventilation', quantity: 35, rating: 4.8, reviews: 56 },
  { name: 'Brake Fluid 1L', category: 'Brakes', brand: 'Castrol', price: 250, image: 'https://images.unsplash.com/photo-1596178065887-8f03268e3ca8?w=400&q=80', description: 'DOT 4 brake fluid for hydraulic systems', quantity: 100, rating: 4.7, reviews: 42 },
  { name: 'Brake Caliper', category: 'Brakes', brand: 'TRW', price: 1500, image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80', description: 'Replacement brake caliper assembly', quantity: 20, rating: 4.6, reviews: 31 },
  { name: 'Shock Absorber', category: 'Suspension', brand: 'KYB', price: 850, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80', description: 'Gas-filled shock absorber for smooth ride', quantity: 45, rating: 4.7, reviews: 52 },
  { name: 'Strut Assembly', category: 'Suspension', brand: 'Monroe', price: 1200, image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&q=80', description: 'Complete strut assembly with spring', quantity: 30, rating: 4.8, reviews: 48 },
  { name: 'Spring Set', category: 'Suspension', brand: 'Eibach', price: 750, image: 'https://images.unsplash.com/photo-1580619775073-fbb9ff1243ca?w=400&q=80', description: 'High-performance suspension springs', quantity: 40, rating: 4.6, reviews: 38 },
  { name: 'Car Battery 12V', category: 'Electrical', brand: 'Exide', price: 1100, image: 'https://images.unsplash.com/photo-1518127846-8125081c8754?w=400&q=80', description: '12V car battery with high starting power', quantity: 55, rating: 4.8, reviews: 78 },
  { name: 'Alternator', category: 'Electrical', brand: 'Denso', price: 1400, image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80', description: 'Alternator for vehicle electrical system', quantity: 25, rating: 4.7, reviews: 41 },
  { name: 'Starter Motor', category: 'Electrical', brand: 'Bosch', price: 1250, image: 'https://images.unsplash.com/photo-1581092918049-8affa5ce7f0f?w=400&q=80', description: 'Heavy-duty starter motor', quantity: 20, rating: 4.6, reviews: 35 },
  { name: 'Radiator', category: 'Cooling', brand: 'Valeo', price: 950, image: 'https://images.unsplash.com/photo-1581092160562-40fed08a0db1?w=400&q=80', description: 'Aluminum radiator for engine cooling', quantity: 18, rating: 4.7, reviews: 33 },
  { name: 'Water Pump', category: 'Cooling', brand: 'Impco', price: 800, image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80', description: 'Engine water pump for coolant circulation', quantity: 32, rating: 4.8, reviews: 47 },
  { name: 'Thermostat', category: 'Cooling', brand: 'Wahler', price: 350, image: 'https://images.unsplash.com/photo-1581092162392-8c6d1ce30842?w=400&q=80', description: 'Engine thermostat for temperature control', quantity: 60, rating: 4.5, reviews: 29 },
];

const towingVehiclesSeed = [
  {
    name: 'Heavy Duty Tow Truck', brand: 'Volvo', tag: 'Premium', towCapacity: '25 Tons', price: 2500,
    image: 'https://images.unsplash.com/photo-1581092161562-40fed08a0db1?w=800&q=80',
    description: 'Professional heavy-duty tow truck capable of towing up to 25 tons. Equipped with advanced hydraulic systems and safety features for secure vehicle recovery.',
    operator: 'John Mensah', phone: '0547123456', experience: '12 years', rating: 4.9, reviews: 156, location: 'Accra',
  },
  {
    name: 'Light Duty Flatbed', brand: 'Isuzu', tag: 'Economy', towCapacity: '5 Tons', price: 1200,
    image: 'https://images.unsplash.com/photo-1581092156562-40fed08a0db1?w=800&q=80',
    description: 'Reliable light-duty flatbed tow truck perfect for local towing and vehicle recovery. Ideal for smaller vehicles and shorter distances.',
    operator: 'Samuel Owusu', phone: '0245987654', experience: '8 years', rating: 4.7, reviews: 98, location: 'Kumasi',
  },
];

async function main() {
  // ---- Users ----
  const admin = await prisma.user.upsert({
    where: { email: 'admin@amkmotors.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'AMK',
      email: 'admin@amkmotors.com',
      phone: '+233 20 000 0000',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
      status: 'ACTIVE',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@amkmotors.com' },
    update: {},
    create: {
      firstName: 'Staff',
      lastName: 'AMK',
      email: 'staff@amkmotors.com',
      phone: '+233 20 111 1111',
      password: await bcrypt.hash('Staff@123', 10),
      role: 'EMPLOYEE',
      isVerified: true,
      isActive: true,
      status: 'ACTIVE',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      firstName: 'Demo',
      lastName: 'Customer',
      email: 'demo@example.com',
      phone: '+233 24 555 1234',
      password: await bcrypt.hash('demo1234', 10),
      role: 'CUSTOMER',
      isVerified: true,
      isActive: true,
      status: 'ACTIVE',
    },
  });

  // ---- Cars ----
  for (const car of fleet) {
    const existing = await prisma.car.findFirst({ where: { model: car.name } });
    if (existing) continue;

    const created = await prisma.car.create({
      data: {
        brand: car.brand,
        model: car.name,
        year: car.year,
        fuelType: FUEL_MAP[car.fuel] ?? 'PETROL',
        transmission: TRANSMISSION_MAP[car.transmission] ?? 'AUTOMATIC',
        color: 'Black',
        plateNumber: `AMK-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        vin: `VIN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        seats: car.seats,
        doors: car.doors,
        airConditioning: true,
        gps: true,
        bluetooth: true,
        dailyPrice: car.price,
        weeklyPrice: car.priceWeek,
        monthlyPrice: Math.round(car.priceWeek * 4.2),
        deposit: Math.round(car.price * 2),
        mileage: 'Unlimited',
        description: car.description,
        location: car.location,
        status: car.available ? 'AVAILABLE' : 'MAINTENANCE',
        category: CATEGORY_MAP[car.category] ?? 'SEDAN',
        mainImage: car.image,
        rating: car.rating,
        totalReviews: car.reviews,
        images: {
          create: car.images.map((url, i) => ({
            imageUrl: url,
            isMain: i === 0,
            order: i,
          })),
        },
      },
    });

    // ---- Bookings for demo customer ----
    if (car.name === 'BMW 5 Series') {
      const start = new Date();
      start.setDate(start.getDate() + 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 3);

      await prisma.booking.create({
        data: {
          bookingNumber: 'BK-100001',
          customerId: customer.id,
          carId: created.id,
          pickupLocation: 'Accra - Osu',
          returnLocation: 'Accra - Osu',
          pickupDate: start,
          returnDate: end,
          pickupTime: '10:00',
          returnTime: '16:00',
          insurance: true,
          driverRequired: false,
          numberOfDrivers: 1,
          totalPrice: car.price * 3 + 50,
          deposit: car.price * 2,
          tax: 0,
          discount: 0,
          paymentStatus: 'COMPLETED',
          bookingStatus: 'CONFIRMED',
          payment: {
            create: {
              transactionId: `TXN-SEED-001`,
              userId: customer.id,
              amount: car.price * 3 + 50,
              currency: 'GHS',
              status: 'COMPLETED',
              method: 'MOBILE_MONEY',
              receiptNumber: 'RCP-SEED-001',
              paidAt: new Date(),
            },
          },
        },
      });
    }
  }

  // ---- Spare Parts ----
  for (const part of sparePartsSeed) {
    const existing = await prisma.sparePart.findFirst({ where: { name: part.name, deletedAt: null } });
    if (existing) continue;

    await prisma.sparePart.create({
      data: {
        name: part.name,
        category: part.category,
        brand: part.brand,
        price: part.price,
        currency: 'GHS',
        image: part.image,
        description: part.description,
        quantity: part.quantity,
        inStock: part.quantity > 0,
        rating: part.rating,
        totalReviews: part.reviews,
      },
    });
  }

  // ---- Towing Vehicles ----
  for (const vehicle of towingVehiclesSeed) {
    const existing = await prisma.towingVehicle.findFirst({ where: { name: vehicle.name, deletedAt: null } });
    if (existing) continue;

    await prisma.towingVehicle.create({
      data: {
        brand: vehicle.brand,
        name: vehicle.name,
        tag: vehicle.tag,
        towCapacity: vehicle.towCapacity,
        price: vehicle.price,
        currency: 'GHS',
        image: vehicle.image,
        description: vehicle.description,
        operator: vehicle.operator,
        phone: vehicle.phone,
        experience: vehicle.experience,
        rating: vehicle.rating,
        totalReviews: vehicle.reviews,
        available: true,
        location: vehicle.location,
      },
    });
  }

  // ---- Coupons ----
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      maxUses: 500,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  console.log('Seed completed successfully');
  console.log(`  Admin:     admin@amkmotors.com / Admin@123`);
  console.log(`  Staff:     staff@amkmotors.com / Staff@123`);
  console.log(`  Customer:  demo@example.com / demo1234`);
  console.log(`  Coupon:    WELCOME10`);
  console.log(`  Admin id:  ${admin.id}`);
  console.log(`  Staff id:  ${staff.id}`);
  console.log(`  Customer id: ${customer.id}`);
}

main()
  .catch(e => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
