
'use client';

import { useState } from 'react';

type Props = {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (v:number)=>void;
};

export default function Slider({ label, min=1, max=10, step=1, defaultValue=5, onChange }: Props) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <label className="font-medium">{label}</label>
        <span className="text-sm text-gray-600">{val}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e)=>{
          const v = Number(e.target.value);
          setVal(v);
          onChange?.(v);
        }}
        className="w-full"
      />
    </div>
  );
}
