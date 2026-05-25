const RESTAURANT = {
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

const RESTAURANT_PHONE_DIGITS = RESTAURANT.phone.replace(/\D/g, '');
const RESTAURANT_WHATSAPP_LINK = `https://wa.me/${RESTAURANT_PHONE_DIGITS}?text=${encodeURIComponent(RESTAURANT.whatsappMessage)}`;
const RESTAURANT_PHONE_LINK = `tel:${RESTAURANT.phone}`;

function applyRestaurantConfig() {
  document.querySelectorAll('[data-restaurant-link="whatsapp"]').forEach(anchor => {
    anchor.href = RESTAURANT_WHATSAPP_LINK;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";

    if (anchor.dataset.overrideText) {
      anchor.textContent = anchor.dataset.overrideText;
    } else if (/^whatsapp$/i.test(anchor.textContent.trim()) || anchor.textContent.trim() === "") {
      anchor.textContent = "Chat on WhatsApp";
    }
  });

  document.querySelectorAll('[data-restaurant-link="phone"]').forEach(anchor => {
    anchor.href = RESTAURANT_PHONE_LINK;

    if (anchor.dataset.overrideText) {
      anchor.textContent = anchor.dataset.overrideText;
    }
  });

  document.querySelectorAll('[data-restaurant-text="phone"]').forEach(el => {
    el.textContent = RESTAURANT.displayPhone;
  });

  document.querySelectorAll('[data-restaurant-link="email"]').forEach(anchor => {
    anchor.href = `mailto:${RESTAURANT.email}`;
  });
  document.querySelectorAll('[data-restaurant-text="email"]').forEach(el => {
    el.textContent = RESTAURANT.email;
  });

  document.querySelectorAll('[data-restaurant-link="instagram"]').forEach(anchor => {
    anchor.href = RESTAURANT.instagram;
  });
  document.querySelectorAll('[data-restaurant-link="maps"]').forEach(anchor => {
    anchor.href = RESTAURANT.mapsLink;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";

    if (anchor.dataset.overrideText) {
      anchor.textContent = anchor.dataset.overrideText;
    } else if (/^view location$/i.test(anchor.textContent.trim()) || anchor.textContent.trim() === "") {
      anchor.textContent = "View Location";
    }
  });
  document.querySelectorAll('[data-restaurant-text="timings"]').forEach(el => {
    el.textContent = RESTAURANT.timingsDisplay;
  });
  document.querySelectorAll('[data-restaurant-text="est"]').forEach(el => {
    el.textContent = RESTAURANT.est;
  });
  document.querySelectorAll('[data-restaurant-text="location"]').forEach(el => {
    el.textContent = RESTAURANT.location;
  });
  document.querySelectorAll('[data-restaurant-text="address"]').forEach(el => {
    el.textContent = RESTAURANT.address;
  });
}

document.addEventListener("DOMContentLoaded", applyRestaurantConfig);
