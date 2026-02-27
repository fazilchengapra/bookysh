import { notFound } from "next/navigation";
import { getEventById, getEventsBySegment, getEventSegment, type TMEvent } from "@/lib/ticketmaster";
import EventDetailClient from "@/components/customer/events/EventDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const event = await getEventById(id);
    return {
      title: `${event.name} — Bokysh`,
      description: event.info?.slice(0, 155) ?? `Book tickets for ${event.name}`,
    };
  } catch {
    return { title: "Event — Bokysh" };
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  let event: TMEvent;
  try {
    event = await getEventById(id);
  } catch {
    notFound();
  }

  // Fetch related events from the same segment
  const segment = getEventSegment(event);
  let related: TMEvent[] = [];
  try {
    const res = await getEventsBySegment(
      segment as Parameters<typeof getEventsBySegment>[0],
      0,
      8
    );
    // Exclude the current event
    related = (res._embedded?.events ?? []).filter((e) => e.id !== event.id).slice(0, 6);
  } catch {
    related = [];
  }

  return <EventDetailClient event={event} related={related} />;
}
