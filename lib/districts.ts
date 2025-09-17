
export type DistrictKey =
  | 'Shinjuku'
  | 'Shibuya'
  | 'Ginza'
  | 'Asakusa'
  | 'Ueno'
  | 'Roppongi'
  | 'Daikanyama';

export type Weights = {
  nightlife: number;
  foodie: number;
  culture: number;
  shopping: number;
  quiet: number;
};

export type District = {
  name: DistrictKey;
  lat: number;
  lng: number;
  weights: Weights;
};

export const DISTRICTS: District[] = [
  { name: 'Shinjuku', lat: 35.6938, lng: 139.7034, weights: { nightlife: 10, foodie: 7, culture: 4, shopping: 8, quiet: 2 } },
  { name: 'Shibuya', lat: 35.6595, lng: 139.7005, weights: { nightlife: 9, foodie: 9, culture: 4, shopping: 9, quiet: 3 } },
  { name: 'Ginza', lat: 35.6717, lng: 139.7650, weights: { nightlife: 6, foodie: 9, culture: 5, shopping: 10, quiet: 4 } },
  { name: 'Asakusa', lat: 35.7148, lng: 139.7967, weights: { nightlife: 3, foodie: 7, culture: 10, shopping: 5, quiet: 8 } },
  { name: 'Ueno', lat: 35.7120, lng: 139.7770, weights: { nightlife: 3, foodie: 6, culture: 9, shopping: 6, quiet: 7 } },
  { name: 'Roppongi', lat: 35.6628, lng: 139.7310, weights: { nightlife: 9, foodie: 8, culture: 6, shopping: 7, quiet: 2 } },
  { name: 'Daikanyama', lat: 35.6487, lng: 139.7030, weights: { nightlife: 4, foodie: 8, culture: 5, shopping: 8, quiet: 7 } },
];

export function scoreDistrict(prefs: {nightlife:number; foodie:number; culture:number; shopping:number; quiet:number}, d: District) {
  const w = d.weights;
  return w.nightlife*prefs.nightlife + w.foodie*prefs.foodie + w.culture*prefs.culture + w.shopping*prefs.shopping + w.quiet*prefs.quiet;
}
