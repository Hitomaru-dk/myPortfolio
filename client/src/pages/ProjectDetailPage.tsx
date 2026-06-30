import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../components/BrandIcons';
import axios from 'axios';
import type { Project } from '../types';
import Button from '../components/Button';
import TechTag from '../components/TechTag';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="font-mono text-sm text-text-muted">Project not found</p>
        <Link to="/projects" className="inline-block mt-4">
          <Button variant="outline">
            <ArrowLeft size={16} />
            {t('projects.back')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      {/* Back link */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-accent-blue transition-colors uppercase tracking-wider mb-8"
      >
        <ArrowLeft size={14} />
        {t('projects.back')}
      </Link>

      {/* Image */}
      {project.imageUrl && (
        <div className="target-bracket-full mb-8 animate-fade-in-up">
          <div className="aspect-video bg-surface overflow-hidden">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Title */}
      <h1 className="font-display font-bold text-3xl md:text-4xl text-text tracking-wide mb-4 animate-fade-in-up">
        {project.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
        <span className="font-mono text-xs text-text-muted">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up-delay">
        {project.techStack.map((tech) => (
          <TechTag key={tech} label={tech} />
        ))}
      </div>

      <hr className="hairline mb-8" />

      {/* Description */}
      <div className="font-body text-base text-text-muted leading-relaxed whitespace-pre-line mb-10 animate-fade-in-up-delay">
        {project.description}
      </div>

      {/* Action links */}
      <div className="flex flex-wrap gap-3 animate-fade-in-up-delay-2">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            <Button>
              <ExternalLink size={16} />
              {t('projects.viewLive')}
            </Button>
          </a>
        )}
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <GithubIcon style={{ width: 16, height: 16 }} />
              {t('projects.viewRepo')}
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
