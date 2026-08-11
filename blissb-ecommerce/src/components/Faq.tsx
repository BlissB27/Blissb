'use client';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { WaveDivider } from './WaveDivider';
import { JsonLd } from '@/components/JsonLd';
import { buildFaqJsonLd } from '@/lib/jsonLd';

// `answerText` is the plain-text answer for the FAQPage structured data — only
// needed when `answer` is JSX (e.g. contains an email link); string answers
// already double as their own schema text.
export type FaqEntry = { question: string; answer: React.ReactNode; answerText?: string };

const EMAIL_LINK = (
  <a href="mailto:blissbdesserts@gmail.com" className="font-bold text-brand-brown">
    blissbdesserts@gmail.com
  </a>
);

export const FAQ_DATA: FaqEntry[] = [
  {
    question: 'How do I place an order?',
    answer:
      "Orders can be placed online through our website from Tuesday to Friday. Just add your favorite treats to your cart and check out! Please note: there's a minimum of 4 cookies per order.",
  },
  {
    question: 'When will my order ship?',
    answer:
      'We ship every Monday to ensure freshness and quality. Make sure to place your order before the shipping cutoff to get it in time!',
  },
  {
    question: 'Can I get same-day delivery or pickup?',
    answer:
      'Yes! Order Tuesday–Friday before 2:00pm for same-day local delivery (2pm–6pm) or same-day pickup (6pm–8pm). Order after 2:00pm and it rolls to the next available day. Saturday is pickup-only at the Suwanee Farmers Market, 8am–12pm.',
  },
  {
    question: 'How much does delivery cost?',
    answer:
      "Delivery pricing is calculated automatically at checkout based on the distance between our kitchen and your address — you'll see the exact fee before you pay.",
  },
  {
    question: 'Can I pick up my order?',
    answer:
      "Yes! Once your order is confirmed, you'll receive pickup instructions and our address by email.",
  },
  {
    question: 'What happens if I miss my pickup?',
    answer: <>Please email us at {EMAIL_LINK} and we&apos;ll do our best to help.</>,
    answerText: "Please email us at blissbdesserts@gmail.com and we'll do our best to help.",
  },
  {
    question: 'How long do the cookies stay fresh?',
    answer:
      'Our cookies are made with premium, fresh ingredients and no preservatives. They stay fresh for up to 5 days in a sealed container at room temperature. Do not refrigerate. For a soft and gooey texture, microwave for 5–10 seconds, or reheat briefly in a preheated oven.',
  },
  {
    question: 'Are your products made fresh?',
    answer:
      "Yes! All of our desserts are baked to order using premium ingredients, with no preservatives or artificial additives. We're committed to delivering the best flavor and quality in every bite.",
  },
  {
    question: 'Do you offer catering for events?',
    answer:
      'Absolutely! We cater for weddings, business events, birthdays, baby showers, and more. Use the "Request a Catering Quote" button on our Contact page at least 2 weeks before your event, and we\'ll respond within 2 business days.',
  },
  {
    question: 'Can I customize my order?',
    answer: 'We don\'t offer full customization, but every cake can be finished with a short message in chocolate, a name, a date, or a simple "Happy Birthday", and corporate gift cookies can carry your company\'s logo.',
  },
  {
    question: 'Do you work with other businesses?',
    answer: <>Yes! We welcome wholesale inquiries and creative collaborations. Reach out to us at {EMAIL_LINK}.</>,
    answerText: 'Yes! We welcome wholesale inquiries and creative collaborations. Reach out to us at blissbdesserts@gmail.com.',
  },
  {
    question: 'Do your products contain allergens?',
    answer:
      'Our desserts are made with ingredients like wheat, dairy, eggs, soy, and nuts. While we do our best to avoid cross-contamination, all items are made in the same kitchen using shared equipment. If you have a severe allergy, please consider this before ordering.',
  },
];

type FaqProps = {
  items?: FaqEntry[];
  /** Show only the first N entries — used to keep a secondary surface (e.g. Contact) concise. */
  limit?: number;
  title?: string;
  withWaveDivider?: boolean;
  className?: string;
};

function FaqColumn({ entries }: { entries: FaqEntry[] }) {
  return (
    <Accordion type="multiple" className="space-y-3">
      {entries.map((faq) => (
        <AccordionItem
          key={faq.question}
          value={faq.question}
          className="rounded-2xl border border-brand-border bg-white px-6 shadow-sm"
        >
          <AccordionTrigger className="text-brand-text font-medium text-sm md:text-base hover:no-underline [&>svg]:text-brand-brown">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-brand-muted text-sm md:text-base leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function FAQ({
  items = FAQ_DATA,
  limit,
  title = 'Frequently Asked Questions',
  withWaveDivider = true,
  className,
}: FaqProps) {
  const entries = limit ? items.slice(0, limit) : items;
  const midpoint = Math.ceil(entries.length / 2);
  const leftColumn = entries.slice(0, midpoint);
  const rightColumn = entries.slice(midpoint);

  // FAQPage structured data for the questions actually shown on this surface.
  const schemaEntries = entries
    .map((faq) => ({
      question: faq.question,
      answerText: faq.answerText ?? (typeof faq.answer === 'string' ? faq.answer : ''),
    }))
    .filter((faq) => faq.answerText.length > 0);

  return (
    <section className={`relative bg-[#ffeccf] py-16 pb-24 ${className ?? ''}`}>
      {schemaEntries.length > 0 && <JsonLd data={buildFaqJsonLd(schemaEntries)} />}
      {withWaveDivider && <WaveDivider direction="top" color="#FFFFFF" className="absolute top-0 left-0 right-0" />}

      <div className={`mx-auto max-w-5xl px-4 ${withWaveDivider ? 'my-8 md:my-10' : ''}`}>
        <h2 className="text-center text-3xl md:text-4xl font-bold text-brand-brown mb-12">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <FaqColumn entries={leftColumn} />
          {rightColumn.length > 0 && <FaqColumn entries={rightColumn} />}
        </div>
      </div>

      {withWaveDivider && <WaveDivider direction="bottom" color="#5C3319" className="absolute bottom-0 left-0 right-0" />}
    </section>
  );
}
