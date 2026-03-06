'use client';

import { useEffect, useCallback } from 'react';
import type { Project } from '@/data/projects';

interface ProjectDetailOverlayProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetailOverlay({ project, onClose }: ProjectDetailOverlayProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative max-w-3xl w-full max-h-[85vh] overflow-y-auto animate-scale-in">
        {/* Glowing border container */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Animated border glow */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-cyan-500/50 animate-pulse" />

          {/* Inner content */}
          <div className="relative bg-[#0a0a2e]/95 backdrop-blur-xl rounded-2xl p-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all duration-300"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-6">
              {/* Category badge */}
              <span className="inline-block px-3 py-1 rounded-full text-xs tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
                {project.category}
              </span>

              <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>

              <div className="flex items-center gap-4 text-sm text-white/50">
                <span>{project.role}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>{project.duration}</span>
                {project.featured && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span className="text-yellow-400">★ Featured</span>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail area */}
            <div className="relative h-48 rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <p className="text-white/30 text-sm">Project Preview</p>
                </div>
              </div>

              {/* Scan line effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse" />
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-cyan-400/80 tracking-wider uppercase mb-2">
                Description
              </h3>
              <p className="text-white/70 leading-relaxed">
                {project.longDescription || project.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-cyan-400/80 tracking-wider uppercase mb-3">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg text-xs bg-white/5 text-white/70 border border-white/10 hover:border-cyan-400/30 hover:text-cyan-400 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-cyan-400/80 tracking-wider uppercase mb-3">
                Key Highlights
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {project.highlights.map((highlight, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/5"
                  >
                    <span className="text-cyan-400 mt-0.5">▸</span>
                    <span className="text-white/70 text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-4 pt-4 border-t border-white/10">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all duration-300 text-sm font-medium"
                >
                  <span>🌐</span>
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all duration-300 text-sm font-medium"
                >
                  <span>💻</span>
                  Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
