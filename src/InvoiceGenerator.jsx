import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import './InvoiceGenerator.css';
import logo from './assets/logo.png'; 

const InvoiceGenerator = ({ addTransaction }) => {
  const receiptRef = useRef();

  const [formData, setFormData] = useState({
    receiptNo: `DIGI/${Math.floor(Math.random() * 10000)}`,
    orderId: '',
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    category: 'Website',
    paymentMode: 'Bank Transfer',
    utrNo: '',
    totalAmount: '',
    advancePaid: '',
    adBudget: '', // Puthusa Meta Ads-kku add panna state
  });

  // 🌟 FIX: Typing smooth-aah irukka Functional State Update use pandrom 🌟
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🌟 META ADS LOGIC: 30% Auto Calculation 🌟
  const isMetaAds = formData.category === 'Meta Ads';
  const adBudgetVal = Number(formData.adBudget) || 0;
  const serviceChargeVal = adBudgetVal * 0.30; // 30% Profit/Quote
  
  // Meta ads-aah iruntha (Budget + 30%) thaan Total. Illana normal Total Amount.
  const finalTotalAmount = isMetaAds 
    ? (adBudgetVal + serviceChargeVal) 
    : (Number(formData.totalAmount) || 0);

  // Balance Calculation
  const balanceAmount = finalTotalAmount - (Number(formData.advancePaid) || 0);

  const handleDownloadPDF = () => {
    const element = receiptRef.current;
    const opt = {
      margin: 0.5,
      filename: `Receipt_${formData.clientName || 'Client'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleSavePayment = () => {
    if (!formData.clientName || Number(formData.advancePaid) <= 0) {
      alert("Please enter Client Name and Valid Advance Amount!");
      return;
    }

    const newIncome = {
      id: Date.now(),
      date: formData.date,
      description: `Receipt: ${formData.clientName} (${formData.receiptNo}) - ${formData.category}`,
      amount: Number(formData.advancePaid),
      type: 'Income'
    };
    
    addTransaction(newIncome);

    alert('✅ Payment Saved & Auto-synced to Income successfully!');
    
    // Form-ah Reset pandrom
    setFormData({ 
      ...formData, 
      receiptNo: `DIGI/${Math.floor(Math.random() * 10000)}`, 
      advancePaid: '', 
      totalAmount: '', 
      adBudget: '',
      clientName: '',
      orderId: '',
      utrNo: ''
    });
  };

  return (
    <div className="invoice-wrapper">
      
      {/* LEFT SIDE: INPUT FORM */}
      <div className="invoice-form-section">
        <h3>RECEIPT DETAILS</h3>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label>RECEIPT NO *</label>
            <input name="receiptNo" value={formData.receiptNo} onChange={handleChange} />
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label>ORDER ID</label>
            <input name="orderId" value={formData.orderId} onChange={handleChange} placeholder="e.g. ORD-123" />
          </div>
        </div>
        
        <div className="input-group">
          <label>CLIENT NAME *</label>
          <input name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Enter Client Name" />
        </div>
        
        <div className="input-group">
          <label>CATEGORY / SERVICE</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Website">Website</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Meta Ads">Meta Ads</option> {/* PUTHU CATEGORY */}
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label>PAYMENT MODE</label>
            <select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label>UTR / TXN NO</label>
            <input name="utrNo" value={formData.utrNo} onChange={handleChange} placeholder="Optional" />
          </div>
        </div>

        <hr style={{ border: '0.5px solid #e2e8f0', margin: '20px 0' }}/>

        {/* 🌟 CONDITIONAL RENDERING FOR META ADS 🌟 */}
        {isMetaAds ? (
          <>
            <div className="input-group">
              <label>AD BUDGET (₹) *</label>
              <input type="number" name="adBudget" value={formData.adBudget} onChange={handleChange} placeholder="Enter Ad Budget" />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div className="input-group" style={{ flex: 1, background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                <label>SERVICE CHARGE (30%)</label>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0ea5e9' }}>
                  ₹ {serviceChargeVal.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="input-group" style={{ flex: 1, background: '#f1f5f9', padding: '10px', borderRadius: '6px' }}>
                <label>TOTAL AMOUNT (₹)</label>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>
                  ₹ {finalTotalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="input-group">
            <label>TOTAL AMOUNT (₹)</label>
            <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} placeholder="0" />
          </div>
        )}
        
        <div className="input-group amount-input">
          <label>ADVANCE PAID (₹) *</label>
          <input type="number" name="advancePaid" value={formData.advancePaid} onChange={handleChange} placeholder="0" />
        </div>

        <div className="input-group" style={{ background: '#fef2f2', padding: '10px', borderRadius: '6px' }}>
          <label>BALANCE AMOUNT (₹)</label>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>
            ₹ {balanceAmount.toLocaleString('en-IN')}
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="btn-save" onClick={handleSavePayment}>💾 Save Payment</button>
          <button className="btn-pdf" onClick={handleDownloadPDF}>📥 Download PDF</button>
        </div>
      </div>

      {/* RIGHT SIDE: LIVE PREVIEW (A4 Proportions & PDF Structure) */}
      <div className="invoice-preview-section">
        <div ref={receiptRef} className="a4-receipt">
          
          {/* Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0ea5e9', paddingBottom: '20px' }}>
            
            {/* Company Info */}
            <div>
              <img src={logo} alt="Diginexa Logo" style={{ height: '100px', width: 'auto', marginBottom: '15px' }} />
              
              <div style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
                <strong style={{ fontSize: '16px', color: '#1e293b' }}>DIGINEXA</strong><br/>
                Email: diginexadigi@gmail.com<br/>
                Phone: +91 9597581873
              </div>
            </div>

            {/* Receipt Meta */}
            <div style={{ textAlign: 'right' }}>
               <h2 style={{ color: '#0d9488', margin: '0 0 15px 0', letterSpacing: '1px', fontSize: '28px' }}>RECEIPT</h2>
               <div style={{ background: '#e0f2fe', padding: '15px 20px', borderRadius: '8px', fontSize: '13px', display: 'inline-block', textAlign: 'left', color: '#0369a1', minWidth: '200px' }}>
                 <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>RECEIPT NO:</strong> <span>{formData.receiptNo}</span>
                 </div>
                 <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>ORDER ID:</strong> <span>{formData.orderId || '---'}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>DATE:</strong> <span>{formData.date}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Client Info */}
          <div style={{ marginTop: '30px' }}>
            <h4 style={{ color: '#0d9488', margin: '0 0 5px 0', textTransform: 'uppercase' }}>RECEIVED FROM:</h4>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#334155' }}>
              {formData.clientName || '---'}
            </p>
          </div>

          {/* Details Table */}
          <table style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '15px 15px', border: '1px solid #0d9488', color: '#0d9488', fontWeight: 'bold', width: '40%' }}>Description / Category</td>
                <td style={{ padding: '15px 15px', border: '1px solid #0d9488', fontWeight: 'bold', color: '#1e293b' }}>
                  {formData.category}
                </td>
              </tr>
              
              {/* 🌟 PDF preview-la Meta Ads breakdown kaatta 🌟 */}
              {isMetaAds && (
                <>
                  <tr>
                    <td style={{ padding: '10px 15px', border: '1px solid #0d9488', color: '#64748b', fontSize: '14px' }}> -- Ad Budget</td>
                    <td style={{ padding: '10px 15px', border: '1px solid #0d9488', color: '#64748b', fontSize: '14px' }}>
                      ₹ {adBudgetVal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 15px', border: '1px solid #0d9488', color: '#64748b', fontSize: '14px' }}> -- Service Charge (30%)</td>
                    <td style={{ padding: '10px 15px', border: '1px solid #0d9488', color: '#64748b', fontSize: '14px' }}>
                      ₹ {serviceChargeVal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <td style={{ padding: '15px 15px', border: '1px solid #0d9488', color: '#0d9488', fontWeight: 'bold' }}>Payment Mode</td>
                <td style={{ padding: '15px 15px', border: '1px solid #0d9488', fontWeight: 'bold', color: '#1e293b' }}>
                  {formData.paymentMode}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '15px 15px', border: '1px solid #0d9488', color: '#0d9488', fontWeight: 'bold' }}>UTR / Transaction No</td>
                <td style={{ padding: '15px 15px', border: '1px solid #0d9488', fontWeight: 'bold', color: '#1e293b' }}>
                  {formData.utrNo || '---'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Financial Summary */}
          <div style={{ marginTop: '30px', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
            
            <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #cbd5e1', background: '#f8fafc' }}>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#475569' }}>Total Amount</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>₹ {finalTotalAmount.toLocaleString('en-IN')}</span>
            </div>
            
            <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', background: '#0d9488', color: '#fff' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>AMOUNT RECEIVED (ADVANCE)</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>₹ {Number(formData.advancePaid).toLocaleString('en-IN')}</span>
            </div>
            
            <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', background: '#fef2f2' }}>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#dc2626' }}>Balance Amount</span>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc2626' }}>₹ {balanceAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Footer Area */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '60px' }}>
            <div>
               <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>This is a Computer Generated Payment Receipt.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 40px 0', fontSize: '14px', color: '#475569', fontWeight: '600' }}>for DIGINEXA</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#1e293b', borderTop: '1px solid #cbd5e1', paddingTop: '5px' }}>Authorised Signatory</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;