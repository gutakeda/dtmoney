import { createContext, useEffect, useState, ReactNode } from 'react';
import { api } from './services/api';

export const TransactionsContext = createContext<Transaction[]>([]);

interface Transaction {
    id: string,
    title: string,
    type: string,
    amount: number,
    category: string,
    createdAt: string
}

interface TransactionsProviderProps {
    children: ReactNode
}
export function TransactionsProvider({ children }: TransactionsProviderProps) {

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        async function loadTransactions() {
            const response = await api.get('transactions')
            console.log(response.data);
            setTransactions(response.data.transactions);
        }
        loadTransactions();
    }, [])

    return (
        <TransactionsContext.Provider value={transactions}>
            {children}
        </TransactionsContext.Provider>
    )
}