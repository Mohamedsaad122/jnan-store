import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_CATEGORIES } from '@/services/categories/categories.mock';

export interface ExtendedProductFilters {
  search: string;
  category: string; // legacy singular category
  categories: string[]; // multi-category checkbox
  brands: string[]; // multi-brand checkbox
  minPrice: number | null;
  maxPrice: number | null;
  rating: number | null;
  discount: number | null; // e.g. 10%, 20%, 30% off minimum
  inStock: boolean;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  colors: string[]; // future-ready color options
  sizes: string[]; // future-ready size options
  sort: string;
  page: number;
  view: 'grid' | 'list';
}

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL search parameters with safe defaults
  const filters = useMemo((): ExtendedProductFilters => {
    const categoriesStr = searchParams.get('categories');
    const legacyCategory = searchParams.get('category') || 'all';

    let categories: string[] = [];
    if (categoriesStr) {
      categories = categoriesStr.split(',').filter(Boolean);
    } else if (legacyCategory !== 'all') {
      categories = [legacyCategory];
    }

    const brandsStr = searchParams.get('brands') || '';
    const brands = brandsStr.split(',').filter(Boolean);

    const colorsStr = searchParams.get('colors') || '';
    const colors = colorsStr.split(',').filter(Boolean);

    const sizesStr = searchParams.get('sizes') || '';
    const sizes = sizesStr.split(',').filter(Boolean);

    return {
      search: searchParams.get('q') || '',
      category: legacyCategory,
      categories,
      brands,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : null,
      discount: searchParams.get('discount') ? Number(searchParams.get('discount')) : null,
      inStock: searchParams.get('inStock') === 'true',
      featured: searchParams.get('featured') === 'true',
      bestSeller: searchParams.get('bestSeller') === 'true',
      newArrival: searchParams.get('newArrival') === 'true',
      colors,
      sizes,
      sort: searchParams.get('sort') || 'featured',
      page: searchParams.get('page') ? Math.max(1, Number(searchParams.get('page'))) : 1,
      view: (searchParams.get('view') as 'grid' | 'list') || 'grid',
    };
  }, [searchParams]);

  // Internal helper to update URL search parameters
  const updateParams = useCallback(
    (
      newParams: Record<string, string | string[] | number | boolean | null | undefined>,
      resetPage = true
    ) => {
      const updated = new URLSearchParams(searchParams);

      // Apply updates
      Object.entries(newParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            updated.delete(key);
          } else {
            updated.set(key, value.join(','));
          }
        } else {
          if (
            value === null ||
            value === undefined ||
            value === '' ||
            value === 'all' ||
            value === 'false' ||
            value === false
          ) {
            updated.delete(key);
          } else {
            updated.set(key, String(value));
          }
        }
      });

      // Maintain legacy category singular sync
      if (newParams.categories !== undefined) {
        const catArr = newParams.categories as string[];
        if (catArr.length === 1) {
          updated.set('category', catArr[0]);
        } else {
          updated.delete('category');
        }
      }

      // Reset pagination to page 1 on filter modification
      if (resetPage) {
        updated.delete('page');
      }

      // Safeguard: only call setSearchParams if the query string actually changed
      updated.sort();
      const currentSorted = new URLSearchParams(searchParams);
      currentSorted.sort();

      if (updated.toString() !== currentSorted.toString()) {
        setSearchParams(updated, { replace: true });
      }
    },
    [searchParams, setSearchParams]
  );

  const setSearch = useCallback((q: string) => updateParams({ q }), [updateParams]);

  const setCategory = useCallback(
    (category: string) => {
      if (category === 'all') {
        updateParams({ categories: [], category: 'all' });
      } else {
        updateParams({ categories: [category] });
      }
    },
    [updateParams]
  );

  const setCategories = useCallback(
    (categories: string[]) => updateParams({ categories }),
    [updateParams]
  );

  const toggleCategory = useCallback(
    (catSlug: string) => {
      const catObj = MOCK_CATEGORIES.find((c) => c.slug === catSlug || c.id === catSlug);
      const slug = catObj ? catObj.slug : catSlug;
      const id = catObj ? catObj.id : catSlug;

      const hasCategory = filters.categories.includes(slug) || filters.categories.includes(id);

      const active = hasCategory
        ? filters.categories.filter((c) => c !== slug && c !== id)
        : [...filters.categories.filter((c) => c !== slug && c !== id), slug];

      updateParams({ categories: active });
    },
    [filters.categories, updateParams]
  );

  const setBrands = useCallback((brands: string[]) => updateParams({ brands }), [updateParams]);

  const toggleBrand = useCallback(
    (brandId: string) => {
      const active = filters.brands.includes(brandId)
        ? filters.brands.filter((b) => b !== brandId)
        : [...filters.brands, brandId];
      updateParams({ brands: active });
    },
    [filters.brands, updateParams]
  );

  const setPriceRange = useCallback(
    (min: number | null, max: number | null) => {
      updateParams({
        minPrice: min !== null ? String(min) : null,
        maxPrice: max !== null ? String(max) : null,
      });
    },
    [updateParams]
  );

  const setRating = useCallback(
    (rating: number | null) => updateParams({ rating }),
    [updateParams]
  );

  const setDiscount = useCallback(
    (discount: number | null) => updateParams({ discount }),
    [updateParams]
  );

  const setInStock = useCallback(
    (inStock: boolean) => updateParams({ inStock: inStock ? 'true' : null }),
    [updateParams]
  );

  const setFeatured = useCallback(
    (featured: boolean) => updateParams({ featured: featured ? 'true' : null }),
    [updateParams]
  );

  const setBestSeller = useCallback(
    (bestSeller: boolean) => updateParams({ bestSeller: bestSeller ? 'true' : null }),
    [updateParams]
  );

  const setNewArrival = useCallback(
    (newArrival: boolean) => updateParams({ newArrival: newArrival ? 'true' : null }),
    [updateParams]
  );

  const setColors = useCallback((colors: string[]) => updateParams({ colors }), [updateParams]);

  const toggleColor = useCallback(
    (color: string) => {
      const active = filters.colors.includes(color)
        ? filters.colors.filter((c) => c !== color)
        : [...filters.colors, color];
      updateParams({ colors: active });
    },
    [filters.colors, updateParams]
  );

  const setSizes = useCallback((sizes: string[]) => updateParams({ sizes }), [updateParams]);

  const toggleSize = useCallback(
    (size: string) => {
      const active = filters.sizes.includes(size)
        ? filters.sizes.filter((s) => s !== size)
        : [...filters.sizes, size];
      updateParams({ sizes: active });
    },
    [filters.sizes, updateParams]
  );

  const setSort = useCallback((sort: string) => updateParams({ sort }, true), [updateParams]);

  const setPage = useCallback(
    (page: number) => updateParams({ page: page > 1 ? String(page) : null }, false),
    [updateParams]
  );

  const setView = useCallback(
    (view: 'grid' | 'list') => updateParams({ view: view !== 'grid' ? view : null }, false),
    [updateParams]
  );

  const resetFilters = useCallback(() => {
    const currentParams = new URLSearchParams(searchParams);
    if (currentParams.toString() !== '') {
      setSearchParams(new URLSearchParams(), { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return {
    filters,
    setSearch,
    setCategory,
    setCategories,
    toggleCategory,
    setBrands,
    toggleBrand,
    setPriceRange,
    setRating,
    setDiscount,
    setInStock,
    setFeatured,
    setBestSeller,
    setNewArrival,
    setColors,
    toggleColor,
    setSizes,
    toggleSize,
    setSort,
    setPage,
    setView,
    resetFilters,
  };
};

export default useProductFilters;
