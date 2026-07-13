import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useInterviewContext } from '../context/InterviewContext';

export function BareLayout() {
  const navigate = useNavigate();
  const { resetSession } = useInterviewContext();

  const handleExit = () => {
    const confirmed = window.confirm(
      'Exit this interview? Your progress on this session will be lost.'
    );
    if (!confirmed) return;
    resetSession();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="text-sm font-semibold tracking-tight text-zinc-500 dark:text-zinc-400"
        >
          InterviewForge
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
          >
            <LogOut size={13} aria-hidden="true" />
            Exit
          </button>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
