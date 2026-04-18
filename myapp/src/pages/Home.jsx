import React, { useEffect, useState } from 'react'
import { fechCryptos } from '../api/coinGecko'
import CryptoCard from '../components/CryptoCard'

export default function Home() {
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCryptoData();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [sortBy, cryptoList, searchQuery]);

  // ✅ Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const fetchCryptoData = async () => {
    try {
      const data = await fechCryptos();
      setCryptoList(data);
    } catch (err) {
      console.log("error happened:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = cryptoList.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.current_price - b.current_price;
        case "price_desc":
          return b.current_price - a.current_price;
        case "change":
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        case "market_cap":
          return a.market_cap - b.market_cap;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });

    setFilteredList(filtered);
  };

  // ✅ Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search cryptos..."
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>
      </header>

      {/* CONTROLS */}
      <div className="controls">
        <div className="filter-group">
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
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
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid View"
          >
            ⊞ Grid
          </button>
          <button
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List View"
          >
            ≡ List
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading cryptos...</p>
        </div>
      ) : (
        <>
          <div className={`crypto-container ${viewMode}`}>
            {currentItems.length > 0 ? (
              currentItems.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))
            ) : (
              <div className="no-results">
                <p>No cryptocurrencies found matching your search.</p>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {filteredList.length > itemsPerPage && (
            <div className="pagination-container">
              <div className="pagination">
                <button
                  className="pagination-btn pagination-prev"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  title="Previous Page"
                >
                  ← Prev
                </button>

                <div className="pagination-info">
                  <span className="page-number">Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
                  <span className="items-info">({indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredList.length)} of {filteredList.length})</span>
                </div>

                <button
                  className="pagination-btn pagination-next"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  title="Next Page"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <p>Data provided by CoinGecko API • Updated every 30 seconds</p>
      </footer>
    </div>
  );
}
