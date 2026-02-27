import {
  getEventsBySegment, getEvents,
  type TMEvent,
} from "@/lib/ticketmaster";
import EventsClientPage from "@/components/customer/events/EventsClientPage";

export const metadata = {
  title: "Events — Bokysh",
  description: "Book tickets for live music and more.",
};

export default async function EventsPage() {
  // Fetch all segments in parallel — fall back to empty array on error
  const safe = async (fn: () => Promise<{ _embedded?: { events?: TMEvent[] } }>) => {
    try {
      const res = await fn();
      return res._embedded?.events ?? [];
    } catch {
      return [] as TMEvent[];
    }
  };

  const [allRaw, music] = await Promise.all([
    safe(() => getEvents(0, 20)),
    safe(() => getEventsBySegment("Music", 0, 20)),
  ]);

  return (
    <EventsClientPage
      all={allRaw}
      music={music}
    />
  );
}
