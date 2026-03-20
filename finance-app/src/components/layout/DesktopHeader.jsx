import React from "react";
import { Search, Bell } from "lucide-react";

export default function DesktopHeader() {
    return (
        <div className="flex justify-between items-center mb-8">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text"
                    placeholder="Cari Transaksi..."
                    className="w-full bg-white border border-gray-100 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-emerald-500/20"
                />
            </div>
            <div className="flex items-center gap-4">
                <div className="flex gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                    <button className="text-slate-800"><Bell size={18} /></button>
                </div>
                <div className="flex items-center gap-3 bg-white pl-2 pr-4 py-1 5 rounded-full border border-gray-100 shadow-sm cursor-pointer">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                        A.
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Alif</span>
                </div>
            </div>
        </div>
    );
}