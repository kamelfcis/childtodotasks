import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from './useAuth'

export const useChildren = () => {
  const { user } = useAuth()
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchChildren = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: true })

    if (!error) setChildren(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchChildren()
  }, [user])

  const addChild = async (name, avatarFile) => {
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
  }

  const updateChildPoints = async (childId, points) => {
    const { error } = await supabase
      .from('children')
      .update({ points })
      .eq('id', childId)

    if (!error) {
      setChildren(prev =>
        prev.map(c => c.id === childId ? { ...c, points } : c)
      )
    }
  }

  const deleteChild = async (childId) => {
    const { error } = await supabase
      .from('children')
      .delete()
      .eq('id', childId)

    if (!error) {
      setChildren(prev => prev.filter(c => c.id !== childId))
    }
    return { error }
  }

  return { children, loading, addChild, deleteChild, updateChildPoints, refetch: fetchChildren }
}

