import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from './useAuth'

export const useChildren = () => {
  const { user } = useAuth()
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchChildren = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: true })

    if (!error) setChildren(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchChildren()
  }, [fetchChildren])

  const addChild = useCallback(async (name, avatarFile) => {
    if (!user) return { error: 'Not authenticated' }

    let avatar_url = null

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('children-avatars')
        .upload(fileName, avatarFile)

      if (uploadError) return { error: uploadError.message }

      const { data: urlData } = supabase.storage
        .from('children-avatars')
        .getPublicUrl(fileName)
      avatar_url = urlData.publicUrl
    }

    const { data, error } = await supabase
      .from('children')
      .insert({ parent_id: user.id, name, avatar_url })
      .select()
      .single()

    if (!error) {
      setChildren(prev => [...prev, data])
    }
    return { data, error }
  }, [user])

  const updateChildPoints = useCallback(async (childId, points) => {
    const { error } = await supabase
      .from('children')
      .update({ points })
      .eq('id', childId)

    if (!error) {
      setChildren(prev =>
        prev.map(c => c.id === childId ? { ...c, points } : c)
      )
    }
  }, [])

  const updateChildAvatar = useCallback(async (childId, avatarFile) => {
    if (!user || !avatarFile) return { error: 'Missing data' }

    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('children-avatars')
      .upload(fileName, avatarFile)

    if (uploadError) return { error: uploadError.message }

    const { data: urlData } = supabase.storage
      .from('children-avatars')
      .getPublicUrl(fileName)
    const avatar_url = urlData.publicUrl

    const { error } = await supabase
      .from('children')
      .update({ avatar_url })
      .eq('id', childId)

    if (!error) {
      setChildren(prev =>
        prev.map(c => c.id === childId ? { ...c, avatar_url } : c)
      )
    }
    return { error }
  }, [user])

  const deleteChild = useCallback(async (childId) => {
    const { error } = await supabase
      .from('children')
      .delete()
      .eq('id', childId)

    if (!error) {
      setChildren(prev => prev.filter(c => c.id !== childId))
    }
    return { error }
  }, [])

  return { children, loading, addChild, deleteChild, updateChildPoints, updateChildAvatar, refetch: fetchChildren }
}
