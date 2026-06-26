export interface MetricItem {
  id: string
  label: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  iconName: string
  trendDescription: string
}

export interface DailySales {
  day: string
  amount: number
  salesCount: number
}

export interface RecentSale {
  id: string
  client: string
  date: string
  status: 'Concluído' | 'Pendente'
  value: number
}

export interface DashboardGeralData {
  metrics: MetricItem[]
  weeklySales: DailySales[]
  recentSales: RecentSale[]
}
