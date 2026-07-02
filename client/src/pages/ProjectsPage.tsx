import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Upload, Edit2 } from 'lucide-react';
import axios from 'axios';
import type { Project, ProjectFormData } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import TechTag from '../components/TechTag';
import SectionHeading from '../components/SectionHeading';

const ITEMS_PER_PAGE = 9;

export default function ProjectsPage() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [headerRef, headerVisible] = useScrollReveal();

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t('projects.deleteConfirm'))) return;
    try {
      await axios.delete(`/api/projects/${id}`, { withCredentials: true });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      console.error('Failed to delete project');
    }
  };

  const handleAdd = async (data: ProjectFormData) => {
    try {
      const payload = {
        ...data,
        techStack: data.techStack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await axios.post('/api/projects', payload, { withCredentials: true });
      setProjects((prev) => [res.data, ...prev]);
      setShowForm(false);
    } catch {
      console.error('Failed to add project');
    }
  };

  const handleEdit = async (data: ProjectFormData) => {
    if (!editingProject) return;
    try {
      const payload = {
        ...data,
        techStack: data.techStack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await axios.put(`/api/projects/${editingProject.id}`, payload, { withCredentials: true });
      setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? res.data : p)));
      setEditingProject(null);
    } catch {
      console.error('Failed to update project');
    }
  };

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      {/* Page header */}
      <div
        ref={headerRef}
        className={`flex items-start justify-between mb-12 reveal ${headerVisible ? 'visible' : ''}`}
      >
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text tracking-wide uppercase">
            {t('projects.title')}
            <span className="text-accent-gold">.</span>
          </h1>
          <p className="font-body text-text-muted mt-2">{t('projects.subtitle')}</p>
        </div>

        {/* Admin-only: Add button */}
        {isAdmin && (
          <Button onClick={() => {
            setShowForm(!showForm);
            setEditingProject(null);
          }}>
            <Plus size={16} />
            {t('projects.addProject')}
          </Button>
        )}
      </div>

      {/* Admin-only: Add form */}
      {isAdmin && showForm && (
        <ProjectForm
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          t={t}
          title={t('projects.addProject')}
        />
      )}

      {/* Admin-only: Edit form */}
      {isAdmin && editingProject && (
        <ProjectForm
          initialData={editingProject}
          onSubmit={handleEdit}
          onCancel={() => setEditingProject(null)}
          t={t}
          title={t('projects.editProject') || 'แก้ไขโปรเจกต์'}
        />
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center">
          <Spinner />
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-text-muted">{t('projects.noProjects')}</p>
        </div>
      )}

      {/* Project grid */}
      {!loading && projects.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAdmin={isAdmin}
                onEdit={(p) => {
                  setEditingProject(p);
                  setShowForm(false);
                }}
                onDelete={handleDelete}
                index={i}
              />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-10">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
              >
                {t('projects.loadMore')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ===== Project Card ===== */
function ProjectCard({
  project,
  isAdmin,
  onEdit,
  onDelete,
  index,
}: {
  project: Project;
  isAdmin: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  index: number;
}) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ delay: index * 80, threshold: 0.05 });

  return (
    <div
      ref={ref}
      className={`target-bracket-full group bg-surface border border-hairline overflow-hidden card-interactive hover:border-accent-blue/30 reveal ${
        isVisible ? 'visible' : ''
      }`}
    >
      {/* Thumbnail */}
      <Link to={`/projects/${project.id}`} className="block">
        <div className="aspect-video bg-bg overflow-hidden">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-2xl text-text-muted/20 font-bold">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/projects/${project.id}`}
            className="font-display font-semibold text-base text-text hover:text-accent-blue transition-colors tracking-wide"
          >
            {project.title}
          </Link>

          {/* Admin-only: Action buttons */}
          {isAdmin && (
            <div className="shrink-0 flex items-center gap-1.5">
              <button
                onClick={() => onEdit(project)}
                className="text-text-muted/40 hover:text-accent-blue transition-colors cursor-pointer p-1"
                aria-label="Edit project"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(project.id)}
                className="text-text-muted/40 hover:text-accent-red transition-colors cursor-pointer p-1"
                aria-label="Delete project"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {(project.techStack || []).slice(0, 3).map((tech) => (
            <TechTag key={tech} label={tech} />
          ))}
          {(project.techStack || []).length > 3 && (
            <span className="font-mono text-xs text-text-muted self-center">
              +{(project.techStack || []).length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== Project Form ===== */
function ProjectForm({
  onSubmit,
  onCancel,
  t,
  title,
  initialData,
}: {
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  t: (key: string) => string;
  title: string;
  initialData?: Project;
}) {
  const [form, setForm] = useState<ProjectFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    techStack: Array.isArray(initialData?.techStack) ? initialData.techStack.join(', ') : '',
    imageUrl: initialData?.imageUrl || '',
    liveUrl: initialData?.liveUrl || '',
    repoUrl: initialData?.repoUrl || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // อ่านไฟล์ภาพจากเครื่อง
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('ขนาดรูปภาพต้องไม่เกิน 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        imageUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-hairline p-6 mb-10 animate-fade-in-up space-y-4"
    >
      <SectionHeading title={title} />

      {/* อัปโหลดรูปภาพโปรเจกต์ */}
      <div className="flex flex-col sm:flex-row gap-5 items-center bg-bg/50 p-4 border border-hairline">
        <div className="w-32 aspect-video bg-surface flex items-center justify-center overflow-hidden border border-hairline shrink-0">
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="font-mono text-xs text-text-muted/30">PREVIEW</span>
          )}
        </div>
        <div className="flex-1 w-full text-center sm:text-left">
          <p className="font-display text-sm text-text mb-1">{t('projects.form.imageUrl')}</p>
          <p className="font-mono text-[10px] text-text-muted mb-3">แนะนำอัตราส่วน 16:9 ขนาดไม่เกิน 3MB</p>
          <label className="inline-flex items-center gap-2 font-display text-xs text-accent-blue border border-accent-blue/30 px-3 py-2 bg-accent-blue/5 hover:bg-accent-blue/20 transition-all cursor-pointer">
            <Upload size={12} />
            เลือกรูปภาพโปรเจกต์
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="title"
          label={t('projects.form.title')}
          value={form.title}
          onChange={handleChange}
          required
        />
        <FormField
          name="techStack"
          label={t('projects.form.techStack')}
          value={form.techStack}
          onChange={handleChange}
        />
        <FormField
          name="liveUrl"
          label={t('projects.form.liveUrl')}
          value={form.liveUrl}
          onChange={handleChange}
        />
        <FormField
          name="repoUrl"
          label={t('projects.form.repoUrl')}
          value={form.repoUrl}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">
          {t('projects.form.description')}
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full bg-bg border border-hairline text-text font-body text-sm px-3 py-2 focus:outline-none focus:border-accent-blue transition-colors resize-y"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit">{t('projects.form.submit')}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t('projects.form.cancel')}
        </Button>
      </div>
    </form>
  );
}

function FormField({
  name,
  label,
  value,
  onChange,
  required,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-bg border border-hairline text-text font-body text-sm px-3 py-2 focus:outline-none focus:border-accent-blue transition-colors"
      />
    </div>
  );
}
