'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, GraduationCap, Save, Loader2, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/contexts/ToastContext';
import MarkdownEditor from '@/components/MarkdownEditor';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function CourseManager() {
  usePageTitle('Manage Courses');
  const { courses, addCourse, updateCourse, deleteCourse } = useData();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [current, setCurrent] = useState<any>({});

  const handleEdit = (course: any) => {
    setCurrent(course);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrent({ 
        id: 'c' + Date.now(), 
        title: '', 
        code: '', 
        description: '', 
        materialLink: '',
        published: true,
        level: 'Undergraduate',
        semester: 'First Semester'
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!current.title) return showToast('Course title is required', 'error');
    setIsSaving(true);
    
    let success;
    if (courses.some(c => c.id === current.id)) success = await updateCourse(current);
    else success = await addCourse(current);

    setIsSaving(false);
    if (success) {
        showToast('Course saved successfully', 'success');
        setIsEditing(false);
    } else {
        showToast('Failed to save course', 'error');
    }
  };

  const handleDelete = async (id: string) => {
      if(confirm('Are you sure you want to delete this course?')) {
          const success = await deleteCourse(id);
          if(success) showToast('Course deleted', 'success');
      }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Header Section - Only show Add button if NOT editing */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-serif text-primary">Courses</h2>
                <p className="text-slate-500 text-sm mt-1">Manage academic courses and materials</p>
            </div>
            {!isEditing && (
                <button onClick={handleCreate} className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-all font-medium">
                    <Plus size={18} /> Add Course
                </button>
            )}
        </div>

        {isEditing ? (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-slate-800">{current.id.startsWith('c') && current.title === '' ? 'New Course' : 'Edit Course'}</h3>
                    <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Code</label>
                            <input 
                                className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none" 
                                value={current.code} 
                                onChange={e => setCurrent({...current, code: e.target.value})} 
                                placeholder="e.g. LAW 401" 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Title</label>
                            <input 
                                className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none" 
                                value={current.title} 
                                onChange={e => setCurrent({...current, title: e.target.value})} 
                                placeholder="e.g. Law of Contract II" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Level / Class</label>
                            <input 
                                className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none" 
                                value={current.level} 
                                onChange={e => setCurrent({...current, level: e.target.value})} 
                                placeholder="e.g. Undergraduate (400L)" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Semester</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg p-3 focus:border-accent focus:outline-none bg-white" 
                                value={current.semester} 
                                onChange={e => setCurrent({...current, semester: e.target.value})}
                            >
                                <option>First Semester</option>
                                <option>Second Semester</option>
                                <option>Both Semesters</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Material Link (Optional)</label>
                        <div className="flex gap-2">
                            <div className="bg-slate-100 flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 text-slate-500">
                                <LinkIcon size={16} />
                            </div>
                            <input 
                                className="w-full border border-slate-300 rounded-r-lg p-3 focus:border-accent focus:outline-none" 
                                value={current.materialLink} 
                                onChange={e => setCurrent({...current, materialLink: e.target.value})} 
                                placeholder="Google Drive or Dropbox link..." 
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <MarkdownEditor 
                            value={current.description} 
                            onChange={val => setCurrent({...current, description: val})} 
                            label="Course Description / Synopsis"
                            rows={8}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" 
                            id="published" 
                            checked={current.published} 
                            onChange={e => setCurrent({...current, published: e.target.checked})}
                            className="w-5 h-5 text-accent rounded focus:ring-accent border-gray-300"
                        />
                        <label htmlFor="published" className="text-sm font-medium text-slate-700">Visible to Public</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-slate-500 hover:text-slate-800 font-medium transition-colors">Cancel</button>
                        <button 
                            onClick={handleSave} 
                            disabled={isSaving} 
                            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-70 transition-all font-medium"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isSaving ? 'Saving...' : 'Save Course'}
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {courses.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                        <GraduationCap size={48} className="mb-4 opacity-20" />
                        <p>No courses added yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">Code</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Level</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {courses.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4 pl-6 font-mono text-sm text-accent font-medium">{c.code}</td>
                                    <td className="p-4 font-medium text-slate-800">{c.title}</td>
                                    <td className="p-4 text-sm text-slate-500">{c.level}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${c.published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {c.published ? 'Visible' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(c)} className="p-2 text-slate-400 hover:text-accent hover:bg-blue-50 rounded transition-colors" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )}
    </div>
  );
}