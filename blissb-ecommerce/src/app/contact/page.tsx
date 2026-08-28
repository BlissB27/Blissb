import { ContactContent } from "./ContactContent";
import { getFaqs } from "@/services/faqs";

export default async function ContactPage() {
  const faqs = await getFaqs();
  return <ContactContent faqs={faqs} />;
}
