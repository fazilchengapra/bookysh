import { getEventsBySegment, type TMEvent } from "@/lib/ticketmaster";
import CustomerHomePageClient from "@/components/customer/CustomerHomePageClient";

export const metadata = {
  title: "Bokysh — Your Tickets to Entertainment",
  description: "Book tickets for latest movies, events, sports and more.",
};

export default async function CustomerHomePage() {
  const safeEvents = async (fn: () => Promise<{ _embedded?: { events?: TMEvent[] } }>) => {
    try {
      const res = await fn();
      return res._embedded?.events ?? [];
    } catch {
      return [] as TMEvent[];
    }
  };

  const sports = await safeEvents(() => getEventsBySegment("Sports", 0, 4));

  return <CustomerHomePageClient sports={sports} />;
}
