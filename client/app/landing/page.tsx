import { Button } from "../src/components/ui/button";
// import { Card, CardContent } from "../src/components/ui/card";
import { Brain, Heart, MessageCircle, TrendingUp, Shield, Users } from "lucide-react";
import { Card, CardContent } from "../src/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Brain className="h-8 w-8 text-primary mr-3" />
                <span className="text-xl font-bold text-foreground">MindSpace</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = "http://localhost:5001/api/login"}
                data-testid="button-login"
                className="bg-primary hover:bg-primary/90"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Personal Mental Health Companion
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Track your mood, journal your thoughts, and receive personalized emotional support 
              from our AI companion. Start your mental wellness journey today.
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = "http://localhost:5001/api/login"}
                data-testid="button-get-started"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
              >
                Start Your Journey
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 text-lg px-8 py-3"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need for mental wellness
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to support your mental health journey with privacy and care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow" data-testid="card-mood-tracking">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Daily Mood Tracking</h3>
                <p className="text-muted-foreground">
                  Track your emotions with our intuitive 1-10 scale and emoji selection. 
                  Identify patterns and trends in your mental health.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow" data-testid="card-journaling">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Journaling</h3>
                <p className="text-muted-foreground">
                  Write your thoughts with our guided journaling features. 
                  Tag entries and track your progress over time.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow" data-testid="card-ai-companion">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Companion</h3>
                <p className="text-muted-foreground">
                  Chat with Luna, your personal AI companion who provides emotional support 
                  and personalized insights based on your entries.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow" data-testid="card-analytics">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Analytics & Insights</h3>
                <p className="text-muted-foreground">
                  Visualize your mental health journey with detailed analytics, 
                  trend analysis, and personalized recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow" data-testid="card-privacy">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
                <p className="text-muted-foreground">
                  Your data is encrypted and secure. We prioritize your privacy 
                  and will never share your personal information.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow" data-testid="card-streak-tracking">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Streak Tracking</h3>
                <p className="text-muted-foreground">
                  Build healthy habits with our streak tracking system. 
                  Stay motivated and consistent in your mental health practice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start your mental wellness journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who have improved their mental health with MindSpace.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = "http://localhost:5001/api/login"}
            data-testid="button-start-now"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
          >
            Start Now - It's Free
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-semibold text-foreground">MindSpace</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 MindSpace. Supporting your mental wellness journey.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
