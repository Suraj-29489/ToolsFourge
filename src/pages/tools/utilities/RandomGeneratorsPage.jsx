import React, { useState } from 'react';
import { Sparkles, ArrowLeft, RefreshCw, Dices } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RandomGeneratorsPage() {
  const [tab, setTab] = useState('numbers'); // 'numbers' | 'coin' | 'dice'

  // Random Number State
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [qty, setQty] = useState(5);
  const [randNumbers, setRandNumbers] = useState([42, 17, 89, 3, 65]);

  // Coin Flip State
  const [coinResult, setCoinResult] = useState('HEADS');
  const [isFlipping, setIsFlipping] = useState(false);

  // Dice Roller State
  const [diceType, setDiceType] = useState(6);
  const [diceCount, setDiceCount] = useState(2);
  const [diceResults, setDiceResults] = useState([4, 6]);

  const generateNumbers = () => {
    const res = [];
    for (let i = 0; i < qty; i++) {
      res.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    setRandNumbers(res);
  };

  const flipCoin = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCoinResult(Math.random() < 0.5 ? 'HEADS' : 'TAILS');
      setIsFlipping(false);
    }, 600);
  };

  const rollDice = () => {
    const res = [];
    for (let i = 0; i < diceCount; i++) {
      res.push(Math.floor(Math.random() * diceType) + 1);
    }
    setDiceResults(res);
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
          <Sparkles className="w-8 h-8 text-purple-400" />
          Random Generators & Chance Suite
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Random number generator, animated coin flipper, and multi-dice roller.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div className="flex justify-center gap-2 flex-wrap">
          <button onClick={() => setTab('numbers')} className={`px-4 py-2 rounded-xl font-bold text-xs ${tab === 'numbers' ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}>
            Random Numbers
          </button>
          <button onClick={() => setTab('coin')} className={`px-4 py-2 rounded-xl font-bold text-xs ${tab === 'coin' ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}>
            Coin Flip
          </button>
          <button onClick={() => setTab('dice')} className={`px-4 py-2 rounded-xl font-bold text-xs ${tab === 'dice' ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}>
            Dice Roller
          </button>
        </div>

        {tab === 'numbers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Min</label><input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl" /></div>
              <div><label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Max</label><input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl" /></div>
              <div><label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Quantity</label><input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl" /></div>
            </div>

            <button onClick={generateNumbers} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Generate Random Numbers
            </button>

            <div className="flex justify-center gap-3 flex-wrap p-6 bg-obsidian-secondary border border-obsidian-border rounded-xl">
              {randNumbers.map((n, idx) => (
                <span key={idx} className="w-14 h-14 bg-purple-600 text-white font-mono font-extrabold text-xl rounded-2xl flex items-center justify-center shadow-lg border border-purple-400/30">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === 'coin' && (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-4 border-yellow-200 flex items-center justify-center shadow-2xl transition-transform duration-500">
              <span className={`text-2xl font-black text-amber-950 ${isFlipping ? 'animate-spin' : ''}`}>{coinResult}</span>
            </div>

            <button onClick={flipCoin} disabled={isFlipping} className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${isFlipping ? 'animate-spin' : ''}`} /> Flip Coin
            </button>
          </div>
        )}

        {tab === 'dice' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Dice Type</label>
                <select value={diceType} onChange={(e) => setDiceType(Number(e.target.value))} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3.5 rounded-xl font-bold">
                  <option value={4}>D4 (4 Sides)</option>
                  <option value={6}>D6 (6 Sides)</option>
                  <option value={8}>D8 (8 Sides)</option>
                  <option value={10}>D10 (10 Sides)</option>
                  <option value={12}>D12 (12 Sides)</option>
                  <option value={20}>D20 (20 Sides)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Number of Dice</label>
                <input type="number" min={1} max={6} value={diceCount} onChange={(e) => setDiceCount(Number(e.target.value))} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl" />
              </div>
            </div>

            <button onClick={rollDice} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2">
              <Dices className="w-4 h-4" /> Roll Dice
            </button>

            <div className="flex justify-center gap-3 flex-wrap p-6 bg-obsidian-secondary border border-obsidian-border rounded-xl">
              {diceResults.map((val, idx) => (
                <div key={idx} className="w-16 h-16 bg-obsidian-card border-2 border-purple-500 rounded-2xl flex items-center justify-center text-2xl font-black text-purple-300 shadow-inner">
                  {val}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
