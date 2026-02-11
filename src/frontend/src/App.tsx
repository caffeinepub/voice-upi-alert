import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import PermissionExplanationScreen from './screens/PermissionExplanationScreen';
import HomeScreen from './screens/HomeScreen';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import type { Transaction } from './types/transactions';

function App() {
  const [acknowledged, setAcknowledged] = useLocalStorageState<boolean>('acknowledged', false);
  const [voiceEnabled, setVoiceEnabled] = useLocalStorageState<boolean>('voiceEnabled', true);
  const [transactions, setTransactions] = useLocalStorageState<Transaction[]>('transactions', []);

  if (!acknowledged) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <PermissionExplanationScreen onAcknowledge={() => setAcknowledged(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HomeScreen
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        transactions={transactions}
        setTransactions={setTransactions}
      />
    </ThemeProvider>
  );
}

export default App;
