export interface Service {
  id: number;
  title: string;
  regularPrice: number;
  membershipPrice: number;
  image: string;
  description: string;
  category?: string;
}

export const services: Service[] = [
  {
    id: 1,
    title: "Cleaning of the house and apartment",
    regularPrice: 36,
    membershipPrice: 18,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Professional residential cleaning services for homes and apartments. Comprehensive cleaning including all rooms, bathrooms, and common areas.",
    category: "Residential"
  },
  {
    id: 2,
    title: "Deep Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Comprehensive deep cleaning for thorough sanitization. Perfect for seasonal cleaning or preparing for special events.",
    category: "Specialized"
  },
  {
    id: 3,
    title: "Office Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Professional office and workspace cleaning services. Keep your work environment clean, healthy, and productive.",
    category: "Commercial"
  },
  {
    id: 4,
    title: "Move in & out Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Specialized cleaning for moving in or out of properties. Ensure your new home is spotless or leave your old one pristine.",
    category: "Specialized"
  },
  {
    id: 5,
    title: "Glass and Window Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Professional window and glass surface cleaning. Crystal clear results for both interior and exterior windows.",
    category: "Specialized"
  },
  {
    id: 6,
    title: "Disinfect cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Professional disinfection and sanitization services. Hospital-grade cleaning for maximum safety and hygiene.",
    category: "Specialized"
  },
  {
    id: 7,
    title: "Maid service",
    regularPrice: 36,
    membershipPrice: 18,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Regular maid services for ongoing home maintenance. Reliable, professional cleaning staff for your convenience.",
    category: "Residential"
  },
  {
    id: 8,
    title: "Event cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Post-event cleanup and restoration services. Let us handle the mess while you enjoy your successful event.",
    category: "Commercial"
  },
  {
    id: 9,
    title: "Construction cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9f8ade4888783da5fad4c6fced299ec4bb1a5934?placeholderIfAbsent=true",
    description: "Post-construction cleanup and debris removal. Professional cleaning for newly built or renovated spaces.",
    category: "Industrial"
  },
  {
    id: 10,
    title: "Shop and Store Cleaning",
    regularPrice: 36,
    membershipPrice: 18,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Retail and commercial store cleaning services. Maintain a clean, welcoming environment for your customers.",
    category: "Commercial"
  },
  {
    id: 11,
    title: "Hospital & Practice Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/5071d900-e393-4f87-9302-b297cabf8c60.png",
    description: "A healthy space for healing. Our expert medical cleaning services are designed for hospitals, clinics, and healthcare practices, maintaining a spotless and calm environment.",
    category: "Medical"
  },
  {
    id: 12,
    title: "Pool Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/90024f2c-f5b7-4917-8761-ddb35630d53c.png",
    description: "Clear water. Clean peace of mind. Checks and balances pool chemicals, keeps your pool ready for a swim.",
    category: "Specialized"
  },
  {
    id: 13,
    title: "Housekeeping Services",
    regularPrice: 36,
    membershipPrice: 18,
    image: "/lovable-uploads/837222c4-0f81-4646-a5c6-c7315a0c3202.png",
    description: "Your home deserves consistent, gentle care, just like family. General home cleaning and tidying.",
    category: "Residential"
  },
  {
    id: 14,
    title: "Private Jet & Aircraft Cleaning",
    regularPrice: 75,
    membershipPrice: 42,
    image: "/lovable-uploads/cd3cf549-d113-40ab-95e5-015c4eb6576b.png",
    description: "High-altitude hygiene, done right. Interior seat, floor, and cockpit care. Premium cleaning for luxury transportation.",
    category: "Luxury"
  },
  {
    id: 15,
    title: "Yacht and Ship Cleaning",
    regularPrice: 65,
    membershipPrice: 32,
    image: "/lovable-uploads/db76486a-1783-4ca6-a126-0e0a835eac1e.png",
    description: "Building/deck and interior polishing, saltwater damage removal. Professional care for your watercraft investment.",
    category: "Luxury"
  },
  {
    id: 16,
    title: "Weeds Cutting & Mowing",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/950a2c4d5b8648e07f41bbef91720364c4134ae5?placeholderIfAbsent=true",
    description: "Lawn care, weed removal, and mowing services. Keep your outdoor spaces neat and well-maintained.",
    category: "Outdoor"
  },
  {
    id: 17,
    title: "Industrial Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/63775cf9-1b3d-40f5-8e86-7a30bc35172d.png",
    description: "Simorgh's industrial cleaning service tackles dirt, debris, and heavy build-up in factories, warehouses, and production areas. Grease, oil, and debris removal.",
    category: "Industrial"
  },
  {
    id: 18,
    title: "Hotel Service",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/63d17ca7-9239-4014-8c05-7eb9090ff428.png",
    description: "Let us handle the mess so your guests feel at home. Room turnaround and deep clean, guest-ready standards every time.",
    category: "Commercial"
  },
  {
    id: 19,
    title: "Winter Services",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/950a2c4d5b8648e07f41bbef91720364c4134ae5?placeholderIfAbsent=true",
    description: "Snow removal and winter maintenance services. Keep your property safe and accessible during winter months.",
    category: "Seasonal"
  },
  {
    id: 20,
    title: "Winter garden cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/521f3954-e6c6-4e8c-a3b2-db1700b1bc5f.png",
    description: "Keep your garden clean and tidy, even in winter. Remove fallen leaves and debris, prepares your garden for winter rest.",
    category: "Seasonal"
  },
  {
    id: 21,
    title: "Roof and terrace cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Roof, terrace, and outdoor area cleaning services. Maintain your property's exterior appearance and safety.",
    category: "Outdoor"
  },
  {
    id: 22,
    title: "Residential cleaning",
    regularPrice: 36,
    membershipPrice: 18,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Standard residential home cleaning services. Regular maintenance cleaning for your family home.",
    category: "Residential"
  },
  {
    id: 23,
    title: "Maintenance cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Regular maintenance and upkeep cleaning services. Scheduled cleaning to keep your space consistently clean.",
    category: "Residential"
  },
  {
    id: 24,
    title: "Paving stone cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Pressure washing and paving stone restoration. Restore the original beauty of your outdoor stone surfaces.",
    category: "Outdoor"
  },
  {
    id: 25,
    title: "Parquet cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Specialized parquet and hardwood floor cleaning. Professional care to maintain your premium flooring.",
    category: "Specialized"
  },
  {
    id: 26,
    title: "Facade cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Building facade and exterior wall cleaning. Professional exterior cleaning to enhance your property's curb appeal.",
    category: "Commercial"
  },
  {
    id: 27,
    title: "Caretaker service",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Property caretaking and maintenance services. Comprehensive care for your property while you're away.",
    category: "Commercial"
  },
  {
    id: 28,
    title: "Floor cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Professional floor cleaning and maintenance. Expert care for all types of flooring materials.",
    category: "Specialized"
  },
  {
    id: 29,
    title: "Luxury Villa cleaning and maintenance",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Premium villa cleaning and maintenance services. Luxury cleaning services for discerning homeowners.",
    category: "Luxury"
  },
  {
    id: 30,
    title: "Security Services",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Security and monitoring services for properties. Professional security solutions for peace of mind.",
    category: "Security"
  },
  {
    id: 31,
    title: "Carpet and Rug Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Deep carpet and rug cleaning services. Professional cleaning to restore your carpets and rugs to like-new condition.",
    category: "Specialized"
  },
  {
    id: 32,
    title: "Upholstery Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Furniture and upholstery cleaning services. Professional cleaning to extend the life of your furniture.",
    category: "Specialized"
  },
  {
    id: 33,
    title: "Car Cleaning (Inside and Out)",
    regularPrice: 45,
    membershipPrice: 22,
    image: "/lovable-uploads/d288aed5-5f0f-4c13-8024-b26b0c26a92f.png",
    description: "Complete interior and exterior car detailing. Enjoy a fresh, spotless ride inside and out, like it's brand new.",
    category: "Automotive"
  },
  {
    id: 34,
    title: "Computer & Printer Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Electronic equipment cleaning and maintenance. Professional cleaning to keep your technology running smoothly.",
    category: "Technology"
  },
  {
    id: 35,
    title: "Laundry and Ironing Service",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Professional laundry and ironing services. Fresh, clean, and perfectly pressed clothing and linens.",
    category: "Personal"
  },
  {
    id: 36,
    title: "Kitchen Deep Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "/lovable-uploads/c26855ad-f7bb-4cf4-8c38-a922d86f34cb.png",
    description: "Where clean meets cuisine. Appliance degreasing and sanitizing, cabinet, countertop & sink cleaning.",
    category: "Specialized"
  },
  {
    id: 37,
    title: "Billboard Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Outdoor advertising and billboard cleaning. Keep your advertisements visible and impactful.",
    category: "Commercial"
  },
  {
    id: 38,
    title: "Ventilation and Filter Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/68df079a-338a-4508-94d7-a22437ec21f3.png",
    description: "Breathe Easy with Clean Air. Cleans vents, ducts, and filters. Boosts HVAC efficiency.",
    category: "Technical"
  },
  {
    id: 39,
    title: "Sauna deep cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/17b664a9-1923-4caf-b79e-fdc899421d46.png",
    description: "Wood-safe cleaning and disinfection. Bench, floor & wall treatment.",
    category: "Wellness"
  },
  {
    id: 40,
    title: "Emergency cleaning services 24/7",
    regularPrice: 99,
    membershipPrice: 45,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "24/7 emergency cleaning response services. Immediate professional help when you need it most.",
    category: "Emergency"
  },
  {
    id: 41,
    title: "Mold Removal",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Professional mold remediation and removal. Safe and effective mold elimination for healthier living spaces.",
    category: "Remediation"
  },
  {
    id: 42,
    title: "Pest Control",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9f8ade4888783da5fad4c6fced299ec4bb1a5934?placeholderIfAbsent=true",
    description: "Comprehensive pest control and prevention services. Protect your property from unwanted pests.",
    category: "Pest Control"
  },
  {
    id: 43,
    title: "Janitorial Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "/lovable-uploads/81950838-d5cc-4aec-9e79-3313fc3f95fb.png",
    description: "Keep your space spotless with routine janitorial care. Office and facility upkeep, trash removal and sanitizing.",
    category: "Commercial"
  },
  {
    id: 44,
    title: "Tile Deep Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/c31aaf72-c255-4e3d-bacc-e2eb98585963.png",
    description: "Sparkling Tiles, Healthier Spaces. Grout and tile scrubbing, polishing for a fresh look.",
    category: "Specialized"
  },
  {
    id: 45,
    title: "Commercial Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/b7749772-e75a-4b47-ac92-4629dbf457ed.png",
    description: "A tidy workplace boosts productivity. Workspace and lobby cleaning, high-touch area disinfection.",
    category: "Commercial"
  },
  {
    id: 46,
    title: "Warehouse Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/9798ff63-dd7b-4655-9c35-5e3fa447c9ef.png",
    description: "Keep your warehouse clean and safe. Floor and equipment dusting, safety zone maintenance.",
    category: "Industrial"
  },
  {
    id: 47,
    title: "School & University Hall Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/f65d5033-12e6-48cf-ac44-80914e9e2efd.png",
    description: "Learning in a Clean Space. Hallway and common area cleaning, restroom and locker maintenance.",
    category: "Educational"
  },
  {
    id: 48,
    title: "Sports Center Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/6e54915e-6b92-4236-98b4-68c306f94300.png",
    description: "Play Hard And Stay Clean. Equipment and floor disinfection, locker room and restroom cleaning.",
    category: "Sports"
  },
  {
    id: 49,
    title: "Staircase Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "/lovable-uploads/8ef865af-f8b9-45c5-b20b-e48d7a32578d.png",
    description: "Clean every step, book your Staircase Cleaning today. Dust and debris removal, handrail sanitizing, stain and mark cleaning.",
    category: "Specialized"
  },
  {
    id: 50,
    title: "Airbnb Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "/lovable-uploads/ca8b6d5f-2078-44b7-affd-27463c75bf50.png",
    description: "Five-Star Clean for Every Guest. Fresh linens and supplies, full home turnaround. Quick, thorough cleaning between guests for 5-star reviews.",
    category: "Hospitality"
  }
];

export const serviceCategories = [
  "All Services",
  "Residential", 
  "Commercial", 
  "Specialized", 
  "Industrial", 
  "Medical", 
  "Luxury", 
  "Outdoor", 
  "Seasonal", 
  "Security", 
  "Automotive", 
  "Technology", 
  "Personal", 
  "Emergency", 
  "Remediation", 
  "Pest Control", 
  "Technical", 
  "Wellness", 
  "Educational", 
  "Sports", 
  "Hospitality"
];

export const locations = [
  "New York",
  "Los Angeles", 
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose"
];