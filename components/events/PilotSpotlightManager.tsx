'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Plus, X, Edit2, Trash2, User, Award, Quote,
  TrendingUp, Eye, ChevronUp, ChevronDown, Image as ImageIcon,
  CheckCircle, AlertCircle, Save, Search, Filter
} from 'lucide-react';
import { supabase } from '../enterprise/hooks/useEnterpriseAuth';

interface PilotSpotlightManagerProps {
  eventId: string;
  eventTitle: string;
  user?: any;
  onClose?: () => void;
}

interface Spotlight {
  id: string;
  event_id: string;
  profile_id: string;
  spotlight_title: string;
  spotlight_description: string;
  spotlight_image_url: string;
  featured_quote: string;
  achievements: string[];
  is_featured: boolean;
  display_order: number;
  views_count: number;
  profile?: {
    display_name: string;
    email: string;
    profile_image_url: string;
  };
}

export function PilotSpotlightManager({ eventId, eventTitle, user, onClose }: PilotSpotlightManagerProps) {
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSpotlight, setEditingSpotlight] = useState<Spotlight | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all');

  const [formData, setFormData] = useState({
    profile_id: '',
    spotlight_title: '',
    spotlight_description: '',
    spotlight_image_url: '',
    featured_quote: '',
    achievements: [] as string[],
    is_featured: false,
    display_order: 0,
  });

  const [newAchievement, setNewAchievement] = useState('');

  useEffect(() => {
    loadSpotlights();
  }, [eventId]);

  const loadSpotlights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pilot_spotlights')
        .select(`
          *,
          profiles (
            display_name,
            email,
            profile_image_url
          )
        `)
        .eq('event_id', eventId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSpotlights(data || []);
    } catch (err) {
      console.error('Error loading spotlights:', err);
      setError('Failed to load spotlights');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.spotlight_title || !formData.spotlight_description) {
      setError('Please fill in required fields');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const spotlightData = {
        event_id: eventId,
        profile_id: formData.profile_id || null,
        spotlight_title: formData.spotlight_title,
        spotlight_description: formData.spotlight_description,
        spotlight_image_url: formData.spotlight_image_url || null,
        featured_quote: formData.featured_quote || null,
        achievements: formData.achievements,
        is_featured: formData.is_featured,
        display_order: formData.display_order,
      };

      let result;
      if (editingSpotlight) {
        const { data, error } = await supabase
          .from('pilot_spotlights')
          .update(spotlightData)
          .eq('id', editingSpotlight.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('pilot_spotlights')
          .insert(spotlightData)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      await loadSpotlights();
      setShowForm(false);
      setEditingSpotlight(null);
      resetForm();
    } catch (err) {
      console.error('Error saving spotlight:', err);
      setError('Failed to save spotlight');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (spotlightId: string) => {
    if (!confirm('Are you sure you want to delete this spotlight?')) return;

    try {
      const { error } = await supabase
        .from('pilot_spotlights')
        .delete()
        .eq('id', spotlightId);

      if (error) throw error;
      await loadSpotlights();
    } catch (err) {
      console.error('Error deleting spotlight:', err);
      setError('Failed to delete spotlight');
    }
  };

  const handleEdit = (spotlight: Spotlight) => {
    setEditingSpotlight(spotlight);
    setFormData({
      profile_id: spotlight.profile_id,
      spotlight_title: spotlight.spotlight_title,
      spotlight_description: spotlight.spotlight_description,
      spotlight_image_url: spotlight.spotlight_image_url,
      featured_quote: spotlight.featured_quote,
      achievements: spotlight.achievements || [],
      is_featured: spotlight.is_featured,
      display_order: spotlight.display_order,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      profile_id: '',
      spotlight_title: '',
      spotlight_description: '',
      spotlight_image_url: '',
      featured_quote: '',
      achievements: [],
      is_featured: false,
      display_order: spotlights.length,
    });
    setNewAchievement('');
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, newAchievement.trim()],
      });
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index),
    });
  };

  const toggleFeatured = async (spotlight: Spotlight) => {
    try {
      const { error } = await supabase
        .from('pilot_spotlights')
        .update({ is_featured: !spotlight.is_featured })
        .eq('id', spotlight.id);

      if (error) throw error;
      await loadSpotlights();
    } catch (err) {
      console.error('Error toggling featured status:', err);
    }
  };

  const filteredSpotlights = spotlights.filter(spotlight => {
    const matchesSearch = !searchQuery || 
      spotlight.spotlight_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spotlight.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterFeatured === 'all' ||
      (filterFeatured === 'featured' && spotlight.is_featured) ||
      (filterFeatured === 'regular' && !spotlight.is_featured);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400" />
              Pilot Spotlights
            </h1>
            <p className="text-slate-400 text-sm mt-1">{eventTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetForm();
                setEditingSpotlight(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Spotlight
            </button>
            {onCancel && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                      {editingSpotlight ? 'Edit Spotlight' : 'Add Spotlight'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingSpotlight(null);
                        resetForm();
                      }}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Spotlight Title *</label>
                      <input
                        type="text"
                        value={formData.spotlight_title}
                        onChange={(e) => setFormData({ ...formData, spotlight_title: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., Keynote Speaker, Career Fair Hire"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Description *</label>
                      <textarea
                        value={formData.spotlight_description}
                        onChange={(e) => setFormData({ ...formData, spotlight_description: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
                        placeholder="Describe why this pilot is being spotlighted..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Featured Quote</label>
                      <textarea
                        value={formData.featured_quote}
                        onChange={(e) => setFormData({ ...formData, featured_quote: e.target.value })}
                        rows={2}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
                        placeholder="A memorable quote from the pilot..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Achievements</label>
                      <div className="space-y-2">
                        {formData.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                            <Award className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="text-white text-sm flex-1">{achievement}</span>
                            <button
                              onClick={() => removeAchievement(index)}
                              className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newAchievement}
                            onChange={(e) => setNewAchievement(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Add achievement..."
                          />
                          <button
                            onClick={addAchievement}
                            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Image URL</label>
                      <input
                        type="text"
                        value={formData.spotlight_image_url}
                        onChange={(e) => setFormData({ ...formData, spotlight_image_url: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                          className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-white text-sm">Featured Spotlight</span>
                      </label>

                      <div className="flex-1">
                        <label className="block text-slate-400 text-xs font-medium mb-1">Display Order</label>
                        <input
                          type="number"
                          value={formData.display_order}
                          onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingSpotlight(null);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-2.5 transition-all"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Spotlight
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spotlights..."
              className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 transition-all"
            />
          </div>
          <select
            value={filterFeatured}
            onChange={(e) => setFilterFeatured(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Spotlights</option>
            <option value="featured">Featured Only</option>
            <option value="regular">Regular Only</option>
          </select>
        </div>

        {/* Spotlights List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredSpotlights.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
            <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No spotlights found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpotlights.map(spotlight => (
              <motion.div
                key={spotlight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-slate-900/40 border rounded-2xl overflow-hidden ${
                  spotlight.is_featured ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-800/40'
                }`}
              >
                {/* Header */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {spotlight.is_featured && (
                        <div className="flex items-center gap-1 text-amber-400 text-xs mb-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          Featured
                        </div>
                      )}
                      <h3 className="text-white font-semibold">{spotlight.spotlight_title}</h3>
                      {spotlight.profile?.display_name && (
                        <p className="text-slate-400 text-xs">{spotlight.profile.display_name}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(spotlight)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(spotlight.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Quote */}
                  {spotlight.featured_quote && (
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Quote className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <p className="text-slate-300 text-xs italic">"{spotlight.featured_quote}"</p>
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {spotlight.achievements && spotlight.achievements.length > 0 && (
                    <div className="space-y-1">
                      {spotlight.achievements.slice(0, 2).map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <Award className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="text-slate-300">{achievement}</span>
                        </div>
                      ))}
                      {spotlight.achievements.length > 2 && (
                        <p className="text-slate-500 text-xs">+{spotlight.achievements.length - 2} more achievements</p>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-slate-400 text-xs line-clamp-2">{spotlight.spotlight_description}</p>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-700/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Eye className="w-3 h-3" />
                    <span>{spotlight.views_count || 0} views</span>
                  </div>
                  <button
                    onClick={() => toggleFeatured(spotlight)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                      spotlight.is_featured
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-700 text-slate-400 hover:text-amber-400'
                    }`}
                  >
                    {spotlight.is_featured ? 'Featured' : 'Make Featured'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-slate-400 text-xs">Total Spotlights</p>
                <p className="text-2xl font-bold text-white">{spotlights.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
              <div>
                <p className="text-slate-400 text-xs">Featured</p>
                <p className="text-2xl font-bold text-white">{spotlights.filter(s => s.is_featured).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-slate-400 text-xs">Total Views</p>
                <p className="text-2xl font-bold text-white">{spotlights.reduce((sum, s) => sum + (s.views_count || 0), 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-white font-semibold text-sm mb-1">Pilot Spotlights</h4>
              <p className="text-slate-400 text-xs">
                Feature exceptional pilots, showcase success stories, highlight keynote speakers, and feature career fair hires. 
                Featured spotlights are prominently displayed on the event page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PilotSpotlightManager;
