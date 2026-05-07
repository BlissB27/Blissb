"use client";

const ANNOUNCEMENTS = [
  "Free delivery in select areas",
  "Cookie & cake carts for events",
  "Corporate cookie boxes",
  "Shipping every Monday",
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