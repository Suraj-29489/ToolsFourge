import React, { useState } from 'react';
import { Calculator, ArrowLeft, Percent, DollarSign, UserCheck, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CalculatorsSuite() {
  const [activeTab, setActiveTab] = useState('emi'); // 'emi' | 'percentage' | 'bmi' | 'age'

  // EMI State
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);

  // Percentage State
  const [pctVal, setPctVal] = useState(15);
  const [totalVal, setTotalVal] = useState(200);

  // BMI State
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);

  // Age State
  const [birthDate, setBirthDate] = useState('1998-05-15');

  // EMI Calc
  const calculateEMI = () => {
    const p = parseFloat(loanAmount) || 0;
    const r = (parseFloat(interestRate) || 0) / 12 / 100;
    const n = (parseFloat(tenureYears) || 0) * 12;
    if (p <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  };

  // BMI Calc
  const calculateBMI = () => {
    const h = (parseFloat(heightCm) || 0) / 100;
    const w = parseFloat(weightKg) || 0;
    if (h <= 0 || w <= 0) return { bmi: 0, category: 'Invalid' };
    const bmi = (w / (h * h)).toFixed(1);
    let category = 'Normal weight';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
    else if (bmi >= 30) category = 'Obese';
    return { bmi, category };
  };

  // Age Calc
  const calculateAge = () => {
    if (!birthDate) return { years: 0, months: 0, days: 0 };
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months, days };
  };

  const emiRes = calculateEMI();
  const bmiRes = calculateBMI();
  const ageRes = calculateAge();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Calculator className="w-8 h-8 text-purple-400" />
          Financial & Utility Calculators
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Calculate EMI loan interest, percentages, BMI, and exact age instantly.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex justify-center gap-2 flex-wrap">
          <button onClick={() => setActiveTab('emi')} className={`px-4 py-2 rounded-xl font-bold text-xs ${activeTab === 'emi' ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}>
            EMI Calculator
          </button>
          <button onClick={() => setActiveTab('percentage')} className={`px-4 py-2 rounded-xl font-bold text-xs ${activeTab === 'percentage' ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}>
            Percentage
          </button>
          <button onClick={() => setActiveTab('bmi')} className={`px-4 py-2 rounded-xl font-bold text-xs ${activeTab === 'bmi' ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}>
            BMI Calculator
          </button>
          <button onClick={() => setActiveTab('age')} className={`px-4 py-2 rounded-xl font-bold text-xs ${activeTab === 'age' ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}>
            Age Calculator
          </button>
        </div>

        {/* EMI CALCULATOR */}
        {activeTab === 'emi' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Loan Amount ($)</label>
                <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Interest Rate (%)</label>
                <input type="number" step={0.1} value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Tenure (Years)</label>
                <input type="number" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-obsidian-secondary border border-obsidian-border rounded-xl text-center">
              <div><span className="block text-xs text-obsidian-text-muted">Monthly EMI</span><span className="text-lg font-extrabold text-purple-400">${emiRes.emi.toLocaleString()}</span></div>
              <div><span className="block text-xs text-obsidian-text-muted">Total Interest</span><span className="text-lg font-bold text-white">${emiRes.totalInterest.toLocaleString()}</span></div>
              <div><span className="block text-xs text-obsidian-text-muted">Total Payment</span><span className="text-lg font-bold text-white">${emiRes.totalPayment.toLocaleString()}</span></div>
            </div>
          </div>
        )}

        {/* PERCENTAGE CALCULATOR */}
        {activeTab === 'percentage' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">What is</span>
              <input type="number" value={pctVal} onChange={(e) => setPctVal(e.target.value)} className="w-24 bg-obsidian-secondary border border-obsidian-border text-white text-sm p-2.5 rounded-xl font-bold text-center" />
              <span className="text-sm text-gray-300">% of</span>
              <input type="number" value={totalVal} onChange={(e) => setTotalVal(e.target.value)} className="w-28 bg-obsidian-secondary border border-obsidian-border text-white text-sm p-2.5 rounded-xl font-bold text-center" />
              <span className="text-sm text-gray-300">?</span>
            </div>

            <div className="p-4 bg-obsidian-secondary border border-obsidian-border rounded-xl text-center">
              <span className="block text-xs text-obsidian-text-muted mb-1">Result</span>
              <span className="text-2xl font-extrabold text-purple-400">
                {((parseFloat(pctVal) || 0) * (parseFloat(totalVal) || 0) / 100).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* BMI CALCULATOR */}
        {activeTab === 'bmi' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Height (cm)</label>
                <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Weight (kg)</label>
                <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl" />
              </div>
            </div>

            <div className="p-4 bg-obsidian-secondary border border-obsidian-border rounded-xl text-center space-y-1">
              <span className="block text-xs text-obsidian-text-muted">Your Body Mass Index (BMI)</span>
              <span className="text-3xl font-extrabold text-purple-400">{bmiRes.bmi}</span>
              <span className="block text-xs font-semibold text-emerald-400">{bmiRes.category}</span>
            </div>
          </div>
        )}

        {/* AGE CALCULATOR */}
        {activeTab === 'age' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Select Birth Date</label>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl" />
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-obsidian-secondary border border-obsidian-border rounded-xl text-center">
              <div><span className="block text-xs text-obsidian-text-muted">Years</span><span className="text-2xl font-extrabold text-purple-400">{ageRes.years}</span></div>
              <div><span className="block text-xs text-obsidian-text-muted">Months</span><span className="text-2xl font-extrabold text-white">{ageRes.months}</span></div>
              <div><span className="block text-xs text-obsidian-text-muted">Days</span><span className="text-2xl font-extrabold text-white">{ageRes.days}</span></div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
