import React from 'react'
import { formatMarketCap, formatPrice } from '../utils/formatter'
import { Link } from 'react-router-dom'

export default function CryptoCard({ crypto }) {


    return (
        <Link to={`/coin/${crypto.id}`} style={{ textDecoration: "none" }}>
            <div className="crypto-card">
                <div className="crypto-header">
                    <div className="crypto-info">
                        <img src={crypto.image} alt={crypto.name} />
                        <div>
                            <h3>{crypto.name}</h3>
                            <p className='symbol'>{crypto.symbol.toUpperCase()}</p>
                            <span className='rank'>#{formatPrice(crypto.market_cap_rank)}</span>

                        </div>
                    </div>
                </div>
                <div className="crypto-price">
                    <p className={`change ${crypto.price_change_percentage_24h >= 0 ? "positive" : "negative"}`}>

                        {crypto.price_change_percentage_24h >= 0 ? "↑" : "↓"}{" "}
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}
                    </p>

                </div>
                <div className="crypto-stats">
                    <div className="stat">
                        <span className="stat-label">Market Cap</span>
                        <span className="stat-value">{formatMarketCap(crypto.market_cap)}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Volume</span>
                        <span className="stat-value">{formatMarketCap(crypto.total_volume)}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
