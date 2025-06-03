
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateGame from "./pages/CreateGame";
import JoinGame from "./pages/JoinGame";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import NotFound from "./pages/NotFound";
import DevTools from "./pages/DevTools";
import MockAnalyzer from "./pages/MockAnalyzer";
import SupabaseSchemaPlanner from "./pages/SupabaseSchemaPlanner";
import BestPracticesAdvisor from "./pages/BestPracticesAdvisor";
import ArchitectureVisualizer from "./pages/ArchitectureVisualizer";
import ReplaceMockWizard from "./pages/ReplaceMockWizard";
import DevSandbox from "./pages/DevSandbox";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreateGame />
            </ProtectedRoute>
          } />
          <Route path="/join" element={
            <ProtectedRoute>
              <JoinGame />
            </ProtectedRoute>
          } />
          <Route path="/lobby" element={
            <ProtectedRoute>
              <Lobby />
            </ProtectedRoute>
          } />
          <Route path="/game" element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          } />
          
          {/* Dev Tools Routes */}
          <Route path="/dev-tools" element={<DevTools />} />
          <Route path="/dev-tools/mock-analyzer" element={<MockAnalyzer />} />
          <Route path="/dev-tools/supabase-schema-suggester" element={<SupabaseSchemaPlanner />} />
          <Route path="/dev-tools/best-practices-advisor" element={<BestPracticesAdvisor />} />
          <Route path="/dev-tools/architecture-visualizer" element={<ArchitectureVisualizer />} />
          <Route path="/dev-tools/replace-mock-wizard" element={<ReplaceMockWizard />} />
          <Route path="/dev-tools/sandbox" element={<DevSandbox />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </Router>
    </AuthProvider>
  );
}

export default App;
