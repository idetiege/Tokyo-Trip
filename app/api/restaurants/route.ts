
import { NextRequest, NextResponse } from 'next/server';

const MOCK = process.env.MOCK === '1';

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lng = req.nextUrl.searchParams.get('lng');
  const foodie = req.nextUrl.searchParams.get('foodie') === '1';

  if (!lat || !lng || !foodie) return NextResponse.json([]);

  if (MOCK) {
    return NextResponse.json([
      { id: 'r1', name: 'Mock Ramen Ichiban', rating: 4.6, priceLevel: '$', photoUrl: 'https://picsum.photos/seed/ramen/400/300', cuisine: 'Ramen', mapsUrl: 'https://maps.google.com' },
      { id: 'r2', name: 'Mock Sushi Hana', rating: 4.7, priceLevel: '$$$', photoUrl: 'https://picsum.photos/seed/sushi/400/300', cuisine: 'Sushi', mapsUrl: 'https://maps.google.com' },
    ]);
  }

  const key = process.env.GOOGLE_PLACES_API_KEY || '';
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', '2000');
  url.searchParams.set('type', 'restaurant');
  url.searchParams.set('key', key);

  const res = await fetch(url);
  if (!res.ok) {
    console.error('Places error', await res.text());
    return NextResponse.json([]);
  }
  const data = await res.json();

  // Optionally fetch photos via photo endpoint when available
  const items = (data.results || []).filter((r:any)=> r.rating && r.rating >= 4.4).slice(0, 10);
  const out = items.map((r:any)=>{
    let photoUrl: string | undefined = undefined;
    const photoRef = r.photos?.[0]?.photo_reference;
    if (photoRef) {
      const photo = new URL('https://maps.googleapis.com/maps/api/place/photo');
      photo.searchParams.set('maxwidth', '400');
      photo.searchParams.set('photo_reference', photoRef);
      photo.searchParams.set('key', key);
      photoUrl = photo.toString();
    }
    const priceMap = { 0:'$', 1:'$', 2:'$$', 3:'$$$', 4:'$$$$' } as any;
    return {
      id: r.place_id,
      name: r.name,
      rating: r.rating,
      priceLevel: priceMap[r.price_level ?? 2],
      photoUrl,
      cuisine: r.types?.[0],
      mapsUrl: `https://www.google.com/maps/place/?q=place_id:${r.place_id}`
    };
  });

  return NextResponse.json(out);
}
