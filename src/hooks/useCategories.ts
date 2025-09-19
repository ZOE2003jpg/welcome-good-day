import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
  count: number
  created_at: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    }
  }

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('count', { ascending: false })

      if (error) throw error
      setTags(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags')
    }
  }

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([fetchCategories(), fetchTags()])
    setLoading(false)
  }

  const createCategory = async (categoryData: { name: string; description?: string }) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single()

      if (error) throw error
      await fetchCategories()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
      throw err
    }
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      await fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
      throw err
    }
  }

  const createTag = async (tagData: { name: string }) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert({ ...tagData, count: 0 })
        .select()
        .single()

      if (error) throw error
      await fetchTags()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag')
      throw err
    }
  }

  const updateTag = async (id: string, updates: Partial<Tag>) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      await fetchTags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tag')
      throw err
    }
  }

  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchTags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tag')
      throw err
    }
  }

  useEffect(() => {
    fetchAll()

    // Set up real-time subscriptions
    const categoriesChannel = supabase
      .channel('categories-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          fetchCategories()
        }
      )
      .subscribe()

    const tagsChannel = supabase
      .channel('tags-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tags'
        },
        () => {
          fetchTags()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(categoriesChannel)
      supabase.removeChannel(tagsChannel)
    }
  }, [])

  return {
    categories,
    tags,
    loading,
    error,
    fetchCategories,
    fetchTags,
    createCategory,
    updateCategory,
    deleteCategory,
    createTag,
    updateTag,
    deleteTag
  }
}