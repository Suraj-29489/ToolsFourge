import { useState, useMemo } from 'react';

/**
 * Placeholder hook prepared for Phase 2 search and filter capabilities.
 * @param {Array} toolsList List of tools
 * @returns {Object} Search query state and filtered tools
 */
export function useSearch(toolsList = []) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return toolsList;
    const query = searchQuery.toLowerCase().trim();
    return toolsList.filter(
      (tool) =>
        tool.title.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query) ||
        tool.id.toLowerCase().includes(query)
    );
  }, [toolsList, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredTools,
    hasResults: filteredTools.length > 0
  };
}
