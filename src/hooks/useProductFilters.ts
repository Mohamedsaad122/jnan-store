import { useSearchParams } from 'react-router-dom';

export interface ExtendedProductFilters {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  rating: number | null;
  inStock: boolean;
  sort: string;
  page: number;
  view: 'grid' | 'list';
}

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL search parameters with safe defaults
  const filters: ExtendedProductFilters = {
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || 'all',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : null,
    inStock: searchParams.get('inStock') === 'true',
    sort: searchParams.get('sort') || 'featured',
    page: searchParams.get('page') ? Math.max(1, Number(searchParams.get('page'))) : 1,
    view: (searchParams.get('view') as 'grid' | 'list') || 'grid',
  };

  // Internal helper to update URL search parameters
  const updateParams = (newParams: Record<string, string | null | undefined>, resetPage = true) => {
    const updated = new URLSearchParams(searchParams);

    // Apply updates
    Object.entries(newParams).forEach(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        value === 'all' ||
        value === 'false'
      ) {
        updated.delete(key);
      } else {
        updated.set(key, value);
      }
    });

    // Reset pagination to page 1 on filter modification (standard UX practice)
    if (resetPage) {
      updated.delete('page'); // Removing page falls back to default 1
    }

    setSearchParams(updated);
  };

  const setSearch = (q: string) => {
    updateParams({ q });
  };

  const setCategory = (category: string) => {
    updateParams({ category });
  };

  const setPriceRange = (min: number | null, max: number | null) => {
    updateParams({
      minPrice: min !== null ? String(min) : null,
      maxPrice: max !== null ? String(max) : null,
    });
  };

  const setRating = (rating: number | null) => {
    updateParams({ rating: rating !== null ? String(rating) : null });
  };

  const setInStock = (inStock: boolean) => {
    updateParams({ inStock: inStock ? 'true' : null });
  };

  const setSort = (sort: string) => {
    // Sorting option changes don't necessarily require page reset, but let's keep it on page 1 for safety
    updateParams({ sort }, true);
  };

  const setPage = (page: number) => {
    updateParams({ page: page > 1 ? String(page) : null }, false);
  };

  const setView = (view: 'grid' | 'list') => {
    updateParams({ view: view !== 'grid' ? view : null }, false);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    filters,
    setSearch,
    setCategory,
    setPriceRange,
    setRating,
    setInStock,
    setSort,
    setPage,
    setView,
    resetFilters,
  };
};

export default useProductFilters;
