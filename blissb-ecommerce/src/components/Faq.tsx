'use client'
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { WaveDivider } from "./WaveDivider";
import { motion } from "framer-motion";

const FAQ_DATA = [
  {
    question: "How do I place an order?",
    answer: "Orders can be placed online through our website from Tuesday to Friday. Just add your favorite treats to your cart and check out! Please note: there's a minimum of 6 cookies per order."
  },
  {
    question: "When will my order ship?",
    answer: "We ship every Monday to ensure freshness and quality. Make sure to place your order before the shipping cutoff to get it in time!"
  },
  {
    question: "Do you offer same-day orders or local delivery?",
    answer: "We currently do not offer same-day orders or local delivery. All orders are made fresh and shipped straight to your door anywhere in the USA."
  },
  {
    question: "Can I pick up my order?",
    answer: "Yes! Pickup is available in Braselton, GA 30517. Once your order is confirmed, you'll receive pickup instructions by email."
  },
  {
    question: "What happens if I miss my pickup?",
    answer: "Please email us at blissbdesserts@gmail.com and we'll do our best to help."
  },
  {
    question: "How long do the cookies stay fresh?",
    answer: "Our cookies are made with premium, fresh ingredients and no preservatives. They stay fresh for up to 5 days in a sealed container at room temperature. Do not refrigerate. For a soft and gooey texture, microwave for 5–10 seconds, or reheat briefly in a preheated oven."
  },
  {
    question: "Are your products made fresh?",
    answer: "Yes! All of our desserts are baked to order using premium ingredients, with no preservatives or artificial additives. We're committed to delivering the best flavor and quality in every bite."
  },
  {
    question: "Do you offer catering for events?",
    answer: "Absolutely! We cater for weddings, business events, birthdays, baby showers, and more. Fill out the Catering Request Form on our website at least 2 weeks before your event, and we'll respond within 2 business days."
  },
  {
    question: "Can I customize my order?",
    answer: "We do not offer custom options for individual treats, but customization is available for catering orders."
  },
  {
    question: "Do you accept collaborations or work with businesses?",
    answer: "Yes! We welcome wholesale inquiries and creative collaborations. Reach out to us at blissbdesserts@gmail.com."
  },
  {
    question: "Do your products contain allergens?",
    answer: "Our desserts are made with ingredients like wheat, dairy, eggs, soy, and nuts. While we do our best to avoid cross-contamination, all items are made in the same kitchen using shared equipment. If you have a severe allergy, please consider this before ordering."
  }
];

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`border border-[#C08552] overflow-hidden bg-white shadow-sm mb-4 transition-all duration-300 ${
      isOpen ? 'rounded-2xl' : 'rounded-full'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#C08552]/5 transition-colors"
      >
        <span className="font-medium text-[#C08552] text-sm md:text-base">
          {question}
        </span>
        <div className="ml-4 flex-shrink-0">
          <div className="w-8 h-8 bg-[#C08552] rounded-full flex items-center justify-center">
            {isOpen ? (
              <Minus className="w-4 h-4 text-white" />
            ) : (
              <Plus className="w-4 h-4 text-white" />
            )}
          </div>
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-4">
          <p className="text-[#6E5B4E] text-sm md:text-base leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (

    <>
    <section className="bg-[#F8F4F0] py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-[#C08552] mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Primera columna */}
          <div>
            {FAQ_DATA.slice(0, 6).map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openItems.includes(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>

          {/* Segunda columna */}
          <div>
            {FAQ_DATA.slice(6).map((faq, index) => (
              <FAQItem
                key={index + 6}
                question={faq.question}
                answer={faq.answer}
                isOpen={openItems.includes(index + 6)}
                onToggle={() => toggleItem(index + 6)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
    <WaveDivider direction="top" color="#F8F4F0" className="absolute bottom-0 left-0 right-0"/>
    </>
  );
}