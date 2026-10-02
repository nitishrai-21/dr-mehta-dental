export const clinic = {
  name: "Dr. Mehta Dental",

  location: "Bengaluru, Karnataka",

  phone: "+91 80 1234 5678",

  hours: {
    days: "Monday through Saturday",
    open: "9 AM",
    close: "7 PM",
  },

  services: [
    {
      id: "general-dentistry",
      title: "General Dentistry",
      price: "From ₹800",
      startingPrice: 800,
    },
    {
      id: "cosmetic-dentistry",
      title: "Cosmetic Dentistry",
      price: "From ₹3,000",
      startingPrice: 3000,
    },
    {
      id: "dental-implants",
      title: "Dental Implants",
      price: "From ₹25,000",
      startingPrice: 25000,
    },
    {
      id: "preventive-care",
      title: "Preventive Care",
      price: "From ₹1,000",
      startingPrice: 1000,
    },
    {
      id: "orthodontics",
      title: "Orthodontics",
      price: "From ₹30,000",
      startingPrice: 30000,
    },
    {
      id: "emergency-appointments",
      title: "Emergency Appointments",
      price: "From ₹700",
      startingPrice: 700,
    },
  ],

  consultation: {
    name: "Dental Consultation",
    price: "₹500",
    numericPrice: 500,
    description:
      "Initial consultation, discussion of concerns, and dental examination.",
  },

  appointment: {
    booking: "Visitors can request an appointment using the form at #contact.",
    confirmation:
      "The clinic team contacts patients to confirm an appointment time.",
  },

  firstVisit: {
    description:
      "A first visit includes a conversation about the patient's concerns, an examination, and recommendations from the dentist.",
  },
} as const;
