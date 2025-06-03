
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateGame />} />
        <Route path="/join" element={<JoinGame />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
        
        {/* Dev Tools Routes */}
        <Route path="/dev-tools" element={<DevTools />} />
        <Route path="/dev-tools/mock-analyzer" element={<MockAnalyzer />} />
        <Route path="/dev-tools/supabase-schema-suggester" element={<SupabaseSchemaPlanner />} />
        <Route path="/dev-tools/best-practices-advisor" element={<BestPracticesAdvisor />} />
        <Route path="/dev-tools/architecture-visualizer" element={<ArchitectureVisualizer />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </Router>
  );
}

export default App;
