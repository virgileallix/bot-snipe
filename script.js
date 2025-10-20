// Configuration
const CORS_PROXY = 'https://corsproxy.io/?';
const ROBLOX_API = {
    CATALOG: 'https://catalog.roblox.com/v1/search/items',
    ECONOMY: 'https://economy.roblox.com/v2/assets',
    THUMBNAIL: 'https://thumbnails.roblox.com/v1/assets'
};

// Helper function to add CORS proxy
function proxify(url) {
    return CORS_PROXY + encodeURIComponent(url);
}

// State
let allItems = [];
let filteredItems = [];

// DOM Elements
const itemsGrid = document.getElementById('itemsGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const itemCount = document.getElementById('itemCount');
const lastUpdate = document.getElementById('lastUpdate');

// Filter Elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('category');
const itemTypeFilter = document.getElementById('itemType');
const creatorTypeFilter = document.getElementById('creatorType');
const sortByFilter = document.getElementById('sortBy');
const minPriceFilter = document.getElementById('minPrice');
const maxPriceFilter = document.getElementById('maxPrice');
const minRAPFilter = document.getElementById('minRAP');
const maxRAPFilter = document.getElementById('maxRAP');

// Buttons
const applyFiltersBtn = document.getElementById('applyFilters');
const refreshItemsBtn = document.getElementById('refreshItems');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadItems();

    applyFiltersBtn.addEventListener('click', applyFilters);
    refreshItemsBtn.addEventListener('click', loadItems);

    // Search as you type
    searchInput.addEventListener('input', () => {
        applyFilters();
    });
});

/**
 * Fetch items from Roblox API
 */
async function loadItems() {
    showLoading(true);
    hideError();

    try {
        // Fetch ALL items from catalog (not just limited)
        const allItemsData = [];

        // Try different query combinations
        const queries = [
            // Limited items
            { category: 'Accessories', subcategory: 'All', salesTypeFilter: 1, sortType: 3, limit: 30 },
            { category: 'Accessories', subcategory: 'Hats', salesTypeFilter: 1, sortType: 3, limit: 30 },
            // Normal items
            { category: 'Accessories', subcategory: 'Hair', sortType: 3, limit: 30 },
            { category: 'Accessories', subcategory: 'Face', sortType: 3, limit: 30 },
            { category: 'Clothing', sortType: 3, limit: 30 },
        ];

        console.log('Starting to fetch items...');

        for (const params of queries) {
            try {
                const queryString = new URLSearchParams(params).toString();
                const url = `${ROBLOX_API.CATALOG}?${queryString}`;

                console.log('Fetching:', url);

                const response = await fetch(proxify(url), {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                console.log('Response status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Items received:', data.data?.length || 0);

                    if (data.data && data.data.length > 0) {
                        allItemsData.push(...data.data);
                    }
                } else {
                    console.warn('Failed response:', response.status, response.statusText);
                }
            } catch (err) {
                console.warn('Failed to fetch:', err);
            }
        }

        console.log('Total items fetched:', allItemsData.length);

        if (allItemsData.length === 0) {
            throw new Error('Aucun item trouvé. L\'API Roblox est peut-être inaccessible via le proxy.');
        }

        // Remove duplicates based on ID
        const uniqueItems = Array.from(new Map(allItemsData.map(item => [item.id, item])).values());

        console.log('Unique items:', uniqueItems.length);
        console.log('Sample item data:', uniqueItems[0]);

        // Fetch thumbnails properly
        const itemIds = uniqueItems.slice(0, 120).map(item => item.id);
        const thumbnailsMap = await fetchThumbnails(itemIds);

        // Process items with proper thumbnails
        allItems = uniqueItems.slice(0, 120).map((item) => {
            const isLimited = item.itemRestrictions?.includes('Limited') || false;
            const isLimitedU = item.itemRestrictions?.includes('LimitedUnique') || false;
            const isUGC = item.creatorType === 'User' || item.creatorType === 'Group';
            const isRoblox = item.creatorType === 'Roblox' || item.creatorName === 'Roblox';
            const isNormal = !isLimited && !isLimitedU;

            const processedItem = {
                id: item.id,
                name: item.name || 'Item sans nom',
                price: item.price ?? 0,
                premiumPrice: item.premiumPrice || null,
                itemType: item.itemType || 'Unknown',
                assetType: item.assetType || 'Unknown',
                creatorName: item.creatorName || 'Créateur inconnu',
                creatorType: item.creatorType || 'Unknown',
                creatorId: item.creatorTargetId || 0,
                itemRestrictions: item.itemRestrictions || [],
                isLimited: isLimited,
                isLimitedU: isLimitedU,
                isNormal: isNormal,
                isUGC: isUGC,
                isRoblox: isRoblox,
                lowestPrice: item.lowestPrice || item.price || 0,
                unitsAvailableForConsumption: item.unitsAvailableForConsumption || 0,
                createdAt: item.createdAt || new Date().toISOString(),
                updatedAt: item.updatedAt || new Date().toISOString(),
                rap: calculateMockRAP(item.price, item.lowestPrice),
                thumbnail: thumbnailsMap[item.id] || `https://assetdelivery.roblox.com/v1/asset/?id=${item.id}`
            };

            return processedItem;
        });

        console.log('Processed items:', allItems.length);
        console.log('Sample processed item:', allItems[0]);

        filteredItems = [...allItems];
        applyFilters();
        updateStats();

    } catch (error) {
        showError(`Erreur lors du chargement des items: ${error.message}`);
        console.error('Error loading items:', error);
    } finally {
        showLoading(false);
    }
}

/**
 * Fetch thumbnails from Roblox API
 * Using direct CDN URLs instead of batch API to avoid CORS issues
 */
async function fetchThumbnails(itemIds) {
    try {
        const thumbnailsMap = {};

        // Use Roblox CDN directly for thumbnails
        itemIds.forEach(id => {
            thumbnailsMap[id] = `https://assetdelivery.roblox.com/v1/asset/?id=${id}`;
        });

        return thumbnailsMap;
    } catch (error) {
        console.error('Error fetching thumbnails:', error);
        return {};
    }
}

/**
 * Calculate mock RAP (Recent Average Price)
 * Note: Real RAP requires authenticated API access
 */
function calculateMockRAP(price, lowestPrice) {
    if (!price && !lowestPrice) return 0;
    const basePrice = lowestPrice || price;
    // Mock RAP as price + random variation
    return Math.floor(basePrice * (1 + (Math.random() * 0.3 - 0.15)));
}

/**
 * Apply filters to items
 */
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const itemType = itemTypeFilter.value;
    const creatorType = creatorTypeFilter.value;
    const sortBy = sortByFilter.value;
    const minPrice = parseFloat(minPriceFilter.value) || 0;
    const maxPrice = parseFloat(maxPriceFilter.value) || Infinity;
    const minRAP = parseFloat(minRAPFilter.value) || 0;
    const maxRAP = parseFloat(maxRAPFilter.value) || Infinity;

    // Filter items
    filteredItems = allItems.filter(item => {
        // Search filter
        if (searchTerm && !item.name.toLowerCase().includes(searchTerm)) {
            return false;
        }

        // Type filter
        if (itemType === 'normal' && !item.isNormal) return false;
        if (itemType === 'limited' && !item.isLimited) return false;
        if (itemType === 'limitedU' && !item.isLimitedU) return false;

        // Creator type filter
        if (creatorType === 'ugc' && !item.isUGC) return false;
        if (creatorType === 'roblox' && !item.isRoblox) return false;
        if (creatorType === 'roblox-limited' && !(item.isRoblox && (item.isLimited || item.isLimitedU))) return false;

        // Price filter
        if (item.price < minPrice || item.price > maxPrice) return false;

        // RAP filter
        if (item.rap < minRAP || item.rap > maxRAP) return false;

        return true;
    });

    // Sort items
    sortItems(sortBy);

    // Display items
    displayItems();
    updateStats();
}

/**
 * Sort items based on selected criteria
 */
function sortItems(sortBy) {
    switch (sortBy) {
        case 'newest':
            // Sort by creation date (newest first)
            filteredItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'recent':
            // Sort by update date (recently updated first)
            filteredItems.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            break;
        case 'price-asc':
            filteredItems.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredItems.sort((a, b) => b.price - a.price);
            break;
        case 'rap-asc':
            filteredItems.sort((a, b) => a.rap - b.rap);
            break;
        case 'rap-desc':
            filteredItems.sort((a, b) => b.rap - a.rap);
            break;
        default:
            filteredItems.sort((a, b) => b.id - a.id);
            break;
    }
}

/**
 * Display items in grid
 */
function displayItems() {
    itemsGrid.innerHTML = '';

    if (filteredItems.length === 0) {
        itemsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">Aucun item trouvé avec ces filtres</p>';
        return;
    }

    filteredItems.forEach(item => {
        const itemCard = createItemCard(item);
        itemsGrid.appendChild(itemCard);
    });
}

/**
 * Create item card element
 */
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';

    const itemTypeClass = item.isLimited ? 'limited' : item.isLimitedU ? 'limitedU' : 'normal';
    const itemTypeText = item.isLimited ? 'Limited' : item.isLimitedU ? 'Limited U' : 'Normal';
    const creatorBadge = item.isUGC ? '<span class="badge ugc-badge">UGC</span>' : item.isRoblox ? '<span class="badge roblox-badge">Roblox</span>' : '';

    card.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.name}" class="item-image" onerror="this.style.display='none'">
        <div class="badges">
            <div class="item-type ${itemTypeClass}">${itemTypeText}</div>
            ${creatorBadge}
        </div>
        <h3 class="item-name">${escapeHtml(item.name)}</h3>
        <div class="item-info">
            <div class="info-row">
                <span class="info-label">Prix:</span>
                <span class="info-value price-value">${formatRobux(item.price)}</span>
            </div>
            ${(item.isLimited || item.isLimitedU) ? `
            <div class="info-row">
                <span class="info-label">RAP:</span>
                <span class="info-value">${formatRobux(item.rap)}</span>
            </div>
            ` : ''}
            ${item.isLimitedU ? `
            <div class="info-row">
                <span class="info-label">Stock:</span>
                <span class="info-value">${item.unitsAvailableForConsumption}</span>
            </div>
            ` : ''}
            <div class="info-row">
                <span class="info-label">Créateur:</span>
                <span class="info-value">${escapeHtml(item.creatorName)}</span>
            </div>
        </div>
        <button class="btn-buy" onclick="buyItem(${item.id})">
            Acheter sur Roblox
        </button>
    `;

    return card;
}

/**
 * Redirect to Roblox item page for purchase
 */
function buyItem(itemId) {
    const robloxItemUrl = `https://www.roblox.com/catalog/${itemId}`;
    window.open(robloxItemUrl, '_blank');
}

/**
 * Format Robux amount
 */
function formatRobux(amount) {
    if (amount === 0) return 'Gratuit';
    return `R$ ${amount.toLocaleString('fr-FR')}`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Update statistics
 */
function updateStats() {
    itemCount.textContent = filteredItems.length;
    const now = new Date();
    lastUpdate.textContent = now.toLocaleTimeString('fr-FR');
}

/**
 * Show/hide loading spinner
 */
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
    itemsGrid.style.display = show ? 'none' : 'grid';
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.style.display = 'none';
}

// Auto-refresh every 5 minutes
setInterval(() => {
    loadItems();
}, 5 * 60 * 1000);
