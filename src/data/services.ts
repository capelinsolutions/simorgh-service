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
    description: "Professional residential cleaning services for homes and apartments.",
    category: "Residential"
  },
  {
    id: 2,
    title: "Deep Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Comprehensive deep cleaning for thorough sanitization.",
    category: "Specialized"
  },
  {
    id: 3,
    title: "Office Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Professional office and workspace cleaning services.",
    category: "Commercial"
  },
  {
    id: 4,
    title: "Move in & out Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Specialized cleaning for moving in or out of properties.",
    category: "Specialized"
  },
  {
    id: 5,
    title: "Glass and Window Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Professional window and glass surface cleaning.",
    category: "Specialized"
  },
  {
    id: 6,
    title: "Disinfect cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Professional disinfection and sanitization services.",
    category: "Specialized"
  },
  {
    id: 7,
    title: "Maid service",
    regularPrice: 36,
    membershipPrice: 18,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Regular maid services for ongoing home maintenance.",
    category: "Residential"
  },
  {
    id: 8,
    title: "Event cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Post-event cleanup and restoration services.",
    category: "Commercial"
  },
  {
    id: 9,
    title: "Construction cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9f8ade4888783da5fad4c6fced299ec4bb1a5934?placeholderIfAbsent=true",
    description: "Post-construction cleanup and debris removal.",
    category: "Industrial"
  },
  {
    id: 10,
    title: "Shop and Store Cleaning",
    regularPrice: 36,
    membershipPrice: 18,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Retail and commercial store cleaning services.",
    category: "Commercial"
  },
  {
    id: 11,
    title: "Hospital & Practice Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Medical facility cleaning with specialized protocols.",
    category: "Medical"
  },
  {
    id: 12,
    title: "Pool Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Swimming pool maintenance and cleaning services.",
    category: "Specialized"
  },
  {
    id: 13,
    title: "Housekeeping Services",
    regularPrice: 36,
    membershipPrice: 18,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Comprehensive housekeeping and maintenance services.",
    category: "Residential"
  },
  {
    id: 14,
    title: "Private Jet & Aircraft Cleaning",
    regularPrice: 75,
    membershipPrice: 42,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Specialized aircraft and private jet cleaning services.",
    category: "Luxury"
  },
  {
    id: 15,
    title: "Yacht and Ship Cleaning",
    regularPrice: 65,
    membershipPrice: 32,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Marine vessel cleaning and maintenance services.",
    category: "Luxury"
  },
  {
    id: 16,
    title: "Weeds Cutting & Mowing",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/950a2c4d5b8648e07f41bbef91720364c4134ae5?placeholderIfAbsent=true",
    description: "Lawn care, weed removal, and mowing services.",
    category: "Outdoor"
  },
  {
    id: 17,
    title: "Industrial Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9f8ade4888783da5fad4c6fced299ec4bb1a5934?placeholderIfAbsent=true",
    description: "Heavy-duty industrial facility cleaning services.",
    category: "Industrial"
  },
  {
    id: 18,
    title: "Hotel Service",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Hotel and hospitality cleaning services.",
    category: "Commercial"
  },
  {
    id: 19,
    title: "Winter Services",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/950a2c4d5b8648e07f41bbef91720364c4134ae5?placeholderIfAbsent=true",
    description: "Snow removal and winter maintenance services.",
    category: "Seasonal"
  },
  {
    id: 20,
    title: "Winter garden cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/950a2c4d5b8648e07f41bbef91720364c4134ae5?placeholderIfAbsent=true",
    description: "Winter garden and greenhouse cleaning services.",
    category: "Seasonal"
  },
  {
    id: 21,
    title: "Roof and terrace cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Roof, terrace, and outdoor area cleaning services.",
    category: "Outdoor"
  },
  {
    id: 22,
    title: "Residential cleaning",
    regularPrice: 36,
    membershipPrice: 18,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Standard residential home cleaning services.",
    category: "Residential"
  },
  {
    id: 23,
    title: "Maintenance cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Regular maintenance and upkeep cleaning services.",
    category: "Residential"
  },
  {
    id: 24,
    title: "Paving stone cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Pressure washing and paving stone restoration.",
    category: "Outdoor"
  },
  {
    id: 25,
    title: "Parquet cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Specialized parquet and hardwood floor cleaning.",
    category: "Specialized"
  },
  {
    id: 26,
    title: "Facade cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Building facade and exterior wall cleaning.",
    category: "Commercial"
  },
  {
    id: 27,
    title: "Caretaker service",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Property caretaking and maintenance services.",
    category: "Commercial"
  },
  {
    id: 28,
    title: "Floor cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Professional floor cleaning and maintenance.",
    category: "Specialized"
  },
  {
    id: 29,
    title: "Luxury Villa cleaning and maintenance",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Premium villa cleaning and maintenance services.",
    category: "Luxury"
  },
  {
    id: 30,
    title: "Security Services",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Security and monitoring services for properties.",
    category: "Security"
  },
  {
    id: 31,
    title: "Carpet and Rug Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Deep carpet and rug cleaning services.",
    category: "Specialized"
  },
  {
    id: 32,
    title: "Upholstery Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Furniture and upholstery cleaning services.",
    category: "Specialized"
  },
  {
    id: 33,
    title: "Car Cleaning (Inside and Out)",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Complete interior and exterior car detailing.",
    category: "Automotive"
  },
  {
    id: 34,
    title: "Computer & Printer Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Electronic equipment cleaning and maintenance.",
    category: "Technology"
  },
  {
    id: 35,
    title: "Laundry and Ironing Service",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Professional laundry and ironing services.",
    category: "Personal"
  },
  {
    id: 36,
    title: "Kitchen Deep Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Comprehensive kitchen deep cleaning services.",
    category: "Specialized"
  },
  {
    id: 37,
    title: "Billboard Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
    description: "Outdoor advertising and billboard cleaning.",
    category: "Commercial"
  },
  {
    id: 38,
    title: "Ventilation and Filter Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "HVAC system and air filter cleaning services.",
    category: "Technical"
  },
  {
    id: 39,
    title: "Sauna deep cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Specialized sauna cleaning and sanitization.",
    category: "Wellness"
  },
  {
    id: 40,
    title: "Emergency cleaning services 24/7",
    regularPrice: 99,
    membershipPrice: 45,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "24/7 emergency cleaning response services.",
    category: "Emergency"
  },
  {
    id: 41,
    title: "Mold Removal",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Professional mold remediation and removal.",
    category: "Remediation"
  },
  {
    id: 42,
    title: "Pest Control",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9f8ade4888783da5fad4c6fced299ec4bb1a5934?placeholderIfAbsent=true",
    description: "Comprehensive pest control and prevention services.",
    category: "Pest Control"
  },
  {
    id: 43,
    title: "Janitorial Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Professional janitorial and custodial services.",
    category: "Commercial"
  },
  {
    id: 44,
    title: "Tile Deep Cleaning (Horizontal & Vertical)",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Deep cleaning for all types of tile surfaces.",
    category: "Specialized"
  },
  {
    id: 45,
    title: "Commercial Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Comprehensive commercial building cleaning.",
    category: "Commercial"
  },
  {
    id: 46,
    title: "Warehouse Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9f8ade4888783da5fad4c6fced299ec4bb1a5934?placeholderIfAbsent=true",
    description: "Industrial warehouse cleaning services.",
    category: "Industrial"
  },
  {
    id: 47,
    title: "School & University Hall Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Educational facility cleaning and maintenance.",
    category: "Educational"
  },
  {
    id: 48,
    title: "Sports Center Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
    description: "Sports facility and gym cleaning services.",
    category: "Sports"
  },
  {
    id: 49,
    title: "Staircase Cleaning",
    regularPrice: 45,
    membershipPrice: 22,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
    description: "Stairway and staircase cleaning services.",
    category: "Specialized"
  },
  {
    id: 50,
    title: "Airbnb Cleaning",
    regularPrice: 54,
    membershipPrice: 24,
    image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
    description: "Specialized Airbnb and vacation rental cleaning.",
    category: "Hospitality"
  }
];

export const serviceCategories = [
  "All Services",
  "Residential",
  "Commercial", 
  "Industrial",
  "Specialized",
  "Luxury",
  "Emergency",
  "Seasonal",
  "Medical",
  "Outdoor"
];

export const locations = [
  "Manhattan",
  "Malibu",
  "Brooklyn",
  "Queens",
  "Bronx",
  "Staten Island",
  "New Jersey",
  "Connecticut"
];