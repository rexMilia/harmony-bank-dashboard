import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { useLedger } from "@/hooks/useLedger";
import { LedgerEntry } from "@/services/transactions";
import { formatCurrency, formatDateTime } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const TransactionsPage = () => {
  const { entries, isLoading, error } = useLedger();
  const [filter, setFilter] = useState<"all" | "CREDIT" | "DEBIT">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);

  const filteredEntries = entries.filter((entry) => {
    const matchesFilter = filter === "all" || entry.entry_type === filter;
    const matchesSearch = entry.transaction_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
            Transactions
          </h1>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
          Transactions
        </h1>
        <p className="text-muted-foreground">View your transaction history</p>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select
              value={filter}
              onValueChange={(value: "all" | "CREDIT" | "DEBIT") => setFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="CREDIT">Credits Only</SelectItem>
                <SelectItem value="DEBIT">Debits Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Transaction History ({filteredEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEntries.length === 0 ? (
            <EmptyState
              icon="search"
              title="No transactions found"
              description={entries.length === 0 ? "You haven't made any transactions yet" : "Try adjusting your filters or search query"}
            />
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="w-full hidden md:table">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                      Transaction ID
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr
                      key={entry.transaction_id}
                      className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              entry.entry_type === "CREDIT" ? "bg-credit/10" : "bg-debit/10"
                            )}
                          >
                            {entry.entry_type === "CREDIT" ? (
                              <ArrowDownLeft className="w-4 h-4 text-credit" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-debit" />
                            )}
                          </div>
                          <span className="font-mono text-sm">{entry.transaction_id.slice(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            entry.entry_type === "CREDIT"
                              ? "bg-credit/10 text-credit"
                              : "bg-debit/10 text-debit"
                          )}
                        >
                          {entry.entry_type}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "px-4 py-4 font-semibold",
                          entry.entry_type === "CREDIT" ? "text-credit" : "text-debit"
                        )}
                      >
                        {entry.entry_type === "CREDIT" ? "+" : "-"}
                        {formatCurrency(parseFloat(entry.amount))}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDateTime(entry.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile List */}
              <div className="md:hidden divide-y divide-border">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.transaction_id}
                    className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            entry.entry_type === "CREDIT" ? "bg-credit/10" : "bg-debit/10"
                          )}
                        >
                          {entry.entry_type === "CREDIT" ? (
                            <ArrowDownLeft className="w-5 h-5 text-credit" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-debit" />
                          )}
                        </div>
                        <div>
                          <p className="font-mono text-sm">{entry.transaction_id.slice(0, 8)}...</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(entry.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-semibold",
                            entry.entry_type === "CREDIT" ? "text-credit" : "text-debit"
                          )}
                        >
                          {entry.entry_type === "CREDIT" ? "+" : "-"}
                          {formatCurrency(parseFloat(entry.amount))}
                        </p>
                        <span
                          className={cn(
                            "text-xs",
                            entry.entry_type === "CREDIT" ? "text-credit" : "text-debit"
                          )}
                        >
                          {entry.entry_type}
                        </span>
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
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              Transaction Details
            </DialogTitle>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-6 py-4">
              {/* Amount */}
              <div className="text-center py-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <p
                  className={cn(
                    "text-3xl font-display font-bold",
                    selectedEntry.entry_type === "CREDIT" ? "text-credit" : "text-debit"
                  )}
                >
                  {selectedEntry.entry_type === "CREDIT" ? "+" : "-"}
                  {formatCurrency(parseFloat(selectedEntry.amount))}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-xs">{selectedEntry.transaction_id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Type</span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      selectedEntry.entry_type === "CREDIT"
                        ? "bg-credit/10 text-credit"
                        : "bg-debit/10 text-debit"
                    )}
                  >
                    {selectedEntry.entry_type}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Wallet</span>
                  <span className="font-medium">{selectedEntry.wallet}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">
                    {formatDateTime(selectedEntry.created_at)}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setSelectedEntry(null)}
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
