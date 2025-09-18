
import { NextRequest, NextResponse } from 'next/server';
import { DISTRICTS, scoreDistrict } from '../../../lib/districts';

type Body = {
  nights: number;
  budget: '$'|'$$'|'$$$';
  preferences: {
    nightlife: number;
    foodie: number;
    culture: number;
    shopping: number;
    quiet: number;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Body;
  const { nights, budget, preferences } = body;

  // Score districts and pick top 2
  const scored = DISTRICTS
    .map(d => ({ d, score: scoreDistrict(preferences, d) }))
    .sort((a,b)=> b.score - a.score)
    .slice(0,2);

  // Split nights roughly proportional to scores (at least 2 nights each if possible)
  const total = scored[0].score + scored[1].score;
  let n1 = Math.max(2, Math.round(nights * (scored[0].score/total)));
  let n2 = nights - n1;
  if (n2 < 2 && nights >= 4) { n2 = 2; n1 = nights - 2; }

  const foodieHigh = body.preferences.foodie >= 6;

  return NextResponse.json({
    budget,
    foodieHigh,
    districts: [
      { name: scored[0].d.name, lat: scored[0].d.lat, lng: scored[0].d.lng, nights: n1 },
      { name: scored[1].d.name, lat: scored[1].d.lat, lng: scored[1].d.lng, nights: n2 },
    ]
  });
}
