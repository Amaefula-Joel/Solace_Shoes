const menu_bth = document.getElementById('menu-btn');
const links_container = document.getElementById('links-container');

menu_bth.addEventListener('click', function () {
    let isVisible = links_container.classList.contains('visible')

    if (isVisible) {
        links_container.classList.remove('fadeIn')
        setTimeout(() => {
            links_container.classList.remove('visible')
        }, 200);
    } else {
        links_container.classList.add('visible')
        setTimeout(() => {
            links_container.classList.add('fadeIn')
        }, 200);
    }
});

const shoes = [
    {
        id: 1,
        name: 'Formal 1',
        category: 'Formal',
        price: 55000,
        image: 'img/formal 1.webp',
        sizes: [40, 41, 42, 43, 44, 45],
        description: 'Polished leather loafers with a padded footbed. A staple for meetings, weddings and Sundays.'
    },
    {
        id: 2,
        name: 'Sneakers 1',
        category: 'Sneakers',
        price: 62000,
        image: 'img/shoe picture.webp',
        sizes: [38, 39, 40, 41, 42, 43],
        description: 'A lightweight everyday runner with breathable mesh and a cushioned sole.'
    },
    {
        id: 3,
        name: 'Boots 1',
        category: 'Boots',
        price: 71000,
        image: 'img/boot 1.avif',
        sizes: [41, 42, 43, 44, 45, 46],
        description: 'Rugged lace-up boots with a grippy tread for rough roads and weekend trips.'
    },
    {
        id: 4,
        name: 'Sneakers 2',
        category: 'Sneakers',
        price: 68000,
        image: 'img/sneaker 1.jpg',
        sizes: [39, 40, 41, 42, 43, 44],
        description: 'Clean court-style sneakers in soft leather. Easy to pair with jeans or a native outfit.'
    },
    {
        id: 5,
        name: 'Formai 2',
        category: 'Formal',
        price: 59000,
        image: 'img/formal 2.webp',
        sizes: [40, 41, 42, 43, 44, 45],
        description: 'Elegant everyday formal shoes designed for workdays, events, and polished comfort.'
    },
    {
        id: 6,
        name: 'Boots 2',
        category: 'Boots',
        price: 76000,
        image: 'img/boot 2.webp',
        sizes: [42, 43, 44, 45, 46],
        description: 'Strong, durable boots built for movement, weather, and long days across town.'
    }
];

const filterOptions = {
    category: ['All', 'Formal', 'Sneakers', 'Boots'],
    size: ['All', '38', '39', '40', '41', '42', '43', '44', '45', '46']
};

const filterState = {
    category: 'All',
    size: 'All'
};

const filtersContainer = document.getElementById('filters');
const shoeGrid = document.getElementById('shoe-grid');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalImage = document.getElementById('modal-image');
const modalCategory = document.getElementById('modal-category');
const modalName = document.getElementById('modal-name');
const modalPrice = document.getElementById('modal-price');
const modalDescription = document.getElementById('modal-description');
const sizeOptions = document.getElementById('size-options');
const qtyValue = document.getElementById('qty-value');
const modalTotal = document.getElementById('modal-total');
const orderWhatsapp = document.getElementById('order-whatsapp');
const modalHint = document.getElementById('modal-hint');
const closeModalBtn = document.getElementById('close-modal');

let activeShoe = null;
let selectedSize = null;
let quantity = 1;

function adjustModalForViewport() {
    const backdrop = document.getElementById('modal-backdrop');
    const modal = document.querySelector('.modal');

    if (!backdrop || !modal) return;

    const isShortViewport = window.innerHeight < 720;

    backdrop.style.alignItems = isShortViewport ? 'flex-start' : 'center';
    backdrop.style.paddingTop = isShortViewport ? '12px' : '24px';
    backdrop.style.paddingBottom = isShortViewport ? '12px' : '24px';
    modal.style.maxHeight = isShortViewport ? 'calc(100vh - 20px)' : 'calc(100vh - 32px)';
    modal.style.overflowY = 'auto';
}

function getSizeLabel(sizes) {
    const sorted = [...sizes].sort((a, b) => a - b);
    return `Sizes ${sorted[0]} to ${sorted[sorted.length - 1]}`;
}

function renderFilters() {
    filtersContainer.innerHTML = '';

    Object.entries(filterOptions).forEach(([group, options]) => {
        const row = document.createElement('div');
        row.className = 'row';

        const label = document.createElement('span');
        label.className = 'lab';
        label.textContent = group === 'category' ? 'Category' : 'Sizes';
        row.appendChild(label);

        const optionRow = document.createElement('span');
        optionRow.className = 'row';

        options.forEach((option) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'chip';
            button.textContent = option;
            button.dataset.group = group;
            button.dataset.value = option;
            button.setAttribute('aria-pressed', String(filterState[group] === option));

            button.addEventListener('click', () => {
                filterState[group] = option;
                renderFilters();
                renderShoes();
            });

            optionRow.appendChild(button);
        });

        row.appendChild(optionRow);
        filtersContainer.appendChild(row);
    });
}

function renderShoes() {
    const filteredShoes = shoes.filter((shoe) => {
        const categoryMatch = filterState.category === 'All' || shoe.category === filterState.category;
        const sizeMatch = filterState.size === 'All' || shoe.sizes.includes(Number(filterState.size));
        return categoryMatch && sizeMatch;
    });

    if (!filteredShoes.length) {
        shoeGrid.innerHTML = `
                    <div class="card" style="grid-column: 1 / -1; padding: 28px;">
                        <div class="body">
                            <h3>No shoes match this filter.</h3>
                            <span class="size">Try another size or category.</span>
                        </div>
                    </div>
                `;
        return;
    }

    shoeGrid.innerHTML = filteredShoes.map((shoe) => `
                <article class="card">
                    <div class="top">
                        <img src="${shoe.image}" alt="${shoe.name}">
                    </div>
                    <div class="body">
                        <span class="cat">${shoe.category.toUpperCase()}</span>
                        <h3>${shoe.name}</h3>
                        <span class="price">₦${shoe.price.toLocaleString()}</span>
                        <span class="size">${getSizeLabel(shoe.sizes)}</span>
                        <button class="cta-outline view-details" data-id="${shoe.id}" type="button">View Details</button>
                    </div>
                </article>
            `).join('');
}

function openModal(shoeId) {
    const shoe = shoes.find((item) => item.id === Number(shoeId));
    if (!shoe) return;

    activeShoe = shoe;
    selectedSize = null;
    quantity = 1;
    adjustModalForViewport();

    modalImage.src = shoe.image;
    modalImage.alt = shoe.name;
    modalCategory.textContent = shoe.category;
    modalName.textContent = shoe.name;
    modalPrice.textContent = `₦${shoe.price.toLocaleString()}`;
    modalDescription.textContent = shoe.description;

    sizeOptions.innerHTML = shoe.sizes.map((size) => `
                <button class="size-option" type="button" data-size="${size}" aria-pressed="false">${size}</button>
            `).join('');

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    updateModal();
}

function closeModal() {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    activeShoe = null;
    selectedSize = null;
    quantity = 1;
}

function updateModal() {
    if (!activeShoe) return;

    const total = activeShoe.price * quantity;
    modalTotal.textContent = `₦${total.toLocaleString()}`;
    qtyValue.textContent = quantity;

    const buttons = sizeOptions.querySelectorAll('.size-option');
    buttons.forEach((button) => {
        const isSelected = Number(button.dataset.size) === selectedSize;
        button.setAttribute('aria-pressed', String(isSelected));
    });

    if (selectedSize) {
        modalHint.textContent = 'Your order is ready to send.';
        orderWhatsapp.setAttribute('aria-disabled', 'false');
        orderWhatsapp.href = `https://wa.me/2348124787574?text=${encodeURIComponent(
            `Hi Solace, I would like to order: ${activeShoe.name}, size ${selectedSize}, quantity ${quantity}. Total: ₦${total.toLocaleString()}.`
        )}`;
    } else {
        modalHint.textContent = 'Choose a size to continue.';
        orderWhatsapp.setAttribute('aria-disabled', 'true');
        orderWhatsapp.removeAttribute('href');
    }
}

sizeOptions.addEventListener('click', (event) => {
    const button = event.target.closest('.size-option');
    if (!button) return;

    selectedSize = Number(button.dataset.size);
    updateModal();
});

document.addEventListener('click', (event) => {
    const detailButton = event.target.closest('.view-details');
    if (detailButton) {
        openModal(detailButton.dataset.id);
    }

    if (event.target === modalBackdrop) {
        closeModal();
    }
});

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('resize', adjustModalForViewport);

document.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]');
    if (!action || !activeShoe) return;

    if (action.dataset.action === 'increase') {
        quantity = Math.min(10, quantity + 1);
    }

    if (action.dataset.action === 'decrease') {
        quantity = Math.max(1, quantity - 1);
    }

    updateModal();
});

renderFilters();
renderShoes();
adjustModalForViewport();