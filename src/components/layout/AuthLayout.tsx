import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary p-8 lg:p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl text-primary-foreground">
            PayFlow
          </span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary-foreground leading-tight">
            Banking made simple, secure, and smart.
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Manage your money with confidence. Send, receive, and track your finances all in one place.
          </p>
        </div>

        <div className="flex items-center gap-6 text-primary-foreground/60 text-sm">
          <span>© 2024 PayFlow</span>
          <span>•</span>
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Service</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 lg:w-1/2 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 gradient-primary">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-primary-foreground">
              PayFlow
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                {title}
              </h2>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
