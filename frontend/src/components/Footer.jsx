import { Link } from 'react-router-dom';

const links = [
  { to: '/setup', label: 'New Interview' },
  { to: '/history', label: 'History' },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-display text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          InterviewForge
        </p>
        <ul className="flex items-center gap-6">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-zinc-400 dark:text-zinc-600">
          Practice mock interviews with AI.
        </p>
      </div>
    </footer>
  );
}
