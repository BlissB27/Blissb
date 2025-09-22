'use client'
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ_DATA = [
  {
    question: "Cookies Care",
    answer: "Our cookies can be kept in their original sealed packaging for up to one week at room temperature. For longer storage, freeze in an airtight container for up to 2 months."
  },
  {
    question: "How can I place an order online?",
    answer: "You can place an order directly through our website by adding items to your cart and proceeding to checkout. We accept all major credit cards and PayPal."
  },
  {
    question: "Do you offer personalized or themed orders?",
    answer: "Yes! We offer custom cookie decorating for special events, corporate gifts, and themed celebrations. Contact us at least 48 hours in advance for custom orders."
  },
  {
    question: "Do you offer home delivery?",
    answer: "We offer local delivery within 25 miles of our bakery. For orders outside this area, we ship nationwide via FedEx with temperature-controlled packaging."
  },
  {
    question: "Promotions & discounts",
    answer: "We regularly offer seasonal promotions and bulk order discounts. Sign up for our newsletter to be the first to know about special offers and new product launches."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Visa, MasterCard, American Express, Discover, PayPal, Apple Pay, and Google Pay. All transactions are processed securely through our encrypted payment system."
  },
  {
    question: "Who can I contact for questions or support?",
    answer: "You can reach our customer service team at support@bliss-b.com or call us at (555) 123-COOKIES. We're available Monday-Friday 9am-6pm EST."
  },
  {
    question: "Others",
    answer: "For any other questions not covered here, please don't hesitate to contact us. We're here to help make your cookie experience as sweet as possible!"
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
    <section className="bg-[#F8F4F0] py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-[#C08552] mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Primera columna */}
          <div>
            {FAQ_DATA.slice(0, 4).map((faq, index) => (
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
            {FAQ_DATA.slice(4).map((faq, index) => (
              <FAQItem
                key={index + 4}
                question={faq.question}
                answer={faq.answer}
                isOpen={openItems.includes(index + 4)}
                onToggle={() => toggleItem(index + 4)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}