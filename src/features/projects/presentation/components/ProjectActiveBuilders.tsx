/**
 * ProjectActiveBuilders — Grid of active builders shown on the project details page.
 * Fetches members dynamically from Supabase who are assigned to this project.
 */

import { useEffect, useState } from 'react';
import { useTheme } from '../../../landing/domain/useTheme';
import { DEMO_PROJECT_BUILDERS as fallbackBuilders } from '../../../../core/data/demoData';
import { supabase } from '../../../../core/supabase/client';

interface ProjectActiveBuildersProps {
  projectTitle: string;
  projectId: string;
  colors: ReturnType<typeof useTheme>['colors'];
  dark: boolean;
  mounted: boolean;
}

export function ProjectActiveBuilders({
  projectTitle,
  projectId,
  colors,
  dark,
  mounted,
}: ProjectActiveBuildersProps) {
  const [builders, setBuilders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('visible', true);

        if (data && !error) {
          const filtered = data
            .filter((m: any) => {
              const projs = Array.isArray(m.projects) ? m.projects : [];
              return projs.includes(projectTitle) || projs.includes(projectId);
            })
            .map((m: any) => ({
              name: m.name,
              role: m.role_title || 'Builder',
              quote: m.quote || '',
              avatar_url: m.avatar_url,
              portfolio: m.github || '',
            }));

          if (filtered.length > 0) {
            setBuilders(filtered);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to load project builders from Supabase:', err);
      }

      // Fallback to static mock builders if none found
      setBuilders(fallbackBuilders);
      setLoading(false);
    };

    fetchBuilders();
  }, [projectTitle, projectId]);

  const cardBg = dark ? '#1a2160' : '#ffffff';
  const imgBg = dark ? '#1f2768' : '#EEF0F8';

  if (loading) {
    return (
      <div className="mt-28 flex justify-center items-center py-12">
        <p className="text-lg font-semibold animate-pulse" style={{ color: colors.textMuted }}>
          Loading builders...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-28">
      <h2
        className="text-4xl lg:text-6xl font-bold mb-14 tracking-tight"
        style={{ color: colors.text }}
      >
        Active Builders
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {builders.map((builder, i) => (
          <div
            key={(builder.name || '') + i}
            className={`rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{
              transitionDelay: `${i * 120}ms`,
              background: colors.bgCard || cardBg,
              borderColor: colors.divider,
            }}
          >
            {/* Portrait Square Photo */}
            <div
              className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
              style={{
                background: (builder.avatar_url || builder.portfolio)
                  ? `url(${builder.avatar_url || builder.portfolio}) top center / cover no-repeat`
                  : imgBg,
                aspectRatio: '1 / 1', // Unified card shape
              }}
            />

            <div className="p-7 text-center">
              <h3 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: colors.text }}>
                {builder.name}
              </h3>
              <p className="text-base mb-5" style={{ color: colors.textMuted }}>{builder.role}</p>
              {builder.quote && (
                <p className="italic text-base" style={{ color: colors.textSubtle }}>{builder.quote}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
