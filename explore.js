// explore.js - UI scaffolding for Explore Destinations page
// This script sets up event listeners and placeholder functions for UI components.
// No business logic, AI integration, or data fetching is implemented.

document.addEventListener('DOMContentLoaded', () => {
  // Search input
  const searchInput = document.getElementById('exploreSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      console.log('Search query:', e.target.value);
      // TODO: Implement live search/filtering of destination cards
    });
  }

  // Sort selector
  const sortSelect = document.getElementById('exploreSort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      console.log('Sort by:', e.target.value);
      // TODO: Implement sorting of destination cards
    });
  }

  // Region filter pills
  const regionFilters = document.getElementById('exploreRegionFilters');
  if (regionFilters) {
    regionFilters.addEventListener('click', (e) => {
      if (e.target.classList.contains('pill')) {
        // Toggle active class
        const currentlyActive = regionFilters.querySelector('.pill.active');
        if (currentlyActive) currentlyActive.classList.remove('active');
        e.target.classList.add('active');
        console.log('Region filter selected:', e.target.dataset.filter);
        // TODO: Filter destination cards by region
      }
    });
  }

  // Quiz button interactions
  const quizButtons = document.querySelectorAll('.quiz-btn');
  quizButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active state among sibling buttons
      const parent = btn.parentElement;
      parent.querySelectorAll('.quiz-btn').forEach((sibling) => sibling.classList.remove('active'));
      btn.classList.add('active');
      console.log('Quiz selection:', btn.dataset);
    });
  });

  // Quiz action buttons
  const matchBtn = document.getElementById('quizMatchBtn');
  if (matchBtn) {
    matchBtn.addEventListener('click', () => {
      console.log('Find Matches clicked');
      // TODO: Generate match results and display quizResultsPanel
    });
  }

  const resetBtn = document.getElementById('quizResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Reset all quiz selections to defaults
      document.querySelectorAll('.quiz-btn.active').forEach((el) => el.classList.remove('active'));
      // Optionally set default active buttons
      const defaultButtons = document.querySelectorAll('.quiz-btn[data-vibe="Culture"], .quiz-btn[data-cost="$$"], .quiz-btn[data-region="europe"]');
      defaultButtons.forEach((el) => el.classList.add('active'));
      console.log('Quiz reset');
    });
  }

  // Modal handling
  const cityDetailsModal = document.getElementById('cityDetailsModal');
  const closeDetailModalBtn = document.getElementById('closeDetailModal');
  if (closeDetailModalBtn) {
    closeDetailModalBtn.addEventListener('click', () => {
      cityDetailsModal.classList.remove('active');
    });
  }

  const selectTripModal = document.getElementById('selectTripModal');
  const closeSelectTripModalBtn = document.getElementById('closeSelectTripModal');
  if (closeSelectTripModalBtn) {
    closeSelectTripModalBtn.addEventListener('click', () => {
      selectTripModal.classList.remove('active');
    });
  }

  // Example: Open city details when a destination card is clicked
  const destinationGrid = document.getElementById('exploreGrid');
  if (destinationGrid) {
    destinationGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.destination-card');
      if (card) {
        console.log('Open details for', card.dataset.cityId);
        // TODO: Populate modal with card data and show it
        cityDetailsModal.classList.add('active');
      }
    });
  }

  // Add to Trip button inside details modal
  const addToTripBtn = document.getElementById('detailAddToTripBtn');
  if (addToTripBtn) {
    addToTripBtn.addEventListener('click', () => {
      console.log('Add to Trip clicked');
      // Show selectTripModal
      selectTripModal.classList.add('active');
    });
  }

  // Confirm selection in selectTripModal
  const confirmSelectTripBtn = document.getElementById('confirmSelectTripBtn');
  if (confirmSelectTripBtn) {
    confirmSelectTripBtn.addEventListener('click', () => {
      console.log('Trip stop confirmed');
      // TODO: Persist selected stop to chosen trip in localStorage
      selectTripModal.classList.remove('active');
    });
  }
});
