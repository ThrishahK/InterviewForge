import { apiClient } from './apiClient';

/**
 * POST /transcribe  (multipart/form-data, field name: file)
 * Response: { text }
 */
export async function transcribeAudio(audioBlob, filename = 'recording.webm') {
  const formData = new FormData();
  formData.append('file', audioBlob, filename);

  const { data } = await apiClient.post('/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.text;
}
