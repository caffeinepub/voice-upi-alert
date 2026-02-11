import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Volume2, VolumeX, Coffee, Plus, Info, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { Transaction } from '../types/transactions';
import { parseTransactionMessage } from '../utils/transactionParsing';
import { speak, testVoice } from '../utils/tts';
import { openUpiPayment } from '../utils/upi';

interface HomeScreenProps {
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

export default function HomeScreen({
  voiceEnabled,
  setVoiceEnabled,
  transactions,
  setTransactions,
}: HomeScreenProps) {
  const [messageInput, setMessageInput] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const todayTotal = transactions
    .filter((t) => {
      const today = new Date();
      const txDate = new Date(t.timestamp);
      return (
        txDate.getDate() === today.getDate() &&
        txDate.getMonth() === today.getMonth() &&
        txDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const last5Transactions = [...transactions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const handleAddTransaction = () => {
    if (!messageInput.trim()) {
      setParseError('Please enter a transaction message');
      return;
    }

    const parsed = parseTransactionMessage(messageInput);
    
    if (!parsed) {
      setParseError('Could not detect a credit transaction. Please check the message format.');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: parsed.amount,
      sender: parsed.sender,
      timestamp: parsed.timestamp || new Date().toISOString(),
      source: parsed.source,
      rawText: messageInput,
    };

    setTransactions([newTransaction, ...transactions]);
    setMessageInput('');
    setParseError(null);

    // Announce if voice is enabled
    if (voiceEnabled) {
      const announcement = `Money credited. Rupees ${parsed.amount} received in your account.`;
      speak(announcement);
    }
  };

  const handleTestVoice = () => {
    testVoice();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/generated/logo.dim_1200x300.png" 
                alt="Voice UPI Alert" 
                className="h-10 w-auto"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Voice Toggle Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              {voiceEnabled ? <Volume2 className="w-8 h-8 text-primary" /> : <VolumeX className="w-8 h-8 text-muted-foreground" />}
              Voice Announcements
            </CardTitle>
            <CardDescription className="text-lg">
              Automatically speak when money is credited
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg">
              <Label htmlFor="voice-toggle" className="text-2xl font-semibold cursor-pointer">
                Voice {voiceEnabled ? 'ON' : 'OFF'}
              </Label>
              <Switch
                id="voice-toggle"
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
                className="scale-150"
              />
            </div>
            <Button 
              onClick={handleTestVoice} 
              variant="outline" 
              className="w-full text-lg py-6"
            >
              Test Voice Announcement
            </Button>
          </CardContent>
        </Card>

        {/* Today's Total */}
        <Card className="border-2 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Today's Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary">₹{todayTotal.toFixed(2)}</p>
            <p className="text-muted-foreground text-lg mt-2">
              {transactions.filter((t) => {
                const today = new Date();
                const txDate = new Date(t.timestamp);
                return (
                  txDate.getDate() === today.getDate() &&
                  txDate.getMonth() === today.getMonth() &&
                  txDate.getFullYear() === today.getFullYear()
                );
              }).length} transaction(s) today
            </p>
          </CardContent>
        </Card>

        {/* Add Transaction */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Add Transaction
            </CardTitle>
            <CardDescription className="text-base">
              Paste a UPI or bank SMS message to add a transaction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-accent/10 border-accent">
              <Info className="h-5 w-5" />
              <AlertDescription className="text-sm ml-2">
                <strong>Parsing Help:</strong> Supports formats like "₹200", "Rs. 200.00", "INR 1,250". 
                Only credit/success messages will be added.
              </AlertDescription>
            </Alert>
            <Textarea
              placeholder="Paste transaction message here...&#10;&#10;Example:&#10;Rs.500.00 credited to A/c XX1234 on 11-Feb-26 by UPI/GPay/9876543210"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="min-h-32 text-base"
            />
            {parseError && (
              <Alert variant="destructive">
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleAddTransaction} className="w-full text-lg py-6">
              Parse & Add Transaction
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Transactions</CardTitle>
            <CardDescription className="text-base">Last 5 transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {last5Transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-lg">
                No transactions yet. Add one above to get started!
              </p>
            ) : (
              <div className="space-y-4">
                {last5Transactions.map((tx, index) => (
                  <div key={tx.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-sm">
                            {tx.source}
                          </Badge>
                          {tx.sender && (
                            <span className="text-base text-muted-foreground">
                              from {tx.sender}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{tx.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Buy Me a Coffee */}
        <Card className="border-2 shadow-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="pt-6">
            <Button
              onClick={openUpiPayment}
              size="lg"
              className="w-full text-xl py-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg"
            >
              <Coffee className="w-6 h-6 mr-2" />
              Buy Me a Coffee ☕
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Support the development of Voice UPI Alert
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-card/50">
        <div className="container mx-auto px-4 text-center text-base text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Voice UPI Alert • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
