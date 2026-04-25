'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon, FileText, Share2, Download, Plus, X, Edit2, Trash2,
  Save, Search, Filter, CheckCircle, AlertCircle, Wand2, Copy, ExternalLink
} from 'lucide-react';
import { supabase } from '../enterprise/hooks/useEnterpriseAuth';

interface MarketingMaterialsGeneratorProps {
  eventId: string;
  eventTitle: string;
  user?: any;
  onClose?: () => void;
}

interface MarketingMaterial {
  id: string;
  event_id: string;
  material_type: string;
  title: string;
  description: string;
  generated_content: string;
  generated_image_url: string;
  template_id: string;
  customizations: any;
  download_count: number;
  status: string;
  created_at: string;
}

export function MarketingMaterialsGenerator({ eventId, eventTitle, user, onClose }: MarketingMaterialsGeneratorProps) {
  const [materials, setMaterials] = useState<MarketingMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MarketingMaterial | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'banner' | 'flyer' | 'social_post' | 'email_template'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'generated' | 'published'>('all');

  const [formData, setFormData] = useState({
    material_type: 'banner',
    title: '',
    description: '',
    generated_content: '',
    template_id: 'default',
    customizations: {
      headline: '',
      subheadline: '',
      call_to_action: 'Register Now',
      colors: { primary: '#1e40af', secondary: '#7c3aed' },
      include_date: true,
      include_location: true,
      include_logo: true,
    },
  });

  useEffect(() => {
    loadMaterials();
  }, [eventId]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_marketing_materials')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (err) {
      console.error('Error loading materials:', err);
      setError('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (!formData.title) {
      setError('Please enter a title');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // Simulate AI generation (in production, this would call an AI service)
      const generatedContent = generateMockContent(formData.material_type, eventTitle, formData.customizations);
      
      setFormData({
        ...formData,
        generated_content: generatedContent.text,
      });

      setGenerating(false);
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content');
      setGenerating(false);
    }
  };

  const generateMockContent = (type: string, eventName: string, customizations: any) => {
    const headline = customizations.headline || `Join Us at ${eventName}`;
    const subheadline = customizations.subheadline || `Don't miss this exciting aviation event`;
    const cta = customizations.call_to_action || 'Register Now';

    switch (type) {
      case 'banner':
        return {
          text: `# ${headline}\n\n${subheadline}\n\n[ ${cta} ]`,
          image: null,
        };
      case 'flyer':
        return {
          text: `${headline}\n\n${subheadline}\n\n✈️ Aviation Event\n📅 Date Coming Soon\n📍 Location TBA\n\n${cta}\n\n#Aviation #PilotCareer #Event`,
          image: null,
        };
      case 'social_post':
        return {
          text: `${headline}\n\n${subheadline}\n\n${cta}\n\n👉 Link in bio\n\n#Aviation #Pilot #Career #Event #Airshow`,
          image: null,
        };
      case 'email_template':
        return {
          text: `Subject: ${headline}\n\nHi Pilot,\n\n${subheadline}\n\nThis is your chance to connect with industry leaders, explore career opportunities, and take your aviation career to new heights.\n\n📅 Date: Coming Soon\n📍 Location: TBA\n\n${cta}\n\nBest regards,\nThe Pilot Recognition Team`,
          image: null,
        };
      default:
        return { text: '', image: null };
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.generated_content) {
      setError('Please generate content before saving');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const materialData = {
        event_id: eventId,
        material_type: formData.material_type,
        title: formData.title,
        description: formData.description,
        generated_content: formData.generated_content,
        generated_image_url: null,
        template_id: formData.template_id,
        customizations: formData.customizations,
        status: 'generated',
      };

      if (editingMaterial) {
        const { error } = await supabase
          .from('event_marketing_materials')
          .update(materialData)
          .eq('id', editingMaterial.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_marketing_materials')
          .insert(materialData);

        if (error) throw error;
      }

      await loadMaterials();
      setShowForm(false);
      setEditingMaterial(null);
      resetForm();
    } catch (err) {
      console.error('Error saving material:', err);
      setError('Failed to save material');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const { error } = await supabase
        .from('event_marketing_materials')
        .delete()
        .eq('id', materialId);

      if (error) throw error;
      await loadMaterials();
    } catch (err) {
      console.error('Error deleting material:', err);
      setError('Failed to delete material');
    }
  };

  const handleEdit = (material: MarketingMaterial) => {
    setEditingMaterial(material);
    setFormData({
      material_type: material.material_type,
      title: material.title,
      description: material.description,
      generated_content: material.generated_content || '',
      template_id: material.template_id,
      customizations: material.customizations || {},
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      material_type: 'banner',
      title: '',
      description: '',
      generated_content: '',
      template_id: 'default',
      customizations: {
        headline: '',
        subheadline: '',
        call_to_action: 'Register Now',
        colors: { primary: '#1e40af', secondary: '#7c3aed' },
        include_date: true,
        include_location: true,
        include_logo: true,
      },
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const updateStatus = async (materialId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('event_marketing_materials')
        .update({ status: newStatus })
        .eq('id', materialId);

      if (error) throw error;
      await loadMaterials();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = !searchQuery || 
      material.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || material.material_type === filterType;
    const matchesStatus = filterStatus === 'all' || material.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'banner': return <ImageIcon className="w-4 h-4" />;
      case 'flyer': return <FileText className="w-4 h-4" />;
      case 'social_post': return <Share2 className="w-4 h-4" />;
      case 'email_template': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getMaterialTypeColor = (type: string) => {
    switch (type) {
      case 'banner': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'flyer': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'social_post': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      case 'email_template': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'generated': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'published': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-purple-400" />
              Marketing Materials
            </h1>
            <p className="text-slate-400 text-sm mt-1">{eventTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetForm();
                setEditingMaterial(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Generate Material
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
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
                      {editingMaterial ? 'Edit Material' : 'Generate Marketing Material'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingMaterial(null);
                        resetForm();
                      }}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2">Material Type *</label>
                        <select
                          value={formData.material_type}
                          onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                        >
                          <option value="banner">Banner</option>
                          <option value="flyer">Flyer</option>
                          <option value="social_post">Social Media Post</option>
                          <option value="email_template">Email Template</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs font-medium mb-2">Title *</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                          placeholder="Material title"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
                        placeholder="Brief description..."
                      />
                    </div>

                    {/* Customizations */}
                    <div className="border-t border-slate-800 pt-4">
                      <h3 className="text-white font-semibold mb-3">Customization Options</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-slate-400 text-xs font-medium mb-2">Headline</label>
                          <input
                            type="text"
                            value={formData.customizations.headline}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              customizations: { ...formData.customizations, headline: e.target.value }
                            })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Main headline"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 text-xs font-medium mb-2">Subheadline</label>
                          <input
                            type="text"
                            value={formData.customizations.subheadline}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              customizations: { ...formData.customizations, subheadline: e.target.value }
                            })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Supporting text"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 text-xs font-medium mb-2">Call to Action</label>
                          <input
                            type="text"
                            value={formData.customizations.call_to_action}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              customizations: { ...formData.customizations, call_to_action: e.target.value }
                            })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="e.g., Register Now"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Generate Button */}
                    <button
                      onClick={generateContent}
                      disabled={generating || !formData.title}
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-3 transition-all"
                    >
                      {generating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          Generate Content
                        </>
                      )}
                    </button>

                    {/* Generated Content Preview */}
                    {formData.generated_content && (
                      <div className="bg-slate-800/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-slate-400 text-xs font-medium">Generated Content</label>
                          <button
                            onClick={() => copyToClipboard(formData.generated_content)}
                            className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            Copy
                          </button>
                        </div>
                        <textarea
                          value={formData.generated_content}
                          onChange={(e) => setFormData({ ...formData, generated_content: e.target.value })}
                          rows={6}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500 focus:outline-none resize-none font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingMaterial(null);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving || !formData.generated_content}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-2.5 transition-all"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Material
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
              placeholder="Search materials..."
              className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="banner">Banners</option>
            <option value="flyer">Flyers</option>
            <option value="social_post">Social Posts</option>
            <option value="email_template">Email Templates</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="generated">Generated</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Materials List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
            <Wand2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No marketing materials found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMaterials.map(material => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/40 border border-slate-800/40 rounded-xl p-4 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getMaterialTypeColor(material.material_type)}`}>
                      {getMaterialTypeIcon(material.material_type)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{material.title}</h3>
                      <p className="text-slate-500 text-xs capitalize">{material.material_type.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(material)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                  <p className="text-slate-300 text-xs line-clamp-3 font-mono">{material.generated_content}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(material.status)}`}>
                      {material.status.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Download className="w-3 h-3" />
                      <span>{material.download_count || 0}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyToClipboard(material.generated_content)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {material.status !== 'published' && (
                      <button
                        onClick={() => updateStatus(material.id, 'published')}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-all"
                        title="Publish"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Wand2 className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-slate-400 text-xs">Total Materials</p>
                <p className="text-2xl font-bold text-white">{materials.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-slate-400 text-xs">Published</p>
                <p className="text-2xl font-bold text-white">{materials.filter(m => m.status === 'published').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Download className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-slate-400 text-xs">Total Downloads</p>
                <p className="text-2xl font-bold text-white">{materials.reduce((sum, m) => sum + (m.download_count || 0), 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Share2 className="w-8 h-8 text-violet-400" />
              <div>
                <p className="text-slate-400 text-xs">Social Posts</p>
                <p className="text-2xl font-bold text-white">{materials.filter(m => m.material_type === 'social_post').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Wand2 className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-white font-semibold text-sm mb-1">Marketing Materials Generator</h4>
              <p className="text-slate-400 text-xs">
                Generate banners, flyers, social media posts, and email templates for your events. 
                Customize headlines, calls-to-action, and branding elements. Track download counts and publish status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketingMaterialsGenerator;
