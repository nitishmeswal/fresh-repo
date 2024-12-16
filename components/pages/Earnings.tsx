import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import 'react-circular-progressbar/dist/styles.css';
function Earnings() {
  const jobStats = {
    total: 64,
    done: 25,
    overdue: 15,
    workFinishedLate: 14,
    processing: 10
  };

  const websiteTraffic = {
    total: 12,
    socialMedia: 78,
    organicSearch: 22
  };

  const overdueWork = [
    { label: 'Overdue work', value: 6, percentage: 38, description: 'More than 7 jobs in progress' },
    { label: 'Work finished late', value: 19, percentage: 62, description: 'Jobs in progress' }
  ];

  const earningData = [
    { date: '03 Nov 2022', overdue: 20, processing: 40, late: 20, done: 20 },
    { date: '04 Nov 2022', overdue: 15, processing: 45, late: 25, done: 15 },
    { date: '05 Nov 2022', overdue: 10, processing: 50, late: 20, done: 20 },
    { date: '06 Nov 2022', overdue: 25, processing: 35, late: 20, done: 20 },
  ];

  return (
    <div className="earnings-container">
      {/* Stats Cards Row */}
      <div className="stats-row">
        {/* Job Status Report */}
        <div className="stat-card">
          <h3>Job status report</h3>
          <div className="circular-progress-container">
            <CircularProgressbar
              value={100}
              text={jobStats.total.toString()}
              styles={buildStyles({
                textColor: 'white',
                pathColor: '#0066FF',
                trailColor: '#2A2A2A'
              })}
            />
            <div className="jobs-label">Jobs</div>
          </div>
          <div className="status-legend">
            <div className="legend-item">
              <span className="dot done"></span>
              <span>Done</span>
            </div>
            <div className="legend-item">
              <span className="dot overdue"></span>
              <span>Overdue work</span>
            </div>
            <div className="legend-item">
              <span className="dot late"></span>
              <span>Work finished late</span>
            </div>
            <div className="legend-item">
              <span className="dot processing"></span>
              <span>Processing</span>
            </div>
          </div>
        </div>

        {/* Website Traffic */}
        <div className="stat-card blue">
          <div className="card-header">
            <h3>Website traffic</h3>
            <span className="year">/2024</span>
          </div>
          <div className="circular-progress-container">
            <CircularProgressbar
              value={100}
              text={`${websiteTraffic.total}k`}
              styles={buildStyles({
                textColor: 'white',
                pathColor: '#0066FF',
                trailColor: '#2A2A2A'
              })}
            />
          </div>
          <div className="traffic-stats">
            <div className="stat-row">
              <span>Social Media</span>
              <span>{websiteTraffic.socialMedia}%</span>
            </div>
            <div className="stat-row">
              <span>Organic Search</span>
              <span>{websiteTraffic.organicSearch}%</span>
            </div>
          </div>
        </div>

        {/* Overdue Work */}
        <div className="stat-card">
          <h3>Overdue work</h3>
          <div className="overdue-stats">
            {overdueWork.map((item, index) => (
              <div key={index} className="overdue-item">
                <div className="progress-container">
                  <CircularProgressbar
                    value={item.percentage}
                    text={item.value.toString()}
                    styles={buildStyles({
                      textColor: 'white',
                      pathColor: index === 0 ? '#FF4444' : '#00FF88',
                      trailColor: '#2A2A2A'
                    })}
                  />
                </div>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earnings Statistics */}
      <div className="earnings-chart-container">
        <div className="chart-header">
          <h3>Earning statistics</h3>
          <select className="period-select">
            <option>Week</option>
          </select>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="dot overdue"></span>
            <span>Overdue work</span>
          </div>
          <div className="legend-item">
            <span className="dot processing"></span>
            <span>Processing</span>
          </div>
          <div className="legend-item">
            <span className="dot late"></span>
            <span>Work finished late</span>
          </div>
          <div className="legend-item">
            <span className="dot done"></span>
            <span>Done</span>
          </div>
        </div>
        <div className="area-chart">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={earningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Area type="monotone" dataKey="overdue" stackId="1" stroke="#00FF88" fill="#00FF88" fillOpacity={0.3} />
              <Area type="monotone" dataKey="processing" stackId="1" stroke="#0066FF" fill="#0066FF" fillOpacity={0.3} />
              <Area type="monotone" dataKey="late" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              <Area type="monotone" dataKey="done" stackId="1" stroke="#666" fill="#666" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Earnings; 