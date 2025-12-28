'use client';
import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import type { Chart as ChartJS, ChartData, ChartOptions } from 'chart.js';
import Image from 'next/image';
import { ArrowLeft, BarChart, Bot, Check, ChevronsUpDown, Info, LineChart, TrendingUp } from 'lucide-react';

const firms = [
    { name: "East Yorkshire IFA", ask: 575000, ri: 175000 }, 
    { name: "Cheshire Based IFA", ask: 2000000, ri: 450000 },
    { name: "Yorkshire IFA", ask: 3500000, ri: 750000 },
    { name: "Herts Client Bank", ask: 125000, ri: 40000 },
    { name: "Essex High Profit", ask: 4000000, ri: 750000 },
    { name: "Northampton IFA", ask: 550000, ri: 140000 },
    { name: "West Midlands Huge", ask: 6000000, ri: 1500000 },
    { name: "Cardiff Sole Trader", ask: 350000, ri: 85000 },
    { name: "Coventry IFA", ask: 1200000, ri: 320000 },
    { name: "Essex Retiring", ask: 250000, ri: 85000 }
];

type Firm = typeof firms[0];

const SVCP_PREMIUM_RATE = 0.0635;
const INSURANCE_WRAP_COST = 0.015;
const STANDARD_INVESTMENT_GROWTH = 0.05;
const UK_PENSION_AVG_GROWTH = 0.045;
const REQUIRED_BENCHMARK_RATE = UK_PENSION_AVG_GROWTH * 2;


export default function Gen2CapitalPage() {
    const [currentFirm, setCurrentFirm] = useState<Firm>(firms[0]);
    const [cashPercent, setCashPercent] = useState(40);
    const [premiumPercent, setPremiumPercent] = useState(10);
    const [soniaRate, setSoniaRate] = useState(5.25);
    const [tenorYears, setTenorYears] = useState(10);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState("Ask a question to receive a compliance-aware explanation grounded in current financial knowledge.");
    const [loading, setLoading] = useState(false);

    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<ChartJS | null>(null);

    const formatCurrency = (num: number) => '£' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

    const stdPrice = currentFirm.ask;
    const stdTaxRate = 0.20;
    const stdTax = stdPrice * stdTaxRate;
    const stdNet = stdPrice - stdTax;

    const svcpPrice = currentFirm.ask * (1 + premiumPercent / 100);
    const svcpLiquidityGross = svcpPrice * (cashPercent / 100);
    const svcpLiquidityTax = svcpLiquidityGross * stdTaxRate;
    const svcpNetCash = svcpLiquidityGross - svcpLiquidityTax;
    const svcpDeferred = svcpPrice * (1 - cashPercent / 100);
    const svcpTotalNet = svcpNetCash + svcpDeferred;

    const svcpNotesYieldGross = (soniaRate / 100) + SVCP_PREMIUM_RATE;
    const svcpNotesYieldNet = svcpNotesYieldGross - INSURANCE_WRAP_COST;
    const notesAnnualMonetaryReturn = svcpDeferred * svcpNotesYieldNet;

    const stdYearX = stdNet * Math.pow(1 + STANDARD_INVESTMENT_GROWTH, tenorYears);
    const svcpCashYearX = svcpNetCash * Math.pow(1 + STANDARD_INVESTMENT_GROWTH, tenorYears);
    const svcpAsnYearX = svcpDeferred * Math.pow(1 + svcpNotesYieldNet, tenorYears);
    const svcpYearX = svcpCashYearX + svcpAsnYearX;
    
    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const chartData: ChartData = {
            labels: ['Net Investable Day 1', `Year ${tenorYears} Wealth`],
            datasets: [
                {
                    label: 'Traditional Sale',
                    data: [stdNet, stdYearX],
                    backgroundColor: '#64748B',
                    borderColor: '#64748B',
                    borderWidth: 0,
                    borderRadius: 6,
                },
                {
                    label: 'SVCP Smart Exit',
                    data: [svcpTotalNet, svcpYearX],
                    backgroundColor: '#FDDD7A',
                    borderColor: '#FDDD7A',
                    borderWidth: 0,
                    borderRadius: 6,
                },
            ],
        };

        const chartOptions: ChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#334155' },
                    ticks: {
                        color: '#F8FAFC',
                        callback: (value) => {
                            if (typeof value !== 'number') return value;
                            if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}m`;
                            return `£${(value / 1000).toFixed(0)}k`;
                        },
                    },
                    border: { display: false },
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#F8FAFC' },
                    border: { display: false },
                },
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label || ''}: ${formatCurrency(context.parsed.y)}`,
                    },
                    backgroundColor: '#0F3B57',
                    titleColor: '#FDDD7A',
                    bodyColor: '#F8FAFC',
                    padding: 10,
                    cornerRadius: 6,
                },
            },
            animation: { duration: 1000 },
        };

        if (chartInstanceRef.current) {
            chartInstanceRef.current.data = chartData;
            chartInstanceRef.current.options = chartOptions;
            chartInstanceRef.current.update();
        } else {
            chartInstanceRef.current = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: chartOptions,
            });
        }
    }, [stdNet, stdYearX, svcpTotalNet, svcpYearX, tenorYears]);

    const handleFirmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentFirm(firms[parseInt(e.target.value)]);
    };

    const handleAskQuestion = async () => {
      // Mocking API call for now
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnswer(`The 'Retain and Realise' mechanism is a structured financial product designed to provide liquidity to business owners while allowing them to retain a significant economic interest in their company. It works by converting a portion of the sale proceeds into Asset Secured Notes (ASN), which are tax-deferred instruments that generate a yield. This allows the owner to receive immediate cash (which is taxed) and a stream of future income, creating a tax-efficient exit strategy.`);
      setLoading(false);
    };

    return (
        <div className="bg-[#1E293B] text-[#F8FAFC] font-sans">
             <style jsx global>{`
                body { font-family: 'Inter', sans-serif; }
                .card-shadow { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); }
                .chart-container { position: relative; width: 100%; height: 300px; max-height: 350px; }
                input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 22px; width: 22px; border-radius: 50%; background: #FDDD7A; border: 3px solid #F8FAFC; cursor: pointer; margin-top: -10px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); }
                input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 6px; cursor: pointer; background: #475569; border-radius: 3px; }
                select { background-color: #FFFFFF; border-color: #475569; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230F3B57' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1.25em 1.25em; padding-right: 2.5rem; }
                input:focus, textarea:focus, select:focus { outline: none; box-shadow: 0 0 0 3px #FDDD7A; border-color: #FDDD7A; }
                .pattern-background { background: linear-gradient(135deg, #0F3B57 0%, #1E293B 100%); position: relative; overflow: hidden; }
                .pattern-background::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.08; background-image: radial-gradient(#FDDD7A 0.5px, transparent 0.5px); background-size: 15px 15px; pointer-events: none; }
                .text-accessible-gray { color: #CBD5E1; }
                .text-accessible-red { color: #FCA5A5; }
                .spinner { border: 4px solid rgba(255, 255, 255, 0.1); border-left-color: #FDDD7A; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .example-tag { cursor: pointer; transition: all 0.2s; border: 1px solid #475569; }
                .example-tag:hover { background-color: #0F3B57; border-color: #FDDD7A; }
            `}</style>
            <header className="bg-[#334155] border-b border-[#0F3B57] sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Image src="https://pub-acaff30517374e6599f5aba62151253c.r2.dev/SVCP_-logo-1-removebg-preview.png" alt="SVCP Capital Partners" width={160} height={80} className="object-contain filter brightness-110" />
                        <div className="hidden md:block border-l border-[#0F3B57] pl-6 h-16 flex flex-col justify-center">
                            <span className="text-[#B0BEDA] text-[10px] tracking-[0.2em] font-bold uppercase">Strategic Value Capital Partners</span>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-[#B0BEDA] uppercase tracking-widest font-bold">Pipeline Value</div>
                        <div className="font-bold text-[#FDDD7A] text-xl tracking-tight">£18.55m</div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
                <div className="pattern-background rounded-xl shadow-2xl p-8 md:p-12 text-[#F8FAFC] relative">
                    <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-2 space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight uppercase text-[#FDDD7A]">Retain and Realise<sup className="text-xl">&trade;</sup></h2>
                            <p className="text-[#F8FAFC] font-light text-lg leading-relaxed max-w-2xl">
                                HMRC compliant structured buyout product designed to deliver immediate, tax-efficient liquidity while preserving long-term economic participation in the underlying asset.
                            </p>
                        </div>
                        <div className="bg-[#FDDD7A] text-[#0F3B57] rounded-lg p-6 border border-[#0F3B57] text-center shadow-lg">
                            <div className="text-xs uppercase tracking-widest font-extrabold mb-2">Outcome</div>
                            <div className="text-3xl font-black tracking-tight">TAX ARBITRAGE</div>
                            <div className="text-xs mt-1 font-semibold">Convert Income to Compounding Growth</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#334155] rounded-xl card-shadow p-6 border-t-4 border-[#0F3B57]">
                            <h3 className="text-lg font-bold text-[#F8FAFC] mb-5 uppercase tracking-wider">1. Select Opportunity</h3>
                            <div className="relative">
                                <select onChange={handleFirmChange} className="w-full p-3 rounded-lg text-sm text-[#0F3B57]">
                                    {firms.map((firm, index) => (
                                        <option key={index} value={index}>
                                            {`${firm.name} (${firm.ask >= 1000000 ? `£${(firm.ask/1000000).toFixed(1)}m` : `£${(firm.ask/1000).toFixed(0)}k`})`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-[#475569]">
                                    <span className="text-xs font-bold text-[#B0BEDA] uppercase tracking-wide">Asking Price</span>
                                    <span className="font-bold text-[#F8FAFC] text-xl tracking-tight">{formatCurrency(currentFirm.ask)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-[#475569]">
                                    <span className="text-xs font-bold text-[#B0BEDA] uppercase tracking-wide">Recurring Rev (RI)</span>
                                    <span className="font-semibold text-[#B0BEDA]">{formatCurrency(currentFirm.ri)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-xs font-bold text-[#B0BEDA] uppercase tracking-wide">Implied Multiple</span>
                                    <span className="font-extrabold text-[#0F3B57] bg-[#FDDD7A] px-3 py-1 rounded-full text-xs">{(currentFirm.ask / currentFirm.ri).toFixed(1)}x</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#334155] rounded-xl card-shadow p-6 border-t-4 border-[#FDDD7A]">
                            <h3 className="text-lg font-bold text-[#F8FAFC] mb-5 uppercase tracking-wider">2. Structure the Offer</h3>
                            <div className="mb-8">
                                <div className="flex justify-between mb-3">
                                    <label className="text-xs font-bold text-[#B0BEDA] uppercase tracking-wide">Liquidity vs Fixed Income Split</label>
                                    <span className="text-[#F8FAFC] font-bold text-lg tracking-tight">{cashPercent}% Liquidity</span>
                                </div>
                                <input type="range" min="20" max="80" value={cashPercent} onChange={(e) => setCashPercent(parseInt(e.target.value))} className="w-full" />
                                <div className="flex justify-between text-[10px] text-[#B0BEDA] mt-2 font-bold uppercase">
                                    <span>More Fixed Income (ASN Notes)</span>
                                    <span>More Upfront Liquidity</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-[#B0BEDA] uppercase tracking-wide mb-2 block" htmlFor="tenorSelector">Note Tenor (Years)</label>
                                    <select id="tenorSelector" value={tenorYears} onChange={(e) => setTenorYears(parseInt(e.target.value))} className="w-full p-3 rounded-lg text-sm text-[#0F3B57]">
                                        <option value="5">5 Years</option>
                                        <option value="7">7 Years</option>
                                        <option value="10">10 Years</option>
                                        <option value="15">15 Years</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#B0BEDA] uppercase tracking-wide mb-2 block" htmlFor="soniaInput">SONIA Rate</label>
                                    <div className="flex items-center bg-[#1E293B] rounded-lg border border-[#475569] overflow-hidden focus-within:ring-2 focus-within:ring-[#FDDD7A]">
                                        <input type="number" id="soniaInput" value={soniaRate} step="0.01" onChange={(e) => setSoniaRate(parseFloat(e.target.value))} className="w-full p-3 text-center font-bold bg-transparent text-[#F8FAFC] outline-none" />
                                        <span className="pr-4 text-[#FDDD7A] font-bold text-lg">%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <label className="text-xs font-bold text-[#B0BEDA] uppercase tracking-wide mb-2 flex justify-between" htmlFor="premiumInput">
                                    <span>SVCP Enhanced Premium</span>
                                    <span className="text-[10px] text-[#FDDD7A] font-bold uppercase tracking-wider">Above Market Ask</span>
                                </label>
                                <div className="flex items-center bg-[#1E293B] rounded-lg border border-[#475569] overflow-hidden focus-within:ring-2 focus-within:ring-[#FDDD7A]">
                                    <span className="pl-4 text-[#FDDD7A] font-bold text-lg">+</span>
                                    <input type="number" id="premiumInput" value={premiumPercent} onChange={(e) => setPremiumPercent(parseInt(e.target.value))} className="w-full p-3 text-center font-bold bg-transparent text-[#F8FAFC] outline-none" />
                                    <span className="pr-4 text-[#FDDD7A] font-bold text-lg">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-[#334155] rounded-xl card-shadow p-6 md:p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#F8FAFC] tracking-tight uppercase">Net Wealth Comparison</h3>
                                    <p className="text-sm text-[#B0BEDA] mt-1">Projected {tenorYears}-Year Outcome: Standard vs. SVCP Structure</p>
                                </div>
                                <div className="flex gap-6 text-xs font-bold uppercase tracking-wide bg-[#1E293B] p-3 rounded-lg border border-[#475569] text-[#B0BEDA]">
                                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-gray-600"></span> Standard Sale</div>
                                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#FDDD7A]"></span> SVCP Smart Exit</div>
                                </div>
                            </div>
                            <div className="chart-container"><canvas ref={chartRef}></canvas></div>

                            <div className="mt-6">
                                <table className="w-full text-sm text-[#F8FAFC] border border-[#475569] rounded-lg overflow-hidden">
                                    <thead className="bg-[#1E293B] uppercase text-[#B0BEDA] text-xs tracking-wider">
                                        <tr>
                                            <th className="p-3 text-left font-semibold">Metric</th>
                                            <th className="p-3 text-right font-semibold">Traditional Sale</th>
                                            <th className="p-3 text-right font-semibold bg-[#0F3B57] text-[#FDDD7A]">SVCP Smart Exit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-[#475569] hover:bg-[#1E293B] transition-colors">
                                            <td className="p-3 font-medium">Net Investable Day 1</td>
                                            <td className="p-3 text-right text-gray-400">{formatCurrency(stdNet)}</td>
                                            <td className="p-3 text-right font-bold text-[#FDDD7A]">{formatCurrency(svcpTotalNet)}</td>
                                        </tr>
                                        <tr className="bg-[#1E293B]/50">
                                            <td className="p-3 font-black text-lg text-[#F8FAFC]">Projected Net Wealth (Year {tenorYears})</td>
                                            <td className="p-3 text-right font-bold text-lg text-gray-200">{formatCurrency(stdYearX)}</td>
                                            <td className="p-3 text-right font-black text-xl text-[#FDDD7A]">{formatCurrency(svcpYearX)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#1E293B] rounded-xl p-6 border-2 border-red-900 relative shadow-lg">
                                <div className="absolute -top-3 left-6 bg-red-900 text-red-300 text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-full shadow-md">TRADITIONAL PE-BACKED ACQUIRER</div>
                                <h4 className="font-bold text-accessible-gray mb-4 pb-2 border-b border-gray-700 flex justify-between mt-2 uppercase tracking-wide">
                                    Traditional Cash Exit (Max Tax Exposure)
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm"><span className="text-accessible-gray">Total Gross Offer</span><span className="font-bold text-svcp-text tracking-tight">{formatCurrency(stdPrice)}</span></div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-accessible-red flex items-center gap-2">Immediate Tax Liability (Est. 20% CGT) <Info size={16}/></span>
                                        <span className="text-accessible-red font-medium tracking-tight">-{formatCurrency(stdTax)}</span>
                                    </div>
                                    <div className="pt-4 mt-2 border-t border-gray-700 flex justify-between items-center">
                                        <span className="text-xs font-bold text-[#B0BEDA] uppercase tracking-widest">NET INVESTABLE DAY 1</span>
                                        <span className="text-2xl font-black text-[#F8FAFC] tracking-tight">{formatCurrency(stdNet)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#334155] rounded-xl p-6 border-2 border-[#FDDD7A] relative shadow-lg">
                                <div className="absolute -top-3 left-6 bg-[#FDDD7A] text-[#0F3B57] text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-full shadow-md">RETAIN AND REALISE&trade;</div>
                                <h4 className="font-bold text-[#FDDD7A] mb-4 pb-2 border-b border-[#475569] flex justify-between mt-2 uppercase tracking-wide">
                                    SVCP Smart Structure (Tax Deferral)
                                    <span className="text-xs font-extrabold bg-[#0F3B57] text-[#FDDD7A] px-2 py-0.5 rounded">TAX EFFICIENT</span>
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm"><span className="text-[#B0BEDA]">Immediate Taxable Cash (Net)</span><span className="font-bold text-[#F8FAFC] tracking-tight">{formatCurrency(svcpNetCash)}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-green-400">Tax Deferred Fixed Income (ASN)</span><span className="text-green-400 font-medium text-xs bg-green-900 px-2 py-0.5 rounded">{formatCurrency(svcpDeferred)}</span></div>
                                    <div className="pt-4 mt-2 border-t border-[#475569] flex justify-between items-center">
                                        <span className="text-xs font-bold text-[#FDDD7A] uppercase tracking-widest">TOTAL NET VALUE DAY 1</span>
                                        <span className="text-2xl font-black text-[#F8FAFC] tracking-tight">{formatCurrency(svcpTotalNet)}</span>
                                    </div>
                                </div>
                                <div className="mt-5 bg-[#1E293B] p-3 rounded-lg border border-[#0F3B57]">
                                    <div className="flex justify-between items-center mb-1"><span className="text-xs text-[#FDDD7A] font-bold uppercase tracking-wide">TOTAL ASN NOTES YIELD (Gross)</span><span className="text-xl font-black text-[#F8FAFC] tracking-tight">{(svcpNotesYieldGross * 100).toFixed(2)}%</span></div>
                                    <div className="flex justify-between items-center py-2 border-y border-[#475569] my-2"><span className="text-xs text-red-400 font-bold uppercase tracking-wide">GUARANTEED INCOME PROTECTION COST (1.50%)</span><span className="text-sm font-bold text-red-400 tracking-tight">-1.50%</span></div>
                                    <div className="flex justify-between items-center py-2 border-t border-[#475569] mt-2"><span className="text-xs text-[#F8FAFC] font-bold uppercase tracking-wide">ESTIMATED ANNUAL MONETARY RETURN (Net of Protection)</span><span className="text-xl font-black text-[#FDDD7A] tracking-tight">{formatCurrency(notesAnnualMonetaryReturn)}</span></div>
                                    <div className="flex justify-between items-center pt-2"><span className="text-xs text-[#B0BEDA] font-bold uppercase tracking-wide">Tax-Beating Benchmark (UK Avg +100%)</span><span className="text-xl font-black text-red-400 tracking-tight">{(REQUIRED_BENCHMARK_RATE * 100).toFixed(2)}%</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#334155] rounded-xl card-shadow p-6 border-t-4 border-[#0F3B57]">
                          <h3 className="text-lg font-bold text-[#F8FAFC] mb-5 uppercase tracking-wider flex items-center gap-2">SVCP Expert Analyst <Bot size={20} /> Q&A</h3>
                          <div className="mb-4">
                            <p className="text-xs text-[#B0BEDA] mb-2 font-bold uppercase">Example Questions:</p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="example-tag bg-[#1E293B] text-[#B0BEDA] p-2 rounded-full" onClick={() => setQuestion('What is the tax treatment of the Asset Secured Notes?')}>Tax Treatment?</span>
                              <span className="example-tag bg-[#1E293B] text-[#B0BEDA] p-2 rounded-full" onClick={() => setQuestion('Explain the \'Retain and Realise\' mechanism.')}>Mechanism?</span>
                              <span className="example-tag bg-[#1E293B] text-[#B0BEDA] p-2 rounded-full" onClick={() => setQuestion('How is the insurance wrap funded via risk tranching?')}>Insurance Funding?</span>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row gap-3 mb-4">
                            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="flex-grow p-3 text-sm rounded-lg bg-[#1E293B] border border-[#475569] text-[#F8FAFC] resize-none" rows={2} placeholder="Ask a question..." />
                            <button onClick={handleAskQuestion} disabled={loading} className="flex-shrink-0 px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-lg bg-[#FDDD7A] text-[#0F3B57] hover:bg-[#2C5E83] hover:text-white transition-colors flex items-center justify-center disabled:opacity-50">
                              {loading ? <div className="spinner"></div> : <span>Ask Analyst <Bot size={16} /></span>}
                            </button>
                          </div>
                          <div className="mt-4 p-4 min-h-[100px] rounded-lg bg-[#1E293B] border border-[#475569] text-[#F8FAFC] text-sm"><p className="text-sm">{answer}</p></div>
                        </div>
                    </div>
                </div>
                <section className="border-t border-[#475569] pt-10 mt-4">
                    <h3 className="text-center font-extrabold text-2xl text-[#F8FAFC] mb-10 uppercase tracking-tight">The Core Mechanism</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-[#334155] rounded-xl card-shadow text-center">
                            <div className="w-14 h-14 mx-auto bg-[#0F3B57] text-[#FDDD7A] rounded-full flex items-center justify-center text-xl font-black mb-4"><BarChart /></div>
                            <h4 className="font-extrabold text-[#F8FAFC] mb-2 uppercase tracking-tight text-lg">Asset Retention</h4>
                            <p className="text-sm text-[#B0BEDA] leading-relaxed">Capital is held in the ASN structure, remaining within the ecosystem to earn a priority yield, maximizing compounding returns.</p>
                        </div>
                        <div className="p-6 bg-[#334155] rounded-xl card-shadow text-center">
                            <div className="w-14 h-14 mx-auto bg-[#FDDD7A] text-[#0F3B57] rounded-full flex items-center justify-center text-xl font-black mb-4"><Check /></div>
                            <h4 className="font-extrabold text-[#F8FAFC] mb-2 uppercase tracking-tight text-lg">Tax-Free Liquidity</h4>
                            <p className="text-sm text-[#B0BEDA] leading-relaxed">Access immediate capital (up to 50% LTV) against the ASN. These loan proceeds are classed as debt, not income, ensuring tax efficiency.</p>
                        </div>
                        <div className="p-6 bg-[#334155] rounded-xl card-shadow text-center">
                            <div className="w-14 h-14 mx-auto bg-[#0F3B57] text-[#FDDD7A] rounded-full flex items-center justify-center text-xl font-black mb-4"><TrendingUp /></div>
                            <h4 className="font-extrabold text-[#F8FAFC] mb-2 uppercase tracking-tight text-lg">Compounding Yield</h4>
                            <p className="text-sm text-[#B0BEDA] leading-relaxed">The ASN's yield (net of protection) is structured to exceed the cost of the loan, creating a positive arbitrage and growing your wealth exponentially.</p>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-[#334155] border-t border-[#475569] py-10 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Image src="https://pub-acaff30517374e6599f5aba62151253c.r2.dev/SVCP_-logo-1-removebg-preview.png" alt="SVCP Logo" width={100} height={50} className="h-10 w-auto mx-auto mb-6 filter brightness-110" />
                    <p className="text-xs text-[#B0BEDA] uppercase tracking-widest font-bold">Strictly Private & Confidential, © Strategic Value Capital Partners Limited, All Rights Reserved.</p>
                    <p className="text-xs text-[#B0BEDA] mt-2">For Professional & Institutional Investors Only.</p>
                </div>
            </footer>
        </div>
    );
}
