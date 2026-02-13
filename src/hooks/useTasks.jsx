import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../services/supabase'

// ============================================
// DEFAULT SEED TASKS (used when parent has none)
// ============================================
const SEED_TASKS = [
  { title: 'Brush Teeth', points: 5, icon: '🪥', sort_order: 0 },
  { title: 'Study 30 Minutes', points: 10, icon: '📚', sort_order: 1 },
  { title: 'Pray', points: 5, icon: '🤲', sort_order: 2 },
  { title: 'Clean Room', points: 10, icon: '🧹', sort_order: 3 },
  { title: 'Drink Water', points: 3, icon: '💧', sort_order: 4 },
  { title: 'Read a Book', points: 10, icon: '📖', sort_order: 5 },
  { title: 'Exercise', points: 8, icon: '🏃', sort_order: 6 },
  { title: 'Help Parents', points: 10, icon: '🤝', sort_order: 7 },
  { title: 'Sleep Early', points: 5, icon: '😴', sort_order: 8 },
  { title: 'Eat Healthy', points: 5, icon: '🥗', sort_order: 9 },
]

export const useTasks = () => {
  const [defaultTasks, setDefaultTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const seedingRef = useRef(false)

  const fetchTasks = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data, error } = await supabase
      .from('default_tasks')
      .select('*')
      .eq('parent_id', user.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (!error) {
      // If parent has no tasks yet, seed defaults
      if ((!data || data.length === 0) && !seedingRef.current) {
        seedingRef.current = true
        const seedRows = SEED_TASKS.map(t => ({ ...t, parent_id: user.id }))
        const { data: inserted } = await supabase
          .from('default_tasks')
          .insert(seedRows)
          .select()
        if (inserted) setDefaultTasks(inserted)
        seedingRef.current = false
      } else {
        setDefaultTasks(data || [])
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Add a new task
  const addTask = useCallback(async (title, points, icon) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // New tasks go to the end
    const maxOrder = defaultTasks.length > 0
      ? Math.max(...defaultTasks.map(t => t.sort_order ?? 0)) + 1
      : 0

    const { data, error } = await supabase
      .from('default_tasks')
      .insert({ title, points: points || 5, icon: icon || '⭐', parent_id: user.id, sort_order: maxOrder })
      .select()
      .single()

    if (!error && data) {
      setDefaultTasks(prev => [...prev, data])
    }
    return { data, error }
  }, [defaultTasks])

  // Update a task (title, icon, points)
  const updateTask = useCallback(async (taskId, updates) => {
    const { data, error } = await supabase
      .from('default_tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (!error && data) {
      setDefaultTasks(prev => prev.map(t => t.id === taskId ? data : t))
    }
    return { data, error }
  }, [])

  // Delete a task
  const deleteTask = useCallback(async (taskId) => {
    const { error } = await supabase
      .from('default_tasks')
      .delete()
      .eq('id', taskId)

    if (!error) {
      setDefaultTasks(prev => prev.filter(t => t.id !== taskId))
    }
    return { error }
  }, [])

  // Reorder tasks — swap sort_order between two tasks
  const reorderTask = useCallback(async (taskId, direction) => {
    const currentIndex = defaultTasks.findIndex(t => t.id === taskId)
    if (currentIndex === -1) return
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= defaultTasks.length) return

    const currentTask = defaultTasks[currentIndex]
    const targetTask = defaultTasks[targetIndex]

    // Optimistic update — swap in local state immediately
    const newTasks = [...defaultTasks]
    newTasks[currentIndex] = targetTask
    newTasks[targetIndex] = currentTask
    setDefaultTasks(newTasks)

    // Persist — swap sort_order values in DB
    const currentOrder = currentTask.sort_order ?? currentIndex
    const targetOrder = targetTask.sort_order ?? targetIndex

    await Promise.all([
      supabase
        .from('default_tasks')
        .update({ sort_order: targetOrder })
        .eq('id', currentTask.id),
      supabase
        .from('default_tasks')
        .update({ sort_order: currentOrder })
        .eq('id', targetTask.id),
    ])
  }, [defaultTasks])

  return { defaultTasks, loading, addTask, updateTask, deleteTask, reorderTask, refetchTasks: fetchTasks }
}

export const useChildTasks = (childId) => {
  const [childTasks, setChildTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const initCalledRef = useRef(false)
  const fetchingRef = useRef(false)

  const today = new Date().toISOString().split('T')[0]

  const fetchChildTasks = useCallback(async (isInitialLoad = false) => {
    if (!childId || fetchingRef.current) return
    fetchingRef.current = true

    if (isInitialLoad) setLoading(true)

    const { data, error } = await supabase
      .from('child_tasks')
      .select('*, default_tasks(*)')
      .eq('child_id', childId)
      .eq('date', today)

    if (!error) setChildTasks(data || [])
    setLoading(false)
    fetchingRef.current = false

    return data || []
  }, [childId, today])

  useEffect(() => {
    initCalledRef.current = false
    fetchChildTasks(true)
  }, [childId])

  const initDailyTasks = useCallback(async (defaultTasks) => {
    if (!childId || !defaultTasks.length) return
    if (initCalledRef.current) return
    initCalledRef.current = true

    const { data: existingData } = await supabase
      .from('child_tasks')
      .select('task_id')
      .eq('child_id', childId)
      .eq('date', today)

    const existingTaskIds = (existingData || []).map(ct => ct.task_id)

    const newTasks = defaultTasks
      .filter(t => !existingTaskIds.includes(t.id))
      .map(t => ({
        child_id: childId,
        task_id: t.id,
        date: today,
        is_done: false,
      }))

    if (newTasks.length > 0) {
      await supabase.from('child_tasks').insert(newTasks)
      await fetchChildTasks(false)
    }
  }, [childId, today, fetchChildTasks])

  const completeTask = useCallback(async (taskId) => {
    const { error } = await supabase
      .from('child_tasks')
      .update({ is_done: true, completed_at: new Date().toISOString() })
      .eq('id', taskId)

    if (!error) {
      setChildTasks(prev =>
        prev.map(ct =>
          ct.id === taskId ? { ...ct, is_done: true } : ct
        )
      )
    }
    return { error }
  }, [])

  return { childTasks, loading, initDailyTasks, completeTask, refetch: fetchChildTasks }
}
