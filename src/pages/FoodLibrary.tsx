import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, CreditCard as Edit2, X, Check, Loader as Loader2, Utensils } from 'lucide-react';
import { EmptyState, SkeletonCard } from '../components/shared/UXStates';
import { cn } from '../lib/utils';

interface FoodLibraryItem {
  id: string;
  name: string;
  brand?: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  usage_count: number;
}

export default function FoodLibrary() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch food library
  const { data: foods = [], isLoading } = useQuery({
    queryKey: ['food-library', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_library')
        .select('*')
        .eq('user_id', user!.id)
        .order('usage_count', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as FoodLibraryItem[];
    },
    enabled: !!user?.id,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('food_library')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-library', user?.id] });
    },
  });

  const filteredFoods = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">Food Library</h1>
          <p className="page-subtitle">Your saved foods for quick logging</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Food
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your saved foods..."
          className="input-base pl-11"
        />
      </div>

      {/* Food List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : filteredFoods.length === 0 ? (
        <EmptyState
          icon={Utensils}
          title={search ? "No foods found" : "No saved foods yet"}
          message={search
            ? "Try a different search term"
            : "Save foods from your meal history to quickly add them again later."}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredFoods.map(food => (
            <FoodCard
              key={food.id}
              food={food}
              isEditing={editingId === food.id}
              onStartEdit={() => setEditingId(food.id)}
              onCancelEdit={() => setEditingId(null)}
              onDelete={() => deleteMutation.mutate(food.id)}
              userId={user!.id}
            />
          ))}
        </div>
      )}

      {/* Add Food Modal */}
      {isAdding && (
        <AddFoodModal
          userId={user!.id}
          onClose={() => setIsAdding(false)}
          onSuccess={() => {
            setIsAdding(false);
            queryClient.invalidateQueries({ queryKey: ['food-library', user?.id] });
          }}
        />
      )}
    </div>
  );
}

// ─── Food Card ────────────────────────────────────────────────────────────────────────

function FoodCard({
  food,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onDelete,
  userId,
}: {
  food: FoodLibraryItem;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState(food);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('food_library')
        .update({
          name: editData.name,
          brand: editData.brand,
          serving_size: editData.serving_size,
          serving_unit: editData.serving_unit,
          calories: editData.calories,
          protein: editData.protein,
          carbs: editData.carbs,
          fat: editData.fat,
        })
        .eq('id', food.id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['food-library', userId] });
      onCancelEdit();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-hover p-4 flex items-center justify-between group">
      {isEditing ? (
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 mr-4">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="input-base py-1.5 text-sm"
            placeholder="Name"
          />
          <input
            type="text"
            value={editData.brand || ''}
            onChange={(e) => setEditData({ ...editData, brand: e.target.value })}
            className="input-base py-1.5 text-sm"
            placeholder="Brand"
          />
          <input
            type="number"
            value={editData.calories}
            onChange={(e) => setEditData({ ...editData, calories: Number(e.target.value) })}
            className="input-base py-1.5 text-sm"
            placeholder="Cal"
          />
          <input
            type="number"
            value={editData.protein}
            onChange={(e) => setEditData({ ...editData, protein: Number(e.target.value) })}
            className="input-base py-1.5 text-sm"
            placeholder="Protein"
          />
        </div>
      ) : (
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm truncate">{food.name}</h4>
            {food.brand && (
              <span className="text-[10px] bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded uppercase font-bold text-muted-foreground">
                {food.brand}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-3">
            <span>{food.serving_size}{food.serving_unit}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{food.calories} kcal</span>
            <span className="text-[10px]">
              ({food.protein}p / {food.carbs}c / {food.fat}f)
            </span>
          </p>
        </div>
      )}

      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={onCancelEdit}
              className="p-2 rounded-lg text-muted-foreground hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onStartEdit}
              className="p-2 rounded-lg text-muted-foreground hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Add Food Modal ───────────────────────────────────────────────────────────────────

function AddFoodModal({
  userId,
  onClose,
  onSuccess,
}: {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    serving_size: '100',
    serving_unit: 'g',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('food_library')
        .insert({
          user_id: userId,
          name: form.name,
          brand: form.brand || null,
          serving_size: parseFloat(form.serving_size) || 100,
          serving_unit: form.serving_unit,
          calories: parseFloat(form.calories) || 0,
          protein: parseFloat(form.protein) || 0,
          carbs: parseFloat(form.carbs) || 0,
          fat: parseFloat(form.fat) || 0,
        });

      if (error) throw error;
      onSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden animate-slide-up">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Custom Food</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Food Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-base"
              placeholder="e.g., Homemade Granola"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Brand (optional)</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="input-base"
              placeholder="e.g., Homemade"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Serving Size</label>
              <input
                type="number"
                step="1"
                value={form.serving_size}
                onChange={(e) => setForm({ ...form, serving_size: e.target.value })}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Unit</label>
              <select
                value={form.serving_unit}
                onChange={(e) => setForm({ ...form, serving_unit: e.target.value })}
                className="input-base"
              >
                <option value="g">grams</option>
                <option value="ml">ml</option>
                <option value="oz">oz</option>
                <option value="serving">serving</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Calories *</label>
              <input
                type="number"
                required
                step="1"
                value={form.calories}
                onChange={(e) => setForm({ ...form, calories: e.target.value })}
                className="input-base"
                placeholder="kcal"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Protein</label>
              <input
                type="number"
                step="0.1"
                value={form.protein}
                onChange={(e) => setForm({ ...form, protein: e.target.value })}
                className="input-base"
                placeholder="g"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Carbs</label>
              <input
                type="number"
                step="0.1"
                value={form.carbs}
                onChange={(e) => setForm({ ...form, carbs: e.target.value })}
                className="input-base"
                placeholder="g"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Fat</label>
              <input
                type="number"
                step="0.1"
                value={form.fat}
                onChange={(e) => setForm({ ...form, fat: e.target.value })}
                className="input-base"
                placeholder="g"
              />
            </div>
          </div>

          <button type="submit" disabled={saving || !form.name || !form.calories} className="btn-primary w-full py-3 mt-2">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add to Library'}
          </button>
        </form>
      </div>
    </div>
  );
}
