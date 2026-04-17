import React from 'react'
import { formatPrice } from '../utils/formatter'

export default function CryptoCard({crypto}) {



  return (
    <div className="crypto-card">
        <div className="crypto-header">
            <div className="crypto-info">
                <img src={crypto.image}  alt={crypto.name} />
                <div>
                    <h3>{crypto.name}</h3>
                    <p className='symbol'>{crypto.symbol.toUpperCase()}</p>
                    <span className='rank'>#{formatPrice(crypto.market_cap_rank)}</span>
                </div>
            </div>
        </div>
    </div>
  )
}
