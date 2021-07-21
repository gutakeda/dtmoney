import { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { api } from '../services/api';

const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
);

interface Transaction {
    id: string,
    title: string,
    type: string,
    amount: number,
    category: string,
    createdAt: string
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProviderProps {
    children: ReactNode
}

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
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

    async function createTransaction(transactionInput: TransactionInput) {
        const response = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date(),
        });

        const { transaction } = response.data;

        setTransactions([
            ...transactions,
            transaction,
        ])
    }

    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionsContext);

    return context;
}