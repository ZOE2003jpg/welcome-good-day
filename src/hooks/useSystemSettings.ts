import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface SystemSetting {
  id: string
  setting_key: string
  value: string
  description: string | null
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
        .order('setting_key', { ascending: true })

      if (error) throw error
      setSettings(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const getSetting = (key: string) => {
    return settings.find(setting => setting.setting_key === key)?.value
  }

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          setting_key: key, 
          value,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      await fetchSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update setting')
      throw err
    }
  }

  useEffect(() => {
    fetchSettings()

    // Set up real-time subscription
    const channel = supabase
      .channel('system-settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_settings' }, () => {
        fetchSettings()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    settings,
    loading,
    error,
    fetchSettings,
    getSetting,
    updateSetting
  }
}