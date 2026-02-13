import { useState, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEdit3, FiTrash2, FiPlus, FiCheck, FiX, FiChevronDown, FiChevronUp, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import IconPicker from './IconPicker'
import { playPop } from '../sounds/useSounds'

// ============================================
// Single task row — view / edit mode
// ============================================
const TaskRow = memo(function TaskRow({ task, onUpdate, onDelete, onReorder, index, isFirst, isLast }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [icon, setIcon] = useState(task.icon || '⭐')
  const [points, setPoints] = useState(task.points)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    await onUpdate(task.id, { title: title.trim(), icon, points: Number(points) || 5 })
    playPop()
    setSaving(false)
    setEditing(false)
  }

  const handleCancel = () => {
    setTitle(task.title)
    setIcon(task.icon || '⭐')
    setPoints(task.points)
    setEditing(false)
    setShowIconPicker(false)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      onDelete(task.id)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', damping: 20 }}
      className={`rounded-2xl border-2 transition-all overflow-visible ${
        editing
          ? 'bg-purple-50/80 border-neon-purple/30 shadow-lg shadow-purple-100'
          : 'bg-white border-purple-100 hover:border-purple-200 shadow-sm'
      }`}
    >
      {editing ? (
        /* ========== EDIT MODE ========== */
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            {/* Icon selector */}
            <div className="relative">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-14 h-14 rounded-2xl bg-white border-2 border-purple-200 flex items-center justify-center text-3xl hover:border-neon-pink/40 transition-all shadow-sm"
                title="Change icon"
              >
                {icon}
              </motion.button>
              <AnimatePresence>
                {showIconPicker && (
                  <IconPicker
                    selectedIcon={icon}
                    onSelect={(emoji) => setIcon(emoji)}
                    onClose={() => setShowIconPicker(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Title input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task name..."
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-purple-200 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-pink/50 focus:ring-2 focus:ring-pink-200 transition-all font-semibold"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') handleCancel()
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Points input */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-secondary">Points:</span>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="1"
                max="100"
                className="w-20 px-3 py-2 rounded-xl bg-white border border-purple-200 text-text-primary focus:outline-none focus:border-neon-pink/50 focus:ring-2 focus:ring-pink-200 transition-all font-bold text-center"
              />
              <span className="text-neon-yellow">⭐</span>
            </div>

            <div className="flex-1" />

            {/* Save / Cancel buttons */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue text-white font-bold text-sm shadow-md shadow-green-200 disabled:opacity-50 transition-all"
            >
              <FiCheck /> {saving ? 'Saving...' : 'Save'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-text-secondary font-bold text-sm transition-all"
            >
              <FiX /> Cancel
            </motion.button>
          </div>
        </div>
      ) : (
        /* ========== VIEW MODE ========== */
        <div className="p-4 flex items-center gap-3">
          {/* Reorder Arrows — premium pill design */}
          <div className="flex flex-col gap-1 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.15, y: -1 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => onReorder(task.id, 'up')}
              disabled={isFirst}
              className={`group relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isFirst
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-500 hover:from-indigo-100 hover:to-blue-100 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md hover:shadow-indigo-100 cursor-pointer'
              }`}
              title="Move up"
            >
              <FiArrowUp className="text-sm stroke-[2.5]" />
              {!isFirst && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-indigo-400/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, y: 1 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => onReorder(task.id, 'down')}
              disabled={isLast}
              className={`group relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isLast
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-500 hover:from-indigo-100 hover:to-blue-100 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md hover:shadow-indigo-100 cursor-pointer'
              }`}
              title="Move down"
            >
              <FiArrowDown className="text-sm stroke-[2.5]" />
              {!isLast && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-indigo-400/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          </div>

          {/* Order badge */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-black text-purple-500">{index + 1}</span>
          </div>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
            {task.icon || '⭐'}
          </div>

          {/* Task info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-text-primary truncate">{task.title}</h4>
            <span className="text-neon-orange text-sm font-bold">+{task.points} ⭐</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEditing(true)}
              className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-500 hover:bg-blue-100 transition-all"
              title="Edit task"
            >
              <FiEdit3 className="text-base" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-400 hover:bg-red-100 transition-all"
              title="Delete task"
            >
              <FiTrash2 className="text-base" />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )
})

// ============================================
// NEW TASK FORM
// ============================================
function AddTaskForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('⭐')
  const [points, setPoints] = useState(5)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [adding, setAdding] = useState(false)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!title.trim()) return
    setAdding(true)
    await onAdd(title.trim(), Number(points) || 5, icon)
    playPop()
    setTitle('')
    setIcon('⭐')
    setPoints(5)
    setAdding(false)
    onCancel?.()
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.45, 0, 0.55, 1] }}
      onSubmit={handleSubmit}
      className="rounded-2xl border-2 border-dashed border-neon-green/40 bg-green-50/50 p-4 overflow-visible"
    >
      <h4 className="text-sm font-bold text-text-secondary mb-3">✨ New Task</h4>

      <div className="flex items-center gap-3 mb-3">
        {/* Icon selector */}
        <div className="relative">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="w-14 h-14 rounded-2xl bg-white border-2 border-purple-200 flex items-center justify-center text-3xl hover:border-neon-pink/40 transition-all shadow-sm"
            title="Choose icon"
          >
            {icon}
          </motion.button>
          <AnimatePresence>
            {showIconPicker && (
              <IconPicker
                selectedIcon={icon}
                onSelect={(emoji) => setIcon(emoji)}
                onClose={() => setShowIconPicker(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task name... (e.g. Brush Teeth)"
          required
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-purple-200 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-pink/50 focus:ring-2 focus:ring-pink-200 transition-all font-semibold"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Escape') onCancel?.()
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Points */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-text-secondary">Points:</span>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            min="1"
            max="100"
            className="w-20 px-3 py-2 rounded-xl bg-white border border-purple-200 text-text-primary focus:outline-none focus:border-neon-pink/50 focus:ring-2 focus:ring-pink-200 transition-all font-bold text-center"
          />
          <span className="text-neon-yellow">⭐</span>
        </div>

        <div className="flex-1" />

        <motion.button
          type="submit"
          disabled={adding || !title.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-green to-neon-blue text-white font-bold text-sm shadow-md shadow-green-200 disabled:opacity-50 transition-all"
        >
          <FiPlus /> {adding ? 'Adding...' : 'Add Task'}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-text-secondary font-bold text-sm transition-all"
        >
          Cancel
        </motion.button>
      </div>
    </motion.form>
  )
}

// ============================================
// MAIN TASK MANAGER COMPONENT
// ============================================
export default memo(function TaskManager({ tasks, onAdd, onUpdate, onDelete, onReorder, loading }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const handleReorder = useCallback((taskId, direction) => {
    onReorder?.(taskId, direction)
    playPop()
  }, [onReorder])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: 'spring', damping: 18 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-100 overflow-visible shadow-lg shadow-purple-50"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: [0.45, 0, 0.55, 1] }}
          >
            📋
          </motion.span>
          <div>
            <h2 className="text-xl font-black text-text-primary">Manage Tasks</h2>
            <p className="text-text-muted text-sm font-medium">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} • Edit, reorder & customize
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {expanded ? (
            <FiChevronUp className="text-text-muted text-xl" />
          ) : (
            <FiChevronDown className="text-text-muted text-xl" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.45, 0, 0.55, 1] }}
            className="overflow-visible"
          >
            <div className="px-6 pb-6 space-y-3">
              {/* Reorder hint */}
              {tasks.length > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 text-xs font-semibold"
                >
                  <FiArrowUp className="text-sm" />
                  <FiArrowDown className="text-sm" />
                  <span>Use arrows to reorder tasks — children will see them in this order</span>
                </motion.div>
              )}

              {/* Add new task button */}
              <AnimatePresence mode="wait">
                {showAddForm ? (
                  <AddTaskForm
                    key="form"
                    onAdd={async (title, points, icon) => {
                      await onAdd(title, points, icon)
                      setShowAddForm(false)
                    }}
                    onCancel={() => setShowAddForm(false)}
                  />
                ) : (
                  <motion.button
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowAddForm(true)}
                    className="w-full p-4 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 text-text-secondary hover:border-neon-pink/40 hover:text-neon-pink hover:bg-pink-50/50 transition-all flex items-center justify-center gap-2 font-bold"
                  >
                    <FiPlus className="text-lg" />
                    Add New Task
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Task list */}
              {loading ? (
                <div className="py-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-3xl inline-block"
                  >
                    ⏳
                  </motion.div>
                  <p className="text-text-muted text-sm mt-2">Loading tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="text-5xl mb-3">📝</div>
                  <p className="text-text-muted font-semibold">No tasks yet. Add your first task!</p>
                </div>
              ) : (
                <AnimatePresence>
                  {tasks.map((task, index) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onReorder={handleReorder}
                      index={index}
                      isFirst={index === 0}
                      isLast={index === tasks.length - 1}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})
