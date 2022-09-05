import { useEffect, useState } from 'react';
import finnHub from '../lib/api/finnhub';

type SearchResult = {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
};

type SearchResponse = {
  count: number;
  result: SearchResult[];
};

export const Autocomplete = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const renderDropdown = () => {
    const dropdownClass = results.length ? 'show' : '';

    return (
      <ul
        className={`dropdown-menu ${dropdownClass}`}
        style={{
          height: '500px',
          overflow: 'hidden scroll',
          cursor: 'pointer',
        }}
      >
        {results.map(({ description, symbol, displaySymbol }) => (
          <li key={symbol} className="dropdown-item">
            {description} ({displaySymbol})
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await finnHub.get<SearchResponse>('/search', {
          params: { q: search },
        });

        if (isMounted) {
          setResults(res.data.result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (search.length > 0) {
      fetchData();
    } else {
      setResults([]);
    }

    return () => {
      isMounted = false;
    };
  }, [search]);

  return (
    <div className="w-50 p-5 rounded mx-auto">
      <div className="form-floating dropdown">
        <input
          style={{ backgroundColor: 'rgba(145, 158, 171, .04)' }}
          id="search"
          type="text"
          className="form-control"
          placeholder="Search"
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="search">Search</label>
        {renderDropdown()}
      </div>
    </div>
  );
};
