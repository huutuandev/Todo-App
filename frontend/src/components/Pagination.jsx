import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="flex items-center justify-center p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/10"
        title="Trang trước"
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} className="stroke-[2.5]" />
      </button>

      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/40">
        Trang {page + 1} <span className="text-slate-400 font-normal">/</span> {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page + 1 >= totalPages}
        className="flex items-center justify-center p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/10"
        title="Trang sau"
        aria-label="Trang sau"
      >
        <ChevronRight size={16} className="stroke-[2.5]" />
      </button>
    </div>
  )
}
