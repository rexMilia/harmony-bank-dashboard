import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { transactions, Transaction, formatCurrency, formatDateTime } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  X,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const TransactionsPage = () => {
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filter === "all" || tx.type === filter;
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const StatusIcon = ({ status }: { status: Transaction["status"] }) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
          Transactions
        </h1>
        <p className="text-muted-foreground">View and manage your transaction history</p>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select
              value={filter}
              onValueChange={(value: "all" | "credit" | "debit") => setFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="credit">Credits Only</SelectItem>
                <SelectItem value="debit">Debits Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter (UI only) */}
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Transaction History ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <EmptyState
              icon="search"
              title="No transactions found"
              description="Try adjusting your filters or search query"
            />
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="w-full hidden md:table">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                      Transaction
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedTransaction(tx)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              tx.type === "credit" ? "bg-credit/10" : "bg-debit/10"
                            )}
                          >
                            {tx.type === "credit" ? (
                              <ArrowDownLeft className="w-4 h-4 text-credit" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-debit" />
                            )}
                          </div>
                          <span className="font-medium">{tx.description}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-sm text-muted-foreground">
                        {tx.id}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium capitalize",
                            tx.type === "credit"
                              ? "bg-credit/10 text-credit"
                              : "bg-debit/10 text-debit"
                          )}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "px-4 py-4 font-semibold",
                          tx.type === "credit" ? "text-credit" : "text-debit"
                        )}
                      >
                        {tx.type === "credit" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon status={tx.status} />
                          <span className="capitalize text-sm">{tx.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDateTime(tx.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile List */}
              <div className="md:hidden divide-y divide-border">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTransaction(tx)}
                  >
                    <div className="flex items-center justify-between">
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
                            {formatDateTime(tx.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-semibold",
                            tx.type === "credit" ? "text-credit" : "text-debit"
                          )}
                        >
                          {tx.type === "credit" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </p>
                        <div className="flex items-center gap-1 justify-end">
                          <StatusIcon status={tx.status} />
                          <span className="capitalize text-xs">{tx.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              Transaction Details
            </DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6 py-4">
              {/* Amount */}
              <div className="text-center py-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <p
                  className={cn(
                    "text-3xl font-display font-bold",
                    selectedTransaction.type === "credit" ? "text-credit" : "text-debit"
                  )}
                >
                  {selectedTransaction.type === "credit" ? "+" : "-"}
                  {formatCurrency(selectedTransaction.amount)}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-medium">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono text-sm">{selectedTransaction.reference}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">From</span>
                  <span className="font-medium">{selectedTransaction.sender.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-medium">{selectedTransaction.receiver.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={selectedTransaction.status} />
                    <span className="capitalize font-medium">
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">
                    {formatDateTime(selectedTransaction.timestamp)}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setSelectedTransaction(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsPage;
