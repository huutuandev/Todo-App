import { useCallback, useEffect, useState } from 'react'
import TodoForm from './components/TodoForm.jsx'
import FilterBar from './components/FilterBar.jsx'
import TodoList from './components/TodoList.jsx'
import Pagination from './components/Pagination.jsx'
import { createTodo, deleteTodo, fetchTodos, toggleTodo, updateTodo } from './api/todoApi.js'
import { useDebouncedValue } from './hook/hooks.js'
import { CheckCircle2, AlertCircle, X, ListTodo, AlertTriangle, Trash2 } from 'lucide-react'
import './App.css'

const INITIAL_FILTERS = {
  keyword: '',
  completed: null,
  page: 0,
  size: 10,
  sortBy: 'createdAt',
  direction: 'desc',
}

export default function App() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [pageData, setPageData] = useState({ content: [], totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [editingTodo, setEditingTodo] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [banner, setBanner] = useState(null) // { type: 'error' | 'success', text }
  const [todoIdToDelete, setTodoIdToDelete] = useState(null) // Holds ID of todo queued for deletion

  const debouncedKeyword = useDebouncedValue(filters.keyword, 400)

  const loadTodos = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTodos({ ...filters, keyword: debouncedKeyword })
      setPageData(data)
    } catch (err) {
      setBanner({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }, [filters, debouncedKeyword])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  useEffect(() => {
    if (!banner) return
    const timer = setTimeout(() => setBanner(null), 4000)
    return () => clearTimeout(timer)
  }, [banner])

  async function handleFormSubmit(form) {
    setSubmitting(true)
    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, { ...form, completed: editingTodo.completed })
        setBanner({ type: 'success', text: 'Đã cập nhật công việc thành công!' })
        setEditingTodo(null)
      } else {
        await createTodo(form)
        setBanner({ type: 'success', text: 'Đã thêm công việc mới thành công!' })
      }
      await loadTodos()
    } catch (err) {
      setBanner({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggle(id) {
    try {
      await toggleTodo(id)
      await loadTodos()
    } catch (err) {
      setBanner({ type: 'error', text: err.message })
    }
  }

  // Trigger custom confirmation modal instead of native confirm
  function initiateDelete(id) {
    setTodoIdToDelete(id)
  }

  async function handleConfirmDelete() {
    if (!todoIdToDelete) return
    try {
      await deleteTodo(todoIdToDelete)
      setBanner({ type: 'success', text: 'Đã xóa công việc thành công!' })
      await loadTodos()
    } catch (err) {
      setBanner({ type: 'error', text: err.message })
    } finally {
      setTodoIdToDelete(null)
    }
  }

  const hasFilter = filters.keyword !== '' || filters.completed !== null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Toast Notification */}
      {banner && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-white border rounded-xl shadow-lg p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            {banner.type === 'success' ? (
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            ) : (
              <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
            )}
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-900">
                {banner.type === 'success' ? 'Thành công' : 'Thất bại'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{banner.text}</p>
            </div>
            <button
              onClick={() => setBanner(null)}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-0.5 transition-colors focus:outline-none"
              aria-label="Đóng thông báo"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 pt-10 sm:pt-14">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-600 text-white rounded-2xl shadow-sm shadow-brand-500/20">
              <ListTodo size={24} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Công việc của tôi</h1>
              <p className="text-xs text-slate-500 mt-0.5">Todo List App - Intern Developer Test</p>
            </div>
          </div>
          <div className="self-start sm:self-center bg-slate-100 border border-slate-200/60 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600">
            <span>Tổng cộng: </span>
            <span className="text-brand-600 font-bold">{pageData.totalElements || 0}</span>
          </div>
        </header>

        {/* Form to Add / Edit */}
        <section className="mb-6" aria-labelledby="form-heading">
          <h2 id="form-heading" className="sr-only">Form thêm hoặc sửa công việc</h2>
          <TodoForm
            editingTodo={editingTodo}
            onSubmit={handleFormSubmit}
            onCancelEdit={() => setEditingTodo(null)}
            submitting={submitting}
          />
        </section>

        {/* Filter and Search Bar */}
        <section className="mb-6" aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only">Bộ lọc tìm kiếm</h2>
          <FilterBar filters={filters} onChange={setFilters} />
        </section>

        {/* Todo List */}
        <section aria-labelledby="list-heading">
          <h2 id="list-heading" className="sr-only">Danh sách công việc</h2>
          <TodoList
            todos={pageData.content}
            loading={loading}
            onToggle={handleToggle}
            onEdit={setEditingTodo}
            onDelete={initiateDelete}
            hasFilter={hasFilter}
          />
        </section>

        {/* Pagination */}
        <Pagination
          page={filters.page}
          totalPages={pageData.totalPages}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      </main>

      {/* Custom Confirmation Modal */}
      {todoIdToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-5 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2 bg-rose-50 rounded-full">
                <AlertTriangle size={20} className="stroke-[2.5]" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Xác nhận xóa công việc</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa công việc này? Hành động này sẽ loại bỏ hoàn toàn thông tin công việc và không thể khôi phục lại.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTodoIdToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-xl shadow-sm transition-all"
              >
                <Trash2 size={14} />
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
