import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../services/supabase'

// ============================================
// DEFAULT SEED TASKS (used when parent has none)
// ============================================
const SEED_TASKS = [
  { title: 'Brush Teeth', points: 5, icon: '🪥' },
  { title: 'Study 30 Minutes', points: 10, icon: '📚' },
  { title: 'Pray', points: 5, icon: '🤲' },
  { title: 'Clean Room', points: 10, icon: '🧹' },
  { title: 'Drink Water', points: 3, icon: '💧' },
  { title: 'Read a Book', points: 10, icon: '📖' },
  { title: 'Exercise', points: 8, icon: '🏃' },
  { title: 'Help Parents', points: 10, icon: '🤝' },
  { title: 'Sleep Early', points: 5, icon: '😴' },
  { title: 'Eat Healthy', points: 5, icon: '🥗' },
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

    const { data, error } = await supabase
      .from('default_tasks')
      .insert({ title, points: points || 5, icon: icon || '⭐', parent_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setDefaultTasks(prev => [...prev, data])
    }
    return { data, error }
  }, [])

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

  return { defaultTasks, loading, addTask, updateTask, deleteTask, refetchTasks: fetchTasks }
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

    // Only show loading spinner on initial load, not re-fetches
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

  // Initial fetch only once per childId
  useEffect(() => {
    initCalledRef.current = false
    fetchChildTasks(true)
  }, [childId])

  const initDailyTasks = useCallback(async (defaultTasks) => {
    if (!childId || !defaultTasks.length) return
    // Prevent calling init more than once per mount
    if (initCalledRef.current) return
    initCalledRef.current = true

    // Query DB directly for existing tasks — don't rely on stale state
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
      // Fetch updated tasks without showing loading spinner
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
