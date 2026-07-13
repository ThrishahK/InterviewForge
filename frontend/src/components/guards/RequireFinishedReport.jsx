import { Navigate, Outlet } from 'react-router-dom';
import { useInterviewContext } from '../../context/InterviewContext';

export function RequireFinishedReport() {
  const { session } = useInterviewContext();

  if (session.status !== 'finished' || !session.finalReport) {
    return <Navigate to="/history" replace />;
  }

  return <Outlet />;
}
