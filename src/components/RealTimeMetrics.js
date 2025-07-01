import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart,
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer ,
//   Calendar
} from 'recharts';
import { 
  TrendingUp, 
  RefreshCw, 
  Clock,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Package
} from 'lucide-react';
import '../styles/RealTimeMetrics.css'; // Import your CSS styles

const RealTimeMetrics = ({ shopId, formatCurrency }) => {
  // Fallback format currency function in case one isn't provided
  const safeFormatCurrency = (amount) => {
    if (typeof formatCurrency === 'function') {
      return formatCurrency(amount);
    }
    
    // Default formatting as fallback
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [salesData, setSalesData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    salesGrowth: 0
  });
  
  // Fetch data when component mounts or time range changes
  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeRange, shopId]);
  
  // Simulate data fetching
  const fetchDashboardData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate sales data based on selected time range
      const generateSalesData = () => {
        if (selectedTimeRange === 'today') {
          // Hourly data for today
          return Array.from({ length: 24 }, (_, i) => {
            const hour = i;
            const hourLabel = `${hour}:00`;
            const randomSales = Math.floor(1000 + Math.random() * 9000);
            const randomOrders = Math.floor(5 + Math.random() * 20);
            return {
              name: hourLabel,
              sales: randomSales,
              orders: randomOrders
            };
          });
        } else if (selectedTimeRange === 'week') {
          // Daily data for the week
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          return days.map(day => {
            const randomSales = Math.floor(8000 + Math.random() * 20000);
            const randomOrders = Math.floor(30 + Math.random() * 70);
            return {
              name: day,
              sales: randomSales,
              orders: randomOrders
            };
          });
        } else if (selectedTimeRange === 'month') {
          // Weekly data for the month
          return Array.from({ length: 4 }, (_, i) => {
            const week = i + 1;
            const randomSales = Math.floor(40000 + Math.random() * 60000);
            const randomOrders = Math.floor(150 + Math.random() * 300);
            return {
              name: `Week ${week}`,
              sales: randomSales,
              orders: randomOrders
            };
          });
        } else { // year
          // Monthly data for the year
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return months.map(month => {
            const randomSales = Math.floor(150000 + Math.random() * 300000);
            const randomOrders = Math.floor(600 + Math.random() * 1200);
            return {
              name: month,
              sales: randomSales,
              orders: randomOrders
            };
          });
        }
      };
      
      // Generate order status data
      const generateOrderStatusData = () => {
        return [
          { name: 'Pending', value: Math.floor(10 + Math.random() * 30) },
          { name: 'Processing', value: Math.floor(20 + Math.random() * 40) },
          { name: 'Completed', value: Math.floor(80 + Math.random() * 120) },
          { name: 'Cancelled', value: Math.floor(5 + Math.random() * 15) }
        ];
      };
      
      // Generate category data
      const generateCategoryData = () => {
        return [
          { name: 'Groceries', value: Math.floor(40 + Math.random() * 30) },
          { name: 'Dairy', value: Math.floor(20 + Math.random() * 15) },
          { name: 'Fruits', value: Math.floor(15 + Math.random() * 15) },
          { name: 'Vegetables', value: Math.floor(10 + Math.random() * 10) },
          { name: 'Beverages', value: Math.floor(5 + Math.random() * 10) },
          { name: 'Others', value: Math.floor(5 + Math.random() * 5) }
        ];
      };
      
      // Get the generated data
      const newSalesData = generateSalesData();
      const newOrderStatusData = generateOrderStatusData();
      const newCategoryData = generateCategoryData();
      
      // Calculate metrics
      const totalSales = newSalesData.reduce((sum, item) => sum + item.sales, 0);
      const totalOrders = newSalesData.reduce((sum, item) => sum + item.orders, 0);
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
      const salesGrowth = Math.floor(-15 + Math.random() * 30); // between -15% and +15%
      
      // Update state
      setSalesData(newSalesData);
      setOrderStatusData(newOrderStatusData);
      setCategoryData(newCategoryData);
      setMetrics({
        totalSales,
        totalOrders,
        averageOrderValue,
        salesGrowth
      });
      
      setIsLoading(false);
    }, 1200);
  };
  
  // Colors for charts
  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#64748b'];
  
  return (
    <div className="real-time-metrics">
      {isLoading && (
        <div className="metrics-loading-overlay">
          <div className="metrics-loading-content">
            <RefreshCw size={32} className="spinning" />
            <span>Loading dashboard data...</span>
          </div>
        </div>
      )}
      
      <div className="metrics-header">
        <h2>Real-time Dashboard</h2>
        <div className="metrics-controls">
          <div className="time-range-selector">
            <button 
              className={`time-range-button ${selectedTimeRange === 'today' ? 'active' : ''}`} 
              onClick={() => setSelectedTimeRange('today')}
            >
              Today
            </button>
            <button 
              className={`time-range-button ${selectedTimeRange === 'week' ? 'active' : ''}`} 
              onClick={() => setSelectedTimeRange('week')}
            >
              This Week
            </button>
            <button 
              className={`time-range-button ${selectedTimeRange === 'month' ? 'active' : ''}`} 
              onClick={() => setSelectedTimeRange('month')}
            >
              This Month
            </button>
            <button 
              className={`time-range-button ${selectedTimeRange === 'year' ? 'active' : ''}`} 
              onClick={() => setSelectedTimeRange('year')}
            >
              This Year
            </button>
          </div>
          <button className="refresh-button" onClick={fetchDashboardData} disabled={isLoading}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="export-button">
            <Download size={16} /> Export
          </button>
        </div>
      </div>
      
      <div className="metrics-summary">
        <div className="metric-summary-card">
          <div className="summary-card-content">
            <div className="summary-title">Total Sales</div>
            <div className="summary-value">{safeFormatCurrency(metrics.totalSales)}</div>
            <div className={`summary-change ${metrics.salesGrowth >= 0 ? 'positive' : 'negative'}`}>
              {metrics.salesGrowth >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(metrics.salesGrowth)}% from previous period
            </div>
          </div>
          <div className="summary-icon sales">₹</div>
        </div>
        
        <div className="metric-summary-card">
          <div className="summary-card-content">
            <div className="summary-title">Total Orders</div>
            <div className="summary-value">{metrics.totalOrders}</div>
            <div className="summary-label">orders processed</div>
          </div>
          <div className="summary-icon orders">
            <Package />
          </div>
        </div>
        
        <div className="metric-summary-card">
          <div className="summary-card-content">
            <div className="summary-title">Average Order Value</div>
            <div className="summary-value">{safeFormatCurrency(metrics.averageOrderValue)}</div>
            <div className="summary-label">per order</div>
          </div>
          <div className="summary-icon aov">
            <TrendingUp />
          </div>
        </div>
        
        <div className="metric-summary-card">
          <div className="summary-card-content">
            <div className="summary-title">Active Now</div>
            <div className="summary-value">{Math.floor(3 + Math.random() * 10)}</div>
            <div className="summary-label">customers browsing</div>
          </div>
          <div className="summary-icon active">
            <Clock />
          </div>
        </div>
      </div>
      
      <div className="metrics-charts">
        <div className="chart-card sales-trend">
          <div className="chart-header">
            <h3>Sales Trend</h3>
            <div className="chart-actions">
              <button className="chart-action-button">
                <Filter size={14} />
              </button>
              <button className="chart-action-button">
                <Download size={14} />
              </button>
            </div>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => safeFormatCurrency(value)} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  name="Sales (₹)"
                  stroke="#8b5cf6"
                  activeDot={{ r: 8 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="orders" 
                  name="Orders" 
                  stroke="#10b981" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="chart-row">
          <div className="chart-card order-status">
            <div className="chart-header">
              <h3>Order Status</h3>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Orders']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="chart-card category-distribution">
            <div className="chart-header">
              <h3>Category Distribution</h3>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [value, 'Orders']} />
                  <Bar dataKey="value" name="Orders">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      <div className="recent-transactions">
        <div className="chart-header">
          <h3>Recent Transactions</h3>
          <button className="view-all-button">View All</button>
        </div>
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }, (_, i) => {
                const orderId = `ORD${Math.floor(10000 + Math.random() * 90000)}`;
                const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Neha Singh', 'Vikram Malhotra'];
                const amounts = [750, 1200, 435, 2500, 890];
                const statuses = ['pending', 'processing', 'completed', 'completed', 'processing'];
                
                // Current date minus random minutes
                const date = new Date();
                date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 300));
                
                return (
                  <tr key={i}>
                    <td>{orderId}</td>
                    <td>{names[i]}</td>
                    <td>{date.toLocaleString('en-IN')}</td>
                    <td>{safeFormatCurrency(amounts[i])}</td>
                    <td>
                      <span className={`transaction-status ${statuses[i]}`}>
                        {statuses[i].charAt(0).toUpperCase() + statuses[i].slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;