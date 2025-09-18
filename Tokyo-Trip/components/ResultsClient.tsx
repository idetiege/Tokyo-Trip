'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type DistrictPlan = { name: string; lat: number; lng: number; nights: number; };
type Hotel = { id: string; name: string; rating?: number; pricePerNight?: number; currency?: string; imageUrl?: string; bookingUrl?: string; };
type Restaurant = { id: string; name: string; rating?: number; priceLevel?: string; photoUrl?: string; cuisine?: string; mapsUrl?: string; };

export default function ResultsClient() {
  const params = useSearchParams();
  const plan = useMemo(()=>{
    const p = params.get('plan');
    return p ? JSON.parse(p) : null;
  }, [params]);

  const [data, setData] = useState<{[name:string]: {hotels: Hotel[]; restaurants: Restaurant[]}}>({});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async () => {
      if(!plan) return;
      const out:any = {};
      for(const d of plan.districts as DistrictPlan[]) {
        const [hRes, rRes] = await Promise.all([
          fetch(`/api/hotels?lat=${d.lat}&lng=${d.lng}&nights=${d.nights}&budget=${plan.budget}`),
          fetch(`/api/restaurants?lat=${d.lat}&lng=${d.lng}&foodie=${plan.foodieHigh ? 1:0}`)
        ]);
        const hotels = await hRes.json();
        const restaurants = await rRes.json();
        out[d.name] = { hotels, restaurants };
      }
      setData(out);
      setLoading(false);
    };
    load();
  }, [plan]);

  if(!plan) return <div className="text-red-600">Invalid plan.</div>;

  return (
    <main>
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h2 className="text-xl font-semibold mb-2">Your Split Stay</h2>
        <p className="text-gray-700 mb-6">
          Based on your preferences, we recommend <b>{plan.districts[0].nights} nights in {plan.districts[0].name}</b> and <b>{plan.districts[1].nights} nights in {plan.districts[1].name}</b>.
        </p>

        {(plan.districts as DistrictPlan[]).map((d:any)=>{
          const hotels = data[d.name]?.hotels || [];
          const restaurants = data[d.name]?.restaurants || [];
          return (
            <section key={d.name} className="mb-12">
              <h3 className="text-lg font-semibold mb-3">{d.name}</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-2">Places to Stay</h4>
                  <div className="space-y-3">
                    {loading ? <p>Loading hotels…</p> :
                      hotels.length ? hotels.map((h)=> (
                        <div key={h.id} className="flex gap-3 p-3 border rounded-xl">
                          <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            {h.imageUrl ? <Image src={h.imageUrl} alt={h.name} fill className="object-cover" /> : null}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{h.name}</div>
                            <div className="text-sm text-gray-600">
                              {h.rating ? `Rating: ${h.rating.toFixed(1)}/5` : 'Rating: n/a'}
                            </div>
                            <div className="text-sm">
                              {h.pricePerNight ? `${h.currency || 'USD'} ${h.pricePerNight.toFixed(0)} / night` : 'Price: n/a'}
                            </div>
                            {h.bookingUrl ? <a className="text-blue-600 text-sm" href={h.bookingUrl} target="_blank" rel="noreferrer">Book Now</a> : null}
                          </div>
                        </div>
                      )) : <p className="text-sm text-gray-600">No hotels found.</p>
                    }
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Places to Eat</h4>
                  <div className="space-y-3">
                    {loading ? <p>Loading restaurants…</p> :
                      restaurants.length ? restaurants.map((r)=> (
                        <div key={r.id} className="flex gap-3 p-3 border rounded-xl">
                          <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            {r.photoUrl ? <Image src={r.photoUrl} alt={r.name} fill className="object-cover" /> : null}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{r.name}</div>
                            <div className="text-sm text-gray-600">
                              {r.cuisine ? `${r.cuisine} • `: ''}{r.rating ? `Rating: ${r.rating.toFixed(1)}/5` : 'Rating: n/a'} • {r.priceLevel || '$$'}
                            </div>
                            {r.mapsUrl ? <a className="text-blue-600 text-sm" href={r.mapsUrl} target="_blank" rel="noreferrer">Open in Google Maps</a> : null}
                          </div>
                        </div>
                      )) : <p className="text-sm text-gray-600">No restaurants found or foodie preference low.</p>
                    }
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
