import React, { useEffect, useState } from 'react'
import { fechCryptos } from '../api/coinGecko'
import CryptoCard from '../components/CryptoCard'
export default function Home() {

    const [cryptolist,setCryptolist]=useState([])
    const [isloading,setIsloading]=useState(false)
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
    {isloading? <div className="loading">
        <div className="spinner">
            Loading....
        </div>
    </div>   : <div className='crypto-container'>
        {
            cryptolist.map((crypto,key)=>(
                <CryptoCard key={key} crypto={crypto} />
            ))
        }
    </div>    }
    </div>
    
    
    </>
  )
}
