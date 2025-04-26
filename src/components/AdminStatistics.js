import React, { useState, useEffect } from 'react';
import { getAdminStatistics } from '../services/adminStatsService';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#9370DB', '#3CB371'];

const AdminStatistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const data = await getAdminStatistics();
                setStats(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch statistics:', err);
                setError('Failed to load statistics. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-accent" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading statistics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="alert alert-warning m-4" role="alert">
                <i className="fas fa-info-circle me-2"></i>
                No statistics data available.
            </div>
        );
    }

    const { userStats, questionStats, performanceStats, weeklyActivity } = stats;

    return (
        <div className="statistics-dashboard">
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card stat-card">
                        <div className="card-body text-center">
                            <div className="stat-icon"><i className="fas fa-users"></i></div>
                            <h2 className="stat-value">{userStats.totalUsers}</h2>
                            <p className="stat-label">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card stat-card">
                        <div className="card-body text-center">
                            <div className="stat-icon"><i className="fas fa-question-circle"></i></div>
                            <h2 className="stat-value">{questionStats.totalQuestions}</h2>
                            <p className="stat-label">Total Questions</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card stat-card">
                        <div className="card-body text-center">
                            <div className="stat-icon"><i className="fas fa-code"></i></div>
                            <h2 className="stat-value">{performanceStats.totalAttempts}</h2>
                            <p className="stat-label">Total Attempts</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card stat-card">
                        <div className="card-body text-center">
                            <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                            <h2 className="stat-value">{performanceStats.completedQuestions}</h2>
                            <p className="stat-label">Completed Questions</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-transparent">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-chart-line me-2"></i>Weekly Activity
                            </h5>
                        </div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart
                                    data={weeklyActivity}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="attempts" stackId="1" stroke="#8884d8" fill="#8884d8" />
                                    <Area type="monotone" dataKey="completions" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-transparent">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-language me-2"></i>Questions by Language
                            </h5>
                        </div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={questionStats.questionsByLanguage}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {questionStats.questionsByLanguage.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-transparent">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-tachometer-alt me-2"></i>Questions by Difficulty
                            </h5>
                        </div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={questionStats.questionsByDifficulty}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {questionStats.questionsByDifficulty.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={
                                                entry.name === 'EASY' ? '#00C49F' :
                                                    entry.name === 'MEDIUM' ? '#FFBB28' :
                                                        '#FF8042'
                                            } />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-transparent">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-star me-2"></i>Average Score by Language
                            </h5>
                        </div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={performanceStats.averageScoreByLanguage}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="score" name="Average Score" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-transparent">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-award me-2"></i>Average Score by Difficulty
                            </h5>
                        </div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={performanceStats.averageScoreByDifficulty}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="score" name="Average Score" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header bg-transparent">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-fire me-2"></i>Most Attempted Questions
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th className="text-center">Attempts</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {questionStats.mostAttemptedQuestions.map(question => (
                                        <tr key={question.id}>
                                            <td>{question.title}</td>
                                            <td className="text-center">{question.attempts}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header bg-transparent">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-exclamation-triangle me-2"></i>Lowest Completion Rate
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th className="text-center">Completion Rate</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {questionStats.lowestCompletionRateQuestions.map(question => (
                                        <tr key={question.id}>
                                            <td>{question.title}</td>
                                            <td className="text-center">{question.completionRate}%</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .statistics-dashboard {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .stat-card {
          border-radius: 15px;
          border: 1px solid #333;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          border-color: var(--accent);
        }
        
        .stat-icon {
          font-size: 2.5rem;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }
        
        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.2rem;
          color: #fff;
        }
        
        .stat-label {
          color: #9fa6b2;
          font-size: 1rem;
          margin-bottom: 0;
        }
        
        .card {
          border-radius: 15px;
          border: 1px solid #333;
          margin-bottom: 1rem;
          overflow: hidden;
          background-color: var(--dark-secondary);
        }
        
        .card-header {
          border-bottom: 1px solid #333;
          padding: 1rem 1.5rem;
        }
        
        .card-title {
          color: var(--accent);
          font-weight: 600;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .table {
          color: #fff;
          margin-bottom: 0;
        }
        
        .table th {
          border-top: none;
          background-color: rgba(0, 0, 0, 0.2);
          color: var(--accent);
          font-weight: 600;
        }
        
        .table td {
          border-color: #444;
          vertical-align: middle;
        }
        
        .table tr:hover {
          background-color: rgba(0, 255, 136, 0.05);
        }
      `}</style>
        </div>
    );
};

export default AdminStatistics;