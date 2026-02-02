import { Copy, Check, Eye, EyeOff, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/data/mockData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const WalletPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyWalletId = async () => {
    if (user?.walletId) {
      await navigator.clipboard.writeText(user.walletId);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Wallet ID copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
          My Wallet
        </h1>
        <p className="text-muted-foreground">
          Manage your wallet and view your balance.
        </p>
      </div>

      {/* Balance Card */}
      <Card className="gradient-card overflow-hidden">
        <CardContent className="p-6 lg:p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-primary-foreground/80 text-sm font-medium">
                Current Balance
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </Button>
            </div>

            <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary-foreground">
              {showBalance ? formatCurrency(user?.walletBalance || 0) : "****"}
            </h2>

            {/* Wallet ID */}
            <div className="bg-primary-foreground/10 rounded-lg p-4 space-y-2">
              <p className="text-xs text-primary-foreground/60 uppercase tracking-wide">
                Wallet ID
              </p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-primary-foreground font-medium">
                  {user?.walletId}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={copyWalletId}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/transfer">
          <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ArrowUpRight className="w-7 h-7 text-primary" />
              </div>
              <span className="font-medium">Send Money</span>
            </CardContent>
          </Card>
        </Link>

        <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="p-6 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-credit/10 flex items-center justify-center group-hover:bg-credit/20 transition-colors">
              <ArrowDownLeft className="w-7 h-7 text-credit" />
            </div>
            <span className="font-medium">Fund Wallet</span>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Details */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Account Name</span>
            <span className="font-medium">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Wallet ID</span>
            <span className="font-mono font-medium">{user?.walletId}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Account Type</span>
            <span className="font-medium">Personal</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-muted-foreground">Account Status</span>
            <span className="px-2 py-1 bg-success/10 text-success text-sm font-medium rounded">
              Active
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletPage;
