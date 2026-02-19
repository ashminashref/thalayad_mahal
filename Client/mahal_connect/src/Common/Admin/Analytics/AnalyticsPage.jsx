import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { DollarSign, Users, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import './Analytics.css';

// Mock Data for Bar Chart
const revenueData = [
  { name: 'Jul', revenue: 45000, expenses: 28000 },
  { name: 'Aug', revenue: 52000, expenses: 31000 },
  { name: 'Sep', revenue: 48000, expenses: 29000 },
  { name: 'Oct', revenue: 61000, expenses: 35000 },
  { name: 'Nov', revenue: 55000, expenses: 32000 },
  { name: 'Dec', revenue: 68000, expenses: 38000 },
];

// Mock Data for Donut Chart
const statusData = [
  { name: 'Paid', value: 156, color: '#1b2e25' },
  { name: 'Pending', value: 42, color: '#c4a45a' },
  { name: 'Overdue', value: 18, color: '#d9534f' },
];

const AnalyticsPage = () => {
  return (
    <div className="animate-fade-in pb-5">
      {/* KPI Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="kpi-card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="rev-p small mb-1">Total Revenue</p>
                <h3 className="rev-h3 fw-bold mb-0">₹3,28,000</h3>
                <span className="stats-up small"><TrendingUp size={14} /> +12.5% vs last month</span>
              </div>
              <div className="kpi-icon"><DollarSign size={20} /></div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="kpi-card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="rev-p small mb-1">Active Members</p>
                <h3 className="rev-h3 fw-bold mb-0">216</h3>
                <span className="stats-up small"><TrendingUp size={14} /> +8 vs last month</span>
              </div>
              <div className="kpi-icon"><Users size={20} /></div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="kpi-card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="rev-p small mb-1">Avg. Monthly</p>
                <h3 className="rev-h3 fw-bold mb-0">₹54,667</h3>
                <span className="stats-down small"><TrendingDown size={14} /> -2.3% vs last month</span>
              </div>
              <div className="kpi-icon"><Calendar size={20} /></div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-4">
        {/* Revenue Bar Chart */}
        <Col lg={8}>
          <Card className="chart-card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-4 chart-title">Revenue Overview</h5>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip cursor={{fill: '#fcfbf7'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="revenue" fill="#1e533a" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="expenses" fill="#c4a45a" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Payment Status Donut */}
        <Col lg={4}>
          <Card className="chart-card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-4 chart-title">Payment Status</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsPage;