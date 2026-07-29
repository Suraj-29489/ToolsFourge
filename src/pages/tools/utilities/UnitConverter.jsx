import React, { useState } from 'react';
import { ArrowLeftRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UnitConverter() {
  const [category, setCategory] = useState('length'); // 'length' | 'weight' | 'temp' | 'data'
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [inputValue, setInputValue] = useState(1000);

  const UNITS = {
    length: [
      { key: 'm', label: 'Meters (m)', factor: 1 },
      { key: 'km', label: 'Kilometers (km)', factor: 1000 },
      { key: 'cm', label: 'Centimeters (cm)', factor: 0.01 },
      { key: 'mm', label: 'Millimeters (mm)', factor: 0.001 },
      { key: 'ft', label: 'Feet (ft)', factor: 0.3048 },
      { key: 'in', label: 'Inches (in)', factor: 0.0254 },
      { key: 'mi', label: 'Miles (mi)', factor: 1609.34 },
    ],
    weight: [
      { key: 'kg', label: 'Kilograms (kg)', factor: 1 },
      { key: 'g', label: 'Grams (g)', factor: 0.001 },
      { key: 'mg', label: 'Milligrams (mg)', factor: 0.000001 },
      { key: 'lb', label: 'Pounds (lb)', factor: 0.453592 },
      { key: 'oz', label: 'Ounces (oz)', factor: 0.0283495 },
    ],
    data: [
      { key: 'B', label: 'Bytes (B)', factor: 1 },
      { key: 'KB', label: 'Kilobytes (KB)', factor: 1024 },
      { key: 'MB', label: 'Megabytes (MB)', factor: 1048576 },
      { key: 'GB', label: 'Gigabytes (GB)', factor: 1073741824 },
      { key: 'TB', label: 'Terabytes (TB)', factor: 1099511627776 },
    ],
  };

  const convertValue = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '0';

    if (category === 'temp') {
      if (fromUnit === toUnit) return val.toString();
      if (fromUnit === 'C' && toUnit === 'F') return ((val * 9) / 5 + 32).toFixed(2);
      if (fromUnit === 'F' && toUnit === 'C') return (((val - 32) * 5) / 9).toFixed(2);
      if (fromUnit === 'C' && toUnit === 'K') return (val + 273.15).toFixed(2);
      if (fromUnit === 'K' && toUnit === 'C') return (val - 273.15).toFixed(2);
      return '0';
    }

    const currentUnits = UNITS[category] || [];
    const fromObj = currentUnits.find((u) => u.key === fromUnit);
    const toObj = currentUnits.find((u) => u.key === toUnit);

    if (!fromObj || !toObj) return '0';
    const baseValue = val * fromObj.factor;
    const result = baseValue / toObj.factor;
    return result.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <ArrowLeftRight className="w-8 h-8 text-purple-400" />
          Unit Converter
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Convert length, weight, temperature, and data units quickly in your browser.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        {/* Category Tabs */}
        <div className="flex justify-center gap-2 flex-wrap">
          {['length', 'weight', 'temp', 'data'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                if (cat === 'length') { setFromUnit('m'); setToUnit('km'); }
                if (cat === 'weight') { setFromUnit('kg'); setToUnit('lb'); }
                if (cat === 'temp') { setFromUnit('C'); setToUnit('F'); }
                if (cat === 'data') { setFromUnit('MB'); setToUnit('GB'); }
              }}
              className={`px-4 py-2 rounded-xl font-bold text-xs capitalize transition-all ${category === cat ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="bg-obsidian-secondary p-4 rounded-xl border border-obsidian-border space-y-2">
            <label className="text-xs font-semibold text-obsidian-text-muted block">From</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-obsidian-card border border-obsidian-border text-white text-lg font-bold p-2.5 rounded-lg outline-none"
            />
            {category !== 'temp' ? (
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full bg-obsidian-card text-xs text-white p-2 rounded-lg border border-obsidian-border">
                {UNITS[category].map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
              </select>
            ) : (
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full bg-obsidian-card text-xs text-white p-2 rounded-lg border border-obsidian-border">
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
                <option value="K">Kelvin (K)</option>
              </select>
            )}
          </div>

          <div className="bg-obsidian-secondary p-4 rounded-xl border border-obsidian-border space-y-2">
            <label className="text-xs font-semibold text-obsidian-text-muted block">To</label>
            <div className="text-lg font-bold text-purple-300 p-2.5 bg-obsidian-card rounded-lg border border-obsidian-border min-h-[44px] flex items-center">
              {convertValue()}
            </div>
            {category !== 'temp' ? (
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full bg-obsidian-card text-xs text-white p-2 rounded-lg border border-obsidian-border">
                {UNITS[category].map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
              </select>
            ) : (
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full bg-obsidian-card text-xs text-white p-2 rounded-lg border border-obsidian-border">
                <option value="F">Fahrenheit (°F)</option>
                <option value="C">Celsius (°C)</option>
                <option value="K">Kelvin (K)</option>
              </select>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
