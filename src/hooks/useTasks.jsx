import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../services/supabase'

export const useTasks = () => {
  const [defaultTasks, setDefaultTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('default_tasks')
        .select('*')
        .order('points', { ascending: true })

      if (!error) setDefaultTasks(data || [])
      setLoading(false)
    }
    fetchTasks()
  }, [])

  return { defaultTasks, loading }
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
