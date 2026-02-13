import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from './useAuth'

export const useGifts = () => {
  const { user } = useAuth()
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchGifts = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('parent_id', user.id)
      .order('required_points', { ascending: true })

    if (!error) setGifts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchGifts()
  }, [user])

  const addGift = async (title, requiredPoints, imageUrl) => {
    if (!user) return { error: 'Not authenticated' }
    const { data, error } = await supabase
      .from('gifts')
      .insert({
        parent_id: user.id,
        title,
        required_points: requiredPoints,
        image_url: imageUrl,
      })
      .select()
      .single()

    if (!error) setGifts(prev => [...prev, data])
    return { data, error }
  }

  const deleteGift = async (giftId) => {
    const { error } = await supabase
      .from('gifts')
      .delete()
      .eq('id', giftId)

    if (!error) setGifts(prev => prev.filter(g => g.id !== giftId))
    return { error }
  }

  const claimGift = async (childId, giftId, childPoints, giftCost) => {
    if (childPoints < giftCost) return { error: 'Not enough points' }

    const { error: rewardError } = await supabase
      .from('child_rewards')
      .insert({ child_id: childId, gift_id: giftId })

    if (rewardError) return { error: rewardError.message }

    const { error: pointsError } = await supabase
      .from('children')
      .update({ points: childPoints - giftCost })
      .eq('id', childId)

    if (pointsError) return { error: pointsError.message }

    return { error: null }
  }

  const getChildRewards = async (childId) => {
    const { data, error } = await supabase
      .from('child_rewards')
      .select('*, gifts(*)')
      .eq('child_id', childId)
      .order('claimed_at', { ascending: false })

    return { data, error }
  }

  return { gifts, loading, addGift, deleteGift, claimGift, getChildRewards, refetch: fetchGifts }
}

