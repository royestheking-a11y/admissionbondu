export const initialCityData = {
    Dhaka: {
        name: "Dhaka",
        lifestyle: {
            budget: { rent: 4500, food: 4000, transport: 1200, utilities: 800 },
            standard: { rent: 7000, food: 6000, transport: 2000, utilities: 1200 },
            premium: { rent: 12000, food: 10000, transport: 3500, utilities: 2000 },
        },
        hostelRent: { min: 4000, max: 8000 },
        privateRent: { min: 6000, max: 15000 },
        description: "Capital city with highest cost of living but most opportunities.",
    },
    Chittagong: {
        name: "Chittagong",
        lifestyle: {
            budget: { rent: 3500, food: 3500, transport: 1000, utilities: 700 },
            standard: { rent: 5500, food: 5000, transport: 1500, utilities: 1000 },
            premium: { rent: 9000, food: 8000, transport: 2500, utilities: 1500 },
        },
        hostelRent: { min: 3500, max: 7000 },
        privateRent: { min: 5000, max: 12000 },
        description: "Port city with moderate living costs and growing opportunities.",
    },
    Sylhet: {
        name: "Sylhet",
        lifestyle: {
            budget: { rent: 3000, food: 3000, transport: 800, utilities: 600 },
            standard: { rent: 4500, food: 4500, transport: 1200, utilities: 900 },
            premium: { rent: 7000, food: 7000, transport: 2000, utilities: 1300 },
        },
        hostelRent: { min: 3000, max: 6000 },
        privateRent: { min: 4000, max: 9000 },
        description: "Tea capital with lower costs and beautiful surroundings.",
    },
    Rajshahi: {
        name: "Rajshahi",
        lifestyle: {
            budget: { rent: 2500, food: 2800, transport: 700, utilities: 500 },
            standard: { rent: 4000, food: 4000, transport: 1000, utilities: 700 },
            premium: { rent: 6500, food: 6000, transport: 1800, utilities: 1100 },
        },
        hostelRent: { min: 2500, max: 5000 },
        privateRent: { min: 3500, max: 8000 },
        description: "Silk city with very affordable living costs.",
    },
    Khulna: {
        name: "Khulna",
        lifestyle: {
            budget: { rent: 2500, food: 2800, transport: 700, utilities: 500 },
            standard: { rent: 4000, food: 4000, transport: 1000, utilities: 700 },
            premium: { rent: 6000, food: 6000, transport: 1800, utilities: 1100 },
        },
        hostelRent: { min: 2500, max: 5000 },
        privateRent: { min: 3500, max: 7000 },
        description: "Industrial city near the Sundarbans with affordable costs.",
    },
    Barisal: {
        name: "Barisal",
        lifestyle: {
            budget: { rent: 2000, food: 2500, transport: 600, utilities: 450 },
            standard: { rent: 3500, food: 3800, transport: 900, utilities: 650 },
            premium: { rent: 6000, food: 5500, transport: 1600, utilities: 1000 },
        },
        hostelRent: { min: 2000, max: 4500 },
        privateRent: { min: 3000, max: 7000 },
        description: "Venice of the East with very affordable living costs and riverine beauty.",
    },
    Rangpur: {
        name: "Rangpur",
        lifestyle: {
            budget: { rent: 2000, food: 2500, transport: 600, utilities: 450 },
            standard: { rent: 3500, food: 3800, transport: 800, utilities: 600 },
            premium: { rent: 5500, food: 5500, transport: 1500, utilities: 900 },
        },
        hostelRent: { min: 2000, max: 4000 },
        privateRent: { min: 3000, max: 6500 },
        description: "Northern divisional city with one of the lowest living costs in Bangladesh.",
    },
    Mymensingh: {
        name: "Mymensingh",
        lifestyle: {
            budget: { rent: 2200, food: 2700, transport: 700, utilities: 500 },
            standard: { rent: 3800, food: 4000, transport: 1000, utilities: 750 },
            premium: { rent: 6500, food: 6000, transport: 1800, utilities: 1200 },
        },
        hostelRent: { min: 2200, max: 5000 },
        privateRent: { min: 3500, max: 8000 },
        description: "Educational hub with moderate living costs and proximity to Dhaka.",
    },
};
export const initialAccomTypes = [
    {
        title: "University Hostel",
        pros: ["Cheapest option", "Campus proximity", "Safe environment", "Meal facilities"],
        cons: ["Limited availability", "Fixed rules", "Less privacy", "Waitlist possible"],
        cost: "2,500–8,000 BDT/month",
        icon: "🏛️",
    },
    {
        title: "Mess / Shared Room",
        pros: ["Affordable", "Flexible", "Shared bills", "Social environment"],
        cons: ["Less privacy", "Shared facilities", "May lack amenities"],
        cost: "3,000–7,000 BDT/month",
        icon: "🏠",
    },
    {
        title: "Private Apartment",
        pros: ["Full privacy", "Own space", "More freedom", "Modern amenities"],
        cons: ["Most expensive", "Utility bills separate", "Security deposit required"],
        cost: "6,000–20,000 BDT/month",
        icon: "🏢",
    },
    {
        title: "Sublet Room",
        pros: ["Furnished options", "Bills included", "Flexible terms"],
        cons: ["Limited control", "Owner on premises", "May be cramped"],
        cost: "4,000–10,000 BDT/month",
        icon: "🛋️",
    },
];
