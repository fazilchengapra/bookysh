import { TMEvent } from "./ticketmaster";

export interface StadiumSeat {
  id: string;   // e.g., "A-1"
  row: string;  // e.g., "A"
  num: number;  // e.g., 1
  status: "available" | "booked" | "wheelchair";
  zoneId: string;
}

export interface StadiumRow {
  row: string;
  seats: (StadiumSeat | null)[];
}

export interface StadiumZone {
  id: string;
  name: string;   // e.g., "North Stand", "VIP Box"
  price: number;
  color: string;  // Hex color for rendering
  rows: StadiumRow[]; // Optional when selectionType is "zone"
  availableCapacity?: number; // Used when selectionType is "zone"
  position: "top" | "bottom" | "left" | "right" | "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export interface StadiumLayout {
  zones: StadiumZone[];
  sportType: "football" | "basketball" | "cricket" | "music" | "default";
  selectionType: "seat" | "zone";
}

// ── Helpers for Auto-Generating Layouts ──────────────────────

function generateRow(
  rowLabel: string,
  startNum: number,
  seatCount: number,
  gapIndices: number[],
  zoneId: string,
  hasWheelchair: boolean = false
): StadiumRow {
  const seats: (StadiumSeat | null)[] = [];
  let currNum = startNum;

  for (let i = 0; i < seatCount; i++) {
    if (gapIndices.includes(i)) {
      seats.push(null);
    } else {
      let status: StadiumSeat["status"] = Math.random() < 0.25 ? "booked" : "available";
      
      if (hasWheelchair && status === "available" && Math.random() < 0.05) {
        status = "wheelchair";
      }

      seats.push({
        id: `${zoneId}-${rowLabel}-${currNum}`,
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

function generateFootballStands(basePrice: number): StadiumLayout {
  const rowsCount = 8;
  const seatsPerRowX = 35; // Top/Bottom
  const seatsPerRowY = 20; // Left/Right

  const genRows = (seatCount: number, zId: string, isPremium=false) => {
    const rows = [];
    for (let i = 0; i < rowsCount; i++) {
       rows.push(generateRow(String.fromCharCode(65 + i), 1, seatCount, [], zId, isPremium && i === 0));
    }
    return rows;
  };

  return {
    sportType: "football",
    selectionType: "zone",
    zones: [
      { id: "z-north", name: "North Stand", price: basePrice, color: "#1D8EFF", position: "top", rows: [], availableCapacity: 500 },
      { id: "z-south", name: "South Stand", price: basePrice, color: "#1D8EFF", position: "bottom", rows: [], availableCapacity: 500 },
      { id: "z-east", name: "East Stand (Away)", price: basePrice * 0.8, color: "#10b981", position: "right", rows: [], availableCapacity: 300 },
      { id: "z-west", name: "West Stand (Premium)", price: basePrice * 2.5, color: "#a855f7", position: "left", rows: [], availableCapacity: 200 },
    ]
  };
}

function generateBasketballStands(basePrice: number): StadiumLayout {
  const rowsCount = 4;
  const seatsPerRowX = 22;
  const seatsPerRowY = 12;

  const genRows = (seatCount: number, zId: string, isPremium=false) => {
    const rows = [];
    for (let i = 0; i < rowsCount; i++) {
       rows.push(generateRow(String.fromCharCode(65 + i), 1, seatCount, [], zId, isPremium && i === 0));
    }
    return rows;
  };

  return {
    sportType: "basketball",
    selectionType: "seat",
    zones: [
      { id: "b-north", name: "Courtside North", price: basePrice * 1.5, color: "#F59E0B", position: "top", rows: genRows(seatsPerRowX, "b-north") },
      { id: "b-south", name: "Courtside South", price: basePrice * 1.5, color: "#F59E0B", position: "bottom", rows: genRows(seatsPerRowX, "b-south") },
      { id: "b-east", name: "General East", price: basePrice, color: "#1D8EFF", position: "right", rows: genRows(seatsPerRowY, "b-east") },
      { id: "b-west", name: "VIP West", price: basePrice * 3, color: "#a855f7", position: "left", rows: genRows(seatsPerRowY, "b-west", true) },
    ]
  };
}

function generateCircularStands(sportType: "cricket", basePrice: number): StadiumLayout {
  const rowsCount = 6;
  const seatsPerRowQ = 14; 

  const genRows = (zId: string, isPremium=false) => {
    const rows = [];
    for (let i = 0; i < rowsCount; i++) {
      rows.push(generateRow(String.fromCharCode(65 + i), 1, seatsPerRowQ, [], zId, isPremium && i === 0));
    }
    return rows;
  };

  return {
    sportType,
    selectionType: "zone",
    zones: [
      { id: "z-n",  name: "Pavilion End", price: basePrice * 3, color: "#a855f7", position: "top", rows: [], availableCapacity: 200 },
      { id: "z-s",  name: "Media End", price: basePrice * 2, color: "#F59E0B", position: "bottom", rows: [], availableCapacity: 400 },
      { id: "z-e",  name: "East Stand", price: basePrice, color: "#1D8EFF", position: "right", rows: [], availableCapacity: 600 },
      { id: "z-w",  name: "West Stand", price: basePrice, color: "#1D8EFF", position: "left", rows: [], availableCapacity: 600 },
      { id: "z-nw", name: "North West Stand", price: basePrice, color: "#10b981", position: "top-left", rows: [], availableCapacity: 300 },
      { id: "z-ne", name: "North East Stand", price: basePrice, color: "#10b981", position: "top-right", rows: [], availableCapacity: 300 },
      { id: "z-sw", name: "South West Stand", price: basePrice, color: "#10b981", position: "bottom-left", rows: [], availableCapacity: 300 },
      { id: "z-se", name: "South East Stand", price: basePrice, color: "#10b981", position: "bottom-right", rows: [], availableCapacity: 300 },
    ]
  };
}

function generateMusicVenue(basePrice: number): StadiumLayout {
  return {
    sportType: "music",
    selectionType: "zone",
    zones: [
      { id: "m-ga", name: "General Admission", price: basePrice, color: "#10b981", position: "bottom", rows: [], availableCapacity: 1500 },
      { id: "m-vip", name: "VIP Standing", price: basePrice * 2.5, color: "#F59E0B", position: "top", rows: [], availableCapacity: 200 },
      { id: "m-left", name: "Left Wing", price: basePrice * 1.5, color: "#1D8EFF", position: "left", rows: [], availableCapacity: 300 },
      { id: "m-right", name: "Right Wing", price: basePrice * 1.5, color: "#1D8EFF", position: "right", rows: [], availableCapacity: 300 }
    ]
  };
}

export function getMockStadiumForEvent(event: TMEvent): StadiumLayout {
  const segment = event.classifications?.[0]?.segment?.name || "";
  const genre = event.classifications?.[0]?.genre?.name || "";
  const subGenre = event.classifications?.[0]?.subGenre?.name || "";
  
  const searchStr = `${segment} ${genre} ${subGenre}`.toLowerCase();
  
  let basePrice = 500;
  if (event.priceRanges && event.priceRanges.length > 0) {
    basePrice = event.priceRanges[0].min;
  }

  if (searchStr.includes("soccer") || searchStr.includes("football") || searchStr.includes("rugby")) {
    return generateFootballStands(basePrice);
  } else if (searchStr.includes("basketball") || searchStr.includes("tennis") || searchStr.includes("volleyball")) {
    return generateBasketballStands(basePrice);
  } else if (searchStr.includes("cricket")) {
    return generateCircularStands("cricket", basePrice);
  } else if (searchStr.includes("music") || searchStr.includes("concert")) {
    return generateMusicVenue(basePrice);
  } else {
    // Default to music venue for other event types (since it's simplest zone-based)
    return generateMusicVenue(basePrice);
  }
}
