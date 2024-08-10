let products = [];
        let currentProductsList = [];
        const itemsPerPage = 4;
        let currentPage = 1;
        let totalPages;
        let cart = [];
        const productListElem = document.querySelector('.products-list');
        const searchInput = document.querySelector('.search');
        const categoriesInput = document.querySelector('.categories');
        const cartItemsElem = document.querySelector('.cart-items');
        const cartTotalElem = document.querySelector('.cart-total');

        function filterProducts() {
            const searchValue = searchInput.value.toLowerCase();
            const categoriesInputValue = categoriesInput.value;
            currentProductsList = products.filter(element => {
                return element.title.toLowerCase().includes(searchValue) &&
                    (categoriesInputValue === '' || element.category === categoriesInputValue);
            });
            renderProducts(true);
        }

        function renderProducts(isFiltering = false) {
            productListElem.innerHTML = '';
            if (!isFiltering) {
                currentProductsList = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            }
            currentProductsList.forEach(element => {
                productListElem.innerHTML += `
                <div class="product">
                    <img src="${element.image}" alt="${element.title}">
                    <h3>${element.title}</h3>
                    <p>$${element.price.toFixed(2)}</p>
                    <button data-id="${element.id}">Add to cart</button>
                </div>
                `;
            });
            attachAddToCartListeners();
            updatePagination();
        }

        function attachAddToCartListeners() {
            document.querySelectorAll('.product button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = event.target.getAttribute('data-id');
                    const product = products.find(p => p.id == productId);
                    addToCart(product);
                });
            });
        }

        function addToCart(product) {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            renderCart();
        }

        function renderCart() {
            cartItemsElem.innerHTML = '';
            let total = 0;
            cart.forEach(item => {
                total += item.price * item.quantity;
                cartItemsElem.innerHTML += `
                <div class="cart-item">
                    <p>${item.title} (x${item.quantity})</p>
                    <button data-id="${item.id}">Remove</button>
                </div>
                `;
            });
            cartTotalElem.textContent = `Total: $${total.toFixed(2)}`;
            attachRemoveFromCartListeners();
        }

        function attachRemoveFromCartListeners() {
            document.querySelectorAll('.cart-item button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = event.target.getAttribute('data-id');
                    removeFromCart(productId);
                });
            });
        }

        function removeFromCart(productId) {
            const index = cart.findIndex(item => item.id == productId);
            if (index > -1) {
                cart[index].quantity--;
                if (cart[index].quantity === 0) {
                    cart.splice(index, 1);
                }
            }
            renderCart();
        }

        function updatePagination() {
            const paginationElem = document.querySelector('.pagination');
            paginationElem.innerHTML = '';
            totalPages = Math.ceil(products.length / itemsPerPage);
            for (let i = 1; i <= totalPages; i++) {
                paginationElem.innerHTML += `
                <span class="page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</span>
                `;
            }
            attachPaginationListeners();
        }

        function attachPaginationListeners() {
            document.querySelectorAll('.page-number').forEach(button => {
                button.addEventListener('click', (event) => {
                    currentPage = parseInt(event.target.getAttribute('data-page'));
                    renderProducts();
                });
            });
        }

        // Fetch products from the API
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                products = data;
                renderProducts();
            });

        // Filter products on input change
        searchInput.addEventListener('input', filterProducts);
        categoriesInput.addEventListener('change', filterProducts);