
import { NextRequest, NextResponse } from 'next/server';

const MOCK = process.env.MOCK === '1';

function budgetToMaxUSD(budget: '$'|'$$'|'$$$') {
  if (budget === '$') return 150;
  if (budget === '$$') return 300;
  return 600;
}

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lng = req.nextUrl.searchParams.get('lng');
  const nights = Number(req.nextUrl.searchParams.get('nights') ?? 3);
  const budget = (req.nextUrl.searchParams.get('budget') ?? '$$') as '$'|'$$'|'$$$';

  if (!lat || !lng) return NextResponse.json([], { status: 200 });

  if (MOCK) {
    return NextResponse.json([
      { id: 'm1', name: 'Mock Hotel Sakura', rating: 4.5, pricePerNight: 180, currency: 'USD', imageUrl: 'https://picsum.photos/seed/hotel1/400/300', bookingUrl: 'https://www.example.com' },
      { id: 'm2', name: 'Mock Ryokan Asahi', rating: 4.7, pricePerNight: 240, currency: 'USD', imageUrl: 'https://picsum.photos/seed/hotel2/400/300', bookingUrl: 'https://www.example.com' },
    ]);
  }

  const maxUSD = budgetToMaxUSD(budget);

  // Amadeus OAuth
  const env = process.env.AMADEUS_ENV === 'prod' ? 'production' : 'test';
  const tokenRes = await fetch(`https://api.${env}.amadeus.com/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AMADEUS_API_KEY || '',
      client_secret: process.env.AMADEUS_API_SECRET || ''
    })
  });
  if (!tokenRes.ok) {
    console.error('Amadeus token error', await tokenRes.text());
    return NextResponse.json([], { status: 200 });
  }
  const token = (await tokenRes.json()).access_token as string;

  const url = new URL(`https://api.${env}.amadeus.com/v2/shopping/hotel-offers`);
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lng));
  url.searchParams.set('radius', '5');
  url.searchParams.set('radiusUnit', 'KM');
  url.searchParams.set('adults', '2');
  url.searchParams.set('roomQuantity', '1');
  url.searchParams.set('currency', 'USD');

  const offersRes = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!offersRes.ok) {
    console.error('Amadeus offers error', await offersRes.text());
    return NextResponse.json([], { status: 200 });
  }
  const payload = await offersRes.json();

  const hotels = (payload.data || []).slice(0, 8).map((h:any) => {
    const offer = h.offers?.[0];
    const totalUSD = offer?.price?.total ? parseFloat(offer.price.total) : undefined;
    const perNight = totalUSD && nights ? totalUSD / nights : undefined;
    return {
      id: h.hotel?.hotelId || h.id,
      name: h.hotel?.name || 'Hotel',
      rating: h.hotel?.rating ? Number(h.hotel.rating)/2 : undefined, // Amadeus rating is 1-5(?), we keep as-is or normalize
      pricePerNight: perNight,
      currency: offer?.price?.currency || 'USD',
      imageUrl: h.hotel?.media?.[0]?.uri || undefined,
      bookingUrl: offer?.self || undefined,
    };
  }).filter((h:any)=> !h.pricePerNight || h.pricePerNight <= maxUSD);

  return NextResponse.json(hotels);
}
