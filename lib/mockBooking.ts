// ──────────────────────────────────────────────────────────
//  Mock Theater & Booking Data  |  lib/mockBooking.ts
// ──────────────────────────────────────────────────────────

export interface Seat {
  id: string;   // e.g., "A-1"
  row: string;  // e.g., "A"
  num: number;  // e.g., 1
  status: "available" | "booked" | "wheelchair";
  zoneId: string;
}

export interface SeatRow {
  row: string;
  seats: (Seat | null)[]; // null represents an aisle or gap
}

export interface SeatZone {
  id: string;
  name: string;   // e.g., "VIP Recliners", "Premium", "Regular"
  price: number;
  color: string;  // Hex color for rendering
  rows: SeatRow[];
}

export interface TheaterLayout {
  zones: SeatZone[];
}

export interface Showtime {
  id: string;
  time: string;   // "09:30 AM"
  format: string; // "2D", "3D", "IMAX"
  layout: TheaterLayout; // Each showtime holds state of its seats
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  distance: string; // e.g., "2.5 km away"
  showtimes: Showtime[];
}

// ── Helpers for Auto-Generating Layouts ──────────────────────

function generateRow(
  rowLabel: string,
  startNum: number,
  seatCount: number,
  gapIndices: number[],
  zoneId: string,
  hasWheelchair: boolean = false
): SeatRow {
  const seats: (Seat | null)[] = [];
  let currNum = startNum;

  for (let i = 0; i < seatCount; i++) {
    if (gapIndices.includes(i)) {
      seats.push(null);
    } else {
      // Randomly make ~15% of seats booked
      let status: Seat["status"] = Math.random() < 0.15 ? "booked" : "available";
      
      // Randomly assign wheelchair access if requested (very rare)
      if (hasWheelchair && status === "available" && Math.random() < 0.05) {
        status = "wheelchair";
      }

      seats.push({
        id: `${rowLabel}-${currNum}`,
        row: rowLabel,
        num: currNum,
        status,
        zoneId,
      });
      currNum++;
    }
  }
  return { row: rowLabel, seats };
}

/**
 * Generates a realistic layout with 3 distinct zones.
 */
function generateStandardLayout(): TheaterLayout {
  return {
    zones: [
      {
        id: "z-vip",
        name: "Diamond / VIP Recliners",
        price: 450,
        color: "#a855f7", // Purple
        rows: [
          generateRow("P", 1, 14, [4, 9], "z-vip"),
          generateRow("O", 1, 14, [4, 9], "z-vip"),
        ]
      },
      {
        id: "z-premium",
        name: "Premium",
        price: 250,
        color: "#1D8EFF", // Brand Blue
        rows: [
          generateRow("N", 1, 18, [4, 13], "z-premium", true), // Wheelchair row
          generateRow("M", 1, 18, [4, 13], "z-premium"),
          generateRow("L", 1, 18, [4, 13], "z-premium"),
          generateRow("K", 1, 18, [4, 13], "z-premium"),
          generateRow("J", 1, 18, [4, 13], "z-premium"),
          generateRow("I", 1, 18, [4, 13], "z-premium"),
          generateRow("H", 1, 18, [4, 13], "z-premium"),
        ]
      },
      {
        id: "z-regular",
        name: "Regular",
        price: 150,
        color: "#10b981", // Emerald
        rows: [
          generateRow("G", 1, 16, [3, 12], "z-regular"),
          generateRow("F", 1, 16, [3, 12], "z-regular"),
          generateRow("E", 1, 16, [3, 12], "z-regular"),
          generateRow("D", 1, 14, [3, 10], "z-regular"),
          generateRow("C", 1, 14, [3, 10], "z-regular"),
          generateRow("B", 1, 12, [3, 8], "z-regular"),
          generateRow("A", 1, 12, [3, 8], "z-regular"), // Closest to screen
        ]
      }
    ]
  };
}

/**
 * Generates an IMAX/mass scale layout.
 */
function generateIMAXLayout(): TheaterLayout {
  return {
    zones: [
      {
        id: "z-club",
        name: "Club Class",
        price: 600,
        color: "#F59E0B", // Amber
        rows: [
          generateRow("R", 1, 22, [6, 15], "z-club"),
          generateRow("Q", 1, 22, [6, 15], "z-club"),
          generateRow("P", 1, 22, [6, 15], "z-club"),
        ]
      },
      {
        id: "z-exec",
        name: "Executive",
        price: 350,
        color: "#06B6D4", // Cyan
        rows: [
          generateRow("O", 1, 26, [6, 19], "z-exec", true),
          generateRow("N", 1, 26, [6, 19], "z-exec"),
          generateRow("M", 1, 26, [6, 19], "z-exec"),
          generateRow("L", 1, 26, [6, 19], "z-exec"),
          generateRow("K", 1, 26, [6, 19], "z-exec"),
          generateRow("J", 1, 26, [6, 19], "z-exec"),
          generateRow("I", 1, 26, [6, 19], "z-exec"),
          generateRow("H", 1, 26, [6, 19], "z-exec"),
          generateRow("G", 1, 26, [6, 19], "z-exec"),
          generateRow("F", 1, 26, [6, 19], "z-exec"),
        ]
      },
      {
        id: "z-front",
        name: "Front Row",
        price: 200,
        color: "#ef4444", // Red (warning close to screen)
        rows: [
          generateRow("E", 1, 20, [5, 14], "z-front"),
          generateRow("D", 1, 20, [5, 14], "z-front"),
          generateRow("C", 1, 18, [5, 12], "z-front"),
          generateRow("B", 1, 18, [5, 12], "z-front"),
          generateRow("A", 1, 16, [4, 11], "z-front"),
        ]
      }
    ]
  };
}

// ── Mock Data Generator ───────────────────────────────────

export function getMockTheatersForMovie(movieId: string, dateStr: string): Theater[] {
  // Use movieId string chars to generate deterministic "randomness" so data 
  // stays consistent across hard reloads for the same movie/date.
  const hash = Array.from(movieId + dateStr).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const generateShowtimes = (count: number, formats: string[], isImax = false): Showtime[] => {
    const times = [];
    let startHour = 9; // 9 AM
    for (let i = 0; i < count; i++) {
        const period = startHour >= 12 ? "PM" : "AM";
        const displayHour = startHour > 12 ? startHour - 12 : startHour;
        const mins = hash % 2 === 0 ? "00" : (hash % 3 === 0 ? "15" : "30");
        const format = formats[(hash + i) % formats.length];
        
        times.push({
            id: `st-${hash}-${i}`,
            time: `${displayHour.toString().padStart(2, '0')}:${mins} ${period}`,
            format,
            layout: isImax ? generateIMAXLayout() : generateStandardLayout()
        });
        startHour += 3; // roughly 3 hours between shows
    }
    return times;
  };

  return [
    {
      id: "t1",
      name: "PVR Director's Cut: Ambience Mall",
      location: "Vasant Kunj, New Delhi",
      distance: "2.1 km away",
      showtimes: generateShowtimes(4, ["2D", "3D"]),
    },
    {
      id: "t2",
      name: "INOX Megaplex: Phoenix Marketcity",
      location: "Kurla, Mumbai",
      distance: "4.5 km away",
      showtimes: generateShowtimes(5, ["IMAX 3D", "IMAX 2D", "4DX"], true),
    },
    {
      id: "t3",
      name: "Cinepolis: Nexus Seawoods",
      location: "Navi Mumbai",
      distance: "6.8 km away",
      showtimes: generateShowtimes(3, ["2D", "VIP 2D"]),
    },
    {
      id: "t4",
      name: "E-Square Cinemas",
      location: "Shivajinagar, Pune",
      distance: "8.0 km away",
      showtimes: generateShowtimes(6, ["2D"]),
    }
  ];
}
