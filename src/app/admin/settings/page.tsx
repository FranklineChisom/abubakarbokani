'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Share2, Loader2, Globe } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SiteConfig } from '@/types';

export default function ProfileManager() {
    usePageTitle('Profile Settings');
    const { siteConfig, updateSiteConfig } = useData();
    const { showToast } = useToast();
    
    // Initialize with safe defaults to prevent "uncontrolled" errors
    const [formData, setFormData] = useState<SiteConfig>({
        name: '',
        role: '',
        tagline: '',
        aboutImage: '',
        email: '',
        location: '',
        analyticsUrl: '',
        social: {
            linkedin: '',
            twitter: '',
            scholar: '',
            ssrn: '',
            facebook: '',
            instagram: ''
        },
        // Include any other required fields from SiteConfig type with empty defaults
        focusText: '',
        focusLink: '',
        focusContent: '',
        researchIntro: '',
        researchInterests: ''
    });
    
    const [isSaving, setIsSaving] = useState(false);

    // Sync state with siteConfig when it loads from Supabase
    useEffect(() => {
        if (siteConfig) {
            setFormData(prev => ({
                ...prev,
                ...siteConfig,
                // Ensure social object exists even if DB returns null for it
                social: {
                    ...prev.social,
                    ...(siteConfig.social || {})
                }
            }));
        }
    }, [siteConfig]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ 
            ...formData, 
            social: { ...formData.social, [e.target.name]: e.target.value } 
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const success = await updateSiteConfig(formData);
            if (success) showToast('Profile updated successfully!', 'success');
            else showToast('Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl pb-20 animate-in fade-in duration-500 mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-serif text-primary">Settings</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your profile and contact details</p>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="bg-accent text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 font-medium disabled:opacity-70"
                >
                    {isSaving ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} /> Save Changes
                        </>
                    )}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* General Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                        <User size={20} className="text-accent" />
                        <h3 className="font-bold text-slate-800">Personal Information</h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                                <input type="text" required name="name" value={formData.name || ''} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title / Role</label>
                                <input type="text" required name="role" value={formData.role || ''} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none transition-all" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Profile Image URL</label>
                            <input type="url" name="aboutImage" value={formData.aboutImage || ''} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none transition-all" placeholder="https://..." />
                            <p className="text-xs text-slate-400 mt-1">This image appears on the homepage sidebar.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact Email</label>
                                <input type="email" required name="email" value={formData.email || ''} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none transition-all" placeholder="City, Country" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                   <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                        <Share2 size={20} className="text-accent" />
                        <h3 className="font-bold text-slate-800">Academic & Social Profiles</h3>
                    </div>
                   <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">SSRN URL</label>
                          <input 
                            name="ssrn" 
                            value={formData.social?.ssrn || ''} 
                            onChange={handleSocialChange} 
                            className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none transition-all" 
                            placeholder="https://papers.ssrn.com/..."
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Google Scholar URL</label>
                          <input 
                            name="scholar" 
                            value={formData.social?.scholar || ''} 
                            onChange={handleSocialChange} 
                            className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none transition-all" 
                            placeholder="https://scholar.google.com/..."
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">LinkedIn URL</label>
                          <input 
                            name="linkedin" 
                            value={formData.social?.linkedin || ''} 
                            onChange={handleSocialChange} 
                            className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none transition-all" 
                            placeholder="https://linkedin.com/in/..."
                          />
                      </div>
                   </div>
                </div>

                {/* Analytics Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                   <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                        <Globe size={20} className="text-accent" />
                        <h3 className="font-bold text-slate-800">Admin Analytics</h3>
                    </div>
                   <div className="p-8">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Analytics Dashboard URL</label>
                      <input 
                        name="analyticsUrl" 
                        value={formData.analyticsUrl || ''} 
                        onChange={handleChange} 
                        className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none transition-all" 
                        placeholder="https://lookerstudio.google.com/embed/..."
                      />
                      <p className="text-xs text-slate-400 mt-2">
                        Embed URL for Google Analytics / Looker Studio report to be displayed on the main Admin Dashboard.
                      </p>
                   </div>
                </div>

            </form>
        </div>
    );
}