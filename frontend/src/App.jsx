import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppLayout } from './layouts/AppLayout';
import { BareLayout } from './layouts/BareLayout';
import { RequireActiveInterview } from './components/guards/RequireActiveInterview';
import { RequireFinishedReport } from './components/guards/RequireFinishedReport';

const Landing = lazy(() => import('./pages/Landing'));
const InterviewSetup = lazy(() => import('./pages/InterviewSetup'));
const ResumeUpload = lazy(() => import('./pages/ResumeUpload'));
const InterviewScreen = lazy(() => import('./pages/InterviewScreen'));
const FinalReport = lazy(() => import('./pages/FinalReport'));
const InterviewHistory = lazy(() => import('./pages/InterviewHistory'));
const InterviewDetails = lazy(() => import('./pages/InterviewDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading&hellip;</span>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Standard chrome: Navbar + Footer */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<InterviewSetup />} />
          <Route path="/resume-upload" element={<ResumeUpload />} />

          <Route element={<RequireFinishedReport />}>
            <Route path="/report" element={<FinalReport />} />
          </Route>

          <Route path="/history" element={<InterviewHistory />} />
          <Route path="/history/:id" element={<InterviewDetails />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Minimal chrome: the live interview stays focused, no nav/footer */}
        <Route element={<BareLayout />}>
          <Route element={<RequireActiveInterview />}>
            <Route path="/interview" element={<InterviewScreen />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
