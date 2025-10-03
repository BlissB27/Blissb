"use client";

const ANNOUNCEMENTS = [
  "Buy 4 Get 1 Free Today Only (Promo code applied at checkout)",
  "Free Shipping on Orders Over $50 - Limited Time Offer",
  "New Flavor Alert: Try Our Red Velvet Cookies Now Available",
  "Custom Cakes Available - Order 48 Hours in Advance",
  "Corporate Catering Services - Perfect for Your Next Event"
];

export function Carrusel() {
  // Duplicamos los anuncios para crear un loop infinito sin saltos
  const duplicatedAnnouncements = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="w-full bg-[#8F4B2B] text-white overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2">
        {duplicatedAnnouncements.map((announcement, index) => (
          <span 
            key={index} 
            className="mx-8 text-[13px] inline-block"
          >
            {announcement}
          </span>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}