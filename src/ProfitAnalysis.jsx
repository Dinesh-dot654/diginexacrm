import React from 'react';
import './ProfitAnalysis.css'; 

const ProfitAnalysis = () => {
  const totalIncome = 308000; 
  const totalExpense = 196840;
  const netProfit = totalIncome - totalExpense;

  return (
    <div>
      {/* 3 Colored Boxes */}
      <div className="profit-container">
        <div className="profit-card income">
          <div className="icon-box">📈</div>
          <div className="card-details">
            <p>TOTAL INCOME</p>
            <h3>₹ {totalIncome.toLocaleString('en-IN')}</h3>
          </div>
        </div>
        
        <div className="profit-card expense">
          <div className="icon-box">📉</div>
          <div className="card-details">
            <p>TOTAL EXPENSE</p>
            <h3>₹ {totalExpense.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        <div className="profit-card net">
          <div className="icon-box">💲</div>
          <div className="card-details">
            <p>NET PROFIT</p>
            <h3>₹ {netProfit.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="chart-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '20px' }}>📅</span>
          <h3 style={{ color: '#1e293b', margin: 0 }}>Monthly Financial Trend</h3>
        </div>

        {/* Pure CSS Mock Chart */}
        <div className="mock-chart-container">
          {/* Y Axis Labels */}
          <div className="y-axis">
            <span>₹120k</span>
            <span>₹80k</span>
            <span>₹40k</span>
            <span>0</span>
          </div>

          {/* Bars Area */}
          <div className="chart-bars">
            {/* Month 1 */}
            <div className="bar-group">
              <div className="bar expense-bar" style={{ height: '30%' }}></div>
              <div className="bar income-bar" style={{ height: '20%' }}></div>
            </div>
            {/* Month 2 */}
            <div className="bar-group">
              <div className="bar expense-bar" style={{ height: '40%' }}></div>
              <div className="bar income-bar" style={{ height: '100%' }}></div>
            </div>
            {/* Month 3 */}
            <div className="bar-group">
              <div className="bar expense-bar" style={{ height: '50%' }}></div>
              <div className="bar income-bar" style={{ height: '70%' }}></div>
            </div>
            {/* Month 4 */}
            <div className="bar-group">
              <div className="bar expense-bar" style={{ height: '20%' }}></div>
              <div className="bar income-bar" style={{ height: '60%' }}></div>
            </div>
            {/* Month 5 */}
            <div className="bar-group">
              <div className="bar expense-bar" style={{ height: '45%' }}></div>
              <div className="bar income-bar" style={{ height: '90%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitAnalysis;