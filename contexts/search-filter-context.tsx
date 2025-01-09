'use client';

import React, { createContext, useContext, useState } from 'react';

interface SearchFilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

const SearchFilterContext = createContext<SearchFilterContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  selectedFilter: 'all',
  setSelectedFilter: () => {},
});

export function SearchFilterProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  return (
    <SearchFilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedFilter,
        setSelectedFilter,
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
}

export function useSearchFilter() {
  const context = useContext(SearchFilterContext);
  if (context === undefined) {
    throw new Error('useSearchFilter must be used within a SearchFilterProvider');
  }
  return context;
}
