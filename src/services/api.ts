import { demoCases, type ExamCase, type ReviewStatus } from '@/features/cases/data';
const baseUrl = import.meta.env['VITE_API_BASE_URL']?.replace(/\/$/, '');
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
  if (!response.ok) throw new Error(`ExamGuard API request failed (${response.status})`);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
// No configured API means explicit demonstration mode. No backend is generated.
export const caseApi = {
  list: async (): Promise<ExamCase[]> => baseUrl ? request<ExamCase[]>('/cases') : demoCases,
  get: async (id: string): Promise<ExamCase | undefined> => baseUrl ? request<ExamCase>(`/cases/${encodeURIComponent(id)}`) : demoCases.find(item => item.id === id),
  updateStatus: async (id: string, status: ReviewStatus): Promise<void> => { if (baseUrl) await request(`/cases/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); },
};
export const isDemonstration = !baseUrl;
