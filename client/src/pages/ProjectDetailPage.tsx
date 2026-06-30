import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../components/BrandIcons';
import axios from 'axios';
import type { Project } from '../types';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import TechTag from '../components/TechTag';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [imageRef, imageVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const [titleRef, titleVisible] = useScrollReveal({ delay: 50 });
  const [metaRef, metaVisible] = useScrollReveal({ delay: 100 });
  const [techRef, techVisible] = useScrollReveal({ delay: 150 });
  const [descRef, descVisible] = useScrollReveal({ delay: 100 });
  const [actionsRef, actionsVisible] = useScrollReveal({ delay: 150 });

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
      <div className="max-w-6xl mx-auto px-4 text-center">
        <Spinner />
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
        className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-accent-blue transition-colors uppercase tracking-wider mb-8 group"
      >
        <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
        {t('projects.back')}
      </Link>

      {/* Image */}
      {project.imageUrl && (
        <div
          ref={imageRef}
          className={`target-bracket-full mb-8 reveal-scale ${imageVisible ? 'visible' : ''}`}
        >
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
      <h1
        ref={titleRef}
        className={`font-display font-bold text-3xl md:text-4xl text-text tracking-wide mb-4 reveal ${
          titleVisible ? 'visible' : ''
        }`}
      >
        {project.title}
      </h1>

      {/* Meta */}
      <div
        ref={metaRef}
        className={`flex items-center gap-4 mb-6 reveal ${metaVisible ? 'visible' : ''}`}
      >
        <span className="font-mono text-xs text-text-muted">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Tech stack */}
      <div
        ref={techRef}
        className={`flex flex-wrap gap-2 mb-8 reveal ${techVisible ? 'visible' : ''}`}
      >
        {project.techStack.map((tech) => (
          <TechTag key={tech} label={tech} />
        ))}
      </div>

      <hr className="hairline mb-8" />

      {/* Description */}
      <div
        ref={descRef}
        className={`font-body text-base text-text-muted leading-relaxed whitespace-pre-line mb-10 reveal ${
          descVisible ? 'visible' : ''
        }`}
      >
        {project.description}
      </div>

      {/* Action links */}
      <div
        ref={actionsRef}
        className={`flex flex-wrap gap-3 reveal ${actionsVisible ? 'visible' : ''}`}
      >
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
