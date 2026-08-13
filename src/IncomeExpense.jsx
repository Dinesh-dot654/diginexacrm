import React, { useState } from 'react';
import './IncomeExpense.css'; 

const IncomeExpense = ({ transactions, addTransaction }) => {
  const [incDesc, setIncDesc] = useState('');
  const [incAmt, setIncAmt] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expAmt, setExpAmt] = useState('');

  // Income & Expense list thani thaniya pirikirom
  const incomeList = transactions.filter(t => t.type === 'Income');
  const expenseList = transactions.filter(t => t.type === 'Expense');
  
  const totalIncome = incomeList.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenseList.reduce((acc, curr) => acc + curr.amount, 0);

  const handleManualAdd = (type) => {
    const desc = type === 'Income' ? incDesc : expDesc;
    const amt = type === 'Income' ? incAmt : expAmt;

    if (!desc || !amt) return;

    addTransaction({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      description: desc,
      amount: Number(amt),
      type: type
    });

    if (type === 'Income') { setIncDesc(''); setIncAmt(''); } 
    else { setExpDesc(''); setExpAmt(''); }
  };

  return (
    <div className="ie-container">
      
      {/* Income Section */}
      <div className="ie-box income-box">
        <div className="ie-header">
          <h3>📈 Income History</h3>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Total Income</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>₹ {totalIncome.toLocaleString('en-IN')}</div>
          </div>
        </div>
        
        <div className="ie-form-row">
          <input type="text" className="ie-input" placeholder="Manual Income Desc" value={incDesc} onChange={(e) => setIncDesc(e.target.value)} style={{ flex: 1 }} />
          <input type="number" className="ie-input" placeholder="Amount" value={incAmt} onChange={(e) => setIncAmt(e.target.value)} style={{ width: '120px' }} />
          <button className="ie-add-btn" onClick={() => handleManualAdd('Income')}>+</button>
        </div>

        <ul className="ie-list">
          {incomeList.map(item => (
            <li className="ie-list-item" key={item.id}>
              <span>{item.date} - {item.description}</span>
              <span style={{ fontWeight: 'bold', color: '#16a34a' }}>+ ₹ {item.amount.toLocaleString('en-IN')}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expense Section */}
      <div className="ie-box expense-box">
        <div className="ie-header">
          <h3>📉 Expense History</h3>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Total Expense</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>₹ {totalExpense.toLocaleString('en-IN')}</div>
          </div>
        </div>
        
        <div className="ie-form-row">
          <input type="text" className="ie-input" placeholder="Manual Expense Desc" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} style={{ flex: 1 }} />
          <input type="number" className="ie-input" placeholder="Amount" value={expAmt} onChange={(e) => setExpAmt(e.target.value)} style={{ width: '120px' }} />
          <button className="ie-add-btn" onClick={() => handleManualAdd('Expense')}>+</button>
        </div>

        <ul className="ie-list">
          {expenseList.map(item => (
            <li className="ie-list-item" key={item.id}>
              <span>{item.date} - {item.description}</span>
              <span style={{ fontWeight: 'bold', color: '#dc2626' }}>- ₹ {item.amount.toLocaleString('en-IN')}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default IncomeExpense;