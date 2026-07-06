import { Search, ArrowUpDown, SlidersHorizontal } from 'lucide-react'

export default function FilterBar({ filters, onChange }) {
  function handleInput(e) {
    onChange({ ...filters, keyword: e.target.value, page: 0 })
  }

  function handleStatusChange(value) {
    onChange({ ...filters, completed: value, page: 0 })
  }

  function handleSort(e) {
    onChange({ ...filters, sortBy: e.target.value, page: 0 })
  }

  function handleDirection(e) {
    onChange({ ...filters, direction: e.target.value, page: 0 })
  }

  const statusOptions = [
    { label: 'Tất cả', value: null },
    { label: 'Chưa xong', value: false },
    { label: 'Đã xong', value: true },
  ]

  return (
    <div className="flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6">
      {/* Top Row: Search and Status Segmented Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="relative lg:col-span-7">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            value={filters.keyword}
            onChange={handleInput}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-sm"
          />
        </div>

        {/* Segmented Tabs for status */}
        <div className="flex lg:col-span-5 bg-slate-100 p-1 rounded-xl items-center">
          {statusOptions.map((opt) => {
            const isActive = filters.completed === opt.value
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => handleStatusChange(opt.value)}
                className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom Row: Sorting Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <SlidersHorizontal size={14} />
          <span>Sắp xếp & Bộ lọc</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort By Field */}
          <div className="relative flex items-center">
            <select
              value={filters.sortBy}
              onChange={handleSort}
              className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all cursor-pointer"
            >
              <option value="createdAt">Ngày tạo</option>
              <option value="title">Tiêu đề</option>
              <option value="priority">Độ ưu tiên</option>
            </select>
            <ArrowUpDown size={12} className="absolute right-2.5 pointer-events-none text-slate-400" />
          </div>

          {/* Sort Direction */}
          <div className="relative flex items-center">
            <select
              value={filters.direction}
              onChange={handleDirection}
              className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all cursor-pointer"
            >
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </select>
            <ArrowUpDown size={12} className="absolute right-2.5 pointer-events-none text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
