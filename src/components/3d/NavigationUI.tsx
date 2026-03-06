'use client';

import { useCallback } from 'react';
import type { SectionName } from './Scene3D';
import { profile } from '@/data/profile';

interface NavigationUIProps {
  activeSection: SectionName;
  onSectionChange: (section: SectionName) => void;
}

const sections: { id: SectionName; label: string; icon: string }[] = [
  { id: 'hero', label: 'About', icon: '◆' },
  { id: 'projects', label: 'Projects', icon: '◈' },
  { id: 'skills', label: 'Skills', icon: '◇' },
  { id: 'contact', label: 'Contact', icon: '◆' },
];

export function NavigationUI({ activeSection, onSectionChange }: NavigationUIProps) {
  const handleScroll = useCallback(
    (e: React.WheelEvent) => {
      const currentIndex = sections.findIndex((s) => s.id === activeSection);
      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        onSectionChange(sections[currentIndex + 1].id);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        onSectionChange(sections[currentIndex - 1].id);
      }
    },
    [activeSection, onSectionChange]
  );

  return (
    <>
      {/* Scroll capture overlay */}
      <div className="absolute inset-0 z-10" onWheel={handleScroll} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo / Name */}
          <div className="pointer-events-auto">
            <button
              onClick={() => onSectionChange('hero')}
              className="group flex items-center gap-3 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                <span className="text-cyan-400 text-sm font-bold">
                  {profile.name.charAt(0)}
                </span>
              </div>
              <span className="text-white/80 text-sm font-medium tracking-wider uppercase group-hover:text-cyan-400 transition-colors">
                {profile.name}
              </span>
            </button>
          </div>

          {/* Section indicator */}
          <div className="flex items-center gap-2">
            <span className="text-cyan-400/50 text-xs tracking-widest uppercase">
              {activeSection}
            </span>
            <div className="w-2 h-2 rounded-full bg-cyan-400/50 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Side navigation dots */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-6 pointer-events-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className="group relative flex items-center justify-end gap-3"
            title={section.label}
          >
            {/* Label (shown on hover) */}
            <span
              className={`text-xs tracking-wider uppercase transition-all duration-300 ${
                activeSection === section.id
                  ? 'text-cyan-400 opacity-100'
                  : 'text-white/40 opacity-0 group-hover:opacity-100'
              }`}
            >
              {section.label}
            </span>

            {/* Dot */}
            <div className="relative">
              <div
                className={`w-3 h-3 rounded-full border transition-all duration-500 ${
                  activeSection === section.id
                    ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(0,200,255,0.5)]'
                    : 'bg-transparent border-white/30 group-hover:border-cyan-400/50'
                }`}
              />
              {activeSection === section.id && (
                <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
              )}
            </div>
          </button>
        ))}

        {/* Connecting line */}
        <div className="absolute right-[5px] top-[6px] bottom-[6px] w-[1px] bg-white/10 -z-10" />
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Scroll hint */}
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
            </div>
            <span className="tracking-wider uppercase">Scroll to navigate</span>
          </div>

          {/* Section counter */}
          <div className="flex items-center gap-2 text-white/30 text-xs tracking-wider">
            <span className="text-cyan-400">
              {String(sections.findIndex((s) => s.id === activeSection) + 1).padStart(2, '0')}
            </span>
            <span>/</span>
            <span>{String(sections.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Keyboard navigation hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex items-center gap-4 text-white/20 text-xs">
          {sections.map((section, i) => (
            <button
              key={section.id}
              className={`pointer-events-auto px-3 py-1 rounded border transition-all duration-300 ${
                activeSection === section.id
                  ? 'border-cyan-500/40 text-cyan-400/80 bg-cyan-500/10'
                  : 'border-white/10 hover:border-white/20 hover:text-white/40'
              }`}
              onClick={() => onSectionChange(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
