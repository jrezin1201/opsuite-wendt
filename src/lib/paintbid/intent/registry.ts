/**
 * Intent Registry
 * Domain rules mapping token patterns to canonical bid lines
 */

import type { IntentRule } from "./types";

export const INTENT_RULES: IntentRule[] = [
  // ===== EXTERIOR / BALCONY =====
  {
    id: "exterior_balcony_rail_count",
    label: "Balcony rail count → Exterior > Balcony Rail Count",
    mustInclude: ["balcony", "rail"],
    unitKind: "EA",
    priority: 90,
    target: { type: "bidLine", section: "Exterior", lineLabel: "Balcony Rail Count" },
    examples: ["Balc. Rail Count", "Balcony Rail Count", "Balcony Rail EA"]
  },

  {
    id: "exterior_balcony_rail_lf",
    label: "Balcony rail LF → Exterior > Balcony Rail LF",
    mustInclude: ["balcony", "rail"],
    unitKind: "LF",
    priority: 90,
    target: { type: "bidLine", section: "Exterior", lineLabel: "Balcony Rail LF" },
    examples: ["Balc Rail", "Balcony Rail LF"]
  },

  {
    id: "exterior_window_door_trim_count",
    label: "Window/Door trim count → Exterior > Window/Door Trim Count",
    anyInclude: ["window", "door"],
    mustInclude: ["trim"],
    unitKind: "EA",
    priority: 85,
    target: { type: "bidLine", section: "Exterior", lineLabel: "Window/Door Trim Count" },
    examples: ["Window/Door Trim Count", "Window Trim", "Door Trim Count"]
  },

  {
    id: "exterior_window_wood_verticals_count",
    label: "Window wood verticals → Exterior > Window Wood Verticals Count",
    mustInclude: ["window"],
    anyInclude: ["wood", "vertical", "verticals"],
    unitKind: "EA",
    priority: 85,
    target: { type: "bidLine", section: "Exterior", lineLabel: "Window Wood Verticals Count" },
    examples: ["Window Wood Verticals Count", "Wood Verticals"]
  },

  {
    id: "exterior_door_count",
    label: "Exterior door count → Exterior > Exterior Door Count",
    mustInclude: ["exterior", "door"],
    unitKind: "EA",
    priority: 80,
    target: { type: "bidLine", section: "Exterior", lineLabel: "Exterior Door Count" },
    examples: ["Ext. Door Count", "Exterior Doors"]
  },

  {
    id: "exterior_parapet_lf",
    label: "Parapet LF → Exterior > Parapet LF",
    mustInclude: ["parapet"],
    unitKind: "LF",
    priority: 85,
    target: { type: "bidLine", section: "Exterior", lineLabel: "Parapet LF" },
    examples: ["Parapet LF", "Parapet"]
  },

  {
    id: "exterior_stucco_sf",
    label: "Stucco SF → Exterior > Stucco SF",
    mustInclude: ["stucco"],
    unitKind: "SF",
    priority: 85,
    target: { type: "bidLine", section: "Exterior", lineLabel: "Stucco Body SF" },
    examples: ["Stucco SF", "Stucco Body SF"]
  },

  {
    id: "exterior_misc_count",
    label: "Exterior misc → Exterior > Misc Count",
    mustInclude: ["misc"],
    anyInclude: ["exterior", "ext"],
    unitKind: "EA",
    priority: 60,
    target: { type: "bidLine", section: "Exterior", lineLabel: "Misc Count" },
    examples: ["Misc", "Exterior Misc"]
  },

  // ===== GARAGE =====
  {
    id: "garage_ceiling_sf",
    label: "Garage ceiling SF (lid) → Garage > Ceiling SF",
    mustInclude: ["garage", "ceiling"],
    // No unitKind requirement - "Garage Lid" doesn't explicitly say SF
    priority: 95,
    target: { type: "bidLine", section: "Garage", lineLabel: "Ceiling SF" },
    examples: ["Garage Lid", "Garage Ceiling SF"]
  },

  {
    id: "garage_wall_sf",
    label: "Garage wall SF → Garage > Wall SF",
    mustInclude: ["garage", "wall"],
    unitKind: "SF",
    priority: 90,
    target: { type: "bidLine", section: "Garage", lineLabel: "Wall SF" },
    examples: ["Garage Wall SF", "Garage Walls"]
  },

  {
    id: "garage_storage_sf",
    label: "Garage storage SF → Garage > Storage SF",
    anyInclude: ["garage"],
    mustInclude: ["storage"],
    unitKind: "SF",
    priority: 88,
    target: { type: "bidLine", section: "Garage", lineLabel: "Storage SF" },
    examples: ["Garage Storage SF", "Storage SF"]
  },

  {
    id: "garage_trash_room_sf",
    label: "Trash room SF → Garage > Trash Room SF",
    mustInclude: ["trash", "room"],
    unitKind: "SF",
    priority: 88,
    target: { type: "bidLine", section: "Garage", lineLabel: "Trash Room SF" },
    examples: ["Trash Room SF", "Garage Trash Room"]
  },

  {
    id: "garage_trash_room_count",
    label: "Trash room count → Garage > Trash Room Count",
    mustInclude: ["trash", "room"],
    unitKind: "EA",
    priority: 87,
    target: { type: "bidLine", section: "Garage", lineLabel: "Trash Room Count" },
    examples: ["Trash Room", "Garage Trash Room Count"]
  },

  {
    id: "garage_column_count",
    label: "Garage column count → Garage > Column Count",
    anyInclude: ["garage"],
    mustInclude: ["column"],
    unitKind: "EA",
    priority: 86,
    target: { type: "bidLine", section: "Garage", lineLabel: "Column Count" },
    examples: ["Garage Column Count", "Columns", "Garage Columns"]
  },

  {
    id: "garage_bike_rack_count",
    label: "Garage bike rack count → Garage > Bike Rack Count",
    anyInclude: ["garage", "bike"],
    mustInclude: ["rack"],
    unitKind: "EA",
    priority: 86,
    target: { type: "bidLine", section: "Garage", lineLabel: "Bike Rack Count" },
    examples: ["Garage Bike Rack Count", "Bike Storage Room", "Bike Racks"]
  },

  {
    id: "garage_bike_storage_count",
    label: "Bike storage → Garage > Bike Storage Count",
    mustInclude: ["bike", "storage"],
    unitKind: "EA",
    priority: 85,
    target: { type: "bidLine", section: "Garage", lineLabel: "Bike Storage Count" },
    examples: ["Bike Storage Room", "Garage Bike Storage"]
  },

  {
    id: "bike_parking_count",
    label: "Bike parking count → Garage > Bike Parking Count",
    mustInclude: ["bike", "parking"],
    unitKind: "EA",
    priority: 70,
    target: { type: "bidLine", section: "Garage", lineLabel: "Bike Parking Count" },
    examples: ["Bike Parking Count", "Bike Parking"]
  },

  {
    id: "garage_door_count",
    label: "Garage door count → Garage > Door Count",
    mustInclude: ["garage", "door"],
    unitKind: "EA",
    priority: 82,
    target: { type: "bidLine", section: "Garage", lineLabel: "Door Count" },
    examples: ["Garage Doors", "Garage Door Count"]
  },

  // ===== CORRIDORS =====
  {
    id: "corridor_wall_sf",
    label: "Corridor wall SF → Corridors > Wall SF",
    anyInclude: ["corridor", "cor"],
    mustInclude: ["wall"],
    unitKind: "SF",
    priority: 90,
    target: { type: "bidLine", section: "Corridors", lineLabel: "Wall SF" },
    examples: ["Cor. Wall SF", "Corridor Wall SF", "Corridors Wall SF"]
  },

  {
    id: "corridor_ceiling_lid_sf",
    label: "Corridor ceiling/lid SF → Corridors > Ceiling SF",
    anyInclude: ["corridor", "cor"],
    mustInclude: ["ceiling"],
    priority: 95,
    target: { type: "bidLine", section: "Corridors", lineLabel: "Ceiling SF" },
    examples: ["Cor. Lid", "Corridor Ceiling SF", "Cor. Ceiling SF"]
  },

  {
    id: "corridor_lid_sf",
    label: "Cor. Lid → Corridors > Ceiling SF",
    mustInclude: ["cor", "ceiling"],
    priority: 100,
    target: { type: "bidLine", section: "Corridors", lineLabel: "Ceiling SF" },
    examples: ["Cor. Lid", "Cor Lid SF"]
  },

  {
    id: "corridor_door_count",
    label: "Corridor door count → Corridors > Door Count",
    anyInclude: ["corridor", "cor"],
    mustInclude: ["door"],
    unitKind: "EA",
    priority: 85,
    target: { type: "bidLine", section: "Corridors", lineLabel: "Door Count" },
    examples: ["Cor. Doors", "Corridor Door Count", "Cor. Door Count"]
  },

  {
    id: "corridor_storage_count",
    label: "Corridor storage → Corridors > Storage Count",
    anyInclude: ["corridor", "cor"],
    mustInclude: ["storage"],
    unitKind: "EA",
    priority: 80,
    target: { type: "bidLine", section: "Corridors", lineLabel: "Storage Count" },
    examples: ["Storage", "Storage Count", "Corridor Storage"]
  },

  {
    id: "corridor_base_count",
    label: "Corridor base → Corridors > Base Count",
    anyInclude: ["corridor", "cor"],
    mustInclude: ["base"],
    unitKind: "EA",
    priority: 80,
    target: { type: "bidLine", section: "Corridors", lineLabel: "Base Count" },
    examples: ["Base", "Corridor Base"]
  },

  {
    id: "corridor_entry_door_count",
    label: "Entry door → Corridors > Entry Door Count",
    mustInclude: ["entry", "door"],
    unitKind: "EA",
    priority: 82,
    target: { type: "bidLine", section: "Corridors", lineLabel: "Entry Door Count" },
    examples: ["Entry Doors", "Entry Door"]
  },

  // ===== STAIRS =====
  {
    id: "stairs_1_levels",
    label: "Stair 1 levels → Stairs > Stair 1 Levels",
    mustInclude: ["stair", "1"],
    anyInclude: ["level", "levels"],
    unitKind: "LVL",
    priority: 85,
    target: { type: "bidLine", section: "Stairs", lineLabel: "Stair 1 Levels" },
    examples: ["Stair 1 lvls", "Stairs 1", "Stair 1"]
  },

  {
    id: "stairs_2_levels",
    label: "Stair 2 levels → Stairs > Stair 2 Levels",
    mustInclude: ["stair", "2"],
    anyInclude: ["level", "levels"],
    unitKind: "LVL",
    priority: 85,
    target: { type: "bidLine", section: "Stairs", lineLabel: "Stair 2 Levels" },
    examples: ["Stair 2 lvls", "Stairs 2", "Stair 2"]
  },

  // ===== AMENITY =====
  {
    id: "amenity_rec_room_sf",
    label: "Rec room → Amenity > Rec Room SF",
    mustInclude: ["rec", "room"],
    // No unitKind requirement - sometimes shows without SF indicator
    priority: 85,
    target: { type: "bidLine", section: "Amenity", lineLabel: "Rec Room SF" },
    examples: ["Rec Room", "Rec Room SF"]
  },

  {
    id: "amenity_lobby_sf",
    label: "Lobby → Amenity > Lobby SF",
    mustInclude: ["lobby"],
    unitKind: "SF",
    priority: 80,
    target: { type: "bidLine", section: "Amenity", lineLabel: "Lobby SF" },
    examples: ["Lobby", "Lobby SF"]
  },

  // ===== LANDSCAPE =====
  {
    id: "landscape_gate_count",
    label: "Gate count → Landscape > Gate Count",
    mustInclude: ["gate"],
    unitKind: "EA",
    priority: 75,
    target: { type: "bidLine", section: "Landscape", lineLabel: "Gate Count" },
    examples: ["Gates", "Gate"]
  },

  // ===== GENERAL =====
  {
    id: "general_units_count",
    label: "Units total → General > Units Count",
    mustInclude: ["units"],
    anyInclude: ["total", "count"],
    unitKind: "EA",
    priority: 95,
    target: { type: "bidLine", section: "General", lineLabel: "Units Count" },
    examples: ["Units Total", "Units", "Unit Count"]
  },

  {
    id: "general_unit_count",
    label: "Unit Count → General > Units Count",
    mustInclude: ["unit", "count"],
    priority: 100,
    target: { type: "bidLine", section: "General", lineLabel: "Units Count" },
    examples: ["Unit Count", "Unit Counts"]
  },

  {
    id: "general_total_sf",
    label: "Total SF → General > Total SF",
    mustInclude: ["total"],
    unitKind: "SF",
    priority: 90,
    target: { type: "bidLine", section: "General", lineLabel: "Total SF" },
    examples: ["Total SF", "Building Total SF"]
  },

  // ===== LOW-PRIORITY FALLBACKS =====
  {
    id: "generic_storage_sf",
    label: "Generic storage → Garage > Storage SF (if SF)",
    mustInclude: ["storage"],
    unitKind: "SF",
    priority: 10,
    target: { type: "bidLine", section: "Garage", lineLabel: "Storage SF" }
  },

  {
    id: "generic_doors_ea",
    label: "Generic doors → Corridors > Door Count (fallback)",
    mustInclude: ["door"],
    mustExclude: ["exterior", "garage", "entry"],
    unitKind: "EA",
    priority: 10,
    target: { type: "bidLine", section: "Corridors", lineLabel: "Door Count" }
  }
];