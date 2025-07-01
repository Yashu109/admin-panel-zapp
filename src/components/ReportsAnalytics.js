





// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   BarChart, TrendingUp, Download, Calendar, Filter, RefreshCw, 
//   ArrowUp, ArrowDown, DollarSign, Package, ShoppingBag, Clock, 
//   Users, AlertTriangle, CheckCircle, FileText, PieChart, UserCheck, 
//   ChevronDown, ChevronUp, Store, Star
// } from 'lucide-react';
// import { ref, onValue, query, orderByChild, limitToLast, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/ReportsAnalytics.css';
// import Chart from 'chart.js/auto';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import * as XLSX from 'xlsx';

// const ReportsAnalytics = () => {
//   // State for dashboard data
//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     totalRevenue: 0,
//     averageOrderValue: 0,
//     activeShops: 0,
//     pendingDeliveries: 0,
//     deliveryCompletionRate: 0,
//     sentimentScore: 0,
//     customerSatisfaction: 0
//   });

//   // State for order stats by status
//   const [orderStats, setOrderStats] = useState({
//     pending: 0,
//     processing: 0,
//     out_for_delivery: 0,
//     delivered: 0,
//     cancelled: 0
//   });

//   // State for revenue trend data
//   const [revenueTrend, setRevenueTrend] = useState([]);

//   // State for support tickets data
//   const [supportTickets, setSupportTickets] = useState({
//     open: 0,
//     inProgress: 0,
//     resolved: 0,
//     total: 0
//   });

//   // State for top shops
//   const [topShops, setTopShops] = useState([]);

//   // State for time period filter
//   const [timePeriod, setTimePeriod] = useState('month');

//   // State for loading
//   const [isLoading, setIsLoading] = useState(true);

//   // State for expanded sections
//   const [expandedSections, setExpandedSections] = useState({
//     revenueMetrics: true,
//     orderMetrics: true,
//     customerMetrics: true,
//     shopPerformance: true
//   });

//   // State for sentiment data
//   const [sentimentData, setSentimentData] = useState({
//     positive: 0,
//     neutral: 0,
//     negative: 0,
//     sentimentOverTime: []
//   });
  
//   // State for export dropdown
//   const [showExportMenu, setShowExportMenu] = useState(false);

//   // Refs for charts
//   const revenueChartRef = useRef(null);
//   const revenueChartInstance = useRef(null);
  
//   const orderChartRef = useRef(null);
//   const orderChartInstance = useRef(null);
  
//   const sentimentChartRef = useRef(null);
//   const sentimentChartInstance = useRef(null);
  
//   const satisfactionChartRef = useRef(null);
//   const satisfactionChartInstance = useRef(null);
  
//   // Ref for export dropdown menu
//   const exportMenuRef = useRef(null);

//   // Toggle section expansion
//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   // Format percentage
//   const formatPercentage = (value) => {
//     return `${value.toFixed(1)}%`;
//   };

//   // Format date
//   const formatDate = (date) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(date).toLocaleDateString('en-IN', options);
//   };

//   // Get time period label
//   const getTimePeriodLabel = () => {
//     switch (timePeriod) {
//       case 'today': return 'Today';
//       case 'week': return 'This Week';
//       case 'month': return 'This Month';
//       case 'quarter': return 'This Quarter';
//       case 'year': return 'This Year';
//       default: return 'This Week';
//     }
//   };

//   // Handle export as PDF
//   const handleExportPDF = async () => {
//     const dashboardElement = document.getElementById('analytics-dashboard');
//     const canvas = await html2canvas(dashboardElement, { scale: 2 });
//     const imgData = canvas.toDataURL('image/png');
    
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();
    
//     const imgWidth = canvas.width;
//     const imgHeight = canvas.height;
    
//     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
//     const imgX = (pdfWidth - imgWidth * ratio) / 2;
//     const imgY = 10;
    
//     pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
//     pdf.save(`ZappCart_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
//   };

//   // Handle export as Excel
//   const handleExportExcel = () => {
//     try {
//       // Prepare data for Excel export
//       const workbook = XLSX.utils.book_new();
      
//       // Dashboard Summary Sheet
//       const dashboardSummary = [
//         ['ZappCart Analytics Report', ''],
//         ['Generated On', formatDate(new Date())],
//         ['Period', getTimePeriodLabel()],
//         [''],
//         ['Metric', 'Value'],
//         ['Total Orders', dashboardData.totalOrders],
//         ['Total Revenue', formatCurrency(dashboardData.totalRevenue)],
//         ['Average Order Value', formatCurrency(dashboardData.averageOrderValue)],
//         ['Active Shops', dashboardData.activeShops],
//         ['Pending Deliveries', dashboardData.pendingDeliveries],
//         ['Delivery Completion Rate', `${dashboardData.deliveryCompletionRate.toFixed(1)}%`],
//         ['Customer Satisfaction', `${dashboardData.customerSatisfaction.toFixed(1)}/5`],
//         ['Sentiment Score', `${dashboardData.sentimentScore > 0 ? '+' : ''}${dashboardData.sentimentScore}%`]
//       ];
      
//       const dashboardSheet = XLSX.utils.aoa_to_sheet(dashboardSummary);
//       XLSX.utils.book_append_sheet(workbook, dashboardSheet, 'Dashboard Summary');
      
//       // Order Status Sheet
//       const orderStatusData = [
//         ['Order Status', 'Count'],
//         ['Pending', orderStats.pending],
//         ['Processing', orderStats.processing],
//         ['Out for Delivery', orderStats.out_for_delivery],
//         ['Delivered', orderStats.delivered],
//         ['Cancelled', orderStats.cancelled]
//       ];
      
//       const orderStatusSheet = XLSX.utils.aoa_to_sheet(orderStatusData);
//       XLSX.utils.book_append_sheet(workbook, orderStatusSheet, 'Order Status');
      
//       // Top Shops Sheet
//       const topShopsData = [
//         ['Rank', 'Shop Name', 'Orders', 'Revenue', 'Rating']
//       ];
      
//       topShops.forEach((shop, index) => {
//         topShopsData.push([
//           index + 1,
//           shop.name,
//           shop.orders,
//           formatCurrency(shop.revenue),
//           shop.rating.toFixed(1)
//         ]);
//       });
      
//       const topShopsSheet = XLSX.utils.aoa_to_sheet(topShopsData);
//       XLSX.utils.book_append_sheet(workbook, topShopsSheet, 'Top Shops');
      
//       // Revenue Trend Sheet
//       const revenueTrendData = [
//         ['Date', 'Revenue']
//       ];
      
//       revenueTrend.forEach(item => {
//         revenueTrendData.push([
//           formatDate(item.date),
//           item.amount
//         ]);
//       });
      
//       const revenueTrendSheet = XLSX.utils.aoa_to_sheet(revenueTrendData);
//       XLSX.utils.book_append_sheet(workbook, revenueTrendSheet, 'Revenue Trend');
      
//       // Sentiment Analysis Sheet
//       const sentimentAnalysisData = [
//         ['Sentiment', 'Percentage'],
//         ['Positive', sentimentData.positive.toFixed(1) + '%'],
//         ['Neutral', sentimentData.neutral.toFixed(1) + '%'],
//         ['Negative', sentimentData.negative.toFixed(1) + '%']
//       ];
      
//       const sentimentSheet = XLSX.utils.aoa_to_sheet(sentimentAnalysisData);
//       XLSX.utils.book_append_sheet(workbook, sentimentSheet, 'Sentiment Analysis');
      
//       // Export to Excel file
//       XLSX.writeFile(workbook, `ZappCart_Analytics_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      
//       console.log('Excel export completed successfully');
//     } catch (error) {
//       console.error('Error exporting to Excel:', error);
//       alert('Failed to export Excel. Please try again.');
//     }
//   };

//   // Handle refresh data
//   const handleRefreshData = () => {
//     setIsLoading(true);
//     fetchDashboardData();
//   };

//   // Handle time period change
//   const handleTimePeriodChange = (period) => {
//     setTimePeriod(period);
//     setIsLoading(true);
//     // Re-fetch data with new time period
//     fetchDashboardData(period);
//   };

//   // Calculate date range based on time period
//   const getDateRange = (period) => {
//     const today = new Date();
//     const startDate = new Date();
    
//     switch (period) {
//       case 'today':
//         startDate.setHours(0, 0, 0, 0);
//         break;
//       case 'week':
//         startDate.setDate(today.getDate() - 7);
//         break;
//       case 'month':
//         startDate.setMonth(today.getMonth() - 1);
//         break;
//       case 'quarter':
//         startDate.setMonth(today.getMonth() - 3);
//         break;
//       case 'year':
//         startDate.setFullYear(today.getFullYear() - 1);
//         break;
//       default:
//         startDate.setDate(today.getDate() - 7);
//     }
    
//     return { startDate, endDate: today };
//   };

//   // Function to analyze sentiment from support tickets
//   const analyzeSentiment = (tickets) => {
//     // Keywords for sentiment analysis
//     const positiveKeywords = ['happy', 'great', 'excellent', 'good', 'satisfied', 'thanks', 'thank you', 'amazing', 'wonderful', 'perfect', 'best'];
//     const negativeKeywords = ['bad', 'terrible', 'worst', 'poor', 'disappointed', 'issue', 'problem', 'delay', 'wrong', 'not good', 'refund', 'cancel', 'unhappy', 'dissatisfied'];
    
//     let positive = 0;
//     let negative = 0;
//     let neutral = 0;
//     let sentimentOverTime = [];
    
//     // Group tickets by date for sentiment over time
//     const ticketsByDate = {};
    
//     tickets.forEach(ticket => {
//       // Skip tickets without notes
//       if (!ticket.customerNote) return;
      
//       const note = ticket.customerNote.toLowerCase();
      
//       // Count positive and negative keywords
//       const positiveCount = positiveKeywords.filter(keyword => note.includes(keyword)).length;
//       const negativeCount = negativeKeywords.filter(keyword => note.includes(keyword)).length;
      
//       // Determine sentiment
//       let sentiment;
//       if (positiveCount > negativeCount) {
//         sentiment = 'positive';
//         positive++;
//       } else if (negativeCount > positiveCount) {
//         sentiment = 'negative';
//         negative++;
//       } else {
//         sentiment = 'neutral';
//         neutral++;
//       }
      
//       // Group by date for sentiment over time
//       const date = new Date(ticket.submittedAt).toISOString().split('T')[0];
//       if (!ticketsByDate[date]) {
//         ticketsByDate[date] = { positive: 0, negative: 0, neutral: 0, total: 0 };
//       }
      
//       ticketsByDate[date][sentiment]++;
//       ticketsByDate[date].total++;
//     });
    
//     // Convert to array for chart
//     sentimentOverTime = Object.keys(ticketsByDate).map(date => ({
//       date,
//       positive: ticketsByDate[date].positive,
//       negative: ticketsByDate[date].negative,
//       neutral: ticketsByDate[date].neutral,
//       // Calculate sentiment score (-100 to +100)
//       score: Math.round(((ticketsByDate[date].positive - ticketsByDate[date].negative) / ticketsByDate[date].total) * 100)
//     })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
//     const total = positive + negative + neutral;
    
//     return {
//       positive: total > 0 ? (positive / total) * 100 : 0,
//       neutral: total > 0 ? (neutral / total) * 100 : 0,
//       negative: total > 0 ? (negative / total) * 100 : 0,
//       sentimentOverTime,
//       // Overall sentiment score (-100 to +100)
//       score: total > 0 ? Math.round(((positive - negative) / total) * 100) : 0
//     };
//   };

//   // Fetch dashboard data from Firebase
//   const fetchDashboardData = async (period = timePeriod) => {
//     try {
//       const { startDate, endDate } = getDateRange(period);
      
//       // Fetch orders
//       const ordersRef = ref(db, 'orders');
//       const ordersSnapshot = await get(ordersRef);
      
//       if (!ordersSnapshot.exists()) {
//         setIsLoading(false);
//         return;
//       }
      
//       const ordersData = [];
//       const orderStatsByStatus = {
//         pending: 0,
//         processing: 0,
//         out_for_delivery: 0,
//         delivered: 0,
//         cancelled: 0
//       };
      
//       let totalRevenue = 0;
//       let completedOrders = 0;
//       let totalOrdersInPeriod = 0;
      
//       // Process orders data
//       ordersSnapshot.forEach(orderSnapshot => {
//         const order = { id: orderSnapshot.key, ...orderSnapshot.val() };
        
//         // Convert string date to Date object for comparison
//         const orderDate = new Date(order.orderDate);
        
//         if (orderDate >= startDate && orderDate <= endDate) {
//           ordersData.push(order);
//           totalOrdersInPeriod++;
          
//           // Update order stats by status
//           if (orderStatsByStatus.hasOwnProperty(order.status)) {
//             orderStatsByStatus[order.status]++;
//           }
          
//           // Calculate revenue from completed orders
//           if (order.status === 'delivered') {
//             totalRevenue += order.totalAmount || 0;
//             completedOrders++;
//           }
//         }
//       });
      
//       // Fetch shops
//       const shopsRef = ref(db, 'shops');
//       const shopsSnapshot = await get(shopsRef);
      
//       const activeShops = shopsSnapshot.exists() 
//         ? Object.values(shopsSnapshot.val()).filter(shop => shop.status === 'active').length 
//         : 0;
      
//       // Calculate shop performance for top shops
//       const shopPerformance = {};
      
//       if (shopsSnapshot.exists()) {
//         ordersData.forEach(order => {
//           if (order.vendor && order.vendor.id) {
//             const vendorId = order.vendor.id;
            
//             if (!shopPerformance[vendorId]) {
//               // Get shop details from shops collection
//               const shopData = Object.entries(shopsSnapshot.val())
//                 .find(([key, value]) => key === vendorId);
              
//               if (shopData) {
//                 shopPerformance[vendorId] = {
//                   id: vendorId,
//                   name: shopData[1].name || 'Unknown Shop',
//                   orders: 0,
//                   revenue: 0,
//                   rating: shopData[1].rating || 0
//                 };
//               } else {
//                 shopPerformance[vendorId] = {
//                   id: vendorId,
//                   name: order.vendor.name || 'Unknown Shop',
//                   orders: 0,
//                   revenue: 0,
//                   rating: order.vendor.rating || 0
//                 };
//               }
//             }
            
//             shopPerformance[vendorId].orders++;
            
//             if (order.status === 'delivered') {
//               shopPerformance[vendorId].revenue += order.totalAmount || 0;
//             }
//           }
//         });
//       }
      
//       // Sort shops by revenue and get top 5
//       const topShopsList = Object.values(shopPerformance)
//         .sort((a, b) => b.revenue - a.revenue)
//         .slice(0, 5);
      
//       // Fetch support tickets
//       const helpRef = ref(db, 'help');
//       const helpSnapshot = await get(helpRef);
      
//       const supportTicketsData = {
//         open: 0,
//         inProgress: 0,
//         resolved: 0,
//         total: 0
//       };
      
//       const ticketsForSentiment = [];
      
//       if (helpSnapshot.exists()) {
//         helpSnapshot.forEach(ticketSnapshot => {
//           const ticket = { id: ticketSnapshot.key, ...ticketSnapshot.val() };
          
//           // Convert string date to Date object for comparison
//           const ticketDate = new Date(ticket.submittedAt);
          
//           if (ticketDate >= startDate && ticketDate <= endDate) {
//             ticketsForSentiment.push(ticket);
            
//             // Update support tickets stats by status
//             supportTicketsData.total++;
            
//             if (ticket.status === 'open') {
//               supportTicketsData.open++;
//             } else if (ticket.status === 'in-progress') {
//               supportTicketsData.inProgress++;
//             } else if (ticket.status === 'resolved') {
//               supportTicketsData.resolved++;
//             }
//           }
//         });
//       }
      
//       // Analyze sentiment from support tickets
//       const sentimentResults = analyzeSentiment(ticketsForSentiment);
      
//       // Calculate revenue trend by day
//       const revenueTrendMap = {};
      
//       ordersData.forEach(order => {
//         if (order.status === 'delivered') {
//           const date = new Date(order.orderDate).toISOString().split('T')[0];
          
//           if (!revenueTrendMap[date]) {
//             revenueTrendMap[date] = 0;
//           }
          
//           revenueTrendMap[date] += order.totalAmount || 0;
//         }
//       });
      
//       // Convert to array and sort by date
//       const revenueTrendData = Object.keys(revenueTrendMap).map(date => ({
//         date,
//         amount: revenueTrendMap[date]
//       })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
//       // If we have no trend data but have total revenue, create at least one data point
//       if (revenueTrendData.length === 0 && totalRevenue > 0) {
//         revenueTrendData.push({
//           date: new Date().toISOString().split('T')[0],
//           amount: totalRevenue
//         });
//       }
      
//       console.log('Revenue trend data:', revenueTrendData);
      
//       // Calculate average order value and delivery completion rate
//       const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
//       const pendingDeliveries = orderStatsByStatus.out_for_delivery + orderStatsByStatus.processing;
//       const deliveryCompletionRate = totalOrdersInPeriod > 0 
//         ? (orderStatsByStatus.delivered / (totalOrdersInPeriod - orderStatsByStatus.cancelled)) * 100 
//         : 0;
      
//       // Calculate customer satisfaction (mock data - in a real app would be from ratings)
//       // Using a weighted calculation based on sentiment and completed orders
//       const positiveSentimentWeight = sentimentResults.positive / 100;
//       const customerSatisfaction = 3.5 + (positiveSentimentWeight * 1.5);
      
//       // Update state with all the calculated data
//       setDashboardData({
//         totalOrders: totalOrdersInPeriod,
//         totalRevenue,
//         averageOrderValue,
//         activeShops,
//         pendingDeliveries,
//         deliveryCompletionRate,
//         sentimentScore: sentimentResults.score,
//         customerSatisfaction
//       });
      
//       setOrderStats(orderStatsByStatus);
//       setRevenueTrend(revenueTrendData);
//       setSupportTickets(supportTicketsData);
//       setTopShops(topShopsList);
//       setSentimentData(sentimentResults);
      
//       setIsLoading(false);
      
//       // Update charts
//       updateCharts();
      
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setIsLoading(false);
//     }
//   };

//   // Update all charts
//   const updateCharts = () => {
//     setTimeout(() => {
//       updateRevenueChart();
//       updateOrderChart();
//       updateSentimentChart();
//       updateSatisfactionChart();
//     }, 100);
//   };

//   // Update revenue chart - MODIFIED to create a pie chart instead of line chart
//   const updateRevenueChart = () => {
//     if (revenueChartInstance.current) {
//       revenueChartInstance.current.destroy();
//     }
    
//     if (!revenueChartRef.current) return;
    
//     const ctx = revenueChartRef.current.getContext('2d');
    
//     // Data for the pie chart based on key metrics from dashboard data
//     const data = [
//       dashboardData.totalOrders,             // Total Orders
//       dashboardData.totalRevenue / 1000,     // Revenue (scaled down for better visualization)
//       dashboardData.activeShops,             // Active Shops
//       dashboardData.customerSatisfaction * 20 // Customer Satisfaction (scaled up for better visualization)
//     ];
    
//     revenueChartInstance.current = new Chart(ctx, {
//       type: 'pie',
//       data: {
//         labels: [
//           'Total Orders', 
//           'Revenue (₹ thousands)', 
//           'Active Shops', 
//           'Customer Satisfaction'
//         ],
//         datasets: [{
//           data: data,
//           backgroundColor: [
//             '#4361EE', // Blue for Total Orders
//             '#2EC4B6', // Teal for Revenue
//             '#FF9F1C', // Orange for Active Shops
//             '#E71D36'  // Red for Customer Satisfaction
//           ],
//           borderWidth: 0
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: 'right',
//             labels: {
//               boxWidth: 15,
//               padding: 15,
//               font: {
//                 size: 12
//               }
//             }
//           },
//           tooltip: {
//             callbacks: {
//               label: function(context) {
//                 const label = context.label || '';
//                 const value = context.raw;
                
//                 if (label.includes('Revenue')) {
//                   return `${label}: ${formatCurrency(value * 1000)}`;
//                 } else if (label.includes('Customer Satisfaction')) {
//                   return `${label}: ${(value / 20).toFixed(1)}/5`;
//                 }
                
//                 return `${label}: ${value}`;
//               }
//             }
//           }
//         }
//       }
//     });
//   };

//   // Update order chart
//   const updateOrderChart = () => {
//     if (orderChartInstance.current) {
//       orderChartInstance.current.destroy();
//     }
    
//     if (!orderChartRef.current) return;
    
//     const ctx = orderChartRef.current.getContext('2d');
    
//     const labels = ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];
//     const data = [
//       orderStats.pending,
//       orderStats.processing,
//       orderStats.out_for_delivery,
//       orderStats.delivered,
//       orderStats.cancelled
//     ];
    
//     orderChartInstance.current = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels,
//         datasets: [{
//           data,
//           backgroundColor: [
//             '#FFB74D', // Pending (orange)
//             '#4FC3F7', // Processing (blue)
//             '#4DB6AC', // Out for Delivery (teal)
//             '#66BB6A', // Delivered (green)
//             '#E57373'  // Cancelled (red)
//           ],
//           borderWidth: 0,
//           borderRadius: 4
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           y: {
//             beginAtZero: true,
//             grid: {
//               color: 'rgba(0, 0, 0, 0.05)'
//             }
//           },
//           x: {
//             grid: {
//               display: false
//             }
//           }
//         },
//         plugins: {
//           legend: {
//             display: false
//           }
//         }
//       }
//     });
//   };

//   // Update sentiment chart
//   const updateSentimentChart = () => {
//     if (sentimentChartInstance.current) {
//       sentimentChartInstance.current.destroy();
//     }
    
//     if (!sentimentChartRef.current) return;
    
//     const ctx = sentimentChartRef.current.getContext('2d');
    
//     // Get sentiment over time data
//     const labels = sentimentData.sentimentOverTime.map(item => formatDate(item.date));
//     const data = sentimentData.sentimentOverTime.map(item => item.score);
    
//     sentimentChartInstance.current = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels,
//         datasets: [{
//           label: 'Sentiment Score',
//           data,
//           borderColor: data.every(val => val >= 0) ? '#4CAF50' : '#FF5722',
//           backgroundColor: (context) => {
//             const value = context.dataset.data[context.dataIndex];
//             return value >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 87, 34, 0.1)';
//           },
//           tension: 0.3,
//           fill: true
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           y: {
//             beginAtZero: false,
//             suggestedMin: -100,
//             suggestedMax: 100,
//             grid: {
//               color: 'rgba(0, 0, 0, 0.05)'
//             },
//             ticks: {
//               callback: function(value) {
//                 return value + (value === 0 ? '' : '%');
//               }
//             }
//           },
//           x: {
//             grid: {
//               display: false
//             }
//           }
//         },
//         plugins: {
//           legend: {
//             display: false
//           },
//           tooltip: {
//             callbacks: {
//               label: function(context) {
//                 const value = context.raw;
//                 return `Sentiment Score: ${value > 0 ? '+' : ''}${value}%`;
//               }
//             }
//           }
//         }
//       }
//     });
//   };

//   // Update satisfaction chart
//   const updateSatisfactionChart = () => {
//     if (satisfactionChartInstance.current) {
//       satisfactionChartInstance.current.destroy();
//     }
    
//     if (!satisfactionChartRef.current) return;
    
//     const ctx = satisfactionChartRef.current.getContext('2d');
    
//     // Create doughnut chart for sentiment distribution
//     satisfactionChartInstance.current = new Chart(ctx, {
//       type: 'doughnut',
//       data: {
//         labels: ['Positive', 'Neutral', 'Negative'],
//         datasets: [{
//           data: [
//             sentimentData.positive,
//             sentimentData.neutral,
//             sentimentData.negative
//           ],
//           backgroundColor: [
//             '#4CAF50', // Positive (green)
//             '#FFC107', // Neutral (amber)
//             '#F44336'  // Negative (red)
//           ],
//           borderWidth: 0
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: 'bottom',
//             labels: {
//               boxWidth: 12,
//               padding: 15
//             }
//           },
//           tooltip: {
//             callbacks: {
//               label: function(context) {
//                 const value = context.raw.toFixed(1);
//                 return `${context.label}: ${value}%`;
//               }
//             }
//           }
//         }
//       }
//     });
//   };

//   // Initialize dashboard data
//   useEffect(() => {
//     fetchDashboardData();
    
//     // Add click outside handler for export menu
//     const handleClickOutside = (event) => {
//       if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
//         setShowExportMenu(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
    
//     // Set up cleanup function
//     return () => {
//       if (revenueChartInstance.current) {
//         revenueChartInstance.current.destroy();
//       }
//       if (orderChartInstance.current) {
//         orderChartInstance.current.destroy();
//       }
//       if (sentimentChartInstance.current) {
//         sentimentChartInstance.current.destroy();
//       }
//       if (satisfactionChartInstance.current) {
//         satisfactionChartInstance.current.destroy();
//       }
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="reports-analytics">
//       <div className="analytics-header">
//         <div className="header-title">
//           <h1>Reports & Analytics</h1>
//           <div style={{top:'5px', position:'relative'}} className="gradient-line">
//           <div className="gradient-segment segment-1"></div>
//         </div>
//         </div>
        
//         <div className="header-actions">
//           <div className="period-filter">
//             <Calendar size={16} />
//             <select 
//               value={timePeriod} 
//               onChange={(e) => handleTimePeriodChange(e.target.value)}
//               className="period-select"
//             >
//               <option value="today">Today</option>
//               <option value="week">This Week</option>
//               <option value="month">This Month</option>
//               <option value="quarter">This Quarter</option>
//               <option value="year">This Year</option>
//             </select>
//           </div>
          
//           <button className="refresh-button" onClick={handleRefreshData}>
//             <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
//             Refresh Data
//           </button>
          
//           <div className="export-dropdown" ref={exportMenuRef}>
//             <button className="export-button" onClick={() => setShowExportMenu(!showExportMenu)}>
//               <Download size={16} />
//               Export
//               <ChevronDown size={14} />
//             </button>
//             {showExportMenu && (
//               <div className="export-menu" style={{ 
//                 display: 'block', 
//                 position: 'absolute', 
//                 zIndex: 100, 
//                 background: '#fff', 
//                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
//                 borderRadius: '4px', 
//                 padding: '8px 0',
//                 right: 0,
//                 top: '100%',
//                 marginTop: '4px',
//                 width: '180px'
//               }}>
//                 <button 
//                   onClick={handleExportPDF} 
//                   className="export-option" 
//                   style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     padding: '8px 16px', 
//                     width: '100%', 
//                     border: 'none', 
//                     background: 'none', 
//                     cursor: 'pointer', 
//                     textAlign: 'left',
//                     transition: 'background-color 0.2s',
//                     hoverBackgroundColor: '#f5f5f5'
//                   }}
//                   onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
//                   onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                 >
//                   <FileText size={14} style={{ marginRight: '8px' }} />
//                   Export as PDF
//                 </button>
//                 <button 
//                   onClick={handleExportExcel} 
//                   className="export-option" 
//                   style={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     padding: '8px 16px', 
//                     width: '100%', 
//                     border: 'none', 
//                     background: 'none', 
//                     cursor: 'pointer', 
//                     textAlign: 'left',
//                     transition: 'background-color 0.2s'
//                   }}
//                   onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
//                   onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                 >
//                   <FileText size={14} style={{ marginRight: '8px' }} />
//                   Export as Excel
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {isLoading ? (
//         <div className="loading-overlay">
//           <div className="loading-spinner">
//             <RefreshCw size={35} className="spinning" />
//           </div>
//           <span>Loading analytics data...</span>
//         </div>
//       ) : (
//         <div className="analytics-dashboard" id="analytics-dashboard">
//           {/* Key Metrics Cards */}
//           <div className="metrics-cards">
//             <div className="metric-card total-orders">
//               <div className="metric-icon">
//                 <Package size={20} />
//               </div>
//               <div className="metric-content">
//                 <h3 className="metric-label">Total Orders</h3>
//                 <p className="metric-value">{dashboardData.totalOrders}</p>
//               </div>
//             </div>
            
//             <div className="metric-card total-revenue">
//               <div className="metric-icon">
//                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹</span>
//               </div>
//               <div className="metric-content">
//                 <h3 className="metric-label">Total Revenue</h3>
//                 <p className="metric-value">{formatCurrency(dashboardData.totalRevenue)}</p>
//               </div>
//             </div>
          
            
//             <div className="metric-card active-shops">
//               <div className="metric-icon">
//                 <Store size={20} />
//               </div>
//               <div className="metric-content">
//                 <h3 className="metric-label">Active Shops</h3>
//                 <p className="metric-value">{dashboardData.activeShops}</p>
//               </div>
//             </div>
            
//             <div className="metric-card customer-satisfaction">
//               <div className="metric-icon">
//                 <UserCheck size={20} />
//               </div>
//               <div className="metric-content">
//                 <h3 className="metric-label">Customer Satisfaction</h3>
//                 <p className="metric-value">{dashboardData.customerSatisfaction.toFixed(1)}/5</p>
//               </div>
//             </div>
            
            
//           </div>
          
//           {/* Revenue Metrics Section */}
//           <div className="analytics-section">
//             <div className="section-header" onClick={() => toggleSection('revenueMetrics')}>
//               <h2>
//                 <BarChart size={18} />
//                 Revenue Metrics
//               </h2>
//               {expandedSections.revenueMetrics ? (
//                 <ChevronUp size={18} />
//               ) : (
//                 <ChevronDown size={18} />
//               )}
//             </div>
            
//             {expandedSections.revenueMetrics && (
//               <div className="section-content">
//                 <div className="chart-container revenue-chart">
//                   <h3>Key Business Metrics ({getTimePeriodLabel()})</h3>
//                   <div className="chart-wrapper">
//                     <canvas ref={revenueChartRef}></canvas>
//                   </div>
//                 </div>
                
//                 <div className="top-shops-list">
//                   <h3>Top Performing Shops</h3>
//                   <div className="shops-list">
//                     {topShops.length > 0 ? (
//                       topShops.map((shop, index) => (
//                         <div className="shop-item" key={shop.id}>
//                           <div className="shop-rank">{index + 1}</div>
//                           <div className="shop-info">
//                             <span className="shop-name">{shop.name}</span>
//                             <div className="shop-stats">
//                               <span className="shop-orders">{shop.orders} orders</span>
//                               <span className="shop-rating">
//                                 {shop.rating.toFixed(1)} <Star size={12} className="star-icon" />
//                               </span>
//                             </div>
//                           </div>
//                           <div className="shop-revenue">{formatCurrency(shop.revenue)}</div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="no-data-message">No shop data available for the selected period.</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Order Metrics Section */}
//           <div className="analytics-section">
//             <div className="section-header" onClick={() => toggleSection('orderMetrics')}>
//               <h2>
//                 <Package size={18} />
//                 Order Metrics
//               </h2>
//               {expandedSections.orderMetrics ? (
//                 <ChevronUp size={18} />
//               ) : (
//                 <ChevronDown size={18} />
//               )}
//             </div>
            
//             {expandedSections.orderMetrics && (
//               <div className="section-content">
//                 <div className="chart-container order-chart">
//                   <h3>Orders by Status</h3>
//                   <div className="chart-wrapper">
//                     <canvas ref={orderChartRef}></canvas>
//                   </div>
//                 </div>
                
//                 <div className="order-stats">
//                   <div className="order-stat-card">
//                     <h3>Delivery Performance</h3>
//                     <div className="order-stat-content">
//                       <div className="stat-item">
//                         <span className="stat-label">Pending Deliveries</span>
//                         <span className="stat-value">{dashboardData.pendingDeliveries}</span>
//                       </div>
//                       <div className="stat-item">
//                         <span className="stat-label">Delivery Completion Rate</span>
//                         <span className="stat-value">{formatPercentage(dashboardData.deliveryCompletionRate)}</span>
//                       </div>
//                       <div className="stat-item">
//                         <span className="stat-label">Avg. Delivery Time</span>
//                         <span className="stat-value">35 mins</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="order-stat-card">
//                     <h3>Support Tickets</h3>
//                     <div className="order-stat-content">
//                       <div className="stat-item">
//                         <span className="stat-label">Open Tickets</span>
//                         <span className="stat-value">{supportTickets.open}</span>
//                       </div>
//                       <div className="stat-item">
//                         <span className="stat-label">In Progress</span>
//                         <span className="stat-value">{supportTickets.inProgress}</span>
//                       </div>
//                       <div className="stat-item">
//                         <span className="stat-label">Resolved</span>
//                         <span className="stat-value">{supportTickets.resolved}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
          
         
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReportsAnalytics;


import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, TrendingUp, Download, Calendar, Filter, RefreshCw, 
  ArrowUp, ArrowDown, DollarSign, Package, ShoppingBag, Clock, 
  Users, AlertTriangle, CheckCircle, FileText, PieChart, UserCheck, 
  ChevronDown, ChevronUp, Store, Star
} from 'lucide-react';
import { ref, onValue, query, orderByChild, limitToLast, get } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/ReportsAnalytics.css';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const ReportsAnalytics = () => {
  // Function to calculate amount without tax
  const calculateAmountWithoutTax = (order) => {
    return (order.subtotal || 0) + (order.deliveryCharge || 0);
  };

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    activeShops: 0,
    pendingDeliveries: 0,
    deliveryCompletionRate: 0,
    sentimentScore: 0,
    customerSatisfaction: 0
  });

  // State for order stats by status
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    processing: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0
  });

  // State for revenue trend data
  const [revenueTrend, setRevenueTrend] = useState([]);

  // State for support tickets data
  const [supportTickets, setSupportTickets] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    total: 0
  });

  // State for top shops
  const [topShops, setTopShops] = useState([]);

  // State for time period filter
  const [timePeriod, setTimePeriod] = useState('month');

  // State for loading
  const [isLoading, setIsLoading] = useState(true);

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    revenueMetrics: true,
    orderMetrics: true,
    customerMetrics: true,
    shopPerformance: true
  });

  // State for sentiment data
  const [sentimentData, setSentimentData] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
    sentimentOverTime: []
  });
  
  // State for export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Refs for charts
  const revenueChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  
  const orderChartRef = useRef(null);
  const orderChartInstance = useRef(null);
  
  const sentimentChartRef = useRef(null);
  const sentimentChartInstance = useRef(null);
  
  const satisfactionChartRef = useRef(null);
  const satisfactionChartInstance = useRef(null);
  
  // Ref for export dropdown menu
  const exportMenuRef = useRef(null);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Format date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-IN', options);
  };

  // Get time period label
  const getTimePeriodLabel = () => {
    switch (timePeriod) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      case 'year': return 'This Year';
      default: return 'This Week';
    }
  };

  // Handle export as PDF
  const handleExportPDF = async () => {
    const dashboardElement = document.getElementById('analytics-dashboard');
    const canvas = await html2canvas(dashboardElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`ZappCart_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Handle export as Excel
  const handleExportExcel = () => {
    try {
      // Prepare data for Excel export
      const workbook = XLSX.utils.book_new();
      
      // Dashboard Summary Sheet
      const dashboardSummary = [
        ['ZappCart Analytics Report', ''],
        ['Generated On', formatDate(new Date())],
        ['Period', getTimePeriodLabel()],
        [''],
        ['Metric', 'Value'],
        ['Total Orders', dashboardData.totalOrders],
        ['Total Revenue', formatCurrency(dashboardData.totalRevenue)],
        ['Average Order Value', formatCurrency(dashboardData.averageOrderValue)],
        ['Active Shops', dashboardData.activeShops],
        ['Pending Deliveries', dashboardData.pendingDeliveries],
        ['Delivery Completion Rate', `${dashboardData.deliveryCompletionRate.toFixed(1)}%`],
        ['Customer Satisfaction', `${dashboardData.customerSatisfaction.toFixed(1)}/5`],
        ['Sentiment Score', `${dashboardData.sentimentScore > 0 ? '+' : ''}${dashboardData.sentimentScore}%`]
      ];
      
      const dashboardSheet = XLSX.utils.aoa_to_sheet(dashboardSummary);
      XLSX.utils.book_append_sheet(workbook, dashboardSheet, 'Dashboard Summary');
      
      // Order Status Sheet
      const orderStatusData = [
        ['Order Status', 'Count'],
        ['Pending', orderStats.pending],
        ['Processing', orderStats.processing],
        ['Out for Delivery', orderStats.out_for_delivery],
        ['Delivered', orderStats.delivered],
        ['Cancelled', orderStats.cancelled]
      ];
      
      const orderStatusSheet = XLSX.utils.aoa_to_sheet(orderStatusData);
      XLSX.utils.book_append_sheet(workbook, orderStatusSheet, 'Order Status');
      
      // Top Shops Sheet
      const topShopsData = [
        ['Rank', 'Shop Name', 'Orders', 'Revenue', 'Rating']
      ];
      
      topShops.forEach((shop, index) => {
        topShopsData.push([
          index + 1,
          shop.name,
          shop.orders,
          formatCurrency(shop.revenue),
          shop.rating.toFixed(1)
        ]);
      });
      
      const topShopsSheet = XLSX.utils.aoa_to_sheet(topShopsData);
      XLSX.utils.book_append_sheet(workbook, topShopsSheet, 'Top Shops');
      
      // Revenue Trend Sheet
      const revenueTrendData = [
        ['Date', 'Revenue']
      ];
      
      revenueTrend.forEach(item => {
        revenueTrendData.push([
          formatDate(item.date),
          item.amount
        ]);
      });
      
      const revenueTrendSheet = XLSX.utils.aoa_to_sheet(revenueTrendData);
      XLSX.utils.book_append_sheet(workbook, revenueTrendSheet, 'Revenue Trend');
      
      // Sentiment Analysis Sheet
      const sentimentAnalysisData = [
        ['Sentiment', 'Percentage'],
        ['Positive', sentimentData.positive.toFixed(1) + '%'],
        ['Neutral', sentimentData.neutral.toFixed(1) + '%'],
        ['Negative', sentimentData.negative.toFixed(1) + '%']
      ];
      
      const sentimentSheet = XLSX.utils.aoa_to_sheet(sentimentAnalysisData);
      XLSX.utils.book_append_sheet(workbook, sentimentSheet, 'Sentiment Analysis');
      
      // Export to Excel file
      XLSX.writeFile(workbook, `ZappCart_Analytics_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      console.log('Excel export completed successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export Excel. Please try again.');
    }
  };

  // Handle refresh data
  const handleRefreshData = () => {
    setIsLoading(true);
    fetchDashboardData();
  };

  // Handle time period change
  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    setIsLoading(true);
    // Re-fetch data with new time period
    fetchDashboardData(period);
  };

  // Calculate date range based on time period
  const getDateRange = (period) => {
    const today = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate.setDate(today.getDate() - 7);
    }
    
    return { startDate, endDate: today };
  };

  // Function to analyze sentiment from support tickets
  const analyzeSentiment = (tickets) => {
    // Keywords for sentiment analysis
    const positiveKeywords = ['happy', 'great', 'excellent', 'good', 'satisfied', 'thanks', 'thank you', 'amazing', 'wonderful', 'perfect', 'best'];
    const negativeKeywords = ['bad', 'terrible', 'worst', 'poor', 'disappointed', 'issue', 'problem', 'delay', 'wrong', 'not good', 'refund', 'cancel', 'unhappy', 'dissatisfied'];
    
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    let sentimentOverTime = [];
    
    // Group tickets by date for sentiment over time
    const ticketsByDate = {};
    
    tickets.forEach(ticket => {
      // Skip tickets without notes
      if (!ticket.customerNote) return;
      
      const note = ticket.customerNote.toLowerCase();
      
      // Count positive and negative keywords
      const positiveCount = positiveKeywords.filter(keyword => note.includes(keyword)).length;
      const negativeCount = negativeKeywords.filter(keyword => note.includes(keyword)).length;
      
      // Determine sentiment
      let sentiment;
      if (positiveCount > negativeCount) {
        sentiment = 'positive';
        positive++;
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        negative++;
      } else {
        sentiment = 'neutral';
        neutral++;
      }
      
      // Group by date for sentiment over time
      const date = new Date(ticket.submittedAt).toISOString().split('T')[0];
      if (!ticketsByDate[date]) {
        ticketsByDate[date] = { positive: 0, negative: 0, neutral: 0, total: 0 };
      }
      
      ticketsByDate[date][sentiment]++;
      ticketsByDate[date].total++;
    });
    
    // Convert to array for chart
    sentimentOverTime = Object.keys(ticketsByDate).map(date => ({
      date,
      positive: ticketsByDate[date].positive,
      negative: ticketsByDate[date].negative,
      neutral: ticketsByDate[date].neutral,
      // Calculate sentiment score (-100 to +100)
      score: Math.round(((ticketsByDate[date].positive - ticketsByDate[date].negative) / ticketsByDate[date].total) * 100)
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const total = positive + negative + neutral;
    
    return {
      positive: total > 0 ? (positive / total) * 100 : 0,
      neutral: total > 0 ? (neutral / total) * 100 : 0,
      negative: total > 0 ? (negative / total) * 100 : 0,
      sentimentOverTime,
      // Overall sentiment score (-100 to +100)
      score: total > 0 ? Math.round(((positive - negative) / total) * 100) : 0
    };
  };

  // Fetch dashboard data from Firebase
  const fetchDashboardData = async (period = timePeriod) => {
    try {
      const { startDate, endDate } = getDateRange(period);
      
      // Fetch orders
      const ordersRef = ref(db, 'orders');
      const ordersSnapshot = await get(ordersRef);
      
      if (!ordersSnapshot.exists()) {
        setIsLoading(false);
        return;
      }
      
      const ordersData = [];
      const orderStatsByStatus = {
        pending: 0,
        processing: 0,
        out_for_delivery: 0,
        delivered: 0,
        cancelled: 0
      };
      
      let totalRevenue = 0;
      let completedOrders = 0;
      let totalOrdersInPeriod = 0;
      
      // Process orders data
      ordersSnapshot.forEach(orderSnapshot => {
        const order = { id: orderSnapshot.key, ...orderSnapshot.val() };
        
        // Convert string date to Date object for comparison
        const orderDate = new Date(order.orderDate);
        
        if (orderDate >= startDate && orderDate <= endDate) {
          ordersData.push(order);
          totalOrdersInPeriod++;
          
          // Update order stats by status
          if (orderStatsByStatus.hasOwnProperty(order.status)) {
            orderStatsByStatus[order.status]++;
          }
          
          // Calculate revenue from completed orders (without tax)
          if (order.status === 'delivered') {
            totalRevenue += calculateAmountWithoutTax(order);
            completedOrders++;
          }
        }
      });
      
      // Fetch shops
      const shopsRef = ref(db, 'shops');
      const shopsSnapshot = await get(shopsRef);
      
      const activeShops = shopsSnapshot.exists() 
        ? Object.values(shopsSnapshot.val()).filter(shop => shop.status === 'active').length 
        : 0;
      
      // Calculate shop performance for top shops
      const shopPerformance = {};
      
      if (shopsSnapshot.exists()) {
        ordersData.forEach(order => {
          if (order.vendor && order.vendor.id) {
            const vendorId = order.vendor.id;
            
            if (!shopPerformance[vendorId]) {
              // Get shop details from shops collection
              const shopData = Object.entries(shopsSnapshot.val())
                .find(([key, value]) => key === vendorId);
              
              if (shopData) {
                shopPerformance[vendorId] = {
                  id: vendorId,
                  name: shopData[1].name || 'Unknown Shop',
                  orders: 0,
                  revenue: 0,
                  rating: shopData[1].rating || 0
                };
              } else {
                shopPerformance[vendorId] = {
                  id: vendorId,
                  name: order.vendor.name || 'Unknown Shop',
                  orders: 0,
                  revenue: 0,
                  rating: order.vendor.rating || 0
                };
              }
            }
            
            shopPerformance[vendorId].orders++;
            
            if (order.status === 'delivered') {
              shopPerformance[vendorId].revenue += calculateAmountWithoutTax(order);
            }
          }
        });
      }
      
      // Sort shops by revenue and get top 5
      const topShopsList = Object.values(shopPerformance)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      
      // Fetch support tickets
      const helpRef = ref(db, 'help');
      const helpSnapshot = await get(helpRef);
      
      const supportTicketsData = {
        open: 0,
        inProgress: 0,
        resolved: 0,
        total: 0
      };
      
      const ticketsForSentiment = [];
      
      if (helpSnapshot.exists()) {
        helpSnapshot.forEach(ticketSnapshot => {
          const ticket = { id: ticketSnapshot.key, ...ticketSnapshot.val() };
          
          // Convert string date to Date object for comparison
          const ticketDate = new Date(ticket.submittedAt);
          
          if (ticketDate >= startDate && ticketDate <= endDate) {
            ticketsForSentiment.push(ticket);
            
            // Update support tickets stats by status
            supportTicketsData.total++;
            
            if (ticket.status === 'open') {
              supportTicketsData.open++;
            } else if (ticket.status === 'in-progress') {
              supportTicketsData.inProgress++;
            } else if (ticket.status === 'resolved') {
              supportTicketsData.resolved++;
            }
          }
        });
      }
      
      // Analyze sentiment from support tickets
      const sentimentResults = analyzeSentiment(ticketsForSentiment);
      
      // Calculate revenue trend by day
      const revenueTrendMap = {};
      
      ordersData.forEach(order => {
        if (order.status === 'delivered') {
          const date = new Date(order.orderDate).toISOString().split('T')[0];
          
          if (!revenueTrendMap[date]) {
            revenueTrendMap[date] = 0;
          }
          
          revenueTrendMap[date] += calculateAmountWithoutTax(order);
        }
      });
      
      // Convert to array and sort by date
      const revenueTrendData = Object.keys(revenueTrendMap).map(date => ({
        date,
        amount: revenueTrendMap[date]
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // If we have no trend data but have total revenue, create at least one data point
      if (revenueTrendData.length === 0 && totalRevenue > 0) {
        revenueTrendData.push({
          date: new Date().toISOString().split('T')[0],
          amount: totalRevenue
        });
      }
      
      console.log('Revenue trend data:', revenueTrendData);
      
      // Calculate average order value and delivery completion rate
      const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
      const pendingDeliveries = orderStatsByStatus.out_for_delivery + orderStatsByStatus.processing;
      const deliveryCompletionRate = totalOrdersInPeriod > 0 
        ? (orderStatsByStatus.delivered / (totalOrdersInPeriod - orderStatsByStatus.cancelled)) * 100 
        : 0;
      
      // Calculate customer satisfaction (mock data - in a real app would be from ratings)
      // Using a weighted calculation based on sentiment and completed orders
      const positiveSentimentWeight = sentimentResults.positive / 100;
      const customerSatisfaction = 3.5 + (positiveSentimentWeight * 1.5);
      
      // Update state with all the calculated data
      setDashboardData({
        totalOrders: totalOrdersInPeriod,
        totalRevenue,
        averageOrderValue,
        activeShops,
        pendingDeliveries,
        deliveryCompletionRate,
        sentimentScore: sentimentResults.score,
        customerSatisfaction
      });
      
      setOrderStats(orderStatsByStatus);
      setRevenueTrend(revenueTrendData);
      setSupportTickets(supportTicketsData);
      setTopShops(topShopsList);
      setSentimentData(sentimentResults);
      
      setIsLoading(false);
      
      // Update charts
      updateCharts();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  // Update all charts
  const updateCharts = () => {
    setTimeout(() => {
      updateRevenueChart();
      updateOrderChart();
      updateSentimentChart();
      updateSatisfactionChart();
    }, 100);
  };

  // Update revenue chart - MODIFIED to create a pie chart instead of line chart
  const updateRevenueChart = () => {
    if (revenueChartInstance.current) {
      revenueChartInstance.current.destroy();
    }
    
    if (!revenueChartRef.current) return;
    
    const ctx = revenueChartRef.current.getContext('2d');
    
    // Data for the pie chart based on key metrics from dashboard data
    const data = [
      dashboardData.totalOrders,             // Total Orders
      dashboardData.totalRevenue / 1000,     // Revenue (scaled down for better visualization)
      dashboardData.activeShops,             // Active Shops
      dashboardData.customerSatisfaction * 20 // Customer Satisfaction (scaled up for better visualization)
    ];
    
    revenueChartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [
          'Total Orders', 
          'Revenue (₹ thousands)', 
          'Active Shops', 
          'Customer Satisfaction'
        ],
        datasets: [{
          data: data,
          backgroundColor: [
            '#4361EE', // Blue for Total Orders
            '#2EC4B6', // Teal for Revenue
            '#FF9F1C', // Orange for Active Shops
            '#E71D36'  // Red for Customer Satisfaction
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                
                if (label.includes('Revenue')) {
                  return `${label}: ${formatCurrency(value * 1000)}`;
                } else if (label.includes('Customer Satisfaction')) {
                  return `${label}: ${(value / 20).toFixed(1)}/5`;
                }
                
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
  };

  // Update order chart
  const updateOrderChart = () => {
    if (orderChartInstance.current) {
      orderChartInstance.current.destroy();
    }
    
    if (!orderChartRef.current) return;
    
    const ctx = orderChartRef.current.getContext('2d');
    
    const labels = ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    const data = [
      orderStats.pending,
      orderStats.processing,
      orderStats.out_for_delivery,
      orderStats.delivered,
      orderStats.cancelled
    ];
    
    orderChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#FFB74D', // Pending (orange)
            '#4FC3F7', // Processing (blue)
            '#4DB6AC', // Out for Delivery (teal)
            '#66BB6A', // Delivered (green)
            '#E57373'  // Cancelled (red)
          ],
          borderWidth: 0,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  };

  // Update sentiment chart
  const updateSentimentChart = () => {
    if (sentimentChartInstance.current) {
      sentimentChartInstance.current.destroy();
    }
    
    if (!sentimentChartRef.current) return;
    
    const ctx = sentimentChartRef.current.getContext('2d');
    
    // Get sentiment over time data
    const labels = sentimentData.sentimentOverTime.map(item => formatDate(item.date));
    const data = sentimentData.sentimentOverTime.map(item => item.score);
    
    sentimentChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Sentiment Score',
          data,
          borderColor: data.every(val => val >= 0) ? '#4CAF50' : '#FF5722',
          backgroundColor: (context) => {
            const value = context.dataset.data[context.dataIndex];
            return value >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 87, 34, 0.1)';
          },
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            suggestedMin: -100,
            suggestedMax: 100,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return value + (value === 0 ? '' : '%');
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                return `Sentiment Score: ${value > 0 ? '+' : ''}${value}%`;
              }
            }
          }
        }
      }
    });
  };

  // Update satisfaction chart
  const updateSatisfactionChart = () => {
    if (satisfactionChartInstance.current) {
      satisfactionChartInstance.current.destroy();
    }
    
    if (!satisfactionChartRef.current) return;
    
    const ctx = satisfactionChartRef.current.getContext('2d');
    
    // Create doughnut chart for sentiment distribution
    satisfactionChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
          data: [
            sentimentData.positive,
            sentimentData.neutral,
            sentimentData.negative
          ],
          backgroundColor: [
            '#4CAF50', // Positive (green)
            '#FFC107', // Neutral (amber)
            '#F44336'  // Negative (red)
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw.toFixed(1);
                return `${context.label}: ${value}%`;
              }
            }
          }
        }
      }
    });
  };

  // Initialize dashboard data
  useEffect(() => {
    fetchDashboardData();
    
    // Add click outside handler for export menu
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Set up cleanup function
    return () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      if (orderChartInstance.current) {
        orderChartInstance.current.destroy();
      }
      if (sentimentChartInstance.current) {
        sentimentChartInstance.current.destroy();
      }
      if (satisfactionChartInstance.current) {
        satisfactionChartInstance.current.destroy();
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="reports-analytics">
      <div className="analytics-header">
        <div className="header-title">
          <h1>Reports & Analytics</h1>
          <div style={{top:'5px', position:'relative'}} className="gradient-line">
          <div className="gradient-segment segment-1"></div>
        </div>
        </div>
        
        <div className="header-actions">
          <div className="period-filter">
            <Calendar size={16} />
            <select 
              value={timePeriod} 
              onChange={(e) => handleTimePeriodChange(e.target.value)}
              className="period-select"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <button className="refresh-button" onClick={handleRefreshData}>
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
            Refresh Data
          </button>
          
          <div className="export-dropdown" ref={exportMenuRef}>
            <button className="export-button" onClick={() => setShowExportMenu(!showExportMenu)}>
              <Download size={16} />
              Export
              <ChevronDown size={14} />
            </button>
            {showExportMenu && (
              <div className="export-menu" style={{ 
                display: 'block', 
                position: 'absolute', 
                zIndex: 100, 
                background: '#fff', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
                borderRadius: '4px', 
                padding: '8px 0',
                right: 0,
                top: '100%',
                marginTop: '4px',
                width: '180px'
              }}>
                <button 
                  onClick={handleExportPDF} 
                  className="export-option" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '8px 16px', 
                    width: '100%', 
                    border: 'none', 
                    background: 'none', 
                    cursor: 'pointer', 
                    textAlign: 'left',
                    transition: 'background-color 0.2s',
                    hoverBackgroundColor: '#f5f5f5'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FileText size={14} style={{ marginRight: '8px' }} />
                  Export as PDF
                </button>
                <button 
                  onClick={handleExportExcel} 
                  className="export-option" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '8px 16px', 
                    width: '100%', 
                    border: 'none', 
                    background: 'none', 
                    cursor: 'pointer', 
                    textAlign: 'left',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FileText size={14} style={{ marginRight: '8px' }} />
                  Export as Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <RefreshCw size={35} className="spinning" />
          </div>
          <span>Loading analytics data...</span>
        </div>
      ) : (
        <div className="analytics-dashboard" id="analytics-dashboard">
          {/* Key Metrics Cards */}
          <div className="metrics-cards">
            <div className="metric-card total-orders">
              <div className="metric-icon">
                <Package size={20} />
              </div>
              <div className="metric-content">
                <h3 className="metric-label">Total Orders</h3>
                <p className="metric-value">{dashboardData.totalOrders}</p>
              </div>
            </div>
            
            <div className="metric-card total-revenue">
              <div className="metric-icon">
                 <span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹</span>
              </div>
              <div className="metric-content">
                <h3 className="metric-label">Total Revenue</h3>
                <p className="metric-value">{formatCurrency(dashboardData.totalRevenue)}</p>
              </div>
            </div>
          
            
            <div className="metric-card active-shops">
              <div className="metric-icon">
                <Store size={20} />
              </div>
              <div className="metric-content">
                <h3 className="metric-label">Active Shops</h3>
                <p className="metric-value">{dashboardData.activeShops}</p>
              </div>
            </div>
            
            <div className="metric-card customer-satisfaction">
              <div className="metric-icon">
                <UserCheck size={20} />
              </div>
              <div className="metric-content">
                <h3 className="metric-label">Customer Satisfaction</h3>
                <p className="metric-value">{dashboardData.customerSatisfaction.toFixed(1)}/5</p>
              </div>
            </div>
            
            
          </div>
          
          {/* Revenue Metrics Section */}
          <div className="analytics-section">
            <div className="section-header" onClick={() => toggleSection('revenueMetrics')}>
              <h2>
                <BarChart size={18} />
                Revenue Metrics
              </h2>
              {expandedSections.revenueMetrics ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>
            
            {expandedSections.revenueMetrics && (
              <div className="section-content">
                <div className="chart-container revenue-chart">
                  <h3>Key Business Metrics ({getTimePeriodLabel()})</h3>
                  <div className="chart-wrapper">
                    <canvas ref={revenueChartRef}></canvas>
                  </div>
                </div>
                
                <div className="top-shops-list">
                  <h3>Top Performing Shops</h3>
                  <div className="shops-list">
                    {topShops.length > 0 ? (
                      topShops.map((shop, index) => (
                        <div className="shop-item" key={shop.id}>
                          <div className="shop-rank">{index + 1}</div>
                          <div className="shop-info">
                            <span className="shop-name">{shop.name}</span>
                            <div className="shop-stats">
                              <span className="shop-orders">{shop.orders} orders</span>
                              <span className="shop-rating">
                                {shop.rating.toFixed(1)} <Star size={12} className="star-icon" />
                              </span>
                            </div>
                          </div>
                          <div className="shop-revenue">{formatCurrency(shop.revenue)}</div>
                        </div>
                      ))
                    ) : (
                      <p className="no-data-message">No shop data available for the selected period.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Metrics Section */}
          <div className="analytics-section">
            <div className="section-header" onClick={() => toggleSection('orderMetrics')}>
              <h2>
                <Package size={18} />
                Order Metrics
              </h2>
              {expandedSections.orderMetrics ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>
            
            {expandedSections.orderMetrics && (
              <div className="section-content">
                <div className="chart-container order-chart">
                  <h3>Orders by Status</h3>
                  <div className="chart-wrapper">
                    <canvas ref={orderChartRef}></canvas>
                  </div>
                </div>
                
                <div className="order-stats">
                  <div className="order-stat-card">
                    <h3>Delivery Performance</h3>
                    <div className="order-stat-content">
                      <div className="stat-item">
                        <span className="stat-label">Pending Deliveries</span>
                        <span className="stat-value">{dashboardData.pendingDeliveries}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Delivery Completion Rate</span>
                        <span className="stat-value">{formatPercentage(dashboardData.deliveryCompletionRate)}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Avg. Delivery Time</span>
                        <span className="stat-value">35 mins</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-stat-card">
                    <h3>Support Tickets</h3>
                    <div className="order-stat-content">
                      <div className="stat-item">
                        <span className="stat-label">Open Tickets</span>
                        <span className="stat-value">{supportTickets.open}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">In Progress</span>
                        <span className="stat-value">{supportTickets.inProgress}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Resolved</span>
                        <span className="stat-value">{supportTickets.resolved}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
         
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;