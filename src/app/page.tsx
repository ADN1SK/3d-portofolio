import { Container } from '@/components/ui';
import {
  ProfileHeader,
  Summary,
  ExperienceTimeline,
  SkillsSection,
  EducationSection,
  CertificationsSection,
  LanguagesSection,
} from '@/components/resume';
import { ContactSection } from '@/components/contact';
import { ProjectGrid } from '@/components/portfolio';
import { Section } from '@/components/ui';
import Link from 'next/link';
import { ArrowRight, Box } from 'lucide-react';

export default function HomePage() {
  return (
    <Container size="lg" className="py-12">
      {/* 3D Portfolio Banner */}
      <div className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-blue-950 to-purple-950 p-6 sm:p-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Box className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Experience the 3D Portfolio</h2>
              <p className="text-gray-300 text-sm">Explore an immersive, interactive 3D environment</p>
            </div>
          </div>
          <Link
            href="/3d"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all duration-300 font-medium text-sm whitespace-nowrap"
          >
            Enter 3D World
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="mb-16">
        <ProfileHeader />
        <Summary />
      </section>

      {/* Experience Section */}
      <ExperienceTimeline />

      {/* Skills Section */}
      <SkillsSection />

      {/* Education Section */}
      <EducationSection />

      {/* Certifications Section */}
      <CertificationsSection />

      {/* Languages Section */}
      <LanguagesSection />

      {/* Featured Projects */}
      <Section 
        id="portfolio-preview" 
        title="Featured Projects" 
        subtitle="A selection of my recent work"
      >
        <ProjectGrid featuredOnly limit={3} showFilters={false} />
        <div className="text-center mt-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Section>

      {/* Contact Section */}
      <ContactSection />
    </Container>
  );
}
