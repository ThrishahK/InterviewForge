import { apiClient } from './apiClient';

export async function startInterview({ role, experienceLevel, resumeUploaded, maxQuestions }) {
  const { data } = await apiClient.post('/api/start_interview', {
    role,
    experience_level: experienceLevel,
    resume_uploaded: resumeUploaded,
    max_questions: maxQuestions,
  });
  return data;
}

export async function getNextQuestion(prevAnswer = '') {
  const { data } = await apiClient.get('/api/next_question', {
    params: { prev_answer: prevAnswer },
  });
  return data;
}

export async function evaluateAnswer(answer) {
  const { data } = await apiClient.post('/api/evaluate', {
    answer,
  });
  return data.evaluation;
}

export async function finishInterview() {
  const { data } = await apiClient.post('/api/finish_interview');
  return data;
}

export async function getHistory() {
  const { data } = await apiClient.get('/api/history');
  return data.interviews;
}