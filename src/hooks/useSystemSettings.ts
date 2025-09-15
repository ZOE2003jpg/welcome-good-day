import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface SystemSetting {
  id: string
  setting_key: string
  value: string
  description?: string
  updated_at: string
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key')

      if (error) throw error
      setSettings(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const getSetting = (key: string): string | null => {
    const setting = settings.find(s => s.setting_key === key)
    return setting?.value || null
  }

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          setting_key: key, 
          value: value,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      await fetchSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update setting')
      throw err
    }
  }

  const updateMultipleSettings = async (settingsToUpdate: { [key: string]: string }) => {
    try {
      const updates = Object.entries(settingsToUpdate).map(([key, value]) => ({
        setting_key: key,
        value: value,
        updated_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('system_settings')
        .upsert(updates)

      if (error) throw error
      await fetchSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
      throw err
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return {
    settings,
    loading,
    error,
    fetchSettings,
    getSetting,
    updateSetting,
    updateMultipleSettings
  }
}