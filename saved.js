/**
 * GlobeTrotter — Saved Cities Page Logic (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── Lucide Icons ────────────────────────────────────────────────────────
    if (window.lucide) lucide.createIcons();

    // ── Data ─────────────────────────────────────────────────────────────────
    // Saved cities list (simulates persisted user wishlist)
    let savedCities = [
        {
            id: 'sc-1',
            name: 'Paris',
            country: 'France',
            region: 'europe',
            rating: 4.9,
            costIndex: '$$$',
            popularity: 'Top Choice',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
            tags: ['Culture', 'Gastronomy', 'Art'],
            savedDate: '2026-08-10',
            note: 'Visit during spring for the cherry blossoms near Trocadéro!'
        },
        {
            id: 'sc-2',
            name: 'Tokyo',
            country: 'Japan',
            region: 'asia',
            rating: 4.95,
            costIndex: '$$$',
            popularity: 'Trending',
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
            tags: ['Tech', 'Street Food', 'Modern'],
            savedDate: '2026-08-12',
            note: 'Shibuya crossing at night is a must-see. Book Tsukiji market tour early.'
        },
        {
            id: 'sc-3',
            name: 'Barcelona',
            country: 'Spain',
            region: 'europe',
            rating: 4.85,
            costIndex: '$$',
            popularity: 'Popular',
            image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80',
            tags: ['Beaches', 'Art', 'Nightlife'],
            savedDate: '2026-08-14',
            note: ''
        },
        {
            id: 'sc-4',
            name: 'New York',
            country: 'USA',
            region: 'americas',
            rating: 4.8,
            costIndex: '$$$',
            popularity: 'Iconic',
            image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
            tags: ['Urban', 'Culture', 'Food'],
            savedDate: '2026-08-15',
            note: ''
        },
        {
            id: 'sc-5',
            name: 'Bangkok',
            country: 'Thailand',
            region: 'asia',
            rating: 4.75,
            costIndex: '$',
            popularity: 'Budget Pick',
            image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
            tags: ['Temples', 'Nightlife', 'Street Food'],
            savedDate: '2026-08-17',
            note: 'Take the BTS Skytrain to avoid traffic. Try pad thai on Khao San Road.'
        },
        {
            id: 'sc-6',
            name: 'Cape Town',
            country: 'South Africa',
            region: 'africa',
            rating: 4.82,
            costIndex: '$$',
            popularity: 'Hidden Gem',
            image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80',
            tags: ['Nature', 'Beaches', 'Wildlife'],
            savedDate: '2026-08-19',
            note: ''
        }
    ];

    // State
    let activeFilter = 'all';
    let activeSort = 'saved-desc';
    let currentView = 'grid';
    let searchQuery = '';
    let editingCityId = null;
    let addingCityId = null;

    // ── DOM Refs ─────────────────────────────────────────────────────────────
    const savedGrid        = document.getElementById('savedGrid');
    const savedSubDesc     = document.getElementById('savedSubDesc');
    const savedCountBadge  = document.getElementById('savedCountBadge');
    const totalSavedCount  = document.getElementById('totalSavedCount');
    const totalRegionsCount = document.getElementById('totalRegionsCount');
    const totalCountriesCount = document.getElementById('totalCountriesCount');
    const filterPills      = document.getElementById('savedRegionFilters');
    const savedSort        = document.getElementById('savedSort');
    const viewToggle       = document.getElementById('viewToggle');
    const savedSearchInput = document.getElementById('savedSearchInput');
    const clearAllBtn      = document.getElementById('clearAllBtn');

    // Note Modal
    const cityNoteModal    = document.getElementById('cityNoteModal');
    const noteModalCityLabel = document.getElementById('noteModalCityLabel');
    const cityNoteTextarea = document.getElementById('cityNoteTextarea');
    const closeNoteModal   = document.getElementById('closeNoteModal');
    const cancelNoteBtn    = document.getElementById('cancelNoteBtn');
    const saveNoteBtn      = document.getElementById('saveNoteBtn');

    // Add to Trip Modal
    const addToTripModal      = document.getElementById('addToTripModal');
    const addToTripLabel      = document.getElementById('addToTripLabel');
    const closeAddToTripModal = document.getElementById('closeAddToTripModal');
    const cancelAddToTripBtn  = document.getElementById('cancelAddToTripBtn');
    const confirmAddToTripBtn = document.getElementById('confirmAddToTripBtn');

    // Sidebar Mobile Toggle
    const sidebar        = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebarBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');

    // Toast Container
    const toastContainer = document.getElementById('toastContainer');

    // ── Render ────────────────────────────────────────────────────────────────

    function getFilteredSorted() {
        let list = [...savedCities];

        // Region filter
        if (activeFilter !== 'all') {
            list = list.filter(c => c.region === activeFilter);
        }

        // Search
        if (searchQuery) {
            list = list.filter(c =>
                c.name.toLowerCase().includes(searchQuery) ||
                c.country.toLowerCase().includes(searchQuery) ||
                c.region.toLowerCase().includes(searchQuery) ||
                c.tags.some(t => t.toLowerCase().includes(searchQuery))
            );
        }

        // Sort
        switch (activeSort) {
            case 'rating-desc':
                list.sort((a, b) => b.rating - a.rating);
                break;
            case 'name-asc':
                list.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'cost-asc': {
                const costOrder = { '$': 1, '$$': 2, '$$$': 3 };
                list.sort((a, b) => costOrder[a.costIndex] - costOrder[b.costIndex]);
                break;
            }
            case 'saved-desc':
            default:
                list.sort((a, b) => new Date(b.savedDate) - new Date(a.savedDate));
                break;
        }

        return list;
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function renderCards() {
        const list = getFilteredSorted();
        savedGrid.innerHTML = '';

        // Sync description & stats
        savedSubDesc.textContent = `Showing ${list.length} of ${savedCities.length} saved cities`;
        savedCountBadge.textContent = savedCities.length;
        totalSavedCount.textContent = savedCities.length;
        const regions  = new Set(savedCities.map(c => c.region));
        const countries = new Set(savedCities.map(c => c.country));
        totalRegionsCount.textContent  = regions.size;
        totalCountriesCount.textContent = countries.size;

        if (list.length === 0) {
            savedGrid.innerHTML = `
                <div class="saved-empty-state">
                    <div class="empty-icon-ring">
                        <i data-lucide="heart-off"></i>
                    </div>
                    <h3>No saved cities found</h3>
                    <p>Try adjusting your filters or search query, or explore new destinations to add to your wishlist.</p>
                    <a href="explore.html" class="btn btn-primary" style="margin-top:4px;">
                        <i data-lucide="compass"></i> Explore Destinations
                    </a>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        list.forEach(city => {
            const noteHTML = city.note
                ? `<div class="saved-card-note">
                       <i data-lucide="sticky-note"></i>
                       <span>${city.note}</span>
                   </div>`
                : '';

            const tagsHTML = city.tags.map(t => `<span class="tag-chip">${t}</span>`).join('');

            const card = document.createElement('article');
            card.className = 'saved-city-card';
            card.dataset.id = city.id;
            card.innerHTML = `
                <div class="saved-card-image">
                    <img src="${city.image}" alt="${city.name}" loading="lazy">
                    <button class="unsave-btn" data-id="${city.id}" title="Remove from saved">
                        <i data-lucide="heart"></i>
                    </button>
                    <div class="card-rating-badge">
                        <i data-lucide="star"></i>
                        <span>${city.rating}</span>
                    </div>
                    <span class="card-region-tag">${capitalise(city.region)}</span>
                </div>

                <div class="saved-card-body">
                    <div class="saved-card-top">
                        <div>
                            <h3 class="saved-city-name">${city.name}</h3>
                            <p class="saved-city-country">${city.country}</p>
                        </div>
                        <span class="saved-date-added">Saved ${formatDate(city.savedDate)}</span>
                    </div>

                    <div class="saved-card-tags">${tagsHTML}</div>

                    ${noteHTML}

                    <div class="saved-card-meta">
                        <span class="meta-cost">Cost: ${city.costIndex}</span>
                        <span class="meta-popularity">${city.popularity}</span>
                    </div>

                    <div class="saved-card-actions">
                        <button class="btn btn-secondary note-btn" data-id="${city.id}" title="Add notes">
                            <i data-lucide="sticky-note" style="width:13px;height:13px;"></i>
                            Notes
                        </button>
                        <button class="btn btn-primary trip-btn" data-id="${city.id}" title="Add to trip">
                            <i data-lucide="plus-circle" style="width:13px;height:13px;"></i>
                            Add to Trip
                        </button>
                    </div>
                </div>
            `;
            savedGrid.appendChild(card);
        });

        if (window.lucide) lucide.createIcons();
    }

    function capitalise(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ── Interactions ──────────────────────────────────────────────────────────

    // Region filter pills
    filterPills.addEventListener('click', e => {
        const pill = e.target.closest('.pill');
        if (!pill) return;
        filterPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.dataset.filter;
        renderCards();
    });

    // Sort
    savedSort.addEventListener('change', () => {
        activeSort = savedSort.value;
        renderCards();
    });

    // View toggle
    viewToggle.addEventListener('click', e => {
        const btn = e.target.closest('.view-btn');
        if (!btn) return;
        viewToggle.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        if (currentView === 'list') {
            savedGrid.classList.add('list-view');
        } else {
            savedGrid.classList.remove('list-view');
        }
    });

    // Search
    savedSearchInput.addEventListener('input', e => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderCards();
    });

    // Keyboard shortcut Ctrl/Cmd+K
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            savedSearchInput.focus();
        }
    });

    // Clear All
    clearAllBtn.addEventListener('click', () => {
        if (savedCities.length === 0) return;
        if (confirm('Remove all saved cities from your wishlist?')) {
            savedCities = [];
            renderCards();
            showToast('All saved cities removed.');
        }
    });

    // Delegated clicks on cards (unsave / note / add-to-trip)
    savedGrid.addEventListener('click', e => {
        // Unsave
        const unsaveBtn = e.target.closest('.unsave-btn');
        if (unsaveBtn) {
            const id = unsaveBtn.dataset.id;
            const city = savedCities.find(c => c.id === id);
            savedCities = savedCities.filter(c => c.id !== id);
            renderCards();
            showToast(`${city?.name || 'City'} removed from saved list.`);
            return;
        }

        // Note
        const noteBtn = e.target.closest('.note-btn');
        if (noteBtn) {
            const id = noteBtn.dataset.id;
            const city = savedCities.find(c => c.id === id);
            if (!city) return;
            editingCityId = id;
            noteModalCityLabel.textContent = `Notes for ${city.name}, ${city.country}`;
            cityNoteTextarea.value = city.note || '';
            openModal(cityNoteModal);
            return;
        }

        // Add to trip
        const tripBtn = e.target.closest('.trip-btn');
        if (tripBtn) {
            const id = tripBtn.dataset.id;
            const city = savedCities.find(c => c.id === id);
            if (!city) return;
            addingCityId = id;
            addToTripLabel.textContent = `Adding ${city.name} to an itinerary`;
            openModal(addToTripModal);
        }
    });

    // ── Note Modal ────────────────────────────────────────────────────────────
    closeNoteModal.addEventListener('click', () => closeModalEl(cityNoteModal));
    cancelNoteBtn.addEventListener('click', () => closeModalEl(cityNoteModal));
    cityNoteModal.addEventListener('click', e => { if (e.target === cityNoteModal) closeModalEl(cityNoteModal); });

    saveNoteBtn.addEventListener('click', () => {
        const city = savedCities.find(c => c.id === editingCityId);
        if (city) {
            city.note = cityNoteTextarea.value.trim();
            renderCards();
            showToast(`Notes saved for ${city.name}!`);
        }
        closeModalEl(cityNoteModal);
    });

    // ── Add to Trip Modal ─────────────────────────────────────────────────────
    closeAddToTripModal.addEventListener('click', () => closeModalEl(addToTripModal));
    cancelAddToTripBtn.addEventListener('click', () => closeModalEl(addToTripModal));
    addToTripModal.addEventListener('click', e => { if (e.target === addToTripModal) closeModalEl(addToTripModal); });

    confirmAddToTripBtn.addEventListener('click', () => {
        const city = savedCities.find(c => c.id === addingCityId);
        const tripSelect = document.getElementById('tripSelectDropdown');
        const tripName = tripSelect.options[tripSelect.selectedIndex]?.text.split(' (')[0];
        if (city) {
            showToast(`${city.name} added to "${tripName}"!`);
        }
        closeModalEl(addToTripModal);
    });

    // ── Sidebar Mobile ────────────────────────────────────────────────────────
    if (openSidebarBtn) openSidebarBtn.addEventListener('click', () => sidebar.classList.add('open'));
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));

    // ── Modal Helpers ─────────────────────────────────────────────────────────
    function openModal(el) {
        el.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.lucide) lucide.createIcons();
    }

    function closeModalEl(el) {
        el.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // ── Toast ─────────────────────────────────────────────────────────────────
    window.showToast = function (message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        const icon = type === 'error' ? 'alert-circle' : 'check-circle';
        toast.innerHTML = `
            <i data-lucide="${icon}" class="toast-icon" style="width:18px;height:18px;"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // ── Initial render ────────────────────────────────────────────────────────
    renderCards();
});
