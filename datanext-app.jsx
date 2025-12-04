import React, { useState, useEffect, useCallback } from 'react';

// Decision Criteria definitions based on the 8 criteria
const decisionCriteria = [
  {
    id: 1,
    name: 'Strategic Objectives',
    shortName: 'S/4HANA Alignment',
    description: 'Based on the functions e.g. Reimagine Finance',
    weight: 15,
    options: ['Core Finance', 'Supply Chain', 'Sales & Distribution', 'HR', 'Manufacturing', 'Procurement']
  },
  {
    id: 2,
    name: 'Business Value',
    shortName: 'Strategic Importance',
    description: 'How critical the reporting is for decision-making, competitive advantage',
    weight: 20,
    options: ['Mission Critical', 'High', 'Medium', 'Low', 'Minimal']
  },
  {
    id: 3,
    name: 'Data Complexity',
    shortName: 'Heterogeneity',
    description: 'Mix of SAP sources, non-SAP (e.g., Kinaxis, Salesforce) and transformations',
    weight: 10,
    options: ['SAP Only', 'SAP + 1 External', 'Multi-Source', 'Complex Transformations', 'Highly Complex']
  },
  {
    id: 4,
    name: 'Historical Depth',
    shortName: 'Archival/Analytics',
    description: 'Historical data requirement for past several years, planning, advanced analytics',
    weight: 10,
    options: ['Current Only', '1 Year', '3 Years', '5+ Years', 'Full History']
  },
  {
    id: 5,
    name: 'Real-time Requirement',
    shortName: 'Operational Need',
    description: 'Business need for near-real-time, batch or transactional speed',
    weight: 15,
    options: ['Real-time', 'Near Real-time', 'Hourly', 'Daily Batch', 'Weekly/Monthly']
  },
  {
    id: 6,
    name: 'Legacy Reuse Potential',
    shortName: 'Model Reusability',
    description: 'Existing BW reports/models can be reused or must be re-designed',
    weight: 10,
    options: ['Direct Reuse', 'Minor Changes', 'Moderate Redesign', 'Major Redesign', 'Full Rebuild']
  },
  {
    id: 7,
    name: 'Effort vs Value',
    shortName: 'Cost/Time to Value',
    description: 'Effort of migration versus expected value; availability of business/user readiness',
    weight: 10,
    options: ['Quick Win', 'Low Effort/High Value', 'Balanced', 'High Effort/High Value', 'High Effort/Low Value']
  },
  {
    id: 8,
    name: 'Innovation/AI Readiness',
    shortName: 'Advanced Analytics',
    description: 'Need for advanced analytics, ML, combining with external data (social, IoT)',
    weight: 10,
    options: ['AI/ML Required', 'Predictive Analytics', 'Advanced Reporting', 'Standard Analytics', 'Basic Reporting']
  }
];

// Generate comprehensive report catalog
const generateReportCatalog = () => {
  const reportTypes = ['SAP ABAP', 'SAP BW', 'Databricks'];
  const functionalAreas = ['Finance', 'Sales', 'Supply Chain', 'HR', 'Manufacturing', 'Procurement', 'Customer Service', 'Marketing'];
  const reportCategories = ['Operational Dashboard', 'KPI Scorecard', 'Management Report', 'Analytical Report', 'Transactional Report', 'Compliance Report'];
  const dataSources = {
    'SAP ABAP': ['ACDOCA', 'BKPF/BSEG', 'VBAK/VBAP', 'EKKO/EKPO', 'MARA/MARC', 'PA0001/PA0002'],
    'SAP BW': ['InfoCube', 'DSO', 'CompositeProvider', 'HANA View', 'Open ODS', 'BEx Query'],
    'Databricks': ['Delta Lake', 'Unity Catalog', 'Feature Store', 'MLflow Model', 'Structured Streaming']
  };
  const businessOwners = ['CFO Office', 'VP Sales', 'COO', 'CHRO', 'VP Supply Chain', 'Controller', 'CMO', 'CIO'];
  const refreshFrequencies = ['Real-time', 'Hourly', 'Daily', 'Weekly', 'Monthly'];
  const reportNames = [
    'Revenue Analysis', 'Cost Center Report', 'Inventory Status', 'Sales Pipeline', 
    'Budget Variance', 'Headcount Report', 'Procurement Spend', 'Customer Insights',
    'Product Profitability', 'Cash Flow Analysis', 'Order Fulfillment', 'Vendor Performance',
    'Employee Turnover', 'Campaign ROI', 'Logistics Tracking', 'Quality Metrics',
    'Margin Analysis', 'Working Capital', 'DSO Tracking', 'Forecast Accuracy',
    'Production Efficiency', 'Supplier Scorecard', 'Territory Performance', 'Churn Analysis'
  ];

  return Array.from({ length: 250 }, (_, i) => {
    const sourceType = reportTypes[i % 3];
    const funcArea = functionalAreas[i % 8];
    
    // Generate criteria scores based on report characteristics
    const criteriaScores = {
      1: Math.floor(Math.random() * 5) + 1,
      2: Math.floor(Math.random() * 5) + 1,
      3: Math.floor(Math.random() * 5) + 1,
      4: Math.floor(Math.random() * 5) + 1,
      5: Math.floor(Math.random() * 5) + 1,
      6: Math.floor(Math.random() * 5) + 1,
      7: Math.floor(Math.random() * 5) + 1,
      8: Math.floor(Math.random() * 5) + 1
    };
    
    // Calculate composite score
    const compositeScore = Object.entries(criteriaScores).reduce((sum, [id, score]) => {
      const criteria = decisionCriteria.find(c => c.id === parseInt(id));
      return sum + (score * criteria.weight / 100);
    }, 0);
    
    // Derive migration path based on scores
    const deriveMigrationPath = () => {
      const businessValue = criteriaScores[2];
      const dataComplexity = criteriaScores[3];
      const realTime = criteriaScores[5];
      const reusePotential = criteriaScores[6];
      const aiReadiness = criteriaScores[8];
      
      if (businessValue <= 2 && compositeScore < 2) return { path: 'Retire', status: 'Deprecated' };
      if (businessValue <= 3 && reusePotential >= 4) return { path: 'Retire', status: 'Redundant' };
      if (realTime <= 2 && dataComplexity <= 2 && sourceType !== 'Databricks') return { path: 'Embedded Analytics', status: 'Needed' };
      if (aiReadiness <= 2 || dataComplexity >= 4) return { path: 'Data Lake', status: 'Needed' };
      if (reusePotential <= 2) return { path: 'Retain', status: 'Needed' };
      return { path: 'Datasphere/BDC', status: 'Needed' };
    };
    
    const migration = deriveMigrationPath();
    
    return {
      id: `RPT-${String(i + 1).padStart(4, '0')}`,
      name: `${reportNames[i % reportNames.length]} ${Math.floor(i / 24) + 1}`,
      sourceType,
      functionalArea: funcArea,
      category: reportCategories[i % 6],
      dataSources: dataSources[sourceType].slice(0, Math.floor(Math.random() * 3) + 1),
      businessOwner: businessOwners[i % 8],
      refreshFrequency: refreshFrequencies[Math.floor(Math.random() * 5)],
      lastUsed: Math.floor(Math.random() * 365),
      activeUsers: Math.floor(Math.random() * 50) + 1,
      createdYear: 2015 + Math.floor(Math.random() * 8),
      complexity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      hasExternalData: Math.random() > 0.7,
      kpiExamples: funcArea === 'Finance' 
        ? ['Revenue', 'EBITDA', 'Working Capital', 'DSO']
        : funcArea === 'Sales'
        ? ['Pipeline Value', 'Win Rate', 'ASP', 'Quota Attainment']
        : funcArea === 'Supply Chain'
        ? ['OTIF', 'Inventory Turns', 'Lead Time', 'Fill Rate']
        : ['Efficiency', 'Utilization', 'Quality', 'Throughput'],
      criteriaScores,
      compositeScore: Math.round(compositeScore * 100) / 100,
      migrationPath: migration.path,
      status: migration.status,
      confidence: Math.floor(Math.random() * 20) + 80,
      rationale: `Based on ${decisionCriteria[criteriaScores[2] > 3 ? 1 : 6].name} assessment`
    };
  });
};

const reports = generateReportCatalog();

// Stats calculations
const getStats = (reportList) => ({
  total: reportList.length,
  needed: reportList.filter(r => r.status === 'Needed').length,
  redundant: reportList.filter(r => r.status === 'Redundant').length,
  deprecated: reportList.filter(r => r.status === 'Deprecated').length,
  bySource: {
    'SAP ABAP': reportList.filter(r => r.sourceType === 'SAP ABAP').length,
    'SAP BW': reportList.filter(r => r.sourceType === 'SAP BW').length,
    'Databricks': reportList.filter(r => r.sourceType === 'Databricks').length
  },
  byPath: {
    'Embedded Analytics': reportList.filter(r => r.migrationPath === 'Embedded Analytics').length,
    'Datasphere/BDC': reportList.filter(r => r.migrationPath === 'Datasphere/BDC').length,
    'Data Lake': reportList.filter(r => r.migrationPath === 'Data Lake').length,
    'Retain': reportList.filter(r => r.migrationPath === 'Retain').length,
    'Retire': reportList.filter(r => r.migrationPath === 'Retire').length
  }
});

// Knowledge Graph Component
const KnowledgeGraph = ({ reports, filter, onNodeClick, isClassifying }) => {
  const width = 800;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const filteredReports = filter === 'All' ? reports : reports.filter(r => r.status === filter);
  
  const getNodePosition = (index, total) => {
    const rings = 5;
    const ring = Math.floor(index / (total / rings));
    const indexInRing = index % Math.ceil(total / rings);
    const itemsInRing = Math.ceil(total / rings);
    const angle = (indexInRing / itemsInRing) * 2 * Math.PI + (ring * 0.3);
    const radius = 60 + ring * 70;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  };
  
  const statusColors = {
    'Needed': '#10B981',
    'Redundant': '#9CA3AF',
    'Deprecated': '#EF4444'
  };
  
  const connections = [];
  filteredReports.slice(0, 50).forEach((report, i) => {
    const deps = Math.min(report.dataSources?.length || 1, 3);
    for (let d = 0; d < deps; d++) {
      const targetIndex = (i + d + 1) % Math.min(filteredReports.length, 50);
      connections.push({ from: i, to: targetIndex });
    }
  });
  
  return (
    <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '16px', position: 'relative' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <circle cx={centerX} cy={centerY} r="200" fill="url(#centerGlow)" />
        
        {connections.map((conn, i) => {
          const from = getNodePosition(conn.from, Math.min(filteredReports.length, 50));
          const to = getNodePosition(conn.to, Math.min(filteredReports.length, 50));
          return (
            <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#E5E7EB" strokeWidth="1" opacity="0.5" />
          );
        })}
        
        <circle cx={centerX} cy={centerY} r="30" fill="#10B981" />
        <text x={centerX} y={centerY + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Knowledge</text>
        <text x={centerX} y={centerY + 16} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Graph</text>
        
        {filteredReports.slice(0, 100).map((report, i) => {
          const pos = getNodePosition(i, Math.min(filteredReports.length, 100));
          const size = 6 + (report.activeUsers / 20);
          return (
            <g key={report.id} onClick={() => onNodeClick(report)} style={{ cursor: 'pointer' }}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size}
                fill={isClassifying ? '#9CA3AF' : statusColors[report.status]}
                opacity={0.7}
              />
            </g>
          );
        })}
      </svg>
      
      {isClassifying && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.95)',
          padding: '24px 32px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          textAlign: 'center'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #E5E7EB',
            borderTopColor: '#10B981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <div style={{ fontWeight: '600', color: '#1F2937' }}>Applying Decision Criteria...</div>
          <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>Analyzing 8 criteria across all reports</div>
        </div>
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon, label, value, subValue, color = '#10B981' }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '10px',
      background: `${color}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: color,
      fontSize: '24px'
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937' }}>{value}</div>
      <div style={{ fontSize: '14px', color: '#6B7280' }}>{label}</div>
      {subValue && <div style={{ fontSize: '12px', color: color, marginTop: '2px' }}>{subValue}</div>}
    </div>
  </div>
);

// Report Catalog Table
const ReportCatalog = ({ reports, onRowClick }) => {
  const [filterArea, setFilterArea] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const functionalAreas = ['All', ...new Set(reports.map(r => r.functionalArea))];
  const sourceTypes = ['All', 'SAP ABAP', 'SAP BW', 'Databricks'];
  
  const filteredReports = reports
    .filter(r => filterArea === 'All' || r.functionalArea === filterArea)
    .filter(r => filterSource === 'All' || r.sourceType === filterSource)
    .filter(r => searchTerm === '' || r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const statusColors = {
    'Needed': { bg: '#ECFDF5', text: '#059669' },
    'Redundant': { bg: '#F3F4F6', text: '#6B7280' },
    'Deprecated': { bg: '#FEF2F2', text: '#DC2626' }
  };
  
  const sourceColors = {
    'SAP ABAP': { bg: '#FEF3C7', text: '#B45309' },
    'SAP BW': { bg: '#DBEAFE', text: '#1D4ED8' },
    'Databricks': { bg: '#F3E8FF', text: '#7C3AED' }
  };
  
  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            width: '250px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <select 
          value={filterArea} 
          onChange={(e) => setFilterArea(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
        >
          {functionalAreas.map(a => <option key={a} value={a}>{a === 'All' ? 'All Functional Areas' : a}</option>)}
        </select>
        <select 
          value={filterSource} 
          onChange={(e) => setFilterSource(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
        >
          {sourceTypes.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sources' : s}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#6B7280' }}>
          Showing {filteredReports.length} of {reports.length} reports
        </span>
      </div>
      
      <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
            <tr style={{ background: '#F9FAFB' }}>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB', whiteSpace: 'nowrap' }}>Report ID</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Name</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Source</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Functional Area</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Category</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Data Sources</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>KPIs</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Refresh</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Owner</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Status</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB' }}>Migration Path</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.slice(0, 50).map((report) => (
              <tr 
                key={report.id} 
                onClick={() => onRowClick(report)}
                style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #E5E7EB', fontFamily: 'monospace', color: '#6B7280', fontSize: '12px' }}>{report.id}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #E5E7EB', fontWeight: '500', color: '#1F2937' }}>{report.name}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #E5E7EB' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: sourceColors[report.sourceType].bg,
                    color: sourceColors[report.sourceType].text
                  }}>
                    {report.sourceType}
                  </span>
                </td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #E5E7EB', color: '#374151' }}>{report.functionalArea}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '12px' }}>{report.category}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #E5E7EB', fontSize: '11px', color: '#6B7280' }}>
                  {report.dataSources.join(', ')}
                </td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #E5E7EB', fontSize: '11px', color: '#6B7280' }}>
                  {report.kpiExamples.slice(0, 2).join(', ')}
                </td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '12px' }}>{report.refreshFrequency}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '12px' }}>{report.businessOwner}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #E5E7EB' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: statusColors[report.status].bg,
                    color: statusColors[report.status].text
                  }}>
                    {report.status}
                  </span>
                </td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #E5E7EB', fontWeight: '500', color: '#059669', fontSize: '12px' }}>
                  {report.migrationPath}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Decision Criteria Panel
const DecisionCriteriaPanel = ({ criteria, onWeightChange }) => {
  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
      <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>Decision Criteria Framework</h3>
      <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6B7280' }}>
        These 8 criteria are applied to each report to derive the optimal migration path. Adjust weights to reflect business priorities.
      </p>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {criteria.map((c) => (
          <div key={c.id} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '16px',
            padding: '16px',
            background: '#F9FAFB',
            borderRadius: '10px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#10B981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '16px',
              flexShrink: 0
            }}>
              {c.id}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>{c.name}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>{c.description}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6B7280', width: '50px' }}>Weight:</span>
                <input 
                  type="range" 
                  min="5" 
                  max="25" 
                  value={c.weight}
                  onChange={(e) => onWeightChange(c.id, parseInt(e.target.value))}
                  style={{ flex: 1, accentColor: '#10B981' }}
                />
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#10B981',
                  width: '40px',
                  textAlign: 'right'
                }}>
                  {c.weight}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        background: '#F0FDF4', 
        borderRadius: '8px',
        border: '1px solid #BBF7D0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontWeight: '600', color: '#166534' }}>Total Weight: </span>
          <span style={{ color: '#15803D' }}>
            {criteria.reduce((sum, c) => sum + c.weight, 0)}%
          </span>
        </div>
        <button style={{
          padding: '8px 16px',
          background: '#10B981',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          Apply Criteria
        </button>
      </div>
    </div>
  );
};

// Report Detail with Criteria Scores
const ReportDetailPanel = ({ report, onClose, criteria }) => {
  if (!report) return null;
  
  const statusColors = {
    'Needed': { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
    'Redundant': { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' },
    'Deprecated': { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' }
  };
  
  const pathColors = {
    'Embedded Analytics': '#3B82F6',
    'Datasphere/BDC': '#8B5CF6',
    'Data Lake': '#06B6D4',
    'Retain': '#10B981',
    'Retire': '#EF4444'
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '480px',
      height: '100vh',
      background: 'white',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
      zIndex: 1000,
      overflow: 'auto',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>{report.id}</div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginTop: '4px' }}>{report.name}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9CA3AF' }}>×</button>
        </div>
        
        <div style={{
          padding: '16px',
          background: statusColors[report.status].bg,
          borderRadius: '10px',
          border: `1px solid ${statusColors[report.status].border}`,
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: statusColors[report.status].text }} />
            <span style={{ fontWeight: '600', color: statusColors[report.status].text }}>Classification: {report.status}</span>
          </div>
          <div style={{ fontSize: '14px', color: '#6B7280' }}>
            Composite Score: <strong>{report.compositeScore}</strong> / 5.0
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Migration Recommendation</div>
          <div style={{
            padding: '16px',
            background: '#F0FDF4',
            borderRadius: '10px',
            border: '1px solid #BBF7D0'
          }}>
            <div style={{ fontWeight: '600', color: pathColors[report.migrationPath] || '#166534', marginBottom: '4px', fontSize: '16px' }}>
              → {report.migrationPath}
            </div>
            <div style={{ fontSize: '13px', color: '#15803D' }}>Confidence: {report.confidence}%</div>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Catalog Attributes</div>
          <div style={{ display: 'grid', gap: '8px' }}>
            {[
              { label: 'Source System', value: report.sourceType },
              { label: 'Functional Area', value: report.functionalArea },
              { label: 'Category', value: report.category },
              { label: 'Data Sources', value: report.dataSources.join(', ') },
              { label: 'Refresh Frequency', value: report.refreshFrequency },
              { label: 'Business Owner', value: report.businessOwner },
              { label: 'Active Users', value: report.activeUsers },
              { label: 'Created', value: report.createdYear },
              { label: 'KPI Examples', value: report.kpiExamples.join(', ') }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ color: '#6B7280', fontSize: '13px' }}>{item.label}</span>
                <span style={{ fontWeight: '500', color: '#1F2937', fontSize: '13px', textAlign: 'right', maxWidth: '200px' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Decision Criteria Scores</div>
          <div style={{ display: 'grid', gap: '8px' }}>
            {criteria.map(c => {
              const score = report.criteriaScores[c.id];
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: '#E5E7EB', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#6B7280'
                  }}>
                    {c.id}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>{c.shortName}</div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(n => (
                        <div key={n} style={{
                          width: '32px',
                          height: '6px',
                          borderRadius: '3px',
                          background: n <= score ? '#10B981' : '#E5E7EB'
                        }} />
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>{score}/5</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Decision Rationale</div>
          <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
            Based on the weighted analysis of all 8 decision criteria, this report scores {report.compositeScore}/5.0. 
            The {report.migrationPath} path is recommended due to {report.criteriaScores[2] > 3 ? 'high business value' : 'optimization potential'} 
            {report.criteriaScores[5] <= 2 ? ' and real-time requirements' : ''}.
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ flex: 1, padding: '12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
            Approve
          </button>
          <button style={{ flex: 1, padding: '12px', background: 'white', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
            Override
          </button>
        </div>
      </div>
    </div>
  );
};

// Migration Matrix Component
const MigrationMatrix = ({ reports }) => {
  const matrix = {
    'SAP ABAP': { 'Embedded Analytics': 0, 'Datasphere/BDC': 0, 'Data Lake': 0, 'Retain': 0, 'Retire': 0 },
    'SAP BW': { 'Embedded Analytics': 0, 'Datasphere/BDC': 0, 'Data Lake': 0, 'Retain': 0, 'Retire': 0 },
    'Databricks': { 'Embedded Analytics': 0, 'Datasphere/BDC': 0, 'Data Lake': 0, 'Retain': 0, 'Retire': 0 }
  };
  
  reports.forEach(r => {
    if (matrix[r.sourceType] && matrix[r.sourceType][r.migrationPath] !== undefined) {
      matrix[r.sourceType][r.migrationPath]++;
    }
  });
  
  const paths = ['Embedded Analytics', 'Datasphere/BDC', 'Data Lake', 'Retain', 'Retire'];
  const types = ['SAP ABAP', 'SAP BW', 'Databricks'];
  
  const getIntensity = (value) => {
    const max = 30;
    const intensity = Math.min(value / max, 1);
    return `rgba(16, 185, 129, ${0.1 + intensity * 0.8})`;
  };
  
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', background: '#F9FAFB' }}>Source → Target</th>
            {paths.map(path => (
              <th key={path} style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151', background: '#F9FAFB', fontSize: '13px' }}>
                {path}
              </th>
            ))}
            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151', background: '#F9FAFB' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {types.map(type => (
            <tr key={type}>
              <td style={{ padding: '12px', fontWeight: '500', color: '#1F2937', borderBottom: '1px solid #E5E7EB' }}>{type}</td>
              {paths.map(path => (
                <td key={path} style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  borderBottom: '1px solid #E5E7EB',
                  background: getIntensity(matrix[type][path])
                }}>
                  <span style={{ fontWeight: '600', color: matrix[type][path] > 15 ? 'white' : '#1F2937' }}>
                    {matrix[type][path]}
                  </span>
                </td>
              ))}
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #E5E7EB', fontWeight: '700', color: '#1F2937' }}>
                {Object.values(matrix[type]).reduce((a, b) => a + b, 0)}
              </td>
            </tr>
          ))}
          <tr style={{ background: '#F9FAFB' }}>
            <td style={{ padding: '12px', fontWeight: '700', color: '#1F2937' }}>Total</td>
            {paths.map(path => (
              <td key={path} style={{ padding: '12px', textAlign: 'center', fontWeight: '700', color: '#1F2937' }}>
                {types.reduce((sum, type) => sum + matrix[type][path], 0)}
              </td>
            ))}
            <td style={{ padding: '12px', textAlign: 'center', fontWeight: '700', color: '#10B981', fontSize: '18px' }}>
              {reports.length}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'catalog', label: 'Report Catalog', icon: '📋' },
    { id: 'criteria', label: 'Decision Criteria', icon: '⚖️' },
    { id: 'graph', label: 'Knowledge Graph', icon: '🔗' },
    { id: 'matrix', label: 'Migration Matrix', icon: '🎯' },
    { id: 'demo', label: 'Demo Walkthrough', icon: '▶️' }
  ];
  
  return (
    <div style={{
      width: '260px',
      background: 'white',
      borderRight: '1px solid #E5E7EB',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: '#10B981',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '18px', color: '#1F2937' }}>DataNext</div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>S/4HANA Migration Intelligence</div>
          </div>
        </div>
      </div>
      
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: activeView === item.id ? '#F0FDF4' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '4px'
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span style={{ 
              fontWeight: activeView === item.id ? '600' : '400', 
              color: activeView === item.id ? '#059669' : '#6B7280',
              fontSize: '14px'
            }}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
      
      <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: '#F3F4F6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            color: '#6B7280',
            fontSize: '14px'
          }}>
            SS
          </div>
          <div>
            <div style={{ fontWeight: '500', fontSize: '14px', color: '#1F2937' }}>Abhay Sisodia</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Data Analyst</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Scene Component
const DemoScene = ({ scene, onNext, onPrev }) => {
  const scenes = [
    { title: "Build Report Catalog", subtitle: "Step 1", description: "Create a comprehensive catalog of all current state reports with attributes: source system, functional area, data sources, category, KPIs, and ownership.", icon: "📋" },
    { title: "Apply Decision Criteria", subtitle: "Step 2", description: "Evaluate each report against 8 weighted criteria: Strategic Alignment, Business Value, Data Complexity, Historical Depth, Real-time Needs, Reuse Potential, Effort/Value, and AI Readiness.", icon: "⚖️" },
    { title: "Generate Knowledge Graph", subtitle: "Step 3", description: "Visualize report relationships, data lineage, and dependencies across SAP ABAP, BW, and Databricks systems.", icon: "🔗" },
    { title: "Derive Migration Matrix", subtitle: "Step 4", description: "Based on criteria scores, automatically recommend optimal migration paths: Embedded Analytics, Datasphere/BDC, Data Lake, Retain, or Retire.", icon: "🎯" }
  ];
  
  const currentScene = scenes[scene];
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFEFF 100%)',
      borderRadius: '12px',
      padding: '32px',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>{currentScene.icon}</span>
          <div>
            <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600', textTransform: 'uppercase' }}>
              {currentScene.subtitle} of 4
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937' }}>{currentScene.title}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onPrev} disabled={scene === 0} style={{
            padding: '8px 16px',
            background: scene === 0 ? '#E5E7EB' : 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            cursor: scene === 0 ? 'not-allowed' : 'pointer',
            color: scene === 0 ? '#9CA3AF' : '#374151'
          }}>← Previous</button>
          <button onClick={onNext} disabled={scene === 3} style={{
            padding: '8px 16px',
            background: scene === 3 ? '#E5E7EB' : '#10B981',
            border: 'none',
            borderRadius: '8px',
            cursor: scene === 3 ? 'not-allowed' : 'pointer',
            color: 'white',
            fontWeight: '500'
          }}>Next →</button>
        </div>
      </div>
      <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{currentScene.description}</p>
    </div>
  );
};

// Main App Component
export default function DataNextApp() {
  const [activeView, setActiveView] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [demoScene, setDemoScene] = useState(0);
  const [criteriaWeights, setCriteriaWeights] = useState(decisionCriteria);
  
  const stats = getStats(reports);
  
  const handleWeightChange = (id, newWeight) => {
    setCriteriaWeights(prev => prev.map(c => c.id === id ? { ...c, weight: newWeight } : c));
  };
  
  const runClassification = () => {
    setIsClassifying(true);
    setTimeout(() => setIsClassifying(false), 3000);
  };
  
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: '#F9FAFB', minHeight: '100vh' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        * { box-sizing: border-box; }
      `}</style>
      
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main style={{ marginLeft: '260px', padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#1F2937' }}>
              {activeView === 'dashboard' && 'Analytics Rationalization Dashboard'}
              {activeView === 'catalog' && 'Report Catalog'}
              {activeView === 'criteria' && 'Decision Criteria Framework'}
              {activeView === 'graph' && 'Knowledge Graph Explorer'}
              {activeView === 'matrix' && 'Migration Recommendation Matrix'}
              {activeView === 'demo' && 'Demo Walkthrough'}
            </h1>
            <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '14px' }}>
              S/4HANA Transformation • Legacy Report Migration Analysis
            </p>
          </div>
          <button onClick={runClassification} style={{
            padding: '10px 20px',
            background: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚡</span> Run Classification
          </button>
        </div>
        
        {activeView === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
              <StatsCard icon="📊" label="Total Reports" value={stats.total} subValue="In catalog" color="#10B981" />
              <StatsCard icon="✓" label="Needed" value={stats.needed} subValue={`${Math.round(stats.needed/stats.total*100)}% to migrate`} color="#10B981" />
              <StatsCard icon="⟳" label="Redundant" value={stats.redundant} subValue="To consolidate" color="#6B7280" />
              <StatsCard icon="✗" label="Deprecated" value={stats.deprecated} subValue="To retire" color="#EF4444" />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>Reports by Source System</h3>
                {Object.entries(stats.bySource).map(([source, count]) => (
                  <div key={source} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px' }}>{source}</span>
                      <span style={{ fontWeight: '600', color: '#10B981' }}>{count}</span>
                    </div>
                    <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(count / stats.total) * 100}%`, height: '100%', background: source === 'SAP ABAP' ? '#F59E0B' : source === 'SAP BW' ? '#3B82F6' : '#8B5CF6', borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>Migration Path Summary</h3>
                {Object.entries(stats.byPath).map(([path, count]) => (
                  <div key={path} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '500', color: '#1F2937', fontSize: '14px' }}>{path}</span>
                      <span style={{ fontWeight: '600', color: '#10B981' }}>{count}</span>
                    </div>
                    <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(count / stats.total) * 100}%`, 
                        height: '100%', 
                        background: path === 'Retire' ? '#EF4444' : path === 'Data Lake' ? '#06B6D4' : '#10B981',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>Knowledge Graph Overview</h3>
              <KnowledgeGraph reports={reports} filter="All" onNodeClick={setSelectedReport} isClassifying={isClassifying} />
            </div>
          </>
        )}
        
        {activeView === 'catalog' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>Current State Report Inventory</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>
                Complete catalog of all legacy reports with attributes, data sources, and KPI mappings
              </p>
            </div>
            <ReportCatalog reports={reports} onRowClick={setSelectedReport} />
          </div>
        )}
        
        {activeView === 'criteria' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <DecisionCriteriaPanel criteria={criteriaWeights} onWeightChange={handleWeightChange} />
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>How It Works</h3>
              <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.7' }}>
                <p style={{ marginTop: 0 }}>Each report in the catalog is scored against all 8 decision criteria on a 1-5 scale.</p>
                <p>The weighted composite score determines the migration recommendation:</p>
                <ul style={{ paddingLeft: '20px', margin: '12px 0' }}>
                  <li><strong>Score {"<"} 2.0:</strong> Retire (Deprecated)</li>
                  <li><strong>Score 2.0-3.0:</strong> Evaluate for consolidation</li>
                  <li><strong>Score {">"} 3.0:</strong> Migrate (path based on criteria)</li>
                </ul>
                <p>High real-time + low complexity → <strong>Embedded Analytics</strong></p>
                <p>High AI/ML needs → <strong>Data Lake</strong></p>
                <p>High reuse potential → <strong>Datasphere/BDC</strong></p>
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'graph' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>Interactive Knowledge Graph</h3>
                <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '14px' }}>Click on nodes to view report details and criteria scores</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'Needed', 'Redundant', 'Deprecated'].map(status => (
                  <button key={status} onClick={() => setStatusFilter(status)} style={{
                    padding: '6px 14px',
                    background: statusFilter === status ? '#10B981' : 'white',
                    color: statusFilter === status ? 'white' : '#6B7280',
                    border: statusFilter === status ? 'none' : '1px solid #E5E7EB',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>{status}</button>
                ))}
              </div>
            </div>
            <KnowledgeGraph 
              reports={statusFilter === 'All' ? reports : reports.filter(r => r.status === statusFilter)} 
              filter={statusFilter}
              onNodeClick={setSelectedReport}
              isClassifying={isClassifying}
            />
          </div>
        )}
        
        {activeView === 'matrix' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>Source to Target Migration Matrix</h3>
            <p style={{ margin: '0 0 24px', color: '#6B7280', fontSize: '14px' }}>
              Distribution of reports from legacy systems to recommended migration paths based on decision criteria analysis
            </p>
            <MigrationMatrix reports={reports} />
            <div style={{ marginTop: '24px', padding: '16px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
              <div style={{ fontWeight: '600', color: '#166534', marginBottom: '8px' }}>💡 Migration Summary</div>
              <div style={{ fontSize: '14px', color: '#15803D' }}>
                Based on the 8 decision criteria: {stats.byPath['Datasphere/BDC']} reports recommended for Datasphere greenfield, 
                {' '}{stats.byPath['Data Lake']} for Data Lake migration, {stats.byPath['Embedded Analytics']} for Embedded Analytics, 
                and {stats.byPath['Retire']} candidates for retirement.
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'demo' && (
          <>
            <DemoScene scene={demoScene} onNext={() => setDemoScene(s => Math.min(s + 1, 3))} onPrev={() => setDemoScene(s => Math.max(s - 1, 0))} />
            
            {demoScene === 0 && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>Report Catalog Preview</h3>
                <ReportCatalog reports={reports.slice(0, 20)} onRowClick={setSelectedReport} />
              </div>
            )}
            
            {demoScene === 1 && <DecisionCriteriaPanel criteria={criteriaWeights} onWeightChange={handleWeightChange} />}
            
            {demoScene === 2 && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>Knowledge Graph Visualization</h3>
                <KnowledgeGraph reports={reports} filter="All" onNodeClick={setSelectedReport} isClassifying={false} />
              </div>
            )}
            
            {demoScene === 3 && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
                  <StatsCard icon="📊" label="Analyzed" value={stats.total} color="#10B981" />
                  <StatsCard icon="🔨" label="Rebuild (BDC)" value={stats.byPath['Datasphere/BDC']} color="#8B5CF6" />
                  <StatsCard icon="☁️" label="Data Lake" value={stats.byPath['Data Lake']} color="#06B6D4" />
                  <StatsCard icon="🗑️" label="Retire" value={stats.byPath['Retire']} color="#EF4444" />
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>Derived Migration Matrix</h3>
                  <MigrationMatrix reports={reports} />
                </div>
              </>
            )}
          </>
        )}
      </main>
      
      {selectedReport && (
        <ReportDetailPanel report={selectedReport} onClose={() => setSelectedReport(null)} criteria={criteriaWeights} />
      )}
    </div>
  );
}
