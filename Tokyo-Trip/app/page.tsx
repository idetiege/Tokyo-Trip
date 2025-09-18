
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Slider from '../components/Slider';

export default function Home() {
  const router = useRouter();
  const [nights, setNights] = useState(7);
  const [budget, setBudget] = useState<'$'|'$$'|'$$$'>('$$');
  const [nightlife, setNightlife] = useState(5);
  const [foodie, setFoodie] = useState(7);
  const [culture, setCulture] = useState(5);
  const [shopping, setShopping] = useState(5);
  const [quiet, setQuiet] = useState(5);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nights, budget, preferences: { nightlife, foodie, culture, shopping, quiet } })
    });
    const data = await res.json();
    const params = new URLSearchParams({ plan: JSON.stringify(data) });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <main>
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h2 className="text-xl font-semibold mb-4">Your Trip</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Trip Length (nights)</label>
            <input type="number" min={3} max={14} value={nights}
              onChange={e=>setNights(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium">Budget per Night</label>
            <select value={budget} onChange={e=>setBudget(e.target.value as any)}
              className="mt-1 w-full rounded-lg border px-3 py-2">
              <option>$</option>
              <option>$$</option>
              <option>$$$</option>
            </select>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-3">Travel Style Priorities</h2>
        <Slider label="Nightlife & Entertainment" defaultValue={5} onChange={setNightlife} />
        <Slider label="Foodie Experience" defaultValue={7} onChange={setFoodie} />
        <Slider label="Culture & History" defaultValue={5} onChange={setCulture} />
        <Slider label="Shopping (Luxury & Trend-setting)" defaultValue={5} onChange={setShopping} />
        <Slider label="Quiet & Relaxation" defaultValue={5} onChange={setQuiet} />

        <button onClick={onSubmit} disabled={loading}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black text-white px-5 py-3 hover:opacity-90">
          {loading ? 'Calculating…' : 'Get My Plan'}
        </button>
      </div>
    </main>
  );
}
