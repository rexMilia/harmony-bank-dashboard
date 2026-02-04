import { ArrowUpRight, ArrowDownLeft, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { transactions, stats, formatCurrency, formatDate } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DashboardPage = () => {
  const { user } = useAuth();
  const { balance, isLoading: balanceLoading } = useWalletBalance();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your finances today.
        </p>
      </div>

      {/* Balance Card */}
      <Card className="gradient-card overflow-hidden">
        <CardContent className="p-6 lg:p-8">
          <div className="space-y-4">
            <p className="text-primary-foreground/80 text-sm font-medium">
              Total Balance
            </p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary-foreground">
              {balanceLoading ? "Loading..." : formatCurrency(balance)}
            </h2>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+12.5% from last month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-xl font-semibold text-credit">
                  {formatCurrency(stats.totalCredits)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-credit/10 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-credit" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-xl font-semibold text-debit">
                  {formatCurrency(stats.totalDebits)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-debit/10 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-debit" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-semibold text-warning">
                  {stats.pendingTransactions}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-xl font-semibold text-foreground">
                  {stats.totalTransactions}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/transfer">
          <Button className="gap-2">
            <ArrowUpRight className="w-4 h-4" />
            Send Money
          </Button>
        </Link>
        <Link to="/wallet">
          <Button variant="outline" className="gap-2">
            <ArrowDownLeft className="w-4 h-4" />
            Fund Wallet
          </Button>
        </Link>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          <Link to="/transactions">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      tx.type === "credit" ? "bg-credit/10" : "bg-debit/10"
                    )}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="w-5 h-5 text-credit" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-debit" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(tx.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      tx.type === "credit" ? "text-credit" : "text-debit"
                    )}
                  >
                    {tx.type === "credit" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </p>
                  <p
                    className={cn(
                      "text-xs capitalize",
                      tx.status === "completed" && "text-success",
                      tx.status === "pending" && "text-warning",
                      tx.status === "failed" && "text-destructive"
                    )}
                  >
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
