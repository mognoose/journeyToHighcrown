// Journey configuration. Tweak these to balance the game.

// How many real-world steps equal one "unit" of progress on the map.
export const STEPS_PER_UNIT = 1000;

// Total units required to travel from start to finish.
export const TOTAL_UNITS = 30000;

// Convenience: total steps required to finish the journey.
export const TOTAL_STEPS = STEPS_PER_UNIT * TOTAL_UNITS;

// Waypoints define the path the token follows on the map.
// Coordinates are percentages of the map image (0..100) so the layout is responsive.
// Order matters: index 0 is the start, the last is the destination.
// Adjust these to match the actual route on JourneyToHighCrown.png.
export interface Waypoint {
  name: string;
  x: number; // percent from left
  y: number; // percent from top
  milestone: boolean; // whether to show a milestone marker at this waypoint
}

export const WAYPOINTS: Waypoint[] = [
  { name: 'Start',        x: 81,  y: 87, milestone: true },
  { name: 'Serpent Road',  x: 73,  y: 93, milestone: false },
  { name: 'Serpent Road',  x: 68,  y: 87, milestone: false },
  { name: 'Serpent Road',  x: 75,  y: 79, milestone: false },
  { name: 'Serpent Road',  x: 69,  y: 73, milestone: false },
  { name: 'Serpent Road',  x: 75,  y: 69, milestone: false },
  { name: 'Serpent Road',  x: 72,  y: 67, milestone: false },
  { name: 'The Guardian', x: 73,  y: 62, milestone: true },
  { name: 'Old Bridge',   x: 55, y: 65, milestone: false },
  { name: 'Riverwatch',   x: 42, y: 60, milestone: true },
  { name: 'Thunderfalls',   x: 25, y: 70, milestone: true },
  { name: 'Silverhold Road',   x: 26, y: 66, milestone: false },
  { name: 'Silverhold Road',   x: 32, y: 63, milestone: false },
  { name: 'Silverhold Road',   x: 32, y: 63, milestone: false },
  { name: 'Silverhold Road',   x: 29, y: 59, milestone: false },
  { name: 'Silverhold Road',   x: 29, y: 56, milestone: false },
  { name: 'Silverhold Road',   x: 20, y: 50, milestone: false },
  { name: 'Silverhold Road',   x: 25, y: 47, milestone: false },
  { name: 'Silverhold',   x: 26, y: 43, milestone: true },
  { name: 'Forest Pass',  x: 35, y: 45, milestone: false },
  { name: 'Forest Pass',  x: 38, y: 43, milestone: false },
  { name: 'Forest Pass',  x: 52, y: 52, milestone: false },
  { name: 'Forest Pass',  x: 62, y: 49, milestone: false },
  { name: 'Mountain Road',  x: 65, y: 46, milestone: false },
  { name: 'Mountain Road',  x: 62, y: 42, milestone: false },
  { name: 'Mountain Road',  x: 67, y: 39, milestone: false },
  { name: 'Bridge of Echoes',x: 61, y: 34, milestone: true },
  { name: 'Mountain Foot',x: 75, y: 32, milestone: false },
  { name: 'Mountain Foot',x: 76, y: 28, milestone: false },
  { name: 'Mountain Foot',x: 84, y: 26, milestone: false },
  { name: 'Mountain Foot',x: 81, y: 23, milestone: false },
  { name: 'Mountain Foot',x: 84, y: 21, milestone: false },
  { name: 'Mountain Foot',x: 80, y: 18, milestone: false },
  { name: 'Highcrown',    x: 82, y: 16, milestone: true },
];
