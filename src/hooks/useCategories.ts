import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  display_order?: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories', err);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading };
}
