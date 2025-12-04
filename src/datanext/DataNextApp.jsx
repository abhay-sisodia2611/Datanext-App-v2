import React, { useMemo, useState } from 'react';
import { palette, radii, shadow } from './theme';
import { decisionCriteria as criteriaSeed, reports as seedReports, getStats } from './data';

const cardStyle = {
  background: palette.surface,
  borderRadius: radii.lg,
  border: `1px solid ${palette.border}`,
  padding: '20px'
};

const Section = ({ title, subtitle, children, actions }) => (
  <div style={cardStyle}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: palette.text }}>{title}</h3>
        {subtitle && <p style={{ margin: '4px 0 0', color: palette.muted, fontSize: 13 }}>{subtitle}</p>}
      </div>
      {actions}
    </div>
    {children}
  </div>
);

const StatsCard = ({ label, value, subValue, color = palette.primary }) => (
  <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 12, boxShadow: shadow }}>
    <div style={{ width: 48, height: 48, borderRadius: radii.md, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontWeight: 700 }}>
      *
    </div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: palette.text }}>{value}</div>
      <div style={{ color: palette.muted, fontSize: 13 }}>{label}</div>
      {subValue && <div style={{ fontSize: 12, color }}>{subValue}</div>}
    </div>
  </div>
);

const KnowledgeGraph = ({ reports, filter, onNodeClick, isClassifying }) => {
  const width = 800;
  const height = 440;
  const centerX = width / 2;
  const centerY = height / 2;
  const filtered = filter === 'All' ? reports : reports.filter(r => r.status === filter);
  const sizeForUsers = users => 6 + Math.min(16, users / 4);

  const getPos = (index, total) => {
    const rings = 5;
    const perRing = Math.ceil(total / rings);
    const ring = Math.floor(index / perRing);
    const angle = (index % perRing) / perRing * Math.PI * 2 + ring * 0.3;
    const radius = 60 + ring * 65;
    return { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
  };

  const connections = [];
  filtered.slice(0, 60).forEach((report, i) => {
    const deps = Math.min(report.dataSources?.length || 1, 3);
    for (let d = 0; d < deps; d++) {
      const to = (i + d + 3) % Math.min(filtered.length, 60);
      connections.push({ from: i, to });
    }
  });

  const statusColor = (status) => {
    if (status === 'Retire') return palette.warning;
    return palette.primaryStrong;
  };

  return (
    <div style={{ position: 'relative', background: palette.bg, borderRadius: radii.lg, border: `1px solid ${palette.border}` }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="kg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.primary} stopOpacity="0.2" />
            <stop offset="100%" stopColor={palette.primary} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={centerX} cy={centerY} r="190" fill="url(#kg-glow)" />
        {connections.map((c, idx) => {
          const a = getPos(c.from, Math.min(filtered.length, 60));
          const b = getPos(c.to, Math.min(filtered.length, 60));
          return <line key={idx} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={palette.border} strokeWidth="1" opacity="0.6" />;
        })}
        <circle cx={centerX} cy={centerY} r="30" fill={palette.primary} />
        <text x={centerX} y={centerY + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="600">Knowledge</text>
        <text x={centerX} y={centerY + 18} textAnchor="middle" fill="white" fontSize="11" fontWeight="600">Graph</text>
        {filtered.slice(0, 100).map((report, i) => {
          const pos = getPos(i, Math.min(filtered.length, 100));
          const size = sizeForUsers(report.activeUsers);
          return (
            <g key={report.id} onClick={() => onNodeClick(report)} style={{ cursor: 'pointer' }}>
              <circle cx={pos.x} cy={pos.y} r={size} fill={statusColor(report.status)} opacity={isClassifying ? 0.35 : 0.85} />
            </g>
          );
        })}
      </svg>
      {isClassifying && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div style={{ ...cardStyle, boxShadow: shadow, textAlign: 'center' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', border: `3px solid ${palette.border}`, borderTopColor: palette.primary, margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontWeight: 700, color: palette.text }}>Applying decision criteria...</div>
            <div style={{ color: palette.muted, fontSize: 13 }}>Analyzing 8 weighted factors across all reports</div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportCatalog = ({ reports, onRowClick, showStatusMigration = false }) => {
  const [filterArea, setFilterArea] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [search, setSearch] = useState('');

  const functionalAreas = ['All', ...new Set(reports.map(r => r.functionalArea))];
  const sourceTypes = ['All', 'SAP ABAP', 'SAP BW', 'Databricks'];

  const filtered = reports
    .filter(r => filterArea === 'All' || r.functionalArea === filterArea)
    .filter(r => filterSource === 'All' || r.sourceType === filterSource)
    .filter(r => search === '' || r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()));

  const sourceColors = {
    'SAP ABAP': { bg: '#FEF3C7', text: '#B45309' },
    'SAP BW': { bg: '#DBEAFE', text: '#1D4ED8' },
    'Databricks': { bg: '#F3E8FF', text: '#7C3AED' }
  };
  const statusColors = {
    Needed: { bg: palette.primarySoft, text: palette.primaryStrong },
    Redundant: { bg: '#F3F4F6', text: palette.muted },
    Deprecated: { bg: '#FEF2F2', text: palette.warning },
    Retain: { bg: palette.primarySoft, text: palette.primaryStrong },
    Retire: { bg: '#FEF2F2', text: palette.warning }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reports or IDs"
          style={{ padding: '8px 12px', border: `1px solid ${palette.border}`, borderRadius: radii.md, width: 240, fontSize: 13 }}
        />
        <select value={filterArea} onChange={e => setFilterArea(e.target.value)} style={{ padding: '8px 10px', border: `1px solid ${palette.border}`, borderRadius: radii.md, fontSize: 13 }}>
          {functionalAreas.map(a => <option key={a} value={a}>{a === 'All' ? 'All Functional Areas' : a}</option>)}
        </select>
        <select value={filterSource} onChange={e => setFilterSource(e.target.value)} style={{ padding: '8px 10px', border: `1px solid ${palette.border}`, borderRadius: radii.md, fontSize: 13 }}>
          {sourceTypes.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sources' : s}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: palette.muted }}>Showing {filtered.length} of {reports.length}</span>
      </div>
      <div style={{ overflowX: 'auto', maxHeight: 520, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead style={{ position: 'sticky', top: 0, background: palette.surface }}>
            <tr style={{ background: palette.bg }}>
              {['Report ID', 'Name', 'Source', 'Functional Area', 'Category', 'Data Sources', 'KPIs', 'Refresh', 'Owner']
                .concat(showStatusMigration ? ['Status', 'Migration Path'] : [])
                .map(header => (
                <th key={header} style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 700, color: palette.text, borderBottom: `2px solid ${palette.border}`, whiteSpace: 'nowrap' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 60).map(report => (
              <tr key={report.id} onClick={() => onRowClick(report)} style={{ cursor: 'pointer' }}>
                <td style={{ padding: '10px 8px', borderBottom: `1px solid ${palette.border}`, fontFamily: 'monospace', color: palette.muted }}>{report.id}</td>
                <td style={{ padding: '10px 8px', borderBottom: `1px solid ${palette.border}`, fontWeight: 600, color: palette.text }}>{report.name}</td>
                <td style={{ padding: '10px 8px', borderBottom: `1px solid ${palette.border}` }}>
                  <span style={{ padding: '4px 8px', borderRadius: radii.sm, background: sourceColors[report.sourceType].bg, color: sourceColors[report.sourceType].text, fontWeight: 600 }}>
                    {report.sourceType}
                  </span>
                </td>
                <td style={{ padding: '10px 8px', borderBottom: `1px solid ${palette.border}`, color: palette.text }}>{report.functionalArea}</td>
                <td style={{ padding: '10px 8px', borderBottom: `1px solid ${palette.border}`, color: palette.muted }}>{report.category}</td>
                <td style={{ padding: '10px 8px', borderBottom: `1px solid ${palette.border}`, color: palette.muted }}>{report.dataSources.join(', ')}</td>
                <td style={{ padding: '10px 8px', borderBottom: `1px solid ${palette.border}`, color: palette.muted }}>{report.kpiExamples.join(', ')}</td>
                <td style={{ padding: '10px 8px', borderBottom: `1px solid ${palette.border}`, color: palette.muted }}>{report.refreshFrequency}</td>
                <td style={{ padding: '10px 8px', borderBottom: `1px solid ${palette.border}`, color: palette.text }}>{report.businessOwner}</td>
                {showStatusMigration && (
                  <>
                    <td style={{ padding: '10px 8px', borderBottom: `1px solid ${palette.border}` }}>
                      {(() => {
                        const statusLabel = report.migrationPath === 'Retain' ? 'Retain' : report.migrationPath === 'Retire' ? 'Retire' : report.status;
                        const colors = statusColors[statusLabel] || { bg: palette.bg, text: palette.text };
                        return (
                          <span style={{ padding: '4px 8px', borderRadius: radii.sm, background: colors.bg, color: colors.text, fontWeight: 700 }}>
                            {statusLabel}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: `1px solid ${palette.border}`, color: palette.text, fontWeight: 600 }}>
                      {report.migrationPath === 'Retire' ? '' : report.migrationPath}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DecisionCriteriaPanel = ({ criteria, onWeightChange }) => (
  <Section title="Decision Criteria Framework" subtitle="Adjust weights to tune classification and migration recommendations">
    <div style={{ marginBottom: 10, padding: 10, borderRadius: radii.md, background: '#F9FAFB', border: `1px solid ${palette.border}` }}>
      <div style={{ fontWeight: 700, color: palette.text }}>Weights total: {criteria.reduce((s, c) => s + c.weight, 0)}</div>
      <div style={{ color: palette.muted, fontSize: 12 }}>Keep total at 100 for balanced scoring. Adjust sliders to redistribute.</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {criteria.map(c => (
        <div key={c.id} style={{ ...cardStyle, border: `1px solid ${palette.border}`, boxShadow: shadow }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 700, color: palette.text }}>{c.name}</div>
              <div style={{ color: palette.muted, fontSize: 12 }}>{c.shortName}</div>
            </div>
            <div style={{ padding: '6px 10px', background: palette.primarySoft, borderRadius: radii.sm, color: palette.primaryStrong, fontWeight: 700 }}>{c.weight}%</div>
          </div>
          <p style={{ margin: '0 0 8px', color: palette.muted, fontSize: 13 }}>{c.description}</p>
          <input type="range" min={5} max={30} value={c.weight} onChange={(e) => onWeightChange(c.id, Number(e.target.value))} style={{ width: '100%' }} />
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {c.options.map(opt => (
              <span key={opt} style={{ padding: '4px 6px', borderRadius: radii.sm, background: palette.bg, color: palette.muted, fontSize: 11 }}>{opt}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </Section>
);

const pathColors = {
  'S/4HANA Embedded Analytics': palette.primary,
  'SAP Datasphere / BDC': palette.accentPurple,
  'Databricks': palette.accentBlue,
  'SAP BW HANA Cloud': palette.accentGreen || '#10B981',
  'Retain': palette.primaryStrong,
  'Retire': palette.warning
};

const MigrationMatrix = ({ reports }) => {
  const sources = ['SAP ABAP', 'SAP BW', 'Databricks'];
  const targets = ['S/4HANA Embedded Analytics', 'SAP Datasphere / BDC', 'Databricks', 'SAP BW HANA Cloud', 'Retain', 'Retire'];
  const counts = {};
  sources.forEach(s => { counts[s] = {}; targets.forEach(t => { counts[s][t] = 0; }); });
  reports.forEach(r => { counts[r.sourceType][r.migrationPath] += 1; });
  const rowTotals = sources.map(s => targets.reduce((sum, t) => sum + counts[s][t], 0));
  const colTotals = targets.map(t => sources.reduce((sum, s) => sum + counts[s][t], 0));
  const grandTotal = reports.length;
  const cellColor = (t) => `${pathColors[t]}25`;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, border: `1px solid ${palette.border}`, borderRadius: radii.md, overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={{ padding: 12, textAlign: 'left', borderBottom: `2px solid ${palette.border}`, background: palette.bg }}>Source ΓåÆ Path</th>
            {targets.map(t => (
              <th key={t} style={{ padding: 12, textAlign: 'center', borderBottom: `2px solid ${palette.border}`, background: palette.bg, color: palette.text }}>{t}</th>
            ))}
            <th style={{ padding: 12, textAlign: 'center', borderBottom: `2px solid ${palette.border}`, background: palette.bg, color: palette.text }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((s, rowIdx) => (
            <tr key={s}>
              <td style={{ padding: 12, borderBottom: `1px solid ${palette.border}`, fontWeight: 700, color: palette.text, background: palette.surface }}>{s}</td>
              {targets.map(t => (
                <td key={t} style={{ padding: 12, borderBottom: `1px solid ${palette.border}`, textAlign: 'center', color: pathColors[t], background: cellColor(t), fontWeight: 700 }}>
                  {counts[s][t]}
                </td>
              ))}
              <td style={{ padding: 12, borderBottom: `1px solid ${palette.border}`, textAlign: 'center', fontWeight: 800, color: palette.text, background: palette.bg }}>{rowTotals[rowIdx]}</td>
            </tr>
          ))}
          <tr>
            <td style={{ padding: 12, borderTop: `2px solid ${palette.border}`, fontWeight: 800, color: palette.text, background: palette.bg }}>Total</td>
            {targets.map((t, idx) => (
              <td key={t} style={{ padding: 12, borderTop: `2px solid ${palette.border}`, textAlign: 'center', fontWeight: 800, color: pathColors[t], background: cellColor(t) }}>
                {colTotals[idx]}
              </td>
            ))}
            <td style={{ padding: 12, borderTop: `2px solid ${palette.border}`, textAlign: 'center', fontWeight: 900, color: palette.primaryStrong, background: palette.surface }}>{grandTotal}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
        <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
          <div style={{ fontWeight: 700, color: palette.text }}>Executive View</div>
          <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: palette.muted, fontSize: 13, lineHeight: 1.6 }}>
            {targets.map(t => (
              <li key={t}>{t}: {sources.reduce((s, src) => s + counts[src][t], 0)}</li>
            ))}
          </ul>
        </div>
        <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
          <div style={{ fontWeight: 700, color: palette.text }}>Risk Hotspots</div>
          <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: palette.muted, fontSize: 13, lineHeight: 1.6 }}>
            <li>High Retire counts need business validation</li>
            <li>High-complexity Databricks or BW HANA Cloud moves need data readiness checks</li>
            <li>Ownership gaps delay migrationsΓÇöfill before execution</li>
          </ul>
        </div>
        <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
          <div style={{ fontWeight: 700, color: palette.text }}>Action Queue</div>
          <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: palette.muted, fontSize: 13, lineHeight: 1.6 }}>
            <li>Prioritize high-usage SAP Datasphere / BDC rebuilds</li>
            <li>Schedule Databricks moves with AI/ML dependencies</li>
            <li>Lock retirements after governance sign-off</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ReportDetailPanel = ({ report, onClose, criteria }) => (
  <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: palette.surface, boxShadow: '-6px 0 30px rgba(0,0,0,0.1)', padding: 20, overflowY: 'auto', borderLeft: `1px solid ${palette.border}` }}>
    <button onClick={onClose} style={{ border: `1px solid ${palette.border}`, background: 'transparent', padding: '6px 10px', borderRadius: radii.sm, cursor: 'pointer', color: palette.muted }}>Close</button>
    <h3 style={{ margin: '12px 0 4px', color: palette.text }}>{report.name}</h3>
    <p style={{ margin: 0, color: palette.muted, fontSize: 13 }}>{report.id} - {report.sourceType} - {report.functionalArea}</p>
    <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {[{ label: 'Status', value: report.status }, { label: 'Migration Path', value: report.migrationPath }, { label: 'Owner', value: report.businessOwner }, { label: 'Refresh', value: report.refreshFrequency }, { label: 'Last Used (days)', value: report.lastUsed }, { label: 'Active Users', value: report.activeUsers }].map(item => (
        <div key={item.label} style={{ padding: '10px 12px', borderRadius: radii.md, background: palette.bg, border: `1px solid ${palette.border}` }}>
          <div style={{ fontSize: 12, color: palette.muted }}>{item.label}</div>
          <div style={{ fontWeight: 700, color: palette.text }}>{item.value}</div>
        </div>
      ))}
    </div>
    <Section title="Criteria Scores" subtitle="Weighted inputs driving classification and path">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
        {criteria.map(c => (
          <div key={c.id} style={{ padding: '10px 12px', borderRadius: radii.md, background: palette.bg, border: `1px solid ${palette.border}` }}>
            <div style={{ fontSize: 12, color: palette.muted }}>{c.shortName}</div>
            <div style={{ fontWeight: 700, color: palette.text }}>{report.criteriaScores[c.id]}</div>
            <div style={{ fontSize: 11, color: palette.muted }}>Weight {c.weight}%</div>
          </div>
        ))}
      </div>
    </Section>
    <Section title="Data Sources and KPIs">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ color: palette.muted, fontSize: 13 }}>Data Sources: {report.dataSources.join(', ')}</div>
        <div style={{ color: palette.muted, fontSize: 13 }}>KPIs: {report.kpiExamples.join(', ')}</div>
        <div style={{ color: palette.muted, fontSize: 13 }}>Rationale: {report.rationale}</div>
      </div>
    </Section>
  </div>
);

const ImplementationPlan = () => (
  <Section title="Implementation Plan" subtitle="Execution guide aligned to BRD/TRD scope">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
      <div style={{ ...cardStyle, boxShadow: shadow }}>
        <h4 style={{ margin: '0 0 6px', color: palette.text }}>Connectors & Ingestion</h4>
        <ul style={{ margin: 0, paddingLeft: 16, color: palette.muted, fontSize: 13 }}>
          <li>SAP BW/ECC metadata (RS* tables, InfoProviders, ACDOCA/CDS, ABAP catalog)</li>
          <li>BI metadata (Power BI/Tableau APIs) + BO audit/usage logs</li>
          <li>Synapse/Purview/Databricks lineage, KPI catalog, ServiceNow/Jira ownership</li>
        </ul>
        <div style={{ marginTop: 10, padding: 10, borderRadius: radii.md, background: palette.primarySoft, color: palette.primaryStrong, fontWeight: 700 }}>Exit: Access validated, sample ingest completed</div>
      </div>
      <div style={{ ...cardStyle, boxShadow: shadow }}>
        <h4 style={{ margin: '0 0 6px', color: palette.text }}>APIs & Data Model</h4>
        <ul style={{ margin: 0, paddingLeft: 16, color: palette.muted, fontSize: 13 }}>
          <li>/reports (filters, pagination) ┬╖ /reports/:id (metadata + lineage refs)</li>
          <li>/graph (nodes/edges with limits) ┬╖ /matrix (source ΓåÆ path counts)</li>
          <li>/classify (run), /weights (versioned), /export (catalog/matrix/graph)</li>
        </ul>
        <div style={{ marginTop: 10, padding: 10, borderRadius: radii.md, background: palette.bg, color: palette.text, fontSize: 12 }}>Schema anchors: Report, CriteriaScores, Classification, Migration, Relationship</div>
      </div>
      <div style={{ ...cardStyle, boxShadow: shadow }}>
        <h4 style={{ margin: '0 0 6px', color: palette.text }}>Classification & Paths</h4>
        <ul style={{ margin: 0, paddingLeft: 16, color: palette.muted, fontSize: 13 }}>
          <li>8 weighted criteria (1-5) with adjustable weights; warning if total Γëá 100</li>
          <li>Status: Needed / Redundant / Deprecated with confidence + rationale</li>
          <li>Paths: S/4HANA Embedded Analytics, SAP Datasphere / BDC, Databricks, SAP BW HANA Cloud, Retain, Retire; migration matrix</li>
        </ul>
        <div style={{ marginTop: 10, padding: 10, borderRadius: radii.md, background: palette.bg, color: palette.text, fontSize: 12 }}>Exit: Classification run completed; business validation round recorded</div>
      </div>
      <div style={{ ...cardStyle, boxShadow: shadow }}>
        <h4 style={{ margin: '0 0 6px', color: palette.text }}>Security, NFRs, Ops</h4>
        <ul style={{ margin: 0, paddingLeft: 16, color: palette.muted, fontSize: 13 }}>
          <li>SSO + RBAC (Viewer/Analyst/Admin), HTTPS only</li>
          <li>Least-privilege read-only connectors, rate limits, input validation</li>
          <li>UI summary loads &lt; 3s @ ~250 reports; paginated tables; audit logs</li>
        </ul>
        <div style={{ marginTop: 10, padding: 10, borderRadius: radii.md, background: palette.primarySoft, color: palette.primaryStrong, fontWeight: 700 }}>Exit: Health checks + metrics wired; audit log enabled</div>
      </div>
    </div>
    <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
      <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
        <h4 style={{ margin: '0 0 6px', color: palette.text }}>Milestones</h4>
        <ol style={{ margin: 0, paddingLeft: 18, color: palette.muted, fontSize: 13 }}>
          <li>W1: Access + ingestion baseline + schema</li>
          <li>W2: Graph + catalog + dashboard KPIs</li>
          <li>W3: Classification + matrix + rationale surfacing</li>
          <li>W4: Exports + RBAC + audit + executive readout</li>
        </ol>
      </div>
      <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
        <h4 style={{ margin: '0 0 6px', color: palette.text }}>Risks & Guards</h4>
        <ul style={{ margin: 0, paddingLeft: 16, color: palette.muted, fontSize: 13 }}>
          <li>Access delays ΓåÆ pre-approved creds, sandbox extracts</li>
          <li>Incomplete logs ΓåÆ fallback exports, data quality checks</li>
          <li>Low confidence ΓåÆ business validation loop, overrides logged</li>
        </ul>
      </div>
      <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
        <h4 style={{ margin: '0 0 6px', color: palette.text }}>Governance & Handover</h4>
        <ul style={{ margin: 0, paddingLeft: 16, color: palette.muted, fontSize: 13 }}>
          <li>Playbook export (catalog + matrix + graph snapshot)</li>
          <li>Jira/ServiceNow linkbacks for ownership and approvals</li>
          <li>Executive-ready summary with KPIs and migration intents</li>
        </ul>
      </div>
    </div>
  </Section>
);

const DemoWalkthrough = () => (
  <Section title="Demo Walkthrough" subtitle="Step-by-step storyline to demo the full experience">
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'stretch' }}>
      <div style={{ ...cardStyle, border: `1px solid ${palette.border}`, boxShadow: shadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h4 style={{ margin: 0, color: palette.text }}>Live Demo Flow (8-10 mins)</h4>
          <span style={{ padding: '4px 8px', borderRadius: radii.sm, background: palette.primarySoft, color: palette.primaryStrong, fontWeight: 700 }}>Script</span>
        </div>
        <ol style={{ margin: 0, paddingLeft: 18, color: palette.muted, fontSize: 13, lineHeight: 1.6 }}>
          <li>Login as admin to show basic RBAC.</li>
          <li>Dashboard: explain KPIs, source mix, path mix, readiness bar.</li>
          <li>Criteria: adjust weights and re-run classification to show warnings when total &ne; 100.</li>
          <li>Catalog: search/filter reports, open a report to show criteria scores and rationale.</li>
          <li>Graph: switch statuses, click nodes to show lineage context and signals.</li>
          <li>Matrix: highlight source-to-target counts, executive/risk/action callouts.</li>
          <li>Plan: show phased delivery, exits, and governance hooks.</li>
        </ol>
      </div>
      <div style={{ ...cardStyle, border: `1px solid ${palette.border}`, boxShadow: shadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, color: palette.text }}>Short Video / Slides</h4>
          <span style={{ padding: '4px 8px', borderRadius: radii.sm, background: palette.bg, color: palette.muted, fontWeight: 700 }}>2-3 mins</span>
        </div>
        <div style={{ marginTop: 10, borderRadius: radii.md, overflow: 'hidden', border: `1px dashed ${palette.border}`, background: palette.bg, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.muted, textAlign: 'center', padding: 12 }}>
          Embed your MP4 or YouTube link here. Recommended: 90s overview of problem, criteria, demo highlights, and outcomes.
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
          <a href="https://www.youtube.com/embed/placeholder" target="_blank" rel="noreferrer" style={{ color: palette.primary, fontWeight: 700 }}>Open video in new tab</a>
          <a href="https://example.com/datanext-demo-walkthrough.pdf" target="_blank" rel="noreferrer" style={{ color: palette.primary, fontWeight: 700 }}>Download slides (PDF)</a>
          <span style={{ color: palette.muted }}>Tip: keep slides to 6-8 pages with the same sequence as the live demo.</span>
        </div>
      </div>
    </div>
    <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
      <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
        <div style={{ fontWeight: 700, color: palette.text }}>Speaker Notes</div>
        <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: palette.muted, fontSize: 13, lineHeight: 1.6 }}>
          <li>Frame business context: S/4HANA migration, rationalization goals.</li>
          <li>Call out decision criteria and how they map to paths.</li>
          <li>Show one example report end-to-end (catalog &rarr; graph &rarr; matrix).</li>
          <li>Close with plan, risks, and next approvals.</li>
        </ul>
      </div>
      <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
        <div style={{ fontWeight: 700, color: palette.text }}>Environment Checklist</div>
        <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: palette.muted, fontSize: 13, lineHeight: 1.6 }}>
          <li>Demo user: admin/admin (or update to client SSO).</li>
          <li>Dataset: at least 200 sample reports with mixed sources.</li>
          <li>Ensure classification spinner visible (Run Classification).</li>
          <li>Matrix and graph render within 2 seconds locally.</li>
        </ul>
      </div>
      <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
        <div style={{ fontWeight: 700, color: palette.text }}>What to Highlight</div>
        <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: palette.muted, fontSize: 13, lineHeight: 1.6 }}>
          <li>Traceability: criteria weights, scores, migration path.</li>
          <li>Actionability: risk hotspots, action queue, path counts.</li>
          <li>Governance: owners, refresh, rationale, validation points.</li>
          <li>Extensibility: connectors, APIs, export options.</li>
        </ul>
      </div>
    </div>
  </Section>
);

const KnowledgeBaseFlow = () => (
  <Section title="Knowledge Base Flow" subtitle="How inputs assemble into a reusable repository and live stats feed">
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: 12, alignItems: 'stretch' }}>
      <div style={{ ...cardStyle, border: `1px solid ${palette.border}`, boxShadow: shadow, background: `linear-gradient(135deg, ${palette.bg} 0%, ${palette.surface} 100%)`, overflow: 'hidden' }}>
        <div style={{ fontWeight: 700, color: palette.text, marginBottom: 6 }}>Ingestion to Insights</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', overflowX: 'auto', padding: '6px 4px 6px 0', scrollbarWidth: 'thin' }}>
          {[
            { label: 'Design Docs', desc: 'BRD/TRD, process maps, KPIs' },
            { label: 'Specifications', desc: 'Report specs, joins, filters' },
            { label: 'Headers/Schemas', desc: 'Table/field metadata, lineage' },
            { label: 'Reports', desc: 'BW/BEx, ABAP, Databricks, BO/BI' },
            { label: 'Training Docs', desc: 'Enablement decks, SOPs' },
            { label: 'Knowledge Base', desc: 'Unified catalog + embeddings' },
            { label: 'Dynamic Stats', desc: 'Source mix, usage, overlaps' }
          ].map((step, idx, arr) => (
            <div key={step.label} style={{ flex: '0 0 180px', padding: 12, borderRadius: radii.md, background: palette.surface, border: `1px solid ${palette.border}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontWeight: 700, color: palette.text }}>{step.label}</div>
              <div style={{ color: palette.muted, fontSize: 12 }}>{step.desc}</div>
              {idx < arr.length - 1 && (
                <div style={{ marginTop: 'auto', fontSize: 12, color: palette.muted, textAlign: 'right' }}>&rarr;</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...cardStyle, border: `1px solid ${palette.border}`, boxShadow: shadow, background: palette.surface, display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
        <div style={{ fontWeight: 700, color: palette.text, marginBottom: 2 }}>Capabilities</div>
        <ul style={{ margin: 0, paddingLeft: 16, color: palette.muted, fontSize: 13, lineHeight: 1.6 }}>
          <li>Search reports by source (e.g., SAP ECC), KPI, or field headers.</li>
          <li>Show trend charts: usage over time, last used, active users.</li>
          <li>Surface overlaps/duplicates across BW, ABAP, Databricks.</li>
          <li>Link design docs to catalog entries and lineage graph nodes.</li>
          <li>Feed dynamic statistics directly into dashboard and graph.</li>
        </ul>
      </div>
    </div>
  </Section>
);

const Sidebar = ({ active, setActive }) => {
  const nav = [
    { id: 'dashboard', label: 'Summary' },
    { id: 'catalog', label: 'Report Catalog' },
    { id: 'graph', label: 'Knowledge Graph' },
    { id: 'criteria', label: 'Decision Framework' },
    { id: 'status', label: 'Status & Migration' },
    { id: 'matrix', label: 'Migration Matrix' },
    { id: 'walkthrough', label: 'Demo Walkthrough' },
    { id: 'plan', label: 'Implementation Plan' }
  ];
  return (
    <aside style={{ width: 240, position: 'fixed', top: 0, bottom: 0, left: 0, background: palette.surface, borderRight: `1px solid ${palette.border}`, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: radii.md, background: palette.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>DN</div>
        <div>
          <div style={{ fontWeight: 800, color: palette.text }}>DataNext</div>
          <div style={{ color: palette.muted, fontSize: 12 }}>S/4HANA Migration</div>
        </div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {nav.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ textAlign: 'left', padding: '10px 12px', borderRadius: radii.md, border: 'none', cursor: 'pointer', background: active === item.id ? palette.primarySoft : 'transparent', color: active === item.id ? palette.primaryStrong : palette.text, fontWeight: active === item.id ? 700 : 500 }}>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default function DataNextApp() {
  const [criteria, setCriteria] = useState(criteriaSeed);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isClassifying, setIsClassifying] = useState(false);
  const [auth, setAuth] = useState({ user: '', pass: '', error: '' });
  const [authorized, setAuthorized] = useState(false);

  const stats = useMemo(() => getStats(seedReports), []);
  const totalWeight = useMemo(() => criteria.reduce((s, c) => s + c.weight, 0), [criteria]);

  const handleWeightChange = (id, weight) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, weight } : c));
  };

  const runClassification = () => {
    setIsClassifying(true);
    setTimeout(() => setIsClassifying(false), 2000);
  };

  const tryLogin = (e) => {
    e.preventDefault();
    if (auth.user === 'admin' && auth.pass === 'admin') {
      setAuthorized(true);
      setAuth({ user: '', pass: '', error: '' });
    } else {
      setAuth(prev => ({ ...prev, error: 'Invalid credentials' }));
    }
  };

  if (!authorized) {
    return (
      <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: palette.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ ...cardStyle, width: 360, boxShadow: shadow }}>
          <h2 style={{ margin: 0, color: palette.text }}>DataNext Login</h2>
          <p style={{ margin: '6px 0 16px', color: palette.muted, fontSize: 13 }}>Authorized access only</p>
          <form onSubmit={tryLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              value={auth.user}
              onChange={e => setAuth(prev => ({ ...prev, user: e.target.value }))}
              placeholder="Username"
              style={{ padding: '10px 12px', borderRadius: radii.md, border: `1px solid ${palette.border}`, fontSize: 14 }}
            />
            <input
              type="password"
              value={auth.pass}
              onChange={e => setAuth(prev => ({ ...prev, pass: e.target.value }))}
              placeholder="Password"
              style={{ padding: '10px 12px', borderRadius: radii.md, border: `1px solid ${palette.border}`, fontSize: 14 }}
            />
            {auth.error && <div style={{ color: palette.warning, fontSize: 12, fontWeight: 700 }}>{auth.error}</div>}
            <button type="submit" style={{ padding: '10px 12px', background: palette.primary, color: '#fff', border: 'none', borderRadius: radii.md, cursor: 'pointer', fontWeight: 700 }}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: palette.bg, minHeight: '100vh', color: palette.text }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } * { box-sizing: border-box; } h1,h2,h3,h4,h5,h6 { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; } p,div,span,button,input,select { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }`}</style>
      <Sidebar active={activeView} setActive={setActiveView} />
      <main style={{ marginLeft: 260, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>
              {activeView === 'dashboard' && 'Analytics Rationalization Dashboard'}
              {activeView === 'catalog' && 'Report Catalog'}
              {activeView === 'criteria' && 'Decision Criteria Framework'}
              {activeView === 'status' && 'Status & Migration'}
              {activeView === 'graph' && 'Knowledge Graph Explorer'}
              {activeView === 'matrix' && 'Migration Recommendation Matrix'}
              {activeView === 'walkthrough' && 'Demo Walkthrough'}
              {activeView === 'plan' && 'Implementation Plan'}
            </h1>
            <p style={{ margin: '4px 0 0', color: palette.muted, fontSize: 13 }}>Aligned to BRD/TRD - S/4HANA legacy report migration</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {totalWeight !== 100 && (
              <div style={{ padding: '8px 12px', borderRadius: radii.md, background: '#FEF3C7', color: '#92400E', border: '1px solid #FBBF24', fontWeight: 700 }}>
                Criteria weights must sum to 100 (current {totalWeight})
              </div>
            )}
            <button onClick={runClassification} style={{ padding: '10px 16px', background: palette.primary, color: '#fff', border: 'none', borderRadius: radii.md, cursor: 'pointer', fontWeight: 700 }}>
              Run Classification
            </button>
          </div>
        </div>

        {activeView === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <StatsCard label="Total Reports" value={stats.total} subValue="In catalog" />
              <StatsCard label="Retain" value={stats.retain} subValue={`${Math.round(stats.retain / stats.total * 100)}% retained`} />
              <StatsCard label="Retire" value={stats.retire} color={palette.warning} subValue={`${Math.round(stats.retire / stats.total * 100)}% retiring`} />
              <StatsCard label="Pending Review" value={stats.pending} color={palette.neutral} subValue="Balance to classify" />
            </div>
            <Section title="Readiness Snapshot" subtitle="Visual summary of migration readiness and source mix">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
                  <div style={{ fontWeight: 700, color: palette.text, marginBottom: 8 }}>Migration Readiness</div>
                  <div style={{ height: 12, background: palette.bg, borderRadius: radii.sm, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round(stats.retain / stats.total * 100)}%`, height: '100%', background: palette.primary }} />
                  </div>
                  <div style={{ marginTop: 6, color: palette.muted, fontSize: 13 }}>{Math.round(stats.retain / stats.total * 100)}% retain, {Math.round(stats.retire / stats.total * 100)}% retire</div>
                </div>
                <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
                  <div style={{ fontWeight: 700, color: palette.text, marginBottom: 8 }}>Source Composition</div>
                  {Object.entries(stats.bySource).map(([src, count]) => (
                    <div key={src} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: palette.muted }}>
                        <span>{src}</span>
                        <span style={{ color: palette.primaryStrong, fontWeight: 700 }}>{count}</span>
                      </div>
                      <div style={{ height: 8, background: palette.bg, borderRadius: radii.sm }}>
                        <div style={{ width: `${(count / stats.total) * 100}%`, height: '100%', background: src === 'SAP ABAP' ? '#F59E0B' : src === 'SAP BW' ? '#3B82F6' : palette.accentPurple, borderRadius: radii.sm }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
                  <div style={{ fontWeight: 700, color: palette.text, marginBottom: 8 }}>Path Mix</div>
                  {Object.entries(stats.byPath).map(([path, count]) => (
                    <div key={path} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: palette.muted }}>
                        <span>{path}</span>
                        <span style={{ color: pathColors[path], fontWeight: 700 }}>{count}</span>
                      </div>
                      <div style={{ height: 8, background: palette.bg, borderRadius: radii.sm }}>
                        <div style={{ width: `${(count / stats.total) * 100}%`, height: '100%', background: pathColors[path], borderRadius: radii.sm }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              <Section title="Reports by Source" subtitle="Volume split across legacy systems">
                {Object.entries(stats.bySource).map(([source, count]) => (
                  <div key={source} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>{source}</span>
                      <span style={{ fontWeight: 700, color: palette.primary }}>{count}</span>
                    </div>
                    <div style={{ height: 8, background: palette.bg, borderRadius: radii.sm }}>
                      <div style={{ width: `${(count / stats.total) * 100}%`, height: '100%', background: source === 'SAP ABAP' ? '#F59E0B' : source === 'SAP BW' ? '#3B82F6' : palette.accentPurple, borderRadius: radii.sm }} />
                    </div>
                  </div>
                ))}
              </Section>
              <Section title="Migration Path Summary" subtitle="Recommended landing by decision criteria">
                {Object.entries(stats.byPath).map(([path, count]) => (
                  <div key={path} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>{path}</span>
                      <span style={{ fontWeight: 700, color: palette.primary }}>{count}</span>
                    </div>
                    <div style={{ height: 8, background: palette.bg, borderRadius: radii.sm }}>
                      <div style={{ width: `${(count / stats.total) * 100}%`, height: '100%', background: pathColors[path] || palette.primary, borderRadius: radii.sm }} />
                    </div>
                  </div>
                ))}
              </Section>
            </div>
            <Section title="Knowledge Graph Overview" subtitle="Lineage and dependency view across BW, ABAP, and Databricks">
              <KnowledgeGraph reports={seedReports} filter="All" onNodeClick={setSelectedReport} isClassifying={isClassifying} />
            </Section>
            <KnowledgeBaseFlow />
          </>
        )}

        {activeView === 'catalog' && (
          <Section title="Current State Report Inventory" subtitle="Complete catalog of legacy reports">
            <ReportCatalog reports={seedReports} onRowClick={setSelectedReport} />
          </Section>
        )}

        {activeView === 'criteria' && (
          <DecisionCriteriaPanel criteria={criteria} onWeightChange={handleWeightChange} />
        )}

        {activeView === 'status' && (
          <Section title="Status & Migration" subtitle="Full catalog view with status and migration path">
            <ReportCatalog reports={seedReports} onRowClick={setSelectedReport} showStatusMigration />
          </Section>
        )}

        {activeView === 'graph' && (
          <>
          <Section
            title="Interactive Knowledge Graph"
            subtitle="Filter by status to validate classification impact and knowledge base coverage"
            actions={(
              <div style={{ display: 'flex', gap: 8 }}>
                {['All', 'Retain', 'Retire'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '6px 12px', borderRadius: radii.md, border: `1px solid ${statusFilter === s ? palette.primary : palette.border}`, background: statusFilter === s ? palette.primarySoft : palette.surface, color: statusFilter === s ? palette.primaryStrong : palette.text, cursor: 'pointer' }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <KnowledgeGraph
                reports={statusFilter === 'All' ? seedReports : seedReports.filter(r => r.status === statusFilter)}
                filter={statusFilter}
                onNodeClick={setSelectedReport}
                isClassifying={isClassifying}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
                  <div style={{ fontWeight: 700, color: palette.text }}>Knowledge Base Coverage</div>
                  <div style={{ color: palette.muted, fontSize: 13 }}>BW/ECC lineage, Databricks assets, BI usage, ownership</div>
                  <div style={{ marginTop: 10 }}>
                    {['SAP BW/ECC', 'Databricks', 'BI Tools', 'Governance'].map((item, idx) => (
                      <div key={item} style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: palette.muted }}>
                          <span>{item}</span>
                          <span style={{ color: palette.primaryStrong }}>{80 + idx * 4}%</span>
                        </div>
                        <div style={{ height: 6, background: palette.bg, borderRadius: radii.sm }}>
                          <div style={{ width: `${80 + idx * 4}%`, height: '100%', background: palette.primary, borderRadius: radii.sm }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
                  <div style={{ fontWeight: 700, color: palette.text }}>Legend</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6, color: palette.muted, fontSize: 13 }}>
                    {[{ label: 'Retain', color: palette.primaryStrong }, { label: 'Retire', color: palette.warning }].map(item => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                        <span style={{ color: item.color === palette.primary ? palette.text : item.color }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
                  <div style={{ fontWeight: 700, color: palette.text }}>Top Signals</div>
                  <ul style={{ margin: 0, paddingLeft: 16, color: palette.muted, fontSize: 13 }}>
                    <li>Highlight high-usage, multi-source reports for BDC rebuild</li>
                    <li>Flag unused greater than 180 days for retirement validation</li>
                    <li>Show AI/ML readiness for Databricks candidates</li>
                  </ul>
                </div>
                <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
                  <div style={{ fontWeight: 700, color: palette.text }}>Graph-Powered Actions</div>
                  <ul style={{ margin: 0, paddingLeft: 16, color: palette.muted, fontSize: 13 }}>
                    <li>Summarize report purpose, KPIs, and owners from graph context</li>
                    <li>Trace lineage hop-by-hop (source ΓåÆ transform ΓåÆ report)</li>
                    <li>Impact analysis: who is affected if a source changes</li>
                    <li>Similarity search to find duplicates/overlaps</li>
                    <li>Surface candidate migration paths based on connected attributes</li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>
          <KnowledgeBaseFlow />
          </>
        )}

        {activeView === 'matrix' && (
          <>
          <Section title="Source to Target Migration Matrix" subtitle="Counts by legacy source and recommended path">
            <MigrationMatrix reports={seedReports} />
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
                <div style={{ fontWeight: 700, color: palette.text }}>Executive Summary</div>
                <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: palette.muted, fontSize: 13, lineHeight: 1.6 }}>
                  <li>{stats.byPath['S/4HANA Embedded Analytics']} to S/4HANA Embedded Analytics</li>
                  <li>{stats.byPath['SAP Datasphere / BDC']} to SAP Datasphere / BDC</li>
                  <li>{stats.byPath['Databricks']} to Databricks</li>
                  <li>{stats.byPath['SAP BW HANA Cloud']} to SAP BW HANA Cloud</li>
                  <li>{stats.byPath['Retain']} retained</li>
                  <li>{stats.byPath['Retire']} to Retire</li>
                </ul>
              </div>
              <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
                <div style={{ fontWeight: 700, color: palette.text }}>Decision Gates</div>
                <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: palette.muted, fontSize: 13, lineHeight: 1.6 }}>
                  <li>S/4HANA Embedded Analytics: low complexity + real-time</li>
                  <li>SAP Datasphere / BDC: high reuse + high value</li>
                  <li>Databricks: high AI/ML need or high complexity</li>
                  <li>SAP BW HANA Cloud: BW modernization or reuse-first lift</li>
                  <li>Retire: low value + low reuse + stale usage</li>
                </ul>
              </div>
              <div style={{ ...cardStyle, border: `1px solid ${palette.border}` }}>
                <div style={{ fontWeight: 700, color: palette.text }}>Action Playbook</div>
                <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: palette.muted, fontSize: 13, lineHeight: 1.6 }}>
                  <li>Sequence rebuilds by business criticality and owner availability</li>
                  <li>Pair retirements with governance approval</li>
                  <li>Track velocity: #converted per week, #validated</li>
                </ul>
              </div>
            </div>
          </Section>
          <KnowledgeBaseFlow />
          </>
        )}

        {activeView === 'walkthrough' && <DemoWalkthrough />}

        {activeView === 'plan' && <ImplementationPlan />}
      </main>

      {selectedReport && (
        <ReportDetailPanel report={selectedReport} onClose={() => setSelectedReport(null)} criteria={criteria} />
      )}
    </div>
  );
}
