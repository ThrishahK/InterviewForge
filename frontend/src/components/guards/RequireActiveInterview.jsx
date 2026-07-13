import { Navigate, Outlet } from 'react-router-dom';
import { useInterviewContext } from '../../context/InterviewContext';

export function RequireActiveInterview() {
  const { session } = useInterviewContext();

  if (session.status !== 'active' || !session.interviewId) {
    return <Navigate to="/setup" replace />;
  }

  return <Outlet />;
}
