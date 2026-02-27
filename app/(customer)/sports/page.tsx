import {
  getEventsByKeyword,
  type TMEvent,
} from "@/lib/ticketmaster";
import SportsClientPage from "@/components/customer/sports/SportsClientPage";

export const metadata = {
  title: "Sports — Bokysh",
  description: "Live sports fixtures, upcoming matches and results across football, cricket, basketball and more.",
};

/** Safely fetch events, return [] on failure */
async function safeEvents(fn: () => Promise<{ _embedded?: { events?: TMEvent[] } }>): Promise<TMEvent[]> {
  try {
    const res = await fn();
    return res._embedded?.events ?? [];
  } catch {
    return [];
  }
}

export default async function SportsPage() {
  const sportsOrder = [
    { label: "Football", keyword: "Soccer" },
    { label: "Basketball", keyword: "Basketball" },
    { label: "Cricket", keyword: "Cricket" },
  ];

  const results = await Promise.all(
    sportsOrder.map(async (sport) => {
      const events = await safeEvents(() => getEventsByKeyword(sport.keyword, 0, 20));
      return {
        label: sport.label,
        keyword: sport.keyword,
        events,
      };
    })
  );

  return <SportsClientPage sportsResults={results} />;
}
