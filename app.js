/**
 * GlobeTrotter — Dashboard Application Logic (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Initial Data state for Dashboard
    let trips = [
        {
            id: 'trip-1',
            title: 'Euro Summer Odyssey',
            startDate: '2026-09-05',
            endDate: '2026-09-18',
            durationDays: 14,
            status: 'Upcoming',
            badgeClass: 'badge-emerald',
            thumbImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
            cities: ['Paris', 'Amsterdam', 'Rome'],
            spentBudget: 2850,
            totalBudget: 3500,
            activitiesCount: 18
        },
        {
            id: 'trip-2',
            title: 'Japan Sakura & Alpine Trail',
            startDate: '2026-10-10',
            endDate: '2026-10-22',
            durationDays: 12,
            status: 'Planning',
            badgeClass: 'badge-amber',
            thumbImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
            cities: ['Tokyo', 'Kyoto', 'Osaka'],
            spentBudget: 1100,
            totalBudget: 4000,
            activitiesCount: 12
        },
        {
            id: 'trip-3',
            title: 'Bali Tropical Island Escape',
            startDate: '2026-12-01',
            endDate: '2026-12-10',
            durationDays: 10,
            status: 'Draft',
            badgeClass: 'badge-purple',
            thumbImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
            cities: ['Ubud', 'Seminyak', 'Nusa Penida'],
            spentBudget: 300,
            totalBudget: 1800,
            activitiesCount: 6
        }
    ];

    const popularCities = [
        {
            id: 'city-1',
            name: 'Paris',
            country: 'France',
            region: 'europe',
            rating: 4.9,
            costIndex: '$$$',
            popularity: 'Top Choice',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80',
            tags: ['Culture', 'Gastronomy']
        },
        {
            id: 'city-2',
            name: 'Tokyo',
            country: 'Japan',
            region: 'asia',
            rating: 4.95,
            costIndex: '$$$',
            popularity: 'Trending',
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=500&q=80',
            tags: ['Tech', 'Street Food']
        },
        {
            id: 'city-3',
            name: 'Rome',
            country: 'Italy',
            region: 'europe',
            rating: 4.8,
            costIndex: '$$',
            popularity: 'Historical',
            image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=80',
            tags: ['History', 'Architecture']
        },
        {
            id: 'city-4',
            name: 'Bangkok',
            country: 'Thailand',
            region: 'asia',
            rating: 4.75,
            costIndex: '$',
            popularity: 'Budget Pick',
            image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=500&q=80',
            tags: ['Nightlife', 'Temples']
        },
        {
            id: 'city-5',
            name: 'Barcelona',
            country: 'Spain',
            region: 'europe',
            rating: 4.85,
            costIndex: '$$',
            popularity: 'Popular',
            image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=500&q=80',
            tags: ['Beaches', 'Art']
        },
        {
            id: 'city-6',
            name: 'Kyoto',
            country: 'Japan',
            region: 'asia',
            rating: 4.92,
            costIndex: '$$',
            popularity: 'Cultural',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80',
            tags: ['Nature', 'Heritage']
        }
    ];

    // DOM Elements
    const tripsContainer = document.getElementById('recentTripsContainer');
    const destinationsGrid = document.getElementById('destinationsGrid');
    const tripCountBadge = document.getElementById('tripCountBadge');
    const feedbackTripSelect = document.getElementById('feedbackTrip');
    const tripFeedbackForm = document.getElementById('tripFeedbackForm');
    const ratingPicker = document.getElementById('ratingPicker');

    // Modal Elements
    const createTripModal = document.getElementById('createTripModal');
    const openCreateTripModalBtn = document.getElementById('openCreateTripModal');
    const heroPlanBtn = document.getElementById('heroPlanBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const createTripForm = document.getElementById('createTripForm');

    // Sidebar Mobile Toggle
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebarBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');

    // Filter Pills
    const filterPillsContainer = document.getElementById('cityFilterPills');

    // Global Search
    const globalSearchInput = document.getElementById('globalSearchInput');

    // Toast Container
    const toastContainer = document.getElementById('toastContainer');

    /* --------------------------------------------------------------------------
       Render Functions
       -------------------------------------------------------------------------- */

    function renderTrips(tripsToRender = trips) {
        tripsContainer.innerHTML = '';

        if (tripsToRender.length === 0) {
            tripsContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; background: var(--bg-surface); border: 1px dashed var(--border-glass); border-radius: var(--radius-lg); color: var(--text-muted);">
                    <i data-lucide="map-pin-off" style="width: 36px; height: 36px; margin-bottom: 10px; color: var(--text-dim);"></i>
                    <p style="font-weight: 600;">No matching trips found.</p>
                    <button class="btn btn-primary" style="margin-top: 14px;" id="emptyCreateBtn">
                        <i data-lucide="plus"></i> Plan a Trip Now
                    </button>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            const emptyCreateBtn = document.getElementById('emptyCreateBtn');
            if (emptyCreateBtn) emptyCreateBtn.addEventListener('click', openModal);
            return;
        }

        tripsToRender.forEach(trip => {
            const budgetPercent = Math.min(100, Math.round((trip.spentBudget / trip.totalBudget) * 100));

            const cardHTML = `
                <article class="trip-card">
                    <div class="trip-thumb">
                        <img src="${trip.thumbImage}" alt="${trip.title}">
                        <span class="badge ${trip.badgeClass} trip-thumb-badge">${trip.status}</span>
                    </div>
                    
                    <div class="trip-details">
                        <div class="trip-header">
                            <div>
                                <h3 class="trip-title">${trip.title}</h3>
                                <div class="trip-meta-row">
                                    <div class="trip-meta-item">
                                        <i data-lucide="calendar" style="width:14px; height:14px;"></i>
                                        <span>${formatDateRange(trip.startDate, trip.endDate)}</span>
                                    </div>
                                    <div class="trip-meta-item">
                                        <i data-lucide="clock" style="width:14px; height:14px;"></i>
                                        <span>${trip.durationDays} Days</span>
                                    </div>
                                </div>
                            </div>
                            <button class="icon-btn" title="Options">
                                <i data-lucide="more-vertical" style="width:16px; height:16px;"></i>
                            </button>
                        </div>

                        <div class="trip-cities-pills">
                            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Stops:</span>
                            ${trip.cities.map(c => `
                                <span class="city-pill">
                                    <i data-lucide="map-pin" style="width:12px; height:12px; color:var(--primary);"></i>
                                    ${c}
                                </span>
                            `).join('')}
                        </div>

                        <div class="trip-footer">
                            <div class="trip-budget-progress">
                                <div class="budget-text">
                                    <span>Budget: <strong>$${trip.spentBudget.toLocaleString()}</strong> / $${trip.totalBudget.toLocaleString()}</span>
                                    <span>${budgetPercent}%</span>
                                </div>
                                <div class="budget-bar-bg">
                                    <div class="budget-bar-fill" style="width: ${budgetPercent}%; background: ${budgetPercent > 90 ? 'var(--accent-rose)' : 'var(--gradient-brand)'};"></div>
                                </div>
                            </div>

                            <div class="trip-actions">
                                <button class="btn btn-secondary" onclick="showToast('Loading Itinerary View...')">
                                    <i data-lucide="eye" style="width:14px; height:14px;"></i> View
                                </button>
                                <button class="btn btn-primary" onclick="showToast('Opening Itinerary Builder...')">
                                    <i data-lucide="edit-3" style="width:14px; height:14px;"></i> Edit Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
            tripsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        if (window.lucide) lucide.createIcons();
        if (tripCountBadge) tripCountBadge.textContent = trips.length;
    }

    function populateFeedbackTrips() {
        if (!feedbackTripSelect) return;

        feedbackTripSelect.innerHTML = '<option value="">Select a trip</option>';

        trips.forEach(trip => {
            const option = document.createElement('option');
            option.value = trip.title;
            option.textContent = trip.title;
            feedbackTripSelect.appendChild(option);
        });
    }

    function setActiveRating(rating) {
        if (!ratingPicker) return;

        const stars = ratingPicker.querySelectorAll('.rating-star');
        stars.forEach(star => {
            const starValue = Number(star.dataset.rating);
            star.classList.toggle('active', starValue <= rating);
        });
    }

    function renderDestinations(filter = 'all', searchQuery = '') {
        destinationsGrid.innerHTML = '';

        let filtered = popularCities.filter(city => {
            const matchesFilter = (filter === 'all') ||
                (filter === 'europe' && city.region === 'europe') ||
                (filter === 'asia' && city.region === 'asia') ||
                (filter === 'budget' && city.costIndex === '$');

            const matchesSearch = city.name.toLowerCase().includes(searchQuery) ||
                city.country.toLowerCase().includes(searchQuery) ||
                city.tags.some(t => t.toLowerCase().includes(searchQuery));

            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            destinationsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 30px; text-align: center; color: var(--text-muted);">
                    No destinations matching your criteria.
                </div>
            `;
            return;
        }

        filtered.forEach(city => {
            const cardHTML = `
                <div class="city-card">
                    <div class="city-card-image">
                        <img src="${city.image}" alt="${city.name}">
                        <div class="city-rating">
                            <i data-lucide="star" style="width:12px; height:12px; fill:var(--accent-amber);"></i>
                            <span>${city.rating}</span>
                        </div>
                    </div>
                    <div class="city-card-body">
                        <div>
                            <h4 class="city-name">${city.name}</h4>
                            <p class="city-country">${city.country}</p>
                            
                            <div class="city-meta-tags">
                                <span class="cost-index">Index: ${city.costIndex}</span>
                                <span class="popularity-tag">${city.popularity}</span>
                            </div>
                        </div>

                        <button class="add-city-btn" onclick="addCityToUpcomingTrip('${city.name}')">
                            <i data-lucide="plus-circle" style="width:14px; height:14px;"></i> Add to Trip
                        </button>
                    </div>
                </div>
            `;
            destinationsGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

        if (window.lucide) lucide.createIcons();
    }

    /* --------------------------------------------------------------------------
       Modal Controls
       -------------------------------------------------------------------------- */
    function openModal() {
        createTripModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        createTripModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        createTripForm.reset();
    }

    if (openCreateTripModalBtn) openCreateTripModalBtn.addEventListener('click', openModal);
    if (heroPlanBtn) heroPlanBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    createTripModal.addEventListener('click', (e) => {
        if (e.target === createTripModal) closeModal();
    });

    /* --------------------------------------------------------------------------
       Create Trip Submission
       -------------------------------------------------------------------------- */
    createTripForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('tripTitle').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const budget = parseInt(document.getElementById('initialBudget').value) || 2500;
        const coverTheme = document.getElementById('coverImage').value;

        // Image map based on theme selection
        const imageMap = {
            europe: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
            asia: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
            tropical: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
            adventure: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
        };

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 7;

        const newTrip = {
            id: 'trip-' + (trips.length + 1),
            title: title,
            startDate: startDate,
            endDate: endDate,
            durationDays: diffDays,
            status: 'Planning',
            badgeClass: 'badge-amber',
            thumbImage: imageMap[coverTheme] || imageMap.europe,
            cities: ['Destination Pending'],
            spentBudget: 0,
            totalBudget: budget,
            activitiesCount: 0
        };

        trips.unshift(newTrip);
        renderTrips();
        closeModal();
        showToast(`Trip "${title}" created successfully!`);
    });

    /* --------------------------------------------------------------------------
       Filters & Search
       -------------------------------------------------------------------------- */
    if (ratingPicker) {
        ratingPicker.addEventListener('click', (event) => {
            const star = event.target.closest('.rating-star');
            if (!star) return;

            const selectedRating = Number(star.dataset.rating);
            setActiveRating(selectedRating);
        });
    }

    if (tripFeedbackForm) {
        tripFeedbackForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const tripName = feedbackTripSelect.value;
            const feedbackMessage = document.getElementById('feedbackMessage').value.trim();
            const rating = Array.from(ratingPicker.querySelectorAll('.rating-star')).filter(star => star.classList.contains('active')).length;

            if (!tripName || !feedbackMessage) {
                showToast('Please select a trip and add your feedback before submitting.');
                return;
            }

            showToast(`Feedback submitted for ${tripName}! Thanks for sharing your trip review.`);
            tripFeedbackForm.reset();
            setActiveRating(4);
        });
    }

    if (filterPillsContainer) {
        filterPillsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('pill')) {
                document.querySelectorAll('.filter-pills .pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                const filter = e.target.getAttribute('data-filter');
                renderDestinations(filter, globalSearchInput.value.trim().toLowerCase());
            }
        });
    }

    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();

            // Filter trips
            const filteredTrips = trips.filter(t =>
                t.title.toLowerCase().includes(query) ||
                t.cities.some(c => c.toLowerCase().includes(query))
            );
            renderTrips(filteredTrips);

            // Filter destinations
            const activePill = document.querySelector('.filter-pills .pill.active');
            const activeFilter = activePill ? activePill.getAttribute('data-filter') : 'all';
            renderDestinations(activeFilter, query);
        });
    }

    /* --------------------------------------------------------------------------
       Sidebar Mobile Navigation
       -------------------------------------------------------------------------- */
    if (openSidebarBtn) {
        openSidebarBtn.addEventListener('click', () => sidebar.classList.add('open'));
    }
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));
    }

    /* --------------------------------------------------------------------------
       Helper Utilities & Global Exports
       -------------------------------------------------------------------------- */
    function formatDateRange(startStr, endStr) {
        const start = new Date(startStr);
        const end = new Date(endStr);
        const options = { month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${end.getFullYear()}`;
    }

    window.showToast = function (message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i data-lucide="check-circle" class="toast-icon" style="width:18px; height:18px;"></i>
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

    window.addCityToUpcomingTrip = function (cityName) {
        if (trips.length > 0) {
            if (!trips[0].cities.includes(cityName)) {
                if (trips[0].cities.includes('Destination Pending')) {
                    trips[0].cities = [cityName];
                } else {
                    trips[0].cities.push(cityName);
                }
                renderTrips();
                showToast(`Added ${cityName} to ${trips[0].title}!`);
            } else {
                showToast(`${cityName} is already in ${trips[0].title}`);
            }
        } else {
            showToast(`Please create a trip first to add ${cityName}!`);
            openModal();
        }
    };

    // Keyboard Shortcut (Cmd/Ctrl + K to focus search)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            globalSearchInput.focus();
        }
    });

    // Hero Explore Button scroll
    const heroExploreBtn = document.getElementById('heroExploreBtn');
    if (heroExploreBtn) {
        heroExploreBtn.addEventListener('click', () => {
            // Navigate to the Explore Destinations page
            window.location.href = 'explore.html';
        });
    }

    // Initial render call
    renderTrips();
    populateFeedbackTrips();
    setActiveRating(4);
    renderDestinations();
});
