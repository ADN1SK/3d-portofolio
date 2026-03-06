import { Scene3D } from '@/components/3d';
import type { Metadata } from 'next';
import { profile } from '@/data/profile';

export const metadata: Metadata = {
  title: `${profile.name} | 3D Portfolio`,
  description: `Immersive 3D portfolio experience — ${profile.title}`,
};

export default function Portfolio3DPage() {
  return (
    <>
      {/* Hide the default layout header/footer/sidenav for immersive 3D */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            header, footer, .side-nav, nav { display: none !important; }
            main { padding-top: 0 !important; }
            body { overflow: hidden !important; background: #050510 !important; }
          `,
        }}
      />
      <Scene3D />
    </>
  );
}
