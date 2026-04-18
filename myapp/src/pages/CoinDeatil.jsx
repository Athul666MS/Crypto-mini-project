import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchChartData, fetchCoinData } from '../api/coinGecko'
import { formatMarketCap, formatPrice } from '../utils/formatter'

export default function CoinDetail() {
  const [coin, setCoin] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState([])
  const [activePoint, setActivePoint] = useState(null)
  const svgRef = useRef(null)
  const { id } = useParams()
  const navigate = useNavigate()

  const priceChange = coin?.market_data?.price_change_percentage_24h ?? 0
  const isPositive = priceChange >= 0
  const chartWidth = 680
  const chartHeight = 260
  const chartPadding = 24
  const plotAreaWidth = chartWidth - chartPadding * 2
  const plotAreaHeight = chartHeight - chartPadding * 2
  const tooltipWidth = 140
  const tooltipHeight = 44

  const loadCoinData = async () => {
    try {
      const data = await fetchCoinData(id)
      setCoin(data)
    } catch (err) {
      console.log("error happened:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadChartData = async () => {
    try {
      const data = await fetchChartData(id)
      const formattedData = data.prices.map((price) => ({
        time: new Date(price[0]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: Number(price[1].toFixed(2)),
      }))

      setChartData(formattedData)
    } catch (err) {
      console.log("error happened:", err)
    }
  }

  useEffect(() => {
    loadCoinData()
    loadChartData()
  }, [id])

  const prices = chartData.map((entry) => entry.price)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0
  const priceRange = maxPrice - minPrice || 1

  const getChartPoint = (entry, index) => {
    const x =
      chartPadding +
      (index * plotAreaWidth) / Math.max(chartData.length - 1, 1)
    const y =
      chartHeight -
      chartPadding -
      ((entry.price - minPrice) / priceRange) * plotAreaHeight

    return { x, y }
  }

  const chartPoints = chartData
    .map((entry, index) => {
      const { x, y } = getChartPoint(entry, index)
      return `${x},${y}`
    })
    .join(" ")

  const handleChartMove = (event) => {
    if (!chartData.length || !svgRef.current) return

    const svg = svgRef.current
    const bounds = svg.getBoundingClientRect()
    const pointer = event.touches?.[0] ?? event
    
    const svgX = ((pointer.clientX - bounds.left) / bounds.width) * chartWidth
    const svgY = ((pointer.clientY - bounds.top) / bounds.height) * chartHeight

    const isInsidePlotArea =
      svgX >= chartPadding &&
      svgX <= chartWidth - chartPadding &&
      svgY >= chartPadding &&
      svgY <= chartHeight - chartPadding

    if (!isInsidePlotArea) {
      setActivePoint(null)
      return
    }

    let closestIndex = 0
    let smallestDistance = Number.POSITIVE_INFINITY

    chartData.forEach((entry, index) => {
      const { x } = getChartPoint(entry, index)
      const distance = Math.abs(svgX - x)

      if (distance < smallestDistance) {
        smallestDistance = distance
        closestIndex = index
      }
    })

    const closestEntry = chartData[closestIndex]
    const { x, y } = getChartPoint(closestEntry, closestIndex)
    setActivePoint({ ...closestEntry, x, y })
  }

  const handleChartLeave = () => {
    setActivePoint(null)
  }

  const getTooltipPosition = () => {
    if (!activePoint) return { x: 0, y: 0 }

    let tooltipX = activePoint.x + 15
    let tooltipY = activePoint.y - tooltipHeight - 10

    if (tooltipX + tooltipWidth > chartWidth - chartPadding) {
      tooltipX = activePoint.x - tooltipWidth - 15
    }
    if (tooltipX < chartPadding) {
      tooltipX = chartPadding + 8
    }

    if (tooltipY < chartPadding) {
      tooltipY = activePoint.y + 20
    }
    if (tooltipY + tooltipHeight > chartHeight - chartPadding) {
      tooltipY = chartHeight - chartPadding - tooltipHeight - 8
    }

    return { x: tooltipX, y: tooltipY }
  }

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading coin data...</p>
        </div>
      </div>
    )
  }

  if (!coin) {
    return (
      <div className="app">
        <div className="no-results">
          <p>Coin not found</p>
          <button onClick={() => navigate("/")} className="back-button">Go Back</button>
        </div>
      </div>
    )
  }

  const tooltipPos = getTooltipPosition()

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>
          <button onClick={() => navigate("/")} className="back-button">← Go Back</button>
        </div>
      </header>

      <div className="coin-detail">
        <div className="coin-header">
          <div className="coin-title">
            <img src={coin.image.large} alt={coin.name} className="coin-image" />
            <div className="coin-info-text">
              <h1>{coin.name}</h1>
              <p className="symbol">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>
          <span className="rank-badge">Rank #{coin.market_cap_rank}</span>
        </div>

        <div className="coin-price-section">
          <div className="current-price">
            <h2>{formatPrice(coin.market_data.current_price.usd)}</h2>
            <span className={`change-badge ${isPositive ? "positive" : "negative"}`}>
              {isPositive ? "↑" : "↓"} {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>

          <div className="price-ranges">
            <div className="price-range">
              <span className="range-label">24h High</span>
              <span className="range-value">
                {formatPrice(coin.market_data.high_24h.usd)}
              </span>
            </div>
            <div className="price-range">
              <span className="range-label">24h Low</span>
              <span className="range-value">
                {formatPrice(coin.market_data.low_24h.usd)}
              </span>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Price Chart (7 Days)</h3>
          {chartData.length > 0 ? (
            <div className="price-chart-container">
              <div className="price-chart-wrapper">
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  width="100%"
                  height="260"
                  role="img"
                  aria-label={`${coin.name} price chart for the last 7 days`}
                  onMouseMove={handleChartMove}
                  onMouseLeave={handleChartLeave}
                  onTouchMove={handleChartMove}
                  onTouchEnd={handleChartLeave}
                  className="price-chart-svg"
                >
                  <defs>
                    <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.01" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <g className="grid-lines" opacity="0.05">
                    <line
                      x1={chartPadding}
                      y1={chartPadding}
                      x2={chartWidth - chartPadding}
                      y2={chartPadding}
                      stroke="white"
                    />
                    <line
                      x1={chartPadding}
                      y1={chartHeight / 2}
                      x2={chartWidth - chartPadding}
                      y2={chartHeight / 2}
                      stroke="white"
                    />
                    <line
                      x1={chartPadding}
                      y1={chartHeight - chartPadding}
                      x2={chartWidth - chartPadding}
                      y2={chartHeight - chartPadding}
                      stroke="white"
                    />
                  </g>

                  <line
                    x1={chartPadding}
                    y1={chartPadding}
                    x2={chartPadding}
                    y2={chartHeight - chartPadding}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={chartPadding}
                    y1={chartHeight - chartPadding}
                    x2={chartWidth - chartPadding}
                    y2={chartHeight - chartPadding}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.5"
                  />

                  <polyline
                    fill="url(#chartArea)"
                    stroke="none"
                    points={`${chartPadding},${chartHeight - chartPadding} ${chartPoints} ${chartWidth - chartPadding},${chartHeight - chartPadding}`}
                  />

                  <polyline
                    fill="none"
                    stroke="#7dd3fc"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={chartPoints}
                    filter="url(#glow)"
                    opacity="0.9"
                  />

                  {chartData.map((entry, index) => {
                    const { x, y } = getChartPoint(entry, index)
                    const isActive = activePoint?.time === entry.time && activePoint?.price === entry.price

                    return (
                      <g key={`${entry.time}-${entry.price}`} pointerEvents="none">
                        <circle
                          cx={x}
                          cy={y}
                          r="8"
                          fill="transparent"
                          pointerEvents="auto"
                          style={{ cursor: 'pointer' }}
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r={isActive ? "5.5" : "3.5"}
                          fill="#7dd3fc"
                          pointerEvents="none"
                          style={{
                            transition: 'r 0.2s ease',
                            filter: isActive ? 'drop-shadow(0 0 6px rgba(125, 211, 252, 0.8))' : 'none'
                          }}
                        />
                        {isActive && (
                          <circle
                            cx={x}
                            cy={y}
                            r="8"
                            fill="none"
                            stroke="#7dd3fc"
                            strokeWidth="1.5"
                            opacity="0.5"
                            pointerEvents="none"
                          />
                        )}
                        {(index === 0 || index === chartData.length - 1) && (
                          <text
                            x={x}
                            y={chartHeight - 4}
                            textAnchor={index === 0 ? "start" : "end"}
                            fill="rgba(255,255,255,0.6)"
                            fontSize="12"
                            fontWeight="500"
                            pointerEvents="none"
                          >
                            {entry.time}
                          </text>
                        )}
                      </g>
                    )
                  })}

                  {activePoint && (
                    <g pointerEvents="none">
                      <line
                        x1={activePoint.x}
                        y1={chartPadding}
                        x2={activePoint.x}
                        y2={chartHeight - chartPadding}
                        stroke="rgba(125, 211, 252, 0.3)"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        opacity="0.8"
                      />
                      <line
                        x1={chartPadding}
                        y1={activePoint.y}
                        x2={chartWidth - chartPadding}
                        y2={activePoint.y}
                        stroke="rgba(125, 211, 252, 0.2)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        opacity="0.6"
                      />

                      <rect
                        x={tooltipPos.x}
                        y={tooltipPos.y}
                        width={tooltipWidth}
                        height={tooltipHeight}
                        rx="12"
                        fill="rgba(15, 23, 42, 0.98)"
                        stroke="rgba(125, 211, 252, 0.5)"
                        strokeWidth="1.5"
                        filter="drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))"
                      />

                      <text
                        x={tooltipPos.x + 10}
                        y={tooltipPos.y + 16}
                        fill="#e5f6ff"
                        fontSize="12"
                        fontWeight="500"
                        pointerEvents="none"
                      >
                        {activePoint.time}
                      </text>

                      <text
                        x={tooltipPos.x + 10}
                        y={tooltipPos.y + 33}
                        fill="#7dd3fc"
                        fontSize="14"
                        fontWeight="700"
                        pointerEvents="none"
                      >
                        {formatPrice(activePoint.price)}
                      </text>
                    </g>
                  )}
                </svg>

                <div className="chart-info">
                  <span className="info-item">
                    <span className="info-label">Low</span>
                    <span className="info-value">{formatPrice(minPrice)}</span>
                  </span>
                  <span className="info-divider">•</span>
                  <span className="info-item">
                    <span className="info-label">High</span>
                    <span className="info-value">{formatPrice(maxPrice)}</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="no-chart-data">No chart data available right now.</p>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">
              ${formatMarketCap(coin.market_data.market_cap.usd)}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Volume (24h)</span>
            <span className="stat-value">
              ${formatMarketCap(coin.market_data.total_volume.usd)}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Circulating Supply</span>
            <span className="stat-value">
              {coin.market_data.circulating_supply?.toLocaleString() || "N/A"}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Total Supply</span>
            <span className="stat-value">
              {coin.market_data.total_supply?.toLocaleString() || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Data provided by CoinGecko API • Updated every 30 seconds</p>
      </footer>
    </div>
  )
}
