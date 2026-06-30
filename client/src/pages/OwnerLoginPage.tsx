import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

export default function OwnerLoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    const success = await login(password);
    setLoading(false);

    if (success) {
      navigate('/projects');
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className={`bg-surface border border-hairline p-8 animate-fade-in-up ${
            shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
          }`}
          style={{
            // @ts-expect-error CSS custom animation inline
            '--shake-offset': '8px',
          }}
        >
          {/* Icon + title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent-blue/10 flex items-center justify-center">
              <Lock size={18} className="text-accent-blue" />
            </div>
            <h1 className="font-display font-bold text-xl text-text tracking-wide uppercase">
              {t('login.title')}
            </h1>
          </div>

          {/* Password field */}
          <div className="mb-5">
            <label className="block font-mono text-xs text-text-muted uppercase tracking-wider mb-2">
              {t('login.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg border border-hairline text-text font-mono text-sm px-4 py-3 focus:outline-none focus:border-accent-blue transition-colors"
              autoFocus
              required
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-accent-red mb-4 font-mono text-xs">
              <AlertTriangle size={14} />
              {t('login.error')}
            </div>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t('login.submit')
            )}
          </Button>
        </form>

        {/* Tiny note */}
        <p className="font-mono text-[10px] text-text-muted/40 text-center mt-4 tracking-wider">
          OWNER ACCESS ONLY
        </p>
      </div>
    </div>
  );
}
