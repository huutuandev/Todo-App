import { useEffect, useState } from 'react'
import { Plus, Check, X, ClipboardList, PenTool } from 'lucide-react'

const EMPTY_FORM = { title: '', description: '', priority: 'MEDIUM' }

export default function TodoForm({ editingTodo, onSubmit, onCancelEdit, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingTodo) {
      setForm({
        title: editingTodo.title,
        description: editingTodo.description || '',
        priority: editingTodo.priority,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError('')
  }, [editingTodo])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmedTitle = form.title.trim()
    if (!trimmedTitle) {
      setError('Tiêu đề không được để trống')
      return
    }
    if (trimmedTitle.length > 255) {
      setError('Tiêu đề tối đa 255 ký tự')
      return
    }
    setError('')

    try {
      await onSubmit({ ...form, title: trimmedTitle })
      if (!editingTodo) setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form
      className={`bg-white border rounded-2xl p-5 shadow-sm transition-all duration-300 ${
        editingTodo
          ? 'border-amber-400 bg-amber-50/10 shadow-amber-100/40 ring-1 ring-amber-400/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
      onSubmit={handleSubmit}
    >
      {/* Header/Mode indicator */}
      <div className="flex items-center gap-2 mb-4">
        {editingTodo ? (
          <>
            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <PenTool size={16} />
            </div>
            <h2 className="text-sm font-semibold text-slate-800">Cập nhật công việc</h2>
          </>
        ) : (
          <>
            <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg">
              <ClipboardList size={16} />
            </div>
            <h2 className="text-sm font-semibold text-slate-800">Thêm công việc mới</h2>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <div className="md:col-span-3">
          <input
            type="text"
            name="title"
            placeholder="Tên công việc..."
            value={form.title}
            onChange={handleChange}
            maxLength={255}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-sm"
          />
        </div>
        <div>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-sm cursor-pointer"
          >
            <option value="LOW">Độ ưu tiên: Thấp</option>
            <option value="MEDIUM">Độ ưu tiên: Trung bình</option>
            <option value="HIGH">Độ ưu tiên: Cao</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <textarea
          name="description"
          placeholder="Mô tả công việc (không bắt buộc)..."
          value={form.description}
          onChange={handleChange}
          rows={2}
          maxLength={2000}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-sm resize-none"
        />
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-xs font-medium">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <div className="text-xs text-slate-400">
          * Điền tên công việc và chọn độ ưu tiên
        </div>
        <div className="flex gap-2">
          {editingTodo && (
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-850 hover:bg-slate-100 rounded-xl transition-all"
              onClick={onCancelEdit}
            >
              <X size={15} />
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className={`flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 ${
              editingTodo
                ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500/25 active:scale-[0.98]'
                : 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/25 active:scale-[0.98]'
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            {editingTodo ? (
              <>
                <Check size={15} className="stroke-[2.5]" />
                Lưu thay đổi
              </>
            ) : (
              <>
                <Plus size={15} className="stroke-[2.5]" />
                Thêm công việc
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
