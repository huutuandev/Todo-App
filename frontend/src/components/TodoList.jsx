import TodoItem from './TodoItem.jsx'
import { Inbox, FileText, Search } from 'lucide-react'

export default function TodoList({ todos, loading, onToggle, onEdit, onDelete, hasFilter }) {
  // Skeleton Loading State
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="flex items-start gap-4 bg-white border border-slate-100 rounded-xl p-4 animate-pulse"
          >
            <div className="w-5 h-5 rounded bg-slate-200 mt-1" />
            <div className="flex-1 space-y-2.5">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  // Beautiful SVG Empty State
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
          {hasFilter ? <Search size={32} /> : <Inbox size={32} />}
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          {hasFilter ? 'Không tìm thấy kết quả' : 'Danh sách trống'}
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          {hasFilter
            ? 'Không tìm thấy công việc nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm hiện tại.'
            : 'Hôm nay bạn không có công việc nào cần hoàn thành. Hãy thêm một công việc mới ở trên để bắt đầu!'}
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
