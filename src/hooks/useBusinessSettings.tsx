import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Tables } from '../lib/database.types';

interface BusinessSettings {
  time_format: string;
  currency: string; // Add currency setting
  locale: string; // Add locale setting
  // Add other settings as needed
}

export const useBusinessSettings = () => {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('businesses')
          .select('time_format, currency, locale') // Select currency and locale as well
          .eq('owner_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // No rows found
            setSettings({ time_format: '24h', currency: 'USD', locale: 'en-US' }); // Default to 24h, USD, and en-US if no settings found
          } else {
            setError(error.message);
          }
        } else if (data) {
          setSettings(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};