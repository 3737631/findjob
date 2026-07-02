import { create } from "zustand";
import type {
  ParsedCV,
  UserPreferences,
  CompanyMatch,
  Application,
  ParsingStatus,
  DashboardMetrics,
} from "@/types";

interface ApplicationState {
  status: ParsingStatus;
  progress: number;
  statusMessage: string;

  parsedCV: ParsedCV | null;
  preferences: UserPreferences | null;
  matches: CompanyMatch[];
  applications: Application[];
  metrics: DashboardMetrics | null;

  setStatus: (status: ParsingStatus) => void;
  setProgress: (progress: number) => void;
  setStatusMessage: (message: string) => void;
  setParsedCV: (cv: ParsedCV | null) => void;
  setPreferences: (prefs: UserPreferences | null) => void;
  setMatches: (matches: CompanyMatch[]) => void;
  addMatches: (matches: CompanyMatch[]) => void;
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  setMetrics: (metrics: DashboardMetrics | null) => void;
  reset: () => void;
}

const initialState = {
  status: "idle" as ParsingStatus,
  progress: 0,
  statusMessage: "",
  parsedCV: null as ParsedCV | null,
  preferences: null as UserPreferences | null,
  matches: [] as CompanyMatch[],
  applications: [] as Application[],
  metrics: null as DashboardMetrics | null,
};

export const useAppStore = create<ApplicationState>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  setParsedCV: (parsedCV) => set({ parsedCV }),
  setPreferences: (preferences) => set({ preferences }),
  setMatches: (matches) => set({ matches }),
  addMatches: (newMatches) =>
    set((state) => ({ matches: [...state.matches, ...newMatches] })),
  setApplications: (applications) => set({ applications }),
  addApplication: (app) =>
    set((state) => ({ applications: [...state.applications, app] })),
  updateApplication: (id, updates) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updates } : app
      ),
    })),
  setMetrics: (metrics) => set({ metrics }),
  reset: () => set(initialState),
}));
