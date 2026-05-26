/**
 * JoinStep3 — Success confirmation screen
 */

import { Link } from 'react-router-dom';
import { ThemeColors } from '../../../../features/landing/domain/types';

interface JoinStep3Props {
  colors: ThemeColors;
  cardBg: string;
  borderColor: string;
}

export function JoinStep3({ colors, cardBg, borderColor }: JoinStep3Props) {
  return (
    <div
      className="rounded-2xl border px-8 sm:px-10 py-14 text-center"
      style={{ background: cardBg, borderColor }}
    >
      <div className="text-6xl mb-6" role="img" aria-label="Party popper">🎉</div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: colors.text }}>
        Application Sent!
      </h2>
      <p className="text-sm sm:text-base leading-relaxed mb-8" style={{ color: colors.textMuted }}>
        We've received your application. Our track leads<br />will review your portfolio and get back to you soon!
      </p>
      <Link
        to="/"
        className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
        style={{ color: '#3B5BDB' }}
      >
        Return to home
      </Link>
    </div>
  );
}
