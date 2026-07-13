import { apiClient } from './apiClient';

/**
 * POST /upload_resume  (multipart/form-data, field name: file)
 * Response: raw dict from analyze_resume(), no response_model on the route,
 * confirmed shape: { resume: { name, email, phone, education[], skills[],
 * projects[], experience[], certifications[] } }.
 *
 * analyze_resume() raises (rather than falling back) on a bad LLM JSON
 * response, so this can genuinely 500 - callers should show a real error
 * state ("couldn't read that resume") rather than a stuck spinner, and the
 * step must remain skippable regardless of outcome.
 */
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post('/upload_resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // { resume: {...} }
}
