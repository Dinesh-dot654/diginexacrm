import React, { useState } from 'react';
import ProfitAnalysis from './ProfitAnalysis';
import IncomeExpense from './IncomeExpense';
import InvoiceGenerator from './InvoiceGenerator';
import './PaymentDetails.css';

const PaymentDetails = () => {
  const [activeTab, setActiveTab] = useState('invoice');

  // 🌟 MAIN STATE: Ithu thaan namma local database mathiri act aagum
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2026-08-10', description: 'Previous Project Advance', amount: 50000, type: 'Income' },
    { id: 2, date: '2026-08-12', description: 'Office Maintenance', amount: 12000, type: 'Expense' }
  ]);

  // Puthu transaction add panna intha function work aagum
  const addTransaction = (newTxn) => {
    setTransactions([newTxn, ...transactions]);
  };

  return (
    <div className="payment-dashboard">
      <div className="pd-header">
         <button onClick={() => window.history.back()} className="pd-back-btn">← Back</button>
         <h1 style={{ margin: '0 0 5px 0' }}>ACCOUNTS OVERVIEW</h1>
         <p style={{ margin: 0, opacity: 0.8 }}>Manage income, expenses and track cash flow</p>
      </div>

      <div className="pd-tabs">
        <button className={`pd-tab-btn ${activeTab === 'profit' ? 'active' : ''}`} onClick={() => setActiveTab('profit')}>
          Profit Analysis
        </button>
        <button className={`pd-tab-btn ${activeTab === 'income-expense' ? 'active' : ''}`} onClick={() => setActiveTab('income-expense')}>
          Income & Expenses
        </button>
        <button className={`pd-tab-btn ${activeTab === 'invoice' ? 'active' : ''}`} onClick={() => setActiveTab('invoice')}>
          Invoice Generator
        </button>
      </div>

      <div>
        {/* Ella pages-kkum intha data-va anuppurom */}
        {activeTab === 'profit' && <ProfitAnalysis transactions={transactions} />}
        {activeTab === 'income-expense' && <IncomeExpense transactions={transactions} addTransaction={addTransaction} />}
        {activeTab === 'invoice' && <InvoiceGenerator addTransaction={addTransaction} />}
      </div>
    </div>
  );
};

export default PaymentDetails;