import { strapiGet } from '@/lib/strapi';
import { RichText, blocksToPlainText } from '@/components/RichText';
import type { FaqEntry } from '@/components/Faq';

const FAQ_POPULATE = { sort: 'order:asc' };

// FAQs editables desde Strapi (colección "FAQ", respuesta en rich text para
// poder incluir enlaces como mailto:). Si el content-type no existe o está
// vacío, devuelve [] y el componente FAQ usa su contenido por defecto.
export async function getFaqs(): Promise<FaqEntry[]> {
  try {
    const res: any = await strapiGet('/faqs', FAQ_POPULATE);
    return (res?.data || [])
      .filter((f: any) => f?.question && Array.isArray(f?.answer) && f.answer.length > 0)
      .map((f: any) => ({
        question: f.question,
        answer: <RichText content={f.answer} />,
        answerText: blocksToPlainText(f.answer),
      }));
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}
