
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AnimatedBackground from '@/components/AnimatedBackground';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleSignIn = async () => {
    if (!email || !password) return;
    
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (!error) {
      navigate('/dashboard');
    }
  };

  const handleSignUp = async () => {
    if (!pseudo || !email || !password) return;
    
    setLoading(true);
    const avatar = getRandomAvatar();
    const { error } = await signUp(email, password, pseudo, avatar);
    setLoading(false);
    
    // Don't navigate immediately for sign up - user needs to confirm email
  };

  const getRandomAvatar = () => {
    const avatars = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  if (authLoading) {
    return (
      <AnimatedBackground variant="auth">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground variant="auth">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-bounce-in">
            <h1 className="text-4xl font-poppins font-bold text-white mb-2">
              Rejoins KIADISA
            </h1>
            <p className="text-white/80 font-inter">
              Connecte-toi pour jouer avec tes amis !
            </p>
          </div>

          {/* Auth Form */}
          <GlassCard className="animate-slide-up">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-card border-white/20">
                <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">
                  Inscription
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-white font-inter">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-600 z-10" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="ton.email@example.com"
                      className="pl-10 bg-white/95 border-white/50 text-gray-900 placeholder:text-gray-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-white font-inter">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-600 z-10" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-white/95 border-white/50 text-gray-900 placeholder:text-gray-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSignIn}
                  className="w-full glass-button text-white border-white/30 hover:bg-white/20"
                  disabled={!email || !password || loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  ) : (
                    <User className="mr-2 w-4 h-4" />
                  )}
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-pseudo" className="text-white font-inter">Pseudo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-600 z-10" />
                    <Input
                      id="signup-pseudo"
                      placeholder="TonPseudo"
                      className="pl-10 bg-white/95 border-white/50 text-gray-900 placeholder:text-gray-500"
                      value={pseudo}
                      onChange={(e) => setPseudo(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white font-inter">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-600 z-10" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="ton.email@example.com"
                      className="pl-10 bg-white/95 border-white/50 text-gray-900 placeholder:text-gray-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white font-inter">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-600 z-10" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-white/95 border-white/50 text-gray-900 placeholder:text-gray-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      onKeyPress={(e) => e.key === 'Enter' && handleSignUp()}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSignUp}
                  className="w-full glass-button text-white border-white/30 hover:bg-white/20"
                  disabled={!pseudo || !email || !password || loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 w-4 h-4" />
                  )}
                  {loading ? 'Inscription...' : 'Créer mon compte'}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-3 glass-card bg-blue-500/20 border-blue-300/30 rounded-2xl">
              <p className="text-blue-100 text-sm font-inter text-center">
                ℹ️ Un email de confirmation sera envoyé après inscription
              </p>
            </div>
          </GlassCard>

          {/* Back Button */}
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              ← Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Auth;
