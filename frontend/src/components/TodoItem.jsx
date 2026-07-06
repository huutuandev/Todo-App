import { Check, Pencil, Trash2, AlertCircle } from 'lucide-react'

const PRIORITY_LABEL = { LOW: 'Thấp', MEDIUM: 'Trung bình', HIGH: 'Cao' }

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  return (
    <li
      className={`group relative flex items-start gap-4 bg-white border rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:border-slate-300 ${
        todo.completed ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200'
      }`}
    >
      {/* Custom Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`mt-1 flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
          todo.completed
            ? 'bg-brand-600 border-brand-600 text-white'
            : 'border-slate-300 hover:border-brand-500 bg-white'
        }`}
        aria-label={todo.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
        title="Đánh dấu hoàn thành / chưa hoàn thành"
      >
        {todo.completed && <Check size={14} className="stroke-[3]" />}
      </button>

      {/* Todo Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[15px] font-medium tracking-tight break-words max-w-full transition-all duration-200 ${
              todo.completed
                ? 'text-slate-400 line-through decoration-slate-300'
                : 'text-slate-700'
            }`}
          >
            {todo.title}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              todo.priority === 'LOW'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                : todo.priority === 'MEDIUM'
                ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                : 'bg-rose-50 text-rose-700 border-rose-200/60'
            }`}
          >
            {PRIORITY_LABEL[todo.priority]}
          </span>
        </div>
        {todo.description && (
          <p
            className={`mt-1.5 text-sm leading-relaxed break-words transition-all duration-200 ${
              todo.completed ? 'text-slate-400/80' : 'text-slate-500'
            }`}
          >
            {todo.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          title="Chỉnh sửa"
          aria-label="Chỉnh sửa công việc"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          title="Xóa"
          aria-label="Xóa công việc"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  )
}
