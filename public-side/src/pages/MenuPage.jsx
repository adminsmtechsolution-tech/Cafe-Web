import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '../components/layout/SEO';
import { CategoryBar } from '../components/menu/CategoryBar';
import { FilterBar } from '../components/menu/FilterBar';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { ItemDetailModal } from '../components/menu/ItemDetailModal';
import { EmptyState } from '../components/ui/EmptyState';
import { useMenu } from '../hooks/useMenu';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'all';
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);

  const {
    categories,
    categoriesLoading,
    categoriesError,
    refetchCategories,
    activeCategory,
    setActiveCategory,
    isVegOnly,
    setIsVegOnly,
    searchQuery,
    setSearchQuery,
    menuItems,
    itemsLoading,
    itemsError,
    resetFilters,
    refetch,
  } = useMenu(categoryFromUrl);

  // Sync category state with URL parameter if it changes
  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== activeCategory) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl, activeCategory, setActiveCategory]);

  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const handleReset = () => {
    resetFilters();
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const hasActiveFilters =
    activeCategory !== 'all' || isVegOnly || searchQuery.trim().length > 0;

  return (
    <>
      <SEO
        title="Menu & Prices — Coffee, Tea, Artisan Bakes & Savories"
        description="Explore Brew & Bloom Café's handcrafted menu. Freshly brewed pour-overs, flat whites, artisanal sourdough sandwiches, and signature pastries in Pune."
      />

      {/* Header Banner */}
      <section className="bg-cream-100 pt-8 pb-6 border-b border-espresso-100">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600">
            Handcrafted with Care
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-900 mt-1 mb-2">
            The Bloom Kitchen & Brew Bar
          </h1>
          <p className="text-sm sm:text-base text-espresso-600 max-w-2xl leading-relaxed">
            All espresso shots pulled with double-certified Chikmagalur beans. Breads and viennoiserie baked fresh every dawn in our stone deck oven.
          </p>
        </div>
      </section>

      {/* Sticky Category Chips */}
      <CategoryBar
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />
      {categoriesError && !categoriesLoading && (
        <div
          role="alert"
          className="bg-white px-4 py-3 text-center text-sm text-espresso-700 border-b border-espresso-100"
        >
          Menu categories could not be loaded. {categoriesError}{' '}
          <button
            type="button"
            onClick={refetchCategories}
            className="font-semibold text-terracotta-700 underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <section className="py-8 sm:py-12 bg-cream-50 min-h-[60vh]">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters (Search & Veg Toggle) */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isVegOnly={isVegOnly}
            onToggleVeg={setIsVegOnly}
            totalItems={menuItems.length}
          />

          {/* Skeletons while loading */}
          {itemsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-espresso-100 animate-pulse space-y-3"
                >
                  <div className="aspect-[16/10] bg-espresso-200/50 rounded-xl" />
                  <div className="h-5 bg-espresso-200/60 rounded w-3/4" />
                  <div className="h-4 bg-espresso-100 rounded w-full" />
                  <div className="h-4 bg-espresso-100 rounded w-4/5" />
                  <div className="h-5 bg-espresso-200/40 rounded w-1/4 pt-2" />
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {itemsError && !itemsLoading && (
            <div className="p-8 text-center bg-white rounded-2xl border border-espresso-200">
              <p className="text-espresso-700 mb-4">{itemsError}</p>
              <button
                type="button"
                onClick={refetch}
                className="px-4 py-2 bg-espresso-800 text-cream-50 rounded-xl text-sm font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!itemsLoading && !itemsError && menuItems.length === 0 && (
            <EmptyState
              title={hasActiveFilters ? 'No delicious treats found' : 'Our menu is being updated'}
              message={
                hasActiveFilters
                  ? `We couldn't find any items matching "${searchQuery || 'your active filters'}". Try adjusting your search term or turning off the veg-only filter.`
                  : 'Our current menu is not available yet. Please check back soon.'
              }
              onReset={hasActiveFilters ? handleReset : undefined}
            />
          )}

          {/* Menu Items Grid */}
          {!itemsLoading && !itemsError && menuItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onSelect={(selected) => setSelectedItemForModal(selected)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Item Customization & Details Modal */}
      <ItemDetailModal
        item={selectedItemForModal}
        isOpen={Boolean(selectedItemForModal)}
        onClose={() => setSelectedItemForModal(null)}
      />
    </>
  );
}
