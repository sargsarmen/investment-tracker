// Mock data for stock prices
const stockPrices: Record<string, number> = {
  AAPL: 194.68,
  MSFT: 374.51,
  GOOGL: 133.32,
  AMZN: 147.03,
  TSLA: 234.3,
  NVDA: 487.21,
  JNJ: 155.16,
  V: 258.03,
  PG: 148.85,
  AMD: 176.52,
  INTC: 42.87,
  META: 472.22,
  DIS: 111.45,
  NFLX: 602.78,
  PYPL: 62.34,
  ADBE: 474.63,
  CSCO: 49.12,
  CRM: 273.8,
  CMCSA: 42.56,
  XOM: 113.49,
}

// Mock historical data for portfolio and benchmarks
const historicalData = {
  // Monthly data points for the last year (12 months)
  monthly: Array.from({ length: 12 }).map((_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    const monthName = date.toLocaleString("default", { month: "short" })

    // Base values with some randomness
    const basePortfolioValue = 100 + i * 3 + Math.random() * 5
    const baseSP500Value = 100 + i * 2 + Math.random() * 3
    const baseNasdaqValue = 100 + i * 2.5 + Math.random() * 4
    const baseDowValue = 100 + i * 1.8 + Math.random() * 2

    return {
      date: monthName,
      portfolio: Number.parseFloat(basePortfolioValue.toFixed(2)),
      sp500: Number.parseFloat(baseSP500Value.toFixed(2)),
      nasdaq: Number.parseFloat(baseNasdaqValue.toFixed(2)),
      dow: Number.parseFloat(baseDowValue.toFixed(2)),
    }
  }),

  // Weekly data points for the last 3 months (12 weeks)
  weekly: Array.from({ length: 12 }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (11 - i) * 7)
    const weekLabel = `Week ${i + 1}`

    // Base values with some randomness
    const basePortfolioValue = 120 + i * 1.5 + Math.random() * 3
    const baseSP500Value = 115 + i * 1 + Math.random() * 2
    const baseNasdaqValue = 118 + i * 1.2 + Math.random() * 2.5
    const baseDowValue = 112 + i * 0.9 + Math.random() * 1.8

    return {
      date: weekLabel,
      portfolio: Number.parseFloat(basePortfolioValue.toFixed(2)),
      sp500: Number.parseFloat(baseSP500Value.toFixed(2)),
      nasdaq: Number.parseFloat(baseNasdaqValue.toFixed(2)),
      dow: Number.parseFloat(baseDowValue.toFixed(2)),
    }
  }),

  // Daily data points for the last month (30 days)
  daily: Array.from({ length: 30 }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`

    // Base values with some randomness
    const basePortfolioValue = 130 + i * 0.5 + Math.random() * 1.5
    const baseSP500Value = 125 + i * 0.3 + Math.random() * 1
    const baseNasdaqValue = 128 + i * 0.4 + Math.random() * 1.2
    const baseDowValue = 122 + i * 0.25 + Math.random() * 0.8

    return {
      date: dayLabel,
      portfolio: Number.parseFloat(basePortfolioValue.toFixed(2)),
      sp500: Number.parseFloat(baseSP500Value.toFixed(2)),
      nasdaq: Number.parseFloat(baseNasdaqValue.toFixed(2)),
      dow: Number.parseFloat(baseDowValue.toFixed(2)),
    }
  }),

  // Generate 5-year monthly data with realistic market cycles
  fiveYear: generateMultiYearData(5),

  // Generate all-time (10-year) monthly data with realistic market cycles
  allTime: generateMultiYearData(10),
}

// Function to generate realistic multi-year data with market cycles
function generateMultiYearData(years: number) {
  const dataPoints = years * 12 // Monthly data points
  const result = []

  // Base starting values
  let portfolioValue = 100
  let sp500Value = 100
  let nasdaqValue = 100
  let dowValue = 100

  // Market cycle parameters
  const cycleLength = 24 // 2-year market cycle
  const upCycleLength = 16 // 16 months up, 8 months down in a typical cycle

  for (let i = 0; i < dataPoints; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - (dataPoints - 1 - i))
    const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

    // Determine if we're in an up or down cycle
    const cyclePosition = i % cycleLength
    const isUpCycle = cyclePosition < upCycleLength

    // Calculate growth rates with some randomness
    // More aggressive growth in up cycles, moderate decline in down cycles
    const portfolioGrowth = isUpCycle
      ? 1 + (0.015 + Math.random() * 0.01) // 1.5-2.5% monthly growth in up cycles
      : 1 - (0.005 + Math.random() * 0.015) // 0.5-2% monthly decline in down cycles

    const sp500Growth = isUpCycle
      ? 1 + (0.01 + Math.random() * 0.008) // 1-1.8% monthly growth in up cycles
      : 1 - (0.004 + Math.random() * 0.012) // 0.4-1.6% monthly decline in down cycles

    const nasdaqGrowth = isUpCycle
      ? 1 + (0.012 + Math.random() * 0.013) // 1.2-2.5% monthly growth in up cycles
      : 1 - (0.006 + Math.random() * 0.018) // 0.6-2.4% monthly decline in down cycles

    const dowGrowth = isUpCycle
      ? 1 + (0.008 + Math.random() * 0.007) // 0.8-1.5% monthly growth in up cycles
      : 1 - (0.003 + Math.random() * 0.01) // 0.3-1.3% monthly decline in down cycles

    // Apply growth rates
    portfolioValue *= portfolioGrowth
    sp500Value *= sp500Growth
    nasdaqValue *= nasdaqGrowth
    dowValue *= dowGrowth

    // Add market shocks occasionally (roughly once every 2-3 years)
    if (Math.random() < 0.015) {
      // ~1.5% chance each month
      const shockFactor = 0.85 + Math.random() * 0.1 // 5-15% drop
      portfolioValue *= shockFactor
      sp500Value *= shockFactor
      nasdaqValue *= shockFactor
      dowValue *= shockFactor
    }

    // Add occasional outperformance for portfolio (active management)
    if (Math.random() < 0.1) {
      // 10% chance each month
      portfolioValue *= 1 + Math.random() * 0.02 // Up to 2% outperformance
    }

    result.push({
      date: monthYear,
      portfolio: Number.parseFloat(portfolioValue.toFixed(2)),
      sp500: Number.parseFloat(sp500Value.toFixed(2)),
      nasdaq: Number.parseFloat(nasdaqValue.toFixed(2)),
      dow: Number.parseFloat(dowValue.toFixed(2)),
    })
  }

  return result
}

// Mock benchmark performance data
const benchmarkPerformance = {
  portfolio: {
    name: "Your Portfolio",
    ytd: 35.0,
    oneYear: 38.5,
    threeYear: 62.3,
    fiveYear: 112.7,
  },
  sp500: {
    name: "S&P 500",
    ytd: 20.0,
    oneYear: 22.5,
    threeYear: 45.8,
    fiveYear: 78.2,
  },
  nasdaq: {
    name: "NASDAQ",
    ytd: 32.0,
    oneYear: 35.7,
    threeYear: 58.9,
    fiveYear: 105.3,
  },
  dow: {
    name: "Dow Jones",
    ytd: 18.0,
    oneYear: 19.8,
    threeYear: 38.2,
    fiveYear: 65.7,
  },
}

// Add some random fluctuation to prices to simulate market movement
function getRandomFluctuation(basePrice: number): number {
  // Random fluctuation between -2% and +2%
  const fluctuationPercent = Math.random() * 4 - 2
  return basePrice * (1 + fluctuationPercent / 100)
}

// Mock API call to get current stock prices
export async function fetchStockPrices(symbols: string[]): Promise<Record<string, number>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // For unknown symbols, generate a random price between $10 and $500
  const result: Record<string, number> = {}

  symbols.forEach((symbol) => {
    const upperSymbol = symbol.toUpperCase()
    if (stockPrices[upperSymbol]) {
      result[upperSymbol] = Number.parseFloat(getRandomFluctuation(stockPrices[upperSymbol]).toFixed(2))
    } else {
      // Random price for unknown symbols
      result[upperSymbol] = Number.parseFloat((Math.random() * 490 + 10).toFixed(2))
    }
  })

  return result
}

// Mock API call to get portfolio data with current prices
export async function fetchPortfolioWithPrices(positions: any[]): Promise<any[]> {
  // Get all unique symbols
  const symbols = [...new Set(positions.map((position) => position.symbol.toUpperCase()))]

  // Fetch current prices
  const prices = await fetchStockPrices(symbols)

  // Update positions with current prices and calculated values
  return positions.map((position) => {
    const symbol = position.symbol.toUpperCase()
    const currentPrice = prices[symbol]
    const shares = position.shares
    const avgCost = position.avgCost

    const value = shares * currentPrice
    const gain = shares * (currentPrice - avgCost)
    const gainPercent = ((currentPrice - avgCost) / avgCost) * 100

    return {
      ...position,
      symbol,
      currentPrice,
      value,
      gain,
      gainPercent,
    }
  })
}

// Calculate allocations after getting all positions with updated values
export function calculateAllocations(positions: any[]): any[] {
  const totalValue = positions.reduce((sum, position) => sum + position.value, 0)

  return positions.map((position) => ({
    ...position,
    allocation: (position.value / totalValue) * 100,
  }))
}

// Generate historical portfolio performance data based on actual holdings
export async function generatePortfolioHistoricalData(positions: any[], timeRange = "1Y"): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Get the base historical data based on time range
  let baseData: any[]
  switch (timeRange) {
    case "1M":
      baseData = historicalData.daily.slice(-30)
      break
    case "3M":
      baseData = historicalData.weekly.slice(-12)
      break
    case "6M":
      baseData = historicalData.monthly.slice(-6)
      break
    case "5Y":
      baseData = historicalData.fiveYear
      break
    case "All":
      baseData = historicalData.allTime
      break
    case "1Y":
    default:
      baseData = historicalData.monthly
  }

  // Calculate the total current value of the portfolio
  const totalValue = positions.reduce((sum, position) => sum + position.value, 0)

  // Scale the historical data based on the current portfolio value
  // For multi-year data, we need to scale based on the end value
  const scaleFactor = totalValue / (baseData[baseData.length - 1].portfolio * 100)

  return baseData.map((dataPoint) => ({
    date: dataPoint.date,
    value: Number.parseFloat((dataPoint.portfolio * 100 * scaleFactor).toFixed(2)),
    sp500: Number.parseFloat((dataPoint.sp500 * 100 * scaleFactor * 0.8).toFixed(2)), // Assuming S&P 500 performs 80% as well
  }))
}

// Fetch benchmark comparison data
export async function fetchBenchmarkData(timeRange = "1Y"): Promise<any[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Get the base historical data based on time range
  let baseData: any[]
  switch (timeRange) {
    case "1M":
      baseData = historicalData.daily.slice(-30)
      break
    case "3M":
      baseData = historicalData.weekly.slice(-12)
      break
    case "6M":
      baseData = historicalData.monthly.slice(-6)
      break
    case "5Y":
      baseData = historicalData.fiveYear
      break
    case "All":
      baseData = historicalData.allTime
      break
    case "1Y":
    default:
      baseData = historicalData.monthly
  }

  return baseData
}

// Fetch benchmark performance metrics
export async function fetchBenchmarkPerformance(): Promise<typeof benchmarkPerformance> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  return benchmarkPerformance
}

// Calculate portfolio performance metrics
export async function calculatePortfolioPerformance(positions: any[]): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Get updated positions with current prices
  const updatedPositions = await fetchPortfolioWithPrices(positions)

  // Calculate total value and cost
  const totalValue = updatedPositions.reduce((sum, position) => sum + position.value, 0)
  const totalCost = updatedPositions.reduce((sum, position) => sum + position.avgCost * position.shares, 0)

  // Calculate returns
  const totalReturn = totalValue - totalCost
  const totalReturnPercent = (totalReturn / totalCost) * 100

  // Simulate day change (in a real app, this would come from historical data)
  const dayChange = totalValue * (Math.random() * 0.04 - 0.02) // Random between -2% and 2%
  const dayChangePercent = (dayChange / totalValue) * 100

  // Simulate YTD return (in a real app, this would come from historical data)
  const ytdReturn = totalValue * 0.15 // Assume 15% YTD return
  const ytdReturnPercent = 15.0

  // Simulate annualized return (in a real app, this would come from historical data)
  const annualizedReturnPercent = 12.5

  return {
    totalValue,
    totalCost,
    totalReturn,
    totalReturnPercent,
    dayChange,
    dayChangePercent,
    ytdReturn,
    ytdReturnPercent,
    annualizedReturnPercent,
  }
}

// S&P 500 companies mock data (partial list for demo)
const sp500Companies = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc. Class A" },
  { symbol: "GOOG", name: "Alphabet Inc. Class C" },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc. Class B" },
  { symbol: "UNH", name: "UnitedHealth Group Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "PG", name: "Procter & Gamble Co." },
  { symbol: "MA", name: "Mastercard Inc." },
  { symbol: "HD", name: "Home Depot Inc." },
  { symbol: "CVX", name: "Chevron Corporation" },
  { symbol: "MRK", name: "Merck & Co. Inc." },
  { symbol: "ABBV", name: "AbbVie Inc." },
  { symbol: "PFE", name: "Pfizer Inc." },
  { symbol: "AVGO", name: "Broadcom Inc." },
  { symbol: "COST", name: "Costco Wholesale Corporation" },
  { symbol: "BAC", name: "Bank of America Corp." },
  { symbol: "KO", name: "Coca-Cola Co." },
  { symbol: "PEP", name: "PepsiCo Inc." },
  { symbol: "TMO", name: "Thermo Fisher Scientific Inc." },
  { symbol: "CSCO", name: "Cisco Systems Inc." },
  { symbol: "ABT", name: "Abbott Laboratories" },
  { symbol: "CMCSA", name: "Comcast Corporation" },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "DHR", name: "Danaher Corporation" },
  { symbol: "MCD", name: "McDonald's Corporation" },
  { symbol: "DIS", name: "Walt Disney Co." },
  { symbol: "VZ", name: "Verizon Communications Inc." },
  { symbol: "NEE", name: "NextEra Energy Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices Inc." },
  { symbol: "TXN", name: "Texas Instruments Inc." },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "PM", name: "Philip Morris International Inc." },
  { symbol: "INTC", name: "Intel Corporation" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "QCOM", name: "QUALCOMM Inc." },
  { symbol: "T", name: "AT&T Inc." },
  { symbol: "PYPL", name: "PayPal Holdings Inc." },
  { symbol: "IBM", name: "International Business Machines Corp." },
  { symbol: "SBUX", name: "Starbucks Corporation" },
  { symbol: "BA", name: "Boeing Co." },
  { symbol: "GE", name: "General Electric Co." },
  { symbol: "F", name: "Ford Motor Co." },
  // Add more companies as needed
]

// Generate a larger list of S&P 500 companies
const generateMoreCompanies = () => {
  const industries = [
    "Technology",
    "Healthcare",
    "Financial",
    "Consumer Cyclical",
    "Energy",
    "Industrial",
    "Communication",
    "Utilities",
    "Real Estate",
    "Materials",
  ]

  const additionalCompanies = []

  for (let i = 1; i <= 450; i++) {
    const industry = industries[Math.floor(Math.random() * industries.length)]
    const symbol = `S${i.toString().padStart(3, "0")}`
    const name = `${industry} Corp ${i}`

    additionalCompanies.push({ symbol, name })
  }

  return [...sp500Companies, ...additionalCompanies]
}

const allSP500Companies = generateMoreCompanies()

// Function to search S&P 500 companies with pagination
export async function searchSP500Companies(
  query = "",
  page = 1,
  pageSize = 10,
): Promise<{ companies: typeof sp500Companies; hasMore: boolean }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter companies based on query
  const filteredCompanies = allSP500Companies.filter(
    (company) =>
      company.symbol.toLowerCase().includes(query.toLowerCase()) ||
      company.name.toLowerCase().includes(query.toLowerCase()),
  )

  // Paginate results
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex)

  return {
    companies: paginatedCompanies,
    hasMore: endIndex < filteredCompanies.length,
  }
}

// Function to get company details by symbol
export async function getCompanyDetails(symbol: string): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Find the company in our list
  const company = allSP500Companies.find((c) => c.symbol.toLowerCase() === symbol.toLowerCase())

  if (!company) {
    return null
  }

  // Generate realistic random data for the company
  const price = Number.parseFloat((50 + Math.random() * 450).toFixed(2))
  const changePercent = Number.parseFloat((Math.random() * 10 - 5).toFixed(2))
  const change = Number.parseFloat(((price * changePercent) / 100).toFixed(2))

  // Generate other realistic metrics
  const peRatio = Number.parseFloat((10 + Math.random() * 40).toFixed(1))
  const marketCapValue = Math.random() * 2000 // in billions
  const marketCap = marketCapValue >= 1000 ? `${(marketCapValue / 1000).toFixed(1)}T` : `${marketCapValue.toFixed(1)}B`

  const volumeValue = Math.random() * 100 // in millions
  const volume = `${volumeValue.toFixed(1)}M`
  const avgVolumeValue = volumeValue * (0.8 + Math.random() * 0.4)
  const avgVolume = `${avgVolumeValue.toFixed(1)}M`

  const hasDividend = Math.random() > 0.5
  const dividend = hasDividend ? Number.parseFloat((Math.random() * 5).toFixed(2)) : 0
  const dividendYield = hasDividend ? Number.parseFloat(((dividend / price) * 100).toFixed(2)) / 100 : 0

  return {
    ...company,
    price,
    change,
    changePercent,
    peRatio,
    marketCap,
    volume,
    avgVolume,
    dividend,
    dividendYield,
  }
}

