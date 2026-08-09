import React, { useState } from 'react';
import { CreditCard, FileText, CheckCircle, AlertTriangle, Eye, X, Check, ShieldAlert, Plus, ArrowUpRight, ArrowDownLeft, BarChart2, Clock } from 'lucide-react';
import { DEPARTMENTS, COURSES_BY_DEPT, generateWeeklySchedule } from '../mockData';

export default function RegistrarWorkspace({ students = [], onUpdateBilling, onUpdateDocuments }) {
  
  const handleDownloadInvoice = (student) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const baseTuition = 45000;
    const adminFees = 5000;
    const totalSemFee = baseTuition + adminFees;
    
    const amountPaid = student.feeStatus === 'Paid' ? totalSemFee : (totalSemFee - student.feeAmount);
    const balanceDues = student.feeStatus === 'Paid' ? 0 : student.feeAmount;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Apex College Billing Invoice - ${student.name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            padding: 40px;
            background-color: white;
            line-height: 1.5;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #cbd5e1;
            padding-bottom: 24px;
            margin-bottom: 30px;
          }
          .college-logo {
            font-size: 28px;
            font-weight: 900;
            color: white;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            width: 54px;
            height: 54px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: -1px;
          }
          .title-area {
            text-align: right;
          }
          .title-area h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            color: #d97706;
            letter-spacing: -0.5px;
          }
          .title-area p {
            margin: 4px 0 0 0;
            font-size: 11px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .invoice-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 40px;
          }
          .meta-group p {
            margin: 6px 0;
            font-size: 13.5px;
          }
          .meta-group strong {
            color: #0f172a;
          }
          .meta-group span {
            color: #64748b;
            display: inline-block;
            width: 120px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 700;
            text-align: left;
            padding: 12px;
            font-size: 12px;
            text-transform: uppercase;
            border-bottom: 2px solid #cbd5e1;
          }
          td {
            padding: 14px 12px;
            font-size: 13.5px;
            border-bottom: 1px solid #e2e8f0;
          }
          .total-sec {
            width: 320px;
            margin-left: auto;
            margin-bottom: 50px;
            font-size: 14px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .total-row.grand {
            border-bottom: none;
            font-size: 17px;
            font-weight: 800;
            color: #0f172a;
            padding-top: 12px;
          }
          .status-stamp {
            display: inline-block;
            border: 4.5px solid #10b981;
            color: #10b981;
            font-weight: 800;
            font-size: 17px;
            padding: 8px 22px;
            border-radius: 8px;
            text-transform: uppercase;
            transform: rotate(-8deg);
            margin-top: 20px;
            letter-spacing: 1.5px;
          }
          .status-stamp.pending {
            border-color: #f59e0b;
            color: #f59e0b;
          }
          .status-stamp.overdue {
            border-color: #ef4444;
            color: #ef4444;
          }
          .sign-area {
            margin-top: 80px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .signature {
            border-top: 1.5px dashed #cbd5e1;
            width: 220px;
            text-align: center;
            padding-top: 10px;
            font-size: 12.5px;
            font-weight: 600;
            color: #475569;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="college-logo">A</div>
          <div class="title-area">
            <h1>APEX TECH COLLEGE</h1>
            <p>Tuition Fee Clearance Invoice</p>
          </div>
        </div>

        <div class="invoice-meta">
          <div class="meta-group">
            <p><span>Student Name:</span> <strong>${student.name}</strong></p>
            <p><span>Roll Number:</span> <strong>${student.rollNumber}</strong></p>
            <p><span>Branch:</span> <strong>${student.department}</strong></p>
          </div>
          <div class="meta-group" style="text-align: right;">
            <p><span style="width:auto;">Invoice ID:</span> <strong>INV-${student._id.toUpperCase()}</strong></p>
            <p><span style="width:auto;">Billing Term:</span> <strong>Semester ${student.semester}</strong></p>
            <p><span style="width:auto;">Date:</span> <strong>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Credits</th>
              <th style="text-align: right;">Base Cost</th>
              <th style="text-align: right;">Tax / Charges</th>
              <th style="text-align: right;">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Semester ${student.semester} Academic Tuition Fee</td>
              <td style="text-align: right;">18</td>
              <td style="text-align: right;">₹42,000</td>
              <td style="text-align: right;">₹3,000</td>
              <td style="text-align: right; font-weight: 600;">₹45,000</td>
            </tr>
            <tr>
              <td>Student Facilities, Library & Lab Charges</td>
              <td style="text-align: right;">-</td>
              <td style="text-align: right;">₹4,500</td>
              <td style="text-align: right;">₹500</td>
              <td style="text-align: right; font-weight: 600;">₹5,000</td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="status-stamp ${student.feeStatus.toLowerCase()}">
              ${student.feeStatus === 'Paid' ? 'Paid - Receipt Issued' : student.feeStatus === 'Pending' ? 'Dues Pending' : 'Dues Overdue'}
            </div>
          </div>
          
          <div class="total-sec">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${totalSemFee.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-row">
              <span>Amount Paid:</span>
              <span>₹${amountPaid.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-row grand">
              <span>Outstanding Dues:</span>
              <span>₹${balanceDues.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div class="sign-area">
          <div class="signature">Accounts Registrar Seal</div>
          <div class="signature">Authorized Signature</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };
  
  // 1. Calculations for Financial and Document KPIs
  const totalStudents = students.length;
  
  const totalOutstanding = students.reduce((acc, curr) => 
    curr.feeStatus !== 'Paid' ? acc + curr.feeAmount : acc, 0
  );
  
  const paidCount = students.filter(s => s.feeStatus === 'Paid').length;
  const collectionRate = totalStudents > 0 ? Math.round((paidCount / totalStudents) * 100) : 0;

  // Document verification stats
  let totalDocsCount = 0;
  let verifiedDocsCount = 0;
  let pendingVerifications = 0;

  students.forEach(s => {
    if (s.documents) {
      s.documents.forEach(doc => {
        totalDocsCount++;
        if (doc.status === 'Verified') verifiedDocsCount++;
        if (doc.status === 'Submitted') pendingVerifications++;
      });
    }
  });

  const docCompletionRate = totalDocsCount > 0 ? Math.round((verifiedDocsCount / totalDocsCount) * 100) : 0;

  // Modal / Drawer state hooks
  const [selectedStudentFee, setSelectedStudentFee] = useState(null);
  
  // Registrar navigation and schedule selection states
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('finance'); // 'finance' | 'schedules'
  const [selectedBranch, setSelectedBranch] = useState(DEPARTMENTS[0] || 'Computer Science');
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const getTodayDayString = () => {
    const dayIndex = new Date().getDay();
    if (dayIndex >= 1 && dayIndex <= 5) return daysOfWeek[dayIndex - 1];
    return "Monday";
  };
  const [selectedScheduleDay, setSelectedScheduleDay] = useState(getTodayDayString());
  
  // Collapsible Charts and tabs state
  const [chartsExpanded, setChartsExpanded] = useState(true);
  const [activeChartTab, setActiveChartTab] = useState('dues'); // 'dues' | 'rates'
  const [hoveredBar, setHoveredBar] = useState(null);

  // Branch-wise outstanding dues and collections calculations
  const branchDuesData = DEPARTMENTS.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    const totalDeptDues = deptStudents.reduce((sum, s) => s.feeStatus !== 'Paid' ? sum + s.feeAmount : sum, 0);
    const deptStudentsCount = deptStudents.length;
    const paidDeptStudents = deptStudents.filter(s => s.feeStatus === 'Paid').length;
    const collectionPct = deptStudentsCount > 0 ? Math.round((paidDeptStudents / deptStudentsCount) * 100) : 0;
    
    return {
      branch: dept,
      dues: totalDeptDues,
      collectionRate: collectionPct,
      count: deptStudentsCount
    };
  });
  
  // Fee Ledger Actions States
  const [actionType, setActionType] = useState('add_charge'); // 'add_charge' | 'post_payment' | 'manual_override'
  const [feeStatus, setFeeStatus] = useState('Pending');
  const [feeAmount, setFeeAmount] = useState(0);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('New Semester Tuition Fee');

  const [selectedStudentDocs, setSelectedStudentDocs] = useState(null);
  const [docsList, setDocsList] = useState([]);

  // Open Billing handlers
  const openBillingModal = (student) => {
    setSelectedStudentFee(student);
    setFeeStatus(student.feeStatus);
    setFeeAmount(student.feeAmount);
    setTransactionAmount('');
    setTransactionDesc('New Semester Tuition Fee');
    setActionType('add_charge');
  };

  const handleLedgerSubmit = (e) => {
    e.preventDefault();
    
    let newAmount = feeAmount;
    let newStatus = feeStatus;
    
    const amountVal = parseFloat(transactionAmount) || 0;

    if (actionType === 'add_charge') {
      // Add a fee charge (debit) - increases outstanding balance
      newAmount = feeAmount + amountVal;
      newStatus = newAmount > 0 ? 'Pending' : 'Paid';
    } else if (actionType === 'post_payment') {
      // Post a payment (credit) - decreases outstanding balance
      newAmount = Math.max(0, feeAmount - amountVal);
      newStatus = newAmount === 0 ? 'Paid' : 'Pending';
    } else {
      // Manual Override
      newAmount = parseFloat(feeAmount) || 0;
      newStatus = feeStatus;
    }

    const updatedStudent = {
      ...selectedStudentFee,
      feeStatus: newStatus,
      feeAmount: newAmount
    };

    onUpdateBilling(updatedStudent);
    setSelectedStudentFee(null);
  };

  // Open Document handlers
  const openDocsModal = (student) => {
    setSelectedStudentDocs(student);
    setDocsList(student.documents || [
      { name: "High School Marksheet", status: "Pending" },
      { name: "ID Proof / Passport", status: "Pending" },
      { name: "Admissions Letter", status: "Pending" }
    ]);
  };

  const handleVerifyDoc = (docName, status) => {
    const updatedDocsList = docsList.map(doc => 
      doc.name === docName ? { ...doc, status } : doc
    );
    setDocsList(updatedDocsList);
  };

  const saveDocsChanges = () => {
    const updatedStudent = {
      ...selectedStudentDocs,
      documents: docsList
    };
    onUpdateDocuments(updatedStudent);
    setSelectedStudentDocs(null);
  };

  return (
    <div className="registrar-view" style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* Welcome Banner */}
      <div className="metric-card" style={{ marginBottom: '32px', backgroundColor: 'var(--bg-secondary)', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Registrar Office &amp; Operations</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage student invoices, approve verification papers, and audit class timetables.
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', backgroundColor: 'var(--bg-secondary)', padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', width: '100%', maxWidth: 'fit-content' }}>
        <button
          type="button"
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '13px',
            backgroundColor: activeWorkspaceTab === 'finance' ? 'var(--accent)' : 'transparent',
            color: activeWorkspaceTab === 'finance' ? 'white' : 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveWorkspaceTab('finance')}
        >
          Finance &amp; Admissions Directory
        </button>
        <button
          type="button"
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '13px',
            backgroundColor: activeWorkspaceTab === 'schedules' ? 'var(--accent)' : 'transparent',
            color: activeWorkspaceTab === 'schedules' ? 'white' : 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveWorkspaceTab('schedules')}
        >
          Class Schedules Directory
        </button>
      </div>

      {activeWorkspaceTab === 'finance' && (
        <>
          {/* KPI Panel */}
          <div className="metrics-grid" style={{ marginBottom: '32px' }}>
        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Outstanding Fees Dues</span>
            <span className="metric-value" style={{ color: 'var(--danger)' }}>
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <CreditCard size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Fees Collection Rate</span>
            <span className="metric-value">{collectionRate}%</span>
          </div>
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Doc Verification Rate</span>
            <span className="metric-value">{docCompletionRate}%</span>
          </div>
          <div className="metric-icon-box" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <FileText size={24} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <span className="metric-label">Pending Document Reviews</span>
            <span className="metric-value" style={{ color: pendingVerifications > 0 ? 'var(--warning-text)' : 'inherit' }}>
              {pendingVerifications}
            </span>
          </div>
          <div className="metric-icon-box" style={{ backgroundColor: pendingVerifications > 0 ? 'var(--warning-light)' : 'var(--bg-tertiary)', color: pendingVerifications > 0 ? 'var(--warning)' : 'var(--text-secondary)' }}>
            <ShieldAlert size={24} />
          </div>
        </div>
      </div>

      {/* Interactive Financial Charts */}
      <div className="chart-card" style={{ marginBottom: '32px' }}>
        <div className="chart-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart2 size={20} style={{ color: 'var(--warning)' }} />
            <div>
              <h3 className="chart-title">Admissions Financial Analytics</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Fee clearance and collection stats per department</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-primary)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
              <button 
                type="button"
                className="btn-primary" 
                style={{ 
                  fontSize: '11px', 
                  padding: '6px 12px', 
                  backgroundColor: activeChartTab === 'dues' ? 'var(--warning)' : 'transparent',
                  color: activeChartTab === 'dues' ? 'var(--warning-text)' : 'var(--text-secondary)',
                  border: 'none',
                  boxShadow: 'none',
                  borderRadius: 'var(--radius-sm)'
                }}
                onClick={() => setActiveChartTab('dues')}
              >
                Outstanding Dues
              </button>
              <button 
                type="button"
                className="btn-primary" 
                style={{ 
                  fontSize: '11px', 
                  padding: '6px 12px', 
                  backgroundColor: activeChartTab === 'rates' ? 'var(--success)' : 'transparent',
                  color: activeChartTab === 'rates' ? 'var(--success-text)' : 'var(--text-secondary)',
                  border: 'none',
                  boxShadow: 'none',
                  borderRadius: 'var(--radius-sm)'
                }}
                onClick={() => setActiveChartTab('rates')}
              >
                Collection Rates
              </button>
            </div>
            <button 
              type="button"
              className="btn-icon" 
              onClick={() => setChartsExpanded(!chartsExpanded)}
              style={{ padding: '6px' }}
            >
              {chartsExpanded ? <X size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>

        {chartsExpanded && (
          <div style={{ padding: '24px 0 8px 0', animation: 'fadeIn 0.25s ease' }}>
            {/* SVG Interactive Chart */}
            <div className="svg-container" style={{ position: 'relative' }}>
              {(() => {
                const chartHeight = 160;
                const barWidth = 40;
                const gap = 24;
                const chartWidth = branchDuesData.length * (barWidth + gap) + gap;
                const maxVal = activeChartTab === 'dues'
                  ? Math.max(...branchDuesData.map(d => d.dues), 1)
                  : 100;

                return (
                  <svg viewBox={`0 0 ${chartWidth} 210`} width="100%" height="210" style={{ overflow: 'visible' }}>
                    {branchDuesData.map((d, index) => {
                      const value = activeChartTab === 'dues' ? d.dues : d.collectionRate;
                      const pct = value / maxVal;
                      const barHeight = pct * chartHeight;
                      const x = gap + index * (barWidth + gap);
                      const y = chartHeight - barHeight + 20;
                      
                      const isHovered = hoveredBar === index;
                      const shortName = d.branch.length > 12 ? d.branch.substring(0, 10) + '..' : d.branch;

                      let fill = 'var(--text-tertiary)';
                      if (value > 0) {
                        if (activeChartTab === 'dues') {
                          fill = isHovered ? 'hsl(346.8, 77.2%, 60%)' : 'var(--danger)';
                        } else {
                          fill = isHovered ? 'hsl(142.1, 76.2%, 45%)' : 'var(--success)';
                        }
                      }

                      return (
                        <g 
                          key={d.branch}
                          onMouseEnter={() => setHoveredBar(index)}
                          onMouseLeave={() => setHoveredBar(null)}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* Background bar */}
                          <rect
                            x={x}
                            y={20}
                            width={barWidth}
                            height={chartHeight}
                            rx={4}
                            fill="var(--bg-tertiary)"
                            opacity={0.5}
                          />
                          {/* Value Fill bar */}
                          <rect
                            className="bar-hoverable"
                            x={x}
                            y={y}
                            width={barWidth}
                            height={Math.max(barHeight, 4)}
                            rx={4}
                            fill={fill}
                            style={{ 
                              transition: 'all 0.2s ease', 
                              filter: isHovered ? 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))' : 'none' 
                            }}
                          />
                          {/* Value Text label */}
                          <text
                            x={x + barWidth / 2}
                            y={y - 8}
                            textAnchor="middle"
                            fontSize="11.5"
                            fontWeight="800"
                            fill="var(--text-primary)"
                          >
                            {activeChartTab === 'dues' 
                              ? (value >= 1000 ? `₹${(value/1000).toFixed(0)}k` : `₹${value}`)
                              : `${value}%`
                            }
                          </text>
                          {/* Branch Label */}
                          <text
                            x={x + barWidth / 2}
                            y={chartHeight + 36}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="600"
                            fill="var(--text-secondary)"
                          >
                            {shortName}
                          </text>
                        </g>
                      );
                    })}
                    <line
                      x1={0}
                      y1={chartHeight + 20}
                      x2={chartWidth}
                      y2={chartHeight + 20}
                      stroke="var(--border-color)"
                      strokeWidth={1}
                    />
                  </svg>
                );
              })()}
            </div>
            
            {/* Interactive tooltip / info box below the chart */}
            {hoveredBar !== null && (
              <div 
                style={{ 
                  margin: '16px 20px 0 20px', 
                  padding: '12px 16px', 
                  backgroundColor: 'var(--bg-primary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  animation: 'fadeIn 0.2s ease'
                }}
              >
                <div>
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{branchDuesData[hoveredBar].branch} Branch</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '8px' }}>({branchDuesData[hoveredBar].count} Students)</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Outstanding Dues:</span>{' '}
                    <strong style={{ color: 'var(--danger)' }}>₹{branchDuesData[hoveredBar].dues.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Paid Rate:</span>{' '}
                    <strong style={{ color: 'var(--success)' }}>{branchDuesData[hoveredBar].collectionRate}%</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Registrar Database Table (Hides GPAs and Attendance) */}
      <div className="table-container">
        <div className="chart-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 className="chart-title">Admissions Billing &amp; Document Registry</h3>
        </div>

        {students.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No Students Registered</p>
            <p className="empty-desc">Admissions records will populate here once signups are approved.</p>
          </div>
        ) : (
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Student Profile</th>
                <th>Academic GPA</th>
                <th>Attendance</th>
                <th>Fees Status</th>
                <th>Outstanding</th>
                <th>Uploaded Docs</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const initials = student.name.split(' ').map(n=>n[0]).join('');
                
                // Summarize docs status
                const docsCount = student.documents?.length || 0;
                const verifiedCount = student.documents?.filter(d => d.status === 'Verified').length || 0;
                const hasPendingDocs = student.documents?.some(d => d.status === 'Submitted');
                const hasRejectedDocs = student.documents?.some(d => d.status === 'Rejected');

                return (
                  <tr key={student._id}>
                    <td>
                      <div className="student-profile-cell">
                        <div className="avatar">{initials}</div>
                        <div>
                          <div className="student-name">{student.name}</div>
                          <div className="student-meta">{student.rollNumber} • {student.department}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* GPA & Attendance - STRICTLY LOCKED FOR REGISTRAR OFFICE */}
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        🔒 Confidential
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        🔒 Confidential
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${
                        student.feeStatus === 'Paid' ? 'badge-success' :
                        student.feeStatus === 'Pending' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {student.feeStatus}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700' }}>
                      ₹{student.feeStatus === 'Paid' ? '0' : student.feeAmount.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: '600' }}>{verifiedCount} / {docsCount}</span>
                        {hasRejectedDocs && (
                          <span className="badge badge-danger" style={{ padding: '2px 6px', fontSize: '10px' }}>Fix Alert</span>
                        )}
                        {!hasRejectedDocs && hasPendingDocs && (
                          <span className="badge badge-warning" style={{ padding: '2px 6px', fontSize: '10px' }}>Review</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button 
                          className="btn-action edit" 
                          onClick={() => openBillingModal(student)} 
                          title="Manage Billing Balance"
                        >
                          <CreditCard size={14} />
                        </button>
                        <button 
                          className="btn-action" 
                          onClick={() => openDocsModal(student)}
                          title="Verify Enrollment Documents"
                        >
                          <FileText size={14} />
                        </button>
                        <button 
                          className="btn-action" 
                          onClick={() => handleDownloadInvoice(student)}
                          title="Print Receipt / Invoice"
                          style={{ color: 'var(--success)' }}
                        >
                          <CheckCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      </>
      )}

      {/* TAB 2: Class Schedules Directory */}
      {activeWorkspaceTab === 'schedules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.25s ease' }}>
          {/* Selection controls */}
          <div className="chart-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-secondary)' }}>Select Department Branch</label>
              <select 
                className="select-filter" 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                style={{ width: '100%', fontSize: '14px', padding: '10px', backgroundColor: 'var(--bg-primary)' }}
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-secondary)' }}>Select Time-Table Day</label>
              <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-primary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', height: '40px', alignItems: 'center' }}>
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedScheduleDay(day)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      backgroundColor: selectedScheduleDay === day ? 'var(--accent)' : 'transparent',
                      color: selectedScheduleDay === day ? 'white' : 'var(--text-secondary)'
                    }}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule display grid */}
          <div className="chart-card">
            <div className="chart-header" style={{ display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <Clock size={20} style={{ color: 'var(--accent)' }} />
              <div>
                <h3 className="chart-title">Class Time-Table ({selectedBranch})</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Showing lecture periods mapped to the selected branch courses.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {(() => {
                const branchCourses = COURSES_BY_DEPT[selectedBranch] || [];
                const sched = generateWeeklySchedule(selectedBranch, branchCourses);
                const activeDaySched = sched ? sched[selectedScheduleDay] : [];

                return activeDaySched.map((slot, idx) => {
                  const isLunch = slot.isBreak;
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: isLunch ? 'var(--warning-light)' : 'var(--bg-secondary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {isLunch && (
                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', backgroundColor: 'var(--warning)' }} />
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: isLunch ? 'var(--warning-text)' : 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {slot.name}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> {slot.time}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '14px', fontWeight: '800', margin: 0, color: isLunch ? 'var(--warning-text)' : 'var(--text-primary)' }}>
                        {slot.subject}
                      </h4>

                      {!isLunch && (
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          Duration: 55 mins
                        </span>
                      )}
                      {isLunch && (
                        <span style={{ fontSize: '11px', color: 'var(--warning-text)' }}>
                          Duration: 1 hour break
                        </span>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Adjust Fees Billing Modal */}
      {selectedStudentFee && (
        <div className="modal-overlay open" onClick={() => setSelectedStudentFee(null)}>
          <form className="modal-container" onClick={(e) => e.stopPropagation()} onSubmit={handleLedgerSubmit}>
            <div className="modal-header">
              <h3 className="page-title">Manage Fees Ledger: {selectedStudentFee.name}</h3>
              <button type="button" className="btn-icon" onClick={() => setSelectedStudentFee(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              {/* Account Overview Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <div>
                  <span className="profile-detail-label">Current Outstanding Dues</span>
                  <p style={{ fontSize: '20px', fontWeight: '850', color: feeAmount > 0 ? 'var(--danger)' : 'var(--success)' }}>
                    ₹{feeAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <span className={`badge ${
                  selectedStudentFee.feeStatus === 'Paid' ? 'badge-success' :
                  selectedStudentFee.feeStatus === 'Pending' ? 'badge-warning' : 'badge-danger'
                }`}>
                  {selectedStudentFee.feeStatus}
                </span>
              </div>

              {/* Action Type Select Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: 'var(--bg-primary)', padding: '6px', borderRadius: 'var(--radius-md)' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: actionType === 'add_charge' ? 'var(--accent)' : 'transparent',
                    color: actionType === 'add_charge' ? 'white' : 'var(--text-secondary)'
                  }}
                  onClick={() => setActionType('add_charge')}
                >
                  <ArrowUpRight size={14} /> Add Charge (Debit)
                </button>

                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: actionType === 'post_payment' ? 'var(--success)' : 'transparent',
                    color: actionType === 'post_payment' ? 'white' : 'var(--text-secondary)'
                  }}
                  onClick={() => setActionType('post_payment')}
                >
                  <ArrowDownLeft size={14} /> Post Payment (Credit)
                </button>

                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: actionType === 'manual_override' ? 'var(--text-secondary)' : 'transparent',
                    color: actionType === 'manual_override' ? 'white' : 'var(--text-secondary)'
                  }}
                  onClick={() => setActionType('manual_override')}
                >
                  Edit Manually
                </button>
              </div>

              {/* Action Form Inputs */}
              {actionType === 'add_charge' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s ease' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Charge Amount (₹) *</label>
                    <input 
                      type="number" 
                      min="1" 
                      required
                      placeholder="e.g. 5000"
                      className="form-control"
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Charge Description / Invoice Label</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Library Fee, Lab Charges, Semester Fee"
                      className="form-control"
                      value={transactionDesc}
                      onChange={(e) => setTransactionDesc(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {actionType === 'post_payment' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s ease' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Payment Amount Received (₹) *</label>
                    <input 
                      type="number" 
                      min="1" 
                      max={feeAmount}
                      required
                      placeholder={`Max ₹${feeAmount}`}
                      className="form-control"
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(e.target.value)}
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={12} style={{ color: 'var(--success)' }} /> Deducts directly from current outstanding balance.
                  </p>
                </div>
              )}

              {actionType === 'manual_override' && (
                <div className="form-row" style={{ animation: 'fadeIn 0.2s ease' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Tuition Fee Status</label>
                    <select 
                      className="form-control"
                      value={feeStatus}
                      onChange={(e) => setFeeStatus(e.target.value)}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Outstanding Balance (₹)</label>
                    <input 
                      type="number"
                      min="0"
                      required
                      disabled={feeStatus === 'Paid'}
                      className="form-control"
                      value={feeStatus === 'Paid' ? 0 : feeAmount}
                      onChange={(e) => setFeeAmount(e.target.value)}
                    />
                  </div>
                </div>
              )}

            </div>

            <div className="modal-footer">
              <button type="button" className="btn-primary" style={{ backgroundColor: 'var(--text-secondary)' }} onClick={() => setSelectedStudentFee(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ backgroundColor: actionType === 'post_payment' ? 'var(--success)' : 'var(--accent)' }}>
                {actionType === 'add_charge' && 'Add Charge to Ledger'}
                {actionType === 'post_payment' && 'Post Payment'}
                {actionType === 'manual_override' && 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Verify Admissions Documents Modal */}
      {selectedStudentDocs && (
        <div className="modal-overlay open" onClick={() => setSelectedStudentDocs(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="page-title">Enrollment Document Checklist</h3>
              <button type="button" className="btn-icon" onClick={() => setSelectedStudentDocs(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '24px', fontSize: '13.5px' }}>
                <div>Reviewing files for: <strong>{selectedStudentDocs.name}</strong></div>
                <div style={{ marginTop: '4px' }}>Roll: <strong>{selectedStudentDocs.rollNumber}</strong></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {docsList.map(doc => (
                  <div key={doc.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)', width: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '14.5px', fontWeight: '700' }}>{doc.name}</h4>
                      <span className={`badge ${
                        doc.status === 'Verified' ? 'badge-success' :
                        doc.status === 'Submitted' ? 'badge-warning' :
                        doc.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                      }`} style={{ fontSize: '10px', padding: '2px 8px', marginTop: '6px', backgroundColor: doc.status === 'Pending' ? 'var(--bg-tertiary)' : undefined, color: doc.status === 'Pending' ? 'var(--text-primary)' : undefined }}>
                        {doc.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: doc.status === 'Verified' ? 'var(--text-tertiary)' : 'var(--success)' }}
                        onClick={() => handleVerifyDoc(doc.name, 'Verified')}
                        disabled={doc.status === 'Verified'}
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button 
                        className="btn-action delete" 
                        style={{ width: '28px', height: '28px' }}
                        onClick={() => handleVerifyDoc(doc.name, 'Rejected')}
                        disabled={doc.status === 'Rejected'}
                        title="Mark as Incomplete / Rejected"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" style={{ backgroundColor: 'var(--text-secondary)' }} onClick={() => setSelectedStudentDocs(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={saveDocsChanges}>
                Save Document Statuses
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
