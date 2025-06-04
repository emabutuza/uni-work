import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Dimensions, 
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  Divider, 
  IconButton, 
  useTheme,
  ActivityIndicator
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FlowerService } from '../services/FlowerService';
import { Flower, Order } from '../models/Flower';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { AdminDashboardScreenProps } from '../navigation/types';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation }: AdminDashboardScreenProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState([0, 0, 0, 0, 0, 0]);
  const [categoryData, setCategoryData] = useState([
    { name: 'Bestsellers', count: 0, color: '#FF6384' },
    { name: 'Specials', count: 0, color: '#36A2EB' },
    { name: 'New', count: 0, color: '#FFCE56' }
  ]);
  const [eventData, setEventData] = useState([
    { name: 'Wedding', count: 0, color: '#FF6384' },
    { name: 'Anniversaries', count: 0, color: '#36A2EB' },
    { name: 'Holidays', count: 0, color: '#FFCE56' },
    { name: 'Other', count: 0, color: '#4BC0C0' }
  ]);
  
  // Generate random sales data for demonstration
  const generateSalesData = useCallback(() => {
    // Generate random sales data for the last 6 months
    const newSalesData = Array(6).fill(0).map(() => Math.floor(Math.random() * 5000) + 1000);
    setSalesData(newSalesData);
  }, []);
  
  // Load data 
  const loadData = useCallback(async () => {
    setLoading(true);
    
    try {
      // Get flowers - now using async/await since the service is now Promise-based
      const allFlowers = await FlowerService.getFlowers({}, undefined, true);
      console.log(`Admin dashboard loaded ${allFlowers.length} flowers`);
      setFlowers(allFlowers);
      
      // Get orders
      const allOrders = FlowerService.getOrders();
      setOrders(allOrders);
      
      // Calculate category stats
      const categoryStats = [
        { name: 'Bestsellers', count: 0, color: '#FF6384' },
        { name: 'Specials', count: 0, color: '#36A2EB' },
        { name: 'New', count: 0, color: '#FFCE56' }
      ];
      
      if (allFlowers && allFlowers.length > 0) {
        allFlowers.forEach(flower => {
          if (flower && flower.category) {
            const index = categoryStats.findIndex(cat => cat.name === flower.category);
            if (index !== -1) {
              categoryStats[index].count++;
            }
          }
        });
      }
      
      setCategoryData(categoryStats);
      
      // Calculate event stats
      const eventStats = [
        { name: 'Wedding', count: 0, color: '#FF6384' },
        { name: 'Anniversaries', count: 0, color: '#36A2EB' },
        { name: 'Holidays', count: 0, color: '#FFCE56' },
        { name: 'Other', count: 0, color: '#4BC0C0' }
      ];
      
      if (allFlowers && allFlowers.length > 0) {
        allFlowers.forEach(flower => {
          if (flower && flower.event) {
            const index = eventStats.findIndex(evt => evt.name === flower.event);
            if (index !== -1) {
              eventStats[index].count++;
            }
          }
        });
      }
      
      setEventData(eventStats);
      
      // Generate random sales data (in a real app, this would come from the backend)
      generateSalesData();
    } catch (error) {
      console.error("Error loading admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [generateSalesData]);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);
  
  // Auto-refresh data every 10 seconds for real-time updates
  useEffect(() => {
    loadData();
    
    const interval = setInterval(() => {
      // Regenerate sales data periodically to simulate real-time updates
      generateSalesData();
      
      // In a real app, you would fetch fresh data from the server here
    }, 10000);
    
    return () => clearInterval(interval);
  }, [loadData, generateSalesData]);
  
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };
  
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: salesData,
        color: (opacity = 1) => `rgba(255, 152, 183, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Monthly Sales']
  };
  
  const pieChartData = categoryData.filter(item => item.count > 0).map(item => ({
    name: item.name,
    count: item.count,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  }));
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading dashboard data...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Button 
          mode="contained" 
          icon="flower" 
          onPress={() => navigation.navigate('AdminFlowerList')}
        >
          Manage Flowers
        </Button>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryCards}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Ionicons name="flower" size={24} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>Flowers</Text>
              </View>
              <Text style={styles.cardValue}>{flowers.length}</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.summaryCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Ionicons name="cart" size={24} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>Orders</Text>
              </View>
              <Text style={styles.cardValue}>{orders.length}</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.summaryCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Ionicons name="cash" size={24} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>Revenue</Text>
              </View>
              <Text style={styles.cardValue}>
                ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
              </Text>
            </Card.Content>
          </Card>
        </View>
        
        {/* Sales Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>Monthly Sales</Text>
            <LineChart
              data={lineChartData}
              width={width - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
        
        {/* Category Distribution Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>Flowers by Category</Text>
            {pieChartData.length > 0 ? (
              <PieChart
                data={pieChartData}
                width={width - 64}
                height={220}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text>No category data available</Text>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Event Distribution */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>Flowers by Event</Text>
            <BarChart
              data={{
                labels: eventData.map(item => item.name),
                datasets: [{
                  data: eventData.map(item => item.count)
                }]
              }}
              width={width - 64}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(255, 152, 183, ${opacity})`,
              }}
              style={styles.chart}
              showValuesOnTopOfBars
              withInnerLines={false}
              yAxisLabel=""
              yAxisSuffix=""
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  chartCard: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 