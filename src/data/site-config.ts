export const RESTAURANT = {
  name: "Grill & Chill",
  phone: "+918980356776",
  displayPhone: "89803 56776",
  email: "grillandchill4321@gmail.com",
  instagram: "https://www.instagram.com/grill.and.chill_/",
  mapsLink: "https://www.google.com/maps/place/Grill+%26+Chill/@21.1582976,72.770642,14z/data=!4m6!3m5!1s0x3be0527f87e48501:0xcce1104d05e07735!8m2!3d21.146208!4d72.759325!16s%2Fg%2F11c6t0k6d4?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D",
  location: "Surat",
  address: "Besides dumas resort, near V R mall circle, new magdalla road, Magdalla, Surat, Gujarat 395007",
  timings: "11 AM – 11 PM (Everyday)",
  timingsDisplay: "Open: 11 AM – 11 PM",
  est: "EST. 2019",
  whatsappMessage: "Hi, I want to order from Grill & Chill"
};

export const RESTAURANT_PHONE_DIGITS = RESTAURANT.phone.replace(/\D/g, '');
export const RESTAURANT_WHATSAPP_LINK = `https://wa.me/${RESTAURANT_PHONE_DIGITS}?text=${encodeURIComponent(RESTAURANT.whatsappMessage)}`;
export const RESTAURANT_PHONE_LINK = `tel:${RESTAURANT.phone}`;
export const RESTAURANT_EMAIL_LINK = `mailto:${RESTAURANT.email}`;
