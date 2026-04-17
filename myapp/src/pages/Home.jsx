import React, { useEffect, useState } from 'react'
import { fechCryptos } from '../api/coinGecko'
import CryptoCard from '../components/CryptoCard'
export default function Home() {

    const [cryptolist,setCryptolist]=useState([])
    const [isloading,setIsloading]=useState(false)
      const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [searchQuery, setSearchQuery] = useState("");

    useEffect(()=>{
        fechCryptodata()
    },[])


const fechCryptodata = async ()=>{
   setIsloading(true)
   try{
     const data = await fechCryptos()
    setCryptolist(data)
   }catch(err){
    console.log("error happend :",err)
   }finally{
    setIsloading(false)
   }
}

  return (
    <>
    <div className="app">
               <div className="controls">
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="market_cap_rank">Rank</option>
            <option value="name">Name</option>
            <option value="price">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="change">24h Change</option>
            <option value="market_cap">Market Cap</option>
          </select>
        </div>
        <div className="view-toggle">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>
      </div>
    {isloading? <div className="loading">
        <div className="spinner">
            Loading....
        </div>
    </div>   : <div className={`crypto-container ${viewMode}`}>

  
        {
            cryptolist.map((crypto,key)=>(
                <CryptoCard key={key} crypto={crypto} />
            ))
        }
    </div> 
    
    }
    </div>
    
    
    </>
  )
}
