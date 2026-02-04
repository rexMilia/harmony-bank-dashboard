import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { transactionService } from "@/services/transactions";
import { formatCurrency } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type TransferState = "form" | "loading" | "success" | "error";

interface TransferResult {
  transaction_id: string;
  status: string;
}

const TransferPage = () => {
  const { balance, isLoading: balanceLoading, refetch: refetchBalance } = useWalletBalance();
  const { toast } = useToast();
  const [state, setState] = useState<TransferState>("form");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!receiverId) {
      setError("Please enter a receiver wallet ID");
      return;
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (numAmount > balance) {
      setError("Insufficient balance");
      return;
    }

    setState("loading");

    try {
      const result = await transactionService.transfer({
        receiver_id: receiverId,
        amount: numAmount,
      });

      setTransferResult(result);
      setState("success");
      toast({
        title: "Transfer Successful!",
        description: `${formatCurrency(numAmount)} sent successfully.`,
      });
      refetchBalance();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Transfer failed. Please try again.");
    }
  };

  const resetForm = () => {
    setState("form");
    setReceiverId("");
    setAmount("");
    setError("");
    setTransferResult(null);
  };

  if (state === "success" && transferResult) {
    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <Card className="shadow-card">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-foreground">
                Transfer Successful!
              </h2>
              <p className="text-muted-foreground">
                Your transfer of {formatCurrency(parseFloat(amount))} has been sent
                successfully.
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4 space-y-2 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono font-medium text-xs">{transferResult.transaction_id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">To</span>
                <span className="font-mono font-medium">{receiverId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatCurrency(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-success">{transferResult.status}</span>
              </div>
            </div>
            <Button onClick={resetForm} className="w-full">
              Make Another Transfer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <Card className="shadow-card">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-foreground">
                Transfer Failed
              </h2>
              <p className="text-muted-foreground">
                {error || "Something went wrong. Please try again."}
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setState("form")} variant="outline" className="flex-1">
                Try Again
              </Button>
              <Button onClick={resetForm} className="flex-1">
                New Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
          Transfer Money
        </h1>
        <p className="text-muted-foreground">Send money to another PayFlow user</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-primary" />
              P2P Transfer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="receiverId">Receiver Wallet ID</Label>
                <Input
                  id="receiverId"
                  placeholder="Enter receiver ID"
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  className="h-12 font-mono"
                  disabled={state === "loading"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 text-lg"
                  disabled={state === "loading"}
                  min="0"
                  step="0.01"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={state === "loading"}
              >
                {state === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Send Money"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg gradient-card">
              <p className="text-primary-foreground/80 text-sm mb-1">Available</p>
              <p className="text-2xl font-display font-bold text-primary-foreground">
                {balanceLoading ? "Loading..." : formatCurrency(balance)}
              </p>
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transfer amount</span>
                  <span
                    className={cn(
                      "font-medium",
                      parseFloat(amount) > balance && "text-destructive"
                    )}
                  >
                    {formatCurrency(parseFloat(amount))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-medium text-success">Free</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between">
                  <span className="font-medium">Balance after</span>
                  <span
                    className={cn(
                      "font-semibold",
                      parseFloat(amount) > balance && "text-destructive"
                    )}
                  >
                    {formatCurrency(Math.max(0, balance - parseFloat(amount || "0")))}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransferPage;
