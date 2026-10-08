import { createContext, useContext, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { caseApi } from "@/services/api";
import { type ExamCase, type ReviewStatus } from "./data";
export const casesQuery = { queryKey: ["cases"], queryFn: caseApi.list };
const CasesContext = createContext<{
  cases: ExamCase[];
  updateStatus: (id: string, status: ReviewStatus) => Promise<void>;
  error: string | null;
  loading: boolean;
} | null>(null);
export function CasesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data = [], isPending, error } = useQuery(casesQuery);
  const [saveError, setSaveError] = useState<string | null>(null);
  async function updateStatus(id: string, status: ReviewStatus) {
    setSaveError(null);
    try {
      await caseApi.updateStatus(id, status);
      queryClient.setQueryData<ExamCase[]>(["cases"], (old) =>
        old?.map((item) => (item.id === id ? { ...item, status } : item)),
      );
    } catch {
      setSaveError("The review status could not be saved. Please try again.");
    }
  }
  return (
    <CasesContext.Provider
      value={{
        cases: data,
        updateStatus,
        error:
          saveError ??
          (error ? "Cases could not be loaded. Check your connection and try again." : null),
        loading: isPending,
      }}
    >
      {children}
    </CasesContext.Provider>
  );
}
export function useCases() {
  const context = useContext(CasesContext);
  if (!context) throw new Error("CasesProvider is required");
  return context;
}
