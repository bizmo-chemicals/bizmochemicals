let cart = [];
let selectedProduct = "";
let selectedSize = "";
let selectedFlavour = "";
let modalQty = 1;


/* =========================
   BIZMO ORDER API
========================= */

const BIZMO_ORDER_API_URL =
	"https://script.google.com/macros/s/AKfycbyY42y_33PuXb0I4JdDUYkD12he6dVKMeBEZKGOstwWBigPtMU44PbUVnccxnC4OA/exec";

let bizmoPendingOrder = null;
let bizmoOrderSaving = false;


/* =========================
   PAGE SCROLL LOCK
========================= */

function lockPageScroll() {
	document.body.classList.add(
		"page-scroll-locked"
	);
}

function unlockPageScroll() {
	document.body.classList.remove(
		"page-scroll-locked"
	);
}

function updatePageScrollLock() {

	const menuOpen =
		document
			.getElementById("navMenu")
			?.classList.contains("show");

	const cartOpen =
		document
			.getElementById("cartDrawer")
			?.classList.contains("open");

	const productModalOpen =
		document
			.getElementById("productModal")
			?.classList.contains("show");

	const checkoutOpen =
		document
			.getElementById("checkoutModal")
			?.classList.contains("show");

	const orderConfirmOpen =
		document
			.getElementById("bizmoOrderConfirm")
			?.classList.contains("show");

	const editConfirmOpen =
		document
			.getElementById("bizmoEditConfirm")
			?.classList.contains("show");

	const successOpen =
		document
			.getElementById("bizmoOrderSuccess")
			?.classList.contains("show");

	if (
		menuOpen ||
		cartOpen ||
		productModalOpen ||
		checkoutOpen ||
		orderConfirmOpen ||
		editConfirmOpen ||
		successOpen
	) {
		lockPageScroll();
	} else {
		unlockPageScroll();
	}
}


/* =========================
   PRODUCT CATALOG
========================= */

const productCatalog = {

	"Toilet Cleaner": {
		sizes: {
			"500 ML": 89,
			"1 L": 160,
			"5 L": 450
		}
	},

	"Floor Cleaner": {
		sizes: {
			"500 ML": 89,
			"5 L": 450
		},
		flavours: [
			"Rose",
			"Lemon"
		]
	},

	"Fabric Conditioner": {
		sizes: {
			"500 ML": 100,
			"1 L": 180,
			"5 L": 550
		}
	},

	"Washing Liquid": {
		sizes: {
			"1 L": 115,
			"5 L": 450
		}
	},

	"Dish Wash Liquid": {
		sizes: {
			"250 ML": 50,
			"500 ML": 95,
			"5 L": 500
		}
	},

	"Glass Cleaner": {
		sizes: {
		"500 ML": 90,
		"5 L": 450
		}
	},

	"Handwash": {
		sizes: {
			"500 ML": 100,
			"5 L": 550
		},
		flavours: [
			"Rose",
			"Green Apple",
			"Blossom",
			"Dove"
		]
	},

	"Phenyl": {
		sizes: {
			"1 L": 45,
			"5 L": 450
		},
		flavours: [
			"White Phenyl",
			"Black Phenyl"
		]
	},

	"Soap Oil": {
		sizes: {
			"1 L": 70,
			"5 L": 350
		}
	},

	"Tile Salt": {
		sizes: {
			"1 L": 120,
			"5 L": 500
		}
	},

	"Room Spray": {
		sizes: {
			"500 ML": 100,
			"5 L": 900
		}
	}
};


/* =========================
   COMBO PRICES
========================= */

const comboPrices = {
	"Combo 1": 335,
	"Combo 2": 485,
	"Combo 3": 595
};


/* =========================
   HANDWASH SLIDER
========================= */

function updateHandwashSlider(slider, index) {

	const track =
		slider.querySelector(
			".handwash-track"
		);

	if (track) {

		track.style.transform =
			`translateX(-${index * 100}%)`;
	}
}


function goToHandwashSlide(
	slider,
	index
) {

	const slides =
		slider.querySelectorAll(
			".handwash-slide"
		);

	if (!slides.length) return;

	if (index < 0) {
		index = slides.length - 1;
	}

	if (index >= slides.length) {
		index = 0;
	}

	slider.dataset.slideIndex =
		index;

	updateHandwashSlider(
		slider,
		index
	);

	slider
		.querySelectorAll(
			".handwash-dot"
		)
		.forEach(
			(dot, n) => {

				dot.classList.toggle(
					"active",
					n === index
				);

			}
		);
}


function initializeHandwashSlider() {

	const sliders =
		document.querySelectorAll(
			".handwash-slider"
		);

	sliders.forEach(
		slider => {

			if (
				slider.dataset
					.sliderInitialized ===
				"true"
			) {
				return;
			}

			slider.dataset.sliderInitialized =
				"true";

			slider.dataset.slideIndex =
				"0";

			let startX = 0;
			let currentX = 0;
			let isDragging = false;


			slider.addEventListener(
				"touchstart",
				e => {

					startX =
						currentX =
							e.touches[0].clientX;

					isDragging = true;

				},
				{
					passive: true
				}
			);


			slider.addEventListener(
				"touchmove",
				e => {

					if (isDragging) {

						currentX =
							e.touches[0].clientX;
					}

				},
				{
					passive: true
				}
			);


			slider.addEventListener(
				"touchend",
				() => {

					if (!isDragging) return;

					const distance =
						currentX -
						startX;

					isDragging = false;

					if (
						Math.abs(distance) >= 50
					) {

						const currentIndex =
							Number(
								slider.dataset
									.slideIndex || 0
							);

						goToHandwashSlide(
							slider,
							currentIndex +
								(
									distance < 0
										? 1
										: -1
								)
						);
					}

				}
			);


			slider.addEventListener(
				"mousedown",
				e => {

					startX =
						currentX =
							e.clientX;

					isDragging = true;

					slider.classList.add(
						"dragging"
					);

				}
			);


			slider.addEventListener(
				"mousemove",
				e => {

					if (isDragging) {

						currentX =
							e.clientX;
					}

				}
			);


			slider.addEventListener(
				"mouseup",
				() => {

					if (!isDragging) return;

					const distance =
						currentX -
						startX;

					isDragging = false;

					slider.classList.remove(
						"dragging"
					);

					if (
						Math.abs(distance) >= 50
					) {

						const currentIndex =
							Number(
								slider.dataset
									.slideIndex || 0
							);

						goToHandwashSlide(
							slider,
							currentIndex +
								(
									distance < 0
										? 1
										: -1
								)
						);
					}

				}
			);


			slider.addEventListener(
				"mouseleave",
				() => {

					isDragging = false;

					slider.classList.remove(
						"dragging"
					);

				}
			);


			updateHandwashSlider(
				slider,
				0
			);

		}
	);
}


/* =========================
   PRODUCT OPTIONS MODAL
========================= */

function openProductOptions(
	productName
) {

	const product =
		productCatalog[productName];

	if (!product) return;

	selectedProduct =
		productName;

	selectedSize = "";

	selectedFlavour = "";

	modalQty = 1;


	const nameElement =
		document.getElementById(
			"modalProductName"
		);

	const qtyElement =
		document.getElementById(
			"modalQty"
		);

	const flavourLabel =
		document.getElementById(
			"flavourLabel"
		);

	const flavourOptions =
		document.getElementById(
			"flavourOptions"
		);

	const sizeOptions =
		document.getElementById(
			"sizeOptions"
		);


	if (nameElement) {

		nameElement.textContent =
			productName;
	}


	if (qtyElement) {

		qtyElement.textContent =
			"1";
	}


	if (
		!flavourOptions ||
		!sizeOptions
	) {
		return;
	}


	flavourOptions.innerHTML = "";

	sizeOptions.innerHTML = "";


	if (
		product.flavours &&
		product.flavours.length
	) {

		if (flavourLabel) {

			flavourLabel.style.display =
				"block";
		}

		flavourOptions.style.display =
			"grid";


		product.flavours.forEach(
			flavour => {

				const button =
					document.createElement(
						"button"
					);

				button.type =
					"button";

				button.textContent =
					flavour;


				button.addEventListener(
					"click",
					() => {

						selectFlavour(
							button,
							flavour
						);

					}
				);


				flavourOptions.appendChild(
					button
				);

			}
		);

	} else {

		if (flavourLabel) {

			flavourLabel.style.display =
				"none";
		}

		flavourOptions.style.display =
			"none";
	}


	Object.entries(
		product.sizes
	).forEach(
		([size, price]) => {

			const button =
				document.createElement(
					"button"
				);

			button.type =
				"button";

			button.textContent =
				`${size} - ₹${price}`;


			button.addEventListener(
				"click",
				() => {

					selectSize(
						button,
						size
					);

				}
			);


			sizeOptions.appendChild(
				button
			);

		}
	);


	/* PHENYL DEFAULT */

	if (
		productName ===
		"Phenyl"
	) {

		const firstFlavour =
			flavourOptions.querySelector(
				"button"
			);

		if (firstFlavour) {

			selectFlavour(
				firstFlavour,
				"White Phenyl"
			);
		}
	}


	updateModalPrice();


	document
		.getElementById(
			"productModal"
		)
		?.classList.add("show");


	updatePageScrollLock();
}


function closeProductOptions() {

	document
		.getElementById(
			"productModal"
		)
		?.classList.remove("show");

	updatePageScrollLock();
}


function selectSize(
	button,
	size
) {

	document
		.querySelectorAll(
			"#sizeOptions button"
		)
		.forEach(
			b =>
				b.classList.remove(
					"selected"
				)
		);


	button.classList.add(
		"selected"
	);

	selectedSize =
		size;

	updateModalPrice();
}


function selectFlavour(
	button,
	flavour
) {

	document
		.querySelectorAll(
			"#flavourOptions button"
		)
		.forEach(
			b =>
				b.classList.remove(
					"selected"
				)
		);


	button.classList.add(
		"selected"
	);

	selectedFlavour =
		flavour;


	/* PHENYL SPECIAL SIZE LOGIC */

	if (
		selectedProduct ===
		"Phenyl"
	) {

		const sizeOptions =
			document.getElementById(
				"sizeOptions"
			);

		if (!sizeOptions) return;


		sizeOptions.innerHTML = "";


		const sizes = {
			"1 L": 45,
			"5 L": 450
		};


		Object.entries(
			sizes
		).forEach(
			([size, price]) => {

				const button =
					document.createElement(
						"button"
					);

				button.type =
					"button";

				button.textContent =
					`${size} - ₹${price}`;


				const disabled =
					(
						flavour ===
						"White Phenyl" &&
						size === "5 L"
					) ||
					(
						flavour ===
						"Black Phenyl" &&
						size === "1 L"
					);


				if (disabled) {

					button.disabled =
						true;

					button.classList.add(
						"disabled"
					);

				} else {

					button.addEventListener(
						"click",
						() => {

							selectSize(
								button,
								size
							);

						}
					);
				}


				sizeOptions.appendChild(
					button
				);

			}
		);


		const validSize =
			flavour ===
			"White Phenyl"
				? "1 L"
				: "5 L";


		const validButton =
			[
				...sizeOptions
					.querySelectorAll(
						"button"
					)
			].find(
				button =>
					button.textContent
						.startsWith(
							validSize
						)
			);


		if (validButton) {

			selectSize(
				validButton,
				validSize
			);
		}
	}
}


function changeModalQty(
	change
) {

	modalQty =
		Math.max(
			1,
			modalQty + change
		);


	const qty =
		document.getElementById(
			"modalQty"
		);


	if (qty) {

		qty.textContent =
			modalQty;
	}


	updateModalPrice();
}


function updateModalPrice() {

	const product =
		productCatalog[
			selectedProduct
		];

	const price =
		document.getElementById(
			"modalPrice"
		);


	if (!price) return;


	if (
		!product ||
		!selectedSize
	) {

		price.textContent =
			"₹0";

		return;
	}


	price.textContent =
		`₹${
			product.sizes[
				selectedSize
			] *
			modalQty
		}`;
}


/* =========================
   PRODUCT CART
========================= */

function confirmAddToCart() {

	const product =
		productCatalog[
			selectedProduct
		];

	if (!product) return;


	if (!selectedSize) {

		showToast(
			"⚠️ Please select a size."
		);

		return;
	}


	if (
		product.flavours?.length &&
		!selectedFlavour
	) {

		showToast(
			"⚠️ Please select a flavour."
		);

		return;
	}


	const price =
		product.sizes[
			selectedSize
		];


	const existing =
		cart.find(
			item =>
				item.name ===
					selectedProduct &&
				item.size ===
					selectedSize &&
				item.flavour ===
					selectedFlavour
		);


	if (existing) {

		existing.qty +=
			modalQty;

	} else {

		cart.push({
			name:
				selectedProduct,

			size:
				selectedSize,

			flavour:
				selectedFlavour || "",

			price:
				Number(price),

			qty:
				modalQty
		});
	}


	updateCartCount();
	renderCart();
	updateProductButtons();
	updateComboButton();

	closeProductOptions();

	showToast(
		selectedProduct +
		" added to cart"
	);
}


/* =========================
   PRODUCT BUTTON STATE
========================= */

function updateProductButtons() {

	document
		.querySelectorAll(
			".product-card"
		)
		.forEach(
			card => {

				const name =
					card.dataset.name;

				const info =
					card.querySelector(
						".product-info"
					);

				if (
					!name ||
					!info
				) {
					return;
				}


				const inCart =
					cart.some(
						item =>
							item.name ===
								name &&
							item.size
					);


				let cartButtons =
					info.querySelector(
						".product-cart-buttons"
					);

				let addButton =
					info.querySelector(
						".product-add-btn"
					);


				if (
					!addButton &&
					!cartButtons
				) {

					const buttons =
						info.querySelectorAll(
							"button"
						);

					if (buttons.length) {

						addButton =
							buttons[
								buttons.length - 1
							];
					}
				}


				/* IN CART */

				if (inCart) {

					if (cartButtons) {
						return;
					}

					if (!addButton) {
						return;
					}


					const area =
						document.createElement(
							"div"
						);

					area.className =
						"product-cart-buttons";


					const addMore =
						document.createElement(
							"button"
						);

					addMore.type =
						"button";

					addMore.className =
						"add-more-btn";

					addMore.textContent =
						"+ Add More";


					addMore.addEventListener(
						"click",
						() => {

							openProductOptions(
								name
							);

						}
					);


					const edit =
						document.createElement(
							"button"
						);

					edit.type =
						"button";

					edit.className =
						"edit-cart-btn";

					edit.textContent =
						"- Edit";


					edit.addEventListener(
						"click",
						openCart
					);


					area.appendChild(
						addMore
					);

					area.appendChild(
						edit
					);


					addButton.replaceWith(
						area
					);

					return;
				}


				/* NOT IN CART */

				if (cartButtons) {

					const button =
						document.createElement(
							"button"
						);

					button.type =
						"button";

					button.className =
						"product-add-btn";

					button.textContent =
						"Add to Cart";


					button.addEventListener(
						"click",
						() => {

							openProductOptions(
								name
							);

						}
					);


					cartButtons.replaceWith(
						button
					);

					return;
				}


				if (addButton) {

					addButton.classList.add(
						"product-add-btn"
					);


					if (
						addButton.dataset
							.cartReady !==
						"true"
					) {

						addButton.dataset
							.cartReady =
							"true";


						addButton.addEventListener(
							"click",
							() => {

								openProductOptions(
									name
								);

							}
						);
					}
				}

			}
		);
}


/* =========================
   COMBO CART
========================= */

function getComboName(card) {

	if (!card) return "";


	const button =
		card.querySelector(
			"[data-combo]"
		);


	if (button?.dataset.combo) {

		const name =
			button.dataset.combo.trim();


		if (comboPrices[name]) {
			return name;
		}
	}


	const heading =
		card.querySelector(
			".combo-copy h2"
		);


	if (heading) {

		const name =
			heading.textContent.trim();


		if (comboPrices[name]) {
			return name;
		}
	}


	const kicker =
		card.querySelector(
			".kicker"
		);


	if (kicker) {

		const name =
			kicker.textContent
				.trim()
				.replace(
					/^COMBO\s+/i,
					"Combo "
				);


		if (comboPrices[name]) {
			return name;
		}
	}


	return "";
}


function addComboToCart(
	comboName
) {

	const price =
		Number(
			comboPrices[
				comboName
			]
		);


	if (
		!comboName ||
		!price
	) {

		showToast(
			"Unable to add combo"
		);

		return;
	}


	const existing =
		cart.find(
			item =>
				item.name ===
					comboName &&
				!item.size
		);


	if (existing) {

		existing.qty += 1;

	} else {

		cart.push({
			name:
				comboName,

			price:
				price,

			qty:
				1
		});
	}


	updateCartCount();
	renderCart();
	updateProductButtons();
	updateComboButton();


	showToast(
		comboName +
		" added to cart"
	);
}


/* =========================
   COMBO BUTTON UPDATE
========================= */

function updateComboButton() {

	document
		.querySelectorAll(
			".combo-card"
		)
		.forEach(
			card => {

				const comboName =
					getComboName(
						card
					);


				if (!comboName) {
					return;
				}


				const existing =
					cart.find(
						item =>
							item.name ===
								comboName &&
							!item.size
					);


				const addButton =
					card.querySelector(
						".combo-add-btn"
					);


				const cartButtons =
					card.querySelector(
						".combo-cart-buttons"
					);


				/* COMBO ALREADY IN CART */

				if (existing) {

					if (cartButtons) {
						return;
					}


					if (addButton) {

						const area =
							document.createElement(
								"div"
							);

						area.className =
							"combo-cart-buttons";

						area.dataset.combo =
							comboName;


						area.innerHTML = `
							<button
								class="add-more-btn combo-add-more"
								type="button"
								data-combo="${comboName}">
								+ Add More
							</button>

							<button
								class="edit-cart-btn combo-edit-cart"
								type="button">
								- Edit
							</button>
						`;


						addButton.replaceWith(
							area
						);
					}

					return;
				}


				/* COMBO NOT IN CART */

				if (cartButtons) {

					const button =
						document.createElement(
							"button"
						);

					button.type =
						"button";

					button.className =
						"combo-add-btn";

					button.dataset.combo =
						comboName;

					button.textContent =
						"Add to Cart";


					cartButtons.replaceWith(
						button
					);
				}


				if (addButton) {

					addButton.dataset.combo =
						comboName;
				}

			}
		);
}


/* =========================
   COMBO CLICK HANDLER
========================= */

document.addEventListener(
	"click",
	e => {

		const addButton =
			e.target.closest(
				".combo-add-btn"
			);


		if (addButton) {

			e.preventDefault();
			e.stopPropagation();


			const comboName =
				addButton.dataset.combo;


			addComboToCart(
				comboName
			);

			return;
		}


		const addMoreButton =
			e.target.closest(
				".combo-add-more"
			);


		if (addMoreButton) {

			e.preventDefault();
			e.stopPropagation();


			const comboName =
				addMoreButton.dataset.combo;


			addComboToCart(
				comboName
			);

			return;
		}


		const editButton =
			e.target.closest(
				".combo-edit-cart"
			);


		if (editButton) {

			e.preventDefault();
			e.stopPropagation();


			openCart();

			return;
		}

	},
	true
);


/* =========================
   GENERIC ADD TO CART
========================= */

function addToCart(
	name,
	price
) {

	if (comboPrices[name]) {

		addComboToCart(
			name
		);

		return;
	}


	const existing =
		cart.find(
			item =>
				item.name ===
					name &&
				!item.size
		);


	if (existing) {

		existing.qty += 1;

	} else {

		cart.push({
			name:
				name,

			price:
				Number(price) || 0,

			qty:
				1
		});
	}


	updateCartCount();
	renderCart();
	updateProductButtons();
	updateComboButton();


	showToast(
		name +
		" added to cart"
	);
}


/* =========================
   CART
========================= */

function updateCartCount() {

	const count =
		document.getElementById(
			"cartCount"
		);


	if (!count) return;


	count.textContent =
		cart.reduce(
			(total, item) =>
				total +
				(item.qty || 0),
			0
		);
}


function renderCart() {

	const box =
		document.getElementById(
			"cartItems"
		);

	const totalBox =
		document.getElementById(
			"cartTotal"
		);


	if (
		!box ||
		!totalBox
	) {
		return;
	}


	if (!cart.length) {

		box.innerHTML =
			"<p>Your cart is empty.</p>";

		totalBox.textContent =
			"₹0";

		return;
	}


	box.innerHTML =
		cart
			.map(
				(item, index) => {

					const itemTotal =
						item.price *
						item.qty;


					return `
						<div class="cart-line">

							<span>
								${index + 1}.
								${escapeHTML(
									item.name
								)}

								${
									item.flavour
										? `<small>${escapeHTML(
												item.flavour
											)}</small>`
										: ""
								}

								${
									item.size
										? `<small>${escapeHTML(
												item.size
											)}</small>`
										: ""
								}
							</span>

							<div class="cart-controls">

								<button
									type="button"
									onclick="changeCartQty(${index},-1)"
								>
									${
										item.qty === 1
											? "🗑"
											: "−"
									}
								</button>

								<strong>
									${item.qty}
								</strong>

								<button
									type="button"
									onclick="changeCartQty(${index},1)"
								>
									+
								</button>

								<b class="cart-item-price">
									₹${itemTotal}
								</b>

							</div>

						</div>
					`;
				}
			)
			.join("");


	const total =
		cart.reduce(
			(sum, item) =>
				sum +
				item.price *
				item.qty,
			0
		);


	totalBox.textContent =
		"₹" + total;
}


function changeCartQty(
	index,
	change
) {

	const item =
		cart[index];


	if (!item) return;


	item.qty += change;


	if (item.qty <= 0) {

		cart.splice(
			index,
			1
		);
	}


	updateCartCount();
	renderCart();
	updateProductButtons();
	updateComboButton();
}


function openCart() {

	const drawer =
		document.getElementById(
			"cartDrawer"
		);


	if (!drawer) return;


	const isOpen =
		drawer.classList.toggle(
			"open"
		);


	if (isOpen) {

		renderCart();
	}


	updatePageScrollLock();
}


function closeCart() {

	document
		.getElementById(
			"cartDrawer"
		)
		?.classList.remove(
			"open"
		);


	updatePageScrollLock();
}


/* =========================
   CHECKOUT
========================= */

function checkout() {

	if (!cart.length) {

		showToast(
			"Your cart is empty"
		);

		return;
	}


	closeCart();

	renderCheckoutItems();


	const message =
		document.getElementById(
			"checkoutMessage"
		);


	if (message) {

		message.textContent =
			"";
	}


	document
		.getElementById(
			"checkoutModal"
		)
		?.classList.add(
			"show"
		);


	updatePageScrollLock();

	updateCodAvailability();
}


function closeCheckout() {

	document
		.getElementById(
			"checkoutModal"
		)
		?.classList.remove(
			"show"
		);


	updatePageScrollLock();
}


function renderCheckoutItems() {

	const box =
		document.getElementById(
			"checkoutItems"
		);

	const totalBox =
		document.getElementById(
			"checkoutTotal"
		);


	if (
		!box ||
		!totalBox
	) {
		return;
	}


	box.innerHTML =
		cart
			.map(
				item =>
					`
					<div class="checkout-item">

						<div>

							<span class="checkout-item-name">
								${escapeHTML(
									item.name
								)}
							</span>

							<span class="checkout-item-detail">
								${
									item.flavour
										? escapeHTML(
												item.flavour
											) +
											" • "
										: ""
								}

								${
									item.size
										? escapeHTML(
												item.size
											) +
											" • "
										: ""
								}

								Qty: ${item.qty}
							</span>

						</div>

						<span class="checkout-item-price">
							₹${
								item.price *
								item.qty
							}
						</span>

					</div>
					`
			)
			.join("");


	const total =
		cart.reduce(
			(sum, item) =>
				sum +
				item.price *
				item.qty,
			0
		);


	totalBox.textContent =
		"₹" + total;
}


/* =========================
   ORDER ID GENERATION
   CLIENT SIDE
========================= */

function generateBizmoOrderId() {

	const now =
		new Date();

	const pad =
		number =>
			String(number).padStart(
				2,
				"0"
			);

	const datePart =
		String(
			now.getFullYear()
		).slice(-2) +
		pad(
			now.getMonth() + 1
		) +
		pad(
			now.getDate()
		);

	const timePart =
		pad(
			now.getHours()
		) +
		pad(
			now.getMinutes()
		) +
		pad(
			now.getSeconds()
		);

	const randomPart =
		String(
			Math.floor(
				Math.random() * 1000
			)
		).padStart(
			3,
			"0"
		);

	return (
		"BZ-" +
		datePart +
		"-" +
		timePart +
		"-" +
		randomPart
	);
}


/* =========================
   SAVE ORDER TO GOOGLE SHEET
========================= */

function saveBizmoOrder(
	order
) {

	if (
		!order ||
		!order.orderId
	) {
		return false;
	}


	const payload = {

		action:
			"saveOrder",

		orderId:
			order.orderId,

		name:
			order.name,

		mobile:
			order.mobile,

		address:
			order.address,

		city:
			order.city,

		pincode:
			order.pincode,

		items:
			order.items,

		total:
			order.total,

		payment:
			order.payment
	};


	const body =
		JSON.stringify(
			payload
		);


	/*
	 * sendBeacon is used because the
	 * Apps Script response does not need
	 * to be read by the browser.
	 *
	 * The request is queued in the
	 * background and does not block the
	 * confirmation popup.
	 */

	try {

		if (
			typeof navigator.sendBeacon ===
			"function"
		) {

			const blob =
				new Blob(
					[
						body
					],
					{
						type:
							"text/plain;charset=UTF-8"
					}
				);


			const queued =
				navigator.sendBeacon(
					BIZMO_ORDER_API_URL,
					blob
				);


			if (queued) {

				return true;
			}
		}

	} catch (error) {

		console.error(
			"Order beacon error:",
			error
		);
	}


	/*
	 * Fallback for browsers where
	 * sendBeacon is unavailable or
	 * unable to queue the request.
	 *
	 * no-cors is intentional because
	 * we do not need to read the response.
	 */

	try {

		fetch(
			BIZMO_ORDER_API_URL,
			{
				method:
					"POST",

				mode:
					"no-cors",

				credentials:
					"omit",

				headers: {
					"Content-Type":
						"text/plain;charset=utf-8"
				},

				body:
					body,

				keepalive:
					true
			}
		)
			.catch(
				error => {

					console.error(
						"Background order save error:",
						error
					);

				}
			);


		return true;

	} catch (error) {

		console.error(
			"Order background save error:",
			error
		);

		return false;
	}
}


/* =========================
   BUILD ORDER ITEMS
========================= */

function buildBizmoOrderItems() {

	return cart
		.map(
			item => {

				let text =
					item.name;

				if (item.flavour) {

					text +=
						" | " +
						item.flavour;
				}

				if (item.size) {

					text +=
						" | " +
						item.size;
				}

				text +=
					" | Qty " +
					item.qty;

				text +=
					" | ₹" +
					(
						item.price *
						item.qty
					);

				return text;

			}
		)
		.join("; ");
}


/* =========================
   PLACE ORDER
========================= */

function placeOrder() {

	const name =
		document
			.getElementById(
				"checkoutName"
			)
			.value.trim();

	const mobile =
		document
			.getElementById(
				"checkoutMobile"
			)
			.value.trim();

	const address =
		document
			.getElementById(
				"checkoutAddress"
			)
			.value.trim();

	const city =
		document
			.getElementById(
				"checkoutCity"
			)
			.value.trim();

	const pin =
		document
			.getElementById(
				"checkoutPincode"
			)
			.value.trim();

	const message =
		document.getElementById(
			"checkoutMessage"
		);


	/* =========================
	   VALIDATION
	========================= */

	if (
		!name ||
		!mobile ||
		!address ||
		!city ||
		!pin
	) {

		message.textContent =
			"Please fill all delivery details.";

		message.style.color =
			"#e31f4f";

		return;
	}


	if (
		!/^[6-9]\d{9}$/.test(
			mobile
		)
	) {

		message.textContent =
			"Please enter a valid 10-digit mobile number.";

		message.style.color =
			"#e31f4f";

		return;
	}


	if (
		!/^\d{6}$/.test(
			pin
		)
	) {

		message.textContent =
			"Please enter a valid 6-digit pincode.";

		message.style.color =
			"#e31f4f";

		return;
	}


	if (!cart.length) {

		message.textContent =
			"Your cart is empty.";

		message.style.color =
			"#e31f4f";

		return;
	}


	/* =========================
	   PAYMENT
	========================= */

	const payment =
		document.querySelector(
			'input[name="paymentMethod"]:checked'
		)?.value ||
		"Cash on Delivery";


	/* =========================
	   COD PINCODE GUARD
	   Blocks bypass attempts even if the
	   disabled COD radio is re-enabled
	   through browser devtools.
	========================= */

	if (
		payment ===
			"Cash on Delivery" &&
		pin !==
			BIZMO_COD_PINCODE
	) {

		message.textContent =
			"Cash on Delivery is not available for your pincode. Please choose Online Payment.";

		message.style.color =
			"#e31f4f";


		const onlineInput =
			document.getElementById(
				"onlinePayment"
			);


		if (onlineInput) {

			onlineInput.checked =
				true;
		}


		updateCodAvailability();


		return;
	}


	/* =========================
	   TOTAL
	========================= */

	const total =
		cart.reduce(
			(sum, item) =>
				sum +
				item.price *
				item.qty,
			0
		);


	/*
	 * IMPORTANT:
	 *
	 * Do NOT wait for Apps Script here.
	 *
	 * The Order ID is generated locally so
	 * WhatsApp can be opened immediately
	 * from the original user click.
	 */

	clearCheckoutStatus();


	const orderId =
		generateBizmoOrderId();


	/* =========================
	   SAVE PENDING ORDER LOCALLY
	========================= */

	const orderItems =
		buildBizmoOrderItems();


	bizmoPendingOrder = {

		orderId:
			orderId,

		name:
			name,

		mobile:
			mobile,

		address:
			address,

		city:
			city,

		pincode:
			pin,

		items:
			orderItems,

		total:
			total,

		payment:
			payment
	};


	/*
	 * Keep a copy in sessionStorage
	 * so the order data survives the
	 * WhatsApp app switch.
	 */

	sessionStorage.setItem(
		"bizmoPendingOrder",
		JSON.stringify(
			bizmoPendingOrder
		)
	);


	/* =========================
	   CREATE WHATSAPP MESSAGE
	========================= */

	let text =
		"New Bizmo Order\n\n" +

		"Order ID: " +
		orderId +

		"\n\nCustomer Details\n" +

		"Name: " +
		name +

		"\nMobile: " +
		mobile +

		"\n\nDelivery Address\n" +

		address +

		"\n" +

		city +

		" - " +

		pin +

		"\n\nOrder Details\n";


	cart.forEach(
		(item, index) => {

			text +=
				`${index + 1}. ${item.name}\n`;


			if (item.flavour) {

				text +=
					`   Flavour: ${item.flavour}\n`;
			}


			if (item.size) {

				text +=
					`   Size: ${item.size}\n`;
			}


			text +=
				`   Qty: ${item.qty}\n` +

				`   Price: ₹${
					item.price *
					item.qty
				}\n\n`;
		}
	);


	text +=
		`Total: ₹${total}\nPayment: ${payment}`;


	/* =========================
	   MARK WHATSAPP ORDER PENDING
	========================= */

	sessionStorage.setItem(
		"bizmoWhatsAppPending",
		"true"
	);


	bizmoWhatsAppLeftPage =
		false;

	bizmoOrderConfirmShown =
		false;

	bizmoWhatsAppOpenedAt =
		Date.now();


	/* =========================
	   OPEN WHATSAPP IMMEDIATELY
	========================= */

	window.open(
		"whatsapp://send?phone=918072381426&text=" +
		encodeURIComponent(text)
	);


	/*
	 * Cart remains unchanged.
	 * Customer details remain unchanged.
	 *
	 * Confirmation is shown only after
	 * the user leaves Bizmo and returns.
	 */
}


/* =========================
   WHATSAPP ORDER CONFIRMATION
========================= */

let bizmoWhatsAppLeftPage =
	false;

let bizmoOrderConfirmShown =
	false;

let bizmoWhatsAppOpenedAt =
	0;


/* =========================
   CREATE CONFIRMATION POPUPS
========================= */

function ensureBizmoOrderConfirmPopups() {

	if (
		document.getElementById(
			"bizmoOrderConfirm"
		)
	) {
		return;
	}


	const wrapper =
		document.createElement(
			"div"
		);

	wrapper.innerHTML = `

		<div
			class="bizmo-order-confirm"
			id="bizmoOrderConfirm"
			aria-hidden="true"
		>

			<div
				class="bizmo-order-confirm-box"
				role="dialog"
				aria-modal="true"
				aria-labelledby="bizmoOrderConfirmTitle"
			>

				<h2 id="bizmoOrderConfirmTitle">
					WhatsApp Order
				</h2>

				<p>
					Did you send the order message on WhatsApp?
					<br><br>
					If you already tapped Send, choose
					<strong>“Order Sent.”</strong>
				</p>

				<div class="bizmo-order-confirm-actions">

					<button
						type="button"
						id="orderSentBtn"
						class="bizmo-order-btn primary"
					>
						✓ Order Sent
					</button>

					<button
						type="button"
						id="editOrderBtn"
						class="bizmo-order-btn secondary"
					>
						✎ I Want to Edit
					</button>

				</div>

			</div>

		</div>


		<div
			class="bizmo-order-confirm"
			id="bizmoEditConfirm"
			aria-hidden="true"
		>

			<div
				class="bizmo-order-confirm-box"
				role="dialog"
				aria-modal="true"
				aria-labelledby="bizmoEditConfirmTitle"
			>

				<h2 id="bizmoEditConfirmTitle">
					Edit Order?
				</h2>

				<p>
					If you already sent the WhatsApp message,
					editing and sending again may create a
					duplicate order.
				</p>

				<div class="bizmo-order-confirm-actions">

					<button
						type="button"
						id="keepOrderSentBtn"
						class="bizmo-order-btn primary"
					>
						✓ Keep Order Sent
					</button>

					<button
						type="button"
						id="continueEditingBtn"
						class="bizmo-order-btn secondary"
					>
						✎ Continue Editing
					</button>

				</div>

			</div>

		</div>

	`;


	while (
		wrapper.firstElementChild
	) {

		document.body.appendChild(
			wrapper.firstElementChild
		);
	}
}


/* =========================
   SUCCESS POPUP STYLE
========================= */

function ensureBizmoSuccessPopup() {

	if (
		document.getElementById(
			"bizmoOrderSuccess"
		)
	) {
		return;
	}


	const style =
		document.createElement(
			"style"
		);

	style.id =
		"bizmoOrderSuccessStyles";


	style.textContent = `

		.bizmo-order-success {
			position: fixed;
			inset: 0;
			z-index: 99999;
			display: none;
			align-items: center;
			justify-content: center;
			padding: 20px;
			background: rgba(0,0,0,0.68);
			box-sizing: border-box;
		}

		.bizmo-order-success.show {
			display: flex;
		}

		.bizmo-order-success-box {
			position: relative;
			width: min(92vw, 460px);
			background: #ffffff;
			border-radius: 22px;
			padding: 34px 24px 26px;
			text-align: center;
			box-shadow: 0 20px 60px rgba(0,0,0,0.25);
			box-sizing: border-box;
			animation: bizmoSuccessPop 0.25s ease-out;
		}

		@keyframes bizmoSuccessPop {
			from {
				opacity: 0;
				transform: scale(0.94);
			}

			to {
				opacity: 1;
				transform: scale(1);
			}
		}

		.bizmo-success-close-x {
			position: absolute;
			top: 10px;
			right: 12px;
			width: 38px;
			height: 38px;
			border: 0;
			background: transparent;
			font-size: 26px;
			line-height: 1;
			cursor: pointer;
			color: #555;
			border-radius: 50%;
		}

		.bizmo-success-close-x:hover {
			background: #f2f2f2;
		}

		.bizmo-success-icon {
			width: 64px;
			height: 64px;
			margin: 0 auto 16px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #fbf4e3;
			color: #a5813d;
			font-size: 34px;
			font-weight: 700;
		}

		.bizmo-order-success-box h2 {
			margin: 0 0 10px;
			font-size: 25px;
			color: #222;
		}

		.bizmo-success-message {
			margin: 0 auto 20px;
			color: #666;
			font-size: 15px;
			line-height: 1.55;
		}

		.bizmo-success-order-label {
			margin-top: 10px;
			font-size: 13px;
			font-weight: 600;
			color: #777;
			text-transform: uppercase;
			letter-spacing: 0.7px;
		}

		.bizmo-success-order-id {
			margin: 8px 0 18px;
			padding: 14px 12px;
			border-radius: 12px;
			background: #faf7f0;
			color: #111;
			font-size: 24px;
			font-weight: 800;
			letter-spacing: 0.8px;
			word-break: break-word;
		}

		.bizmo-success-note {
			margin: 0 0 20px;
			font-size: 13px;
			color: #777;
			line-height: 1.45;
		}

		.bizmo-success-close-btn {
			width: 100%;
			border: 0;
			border-radius: 12px;
			padding: 13px 18px;
			font-size: 16px;
			font-weight: 700;
			cursor: pointer;
			background: #0c3b2e;
			color: #fff;
		}

		.bizmo-success-close-btn:hover {
			opacity: 0.9;
		}

		@media (max-width: 480px) {

			.bizmo-order-success {
				padding: 14px;
			}

			.bizmo-order-success-box {
				padding: 32px 18px 22px;
				border-radius: 18px;
			}

			.bizmo-order-success-box h2 {
				font-size: 22px;
			}

			.bizmo-success-order-id {
				font-size: 21px;
			}
		}
	`;


	document.head.appendChild(
		style
	);


	const wrapper =
		document.createElement(
			"div"
		);


	wrapper.innerHTML = `

		<div
			class="bizmo-order-success"
			id="bizmoOrderSuccess"
			aria-hidden="true"
		>

			<div
				class="bizmo-order-success-box"
				role="dialog"
				aria-modal="true"
				aria-labelledby="bizmoSuccessTitle"
			>

				<button
					type="button"
					class="bizmo-success-close-x"
					id="bizmoSuccessCloseX"
					aria-label="Close"
				>
					×
				</button>

				<div class="bizmo-success-icon">
					✓
				</div>

				<h2 id="bizmoSuccessTitle">
					Order Placed Successfully
				</h2>

				<p class="bizmo-success-message">
					Thank you for your order!<br>
					Your order has been confirmed successfully.
				</p>

				<div class="bizmo-success-order-label">
					Order ID
				</div>

				<div
					class="bizmo-success-order-id"
					id="bizmoSuccessOrderId"
				>
					-
				</div>

				<p class="bizmo-success-note">
					Please save this Order ID for your reference.
					You can also take a screenshot of this confirmation.
				</p>

				<button
					type="button"
					class="bizmo-success-close-btn"
					id="bizmoSuccessCloseBtn"
				>
					Close
				</button>

			</div>

		</div>

	`;


	document.body.appendChild(
		wrapper.firstElementChild
	);
}


/* =========================
   SUCCESS POPUP HELPERS
========================= */

function showBizmoOrderSuccess(
	orderId
) {

	ensureBizmoSuccessPopup();


	const popup =
		document.getElementById(
			"bizmoOrderSuccess"
		);

	const orderIdElement =
		document.getElementById(
			"bizmoSuccessOrderId"
		);


	if (!popup) return;


	if (orderIdElement) {

		orderIdElement.textContent =
			orderId || "-";
	}


	popup.classList.add(
		"show"
	);


	popup.setAttribute(
		"aria-hidden",
		"false"
	);


	updatePageScrollLock();
}


function closeBizmoOrderSuccess() {

	const popup =
		document.getElementById(
			"bizmoOrderSuccess"
		);


	if (!popup) return;


	popup.classList.remove(
		"show"
	);


	popup.setAttribute(
		"aria-hidden",
		"true"
	);


	updatePageScrollLock();
}


/* =========================
   POPUP HELPERS
========================= */

function showBizmoOrderConfirm() {

	ensureBizmoOrderConfirmPopups();


	const popup =
		document.getElementById(
			"bizmoOrderConfirm"
		);


	if (!popup) return;


	if (
		bizmoOrderConfirmShown
	) {
		return;
	}


	bizmoOrderConfirmShown =
		true;


	popup.classList.add(
		"show"
	);


	popup.setAttribute(
		"aria-hidden",
		"false"
	);


	updatePageScrollLock();
}


function closeBizmoOrderConfirm() {

	const popup =
		document.getElementById(
			"bizmoOrderConfirm"
		);


	if (!popup) return;


	popup.classList.remove(
		"show"
	);


	popup.setAttribute(
		"aria-hidden",
		"true"
	);


	updatePageScrollLock();
}


function showBizmoEditConfirm() {

	ensureBizmoOrderConfirmPopups();


	const popup =
		document.getElementById(
			"bizmoEditConfirm"
		);


	if (!popup) return;


	popup.classList.add(
		"show"
	);


	popup.setAttribute(
		"aria-hidden",
		"false"
	);


	updatePageScrollLock();
}


function closeBizmoEditConfirm() {

	const popup =
		document.getElementById(
			"bizmoEditConfirm"
		);


	if (!popup) return;


	popup.classList.remove(
		"show"
	);


	popup.setAttribute(
		"aria-hidden",
		"true"
	);


	updatePageScrollLock();
}


/* =========================
   CLEAR CHECKOUT DETAILS
========================= */

function clearCheckoutStatus() {

	const message =
		document.getElementById(
			"checkoutMessage"
		);

	if (!message) return;

	message.textContent = "";

	message.style.color = "";
}


function clearCheckoutDetails() {

	const fields = [
		"checkoutName",
		"checkoutMobile",
		"checkoutAddress",
		"checkoutCity",
		"checkoutPincode"
	];


	fields.forEach(
		id => {

			const field =
				document.getElementById(
					id
				);


			if (field) {

				field.value =
					"";
			}

		}
	);


	const message =
		document.getElementById(
			"checkoutMessage"
		);


	if (message) {

		message.textContent =
			"";

		message.style.color =
			"";
	}
}


/* =========================
   LOAD PENDING ORDER
========================= */

function loadBizmoPendingOrder() {

	const saved =
		sessionStorage.getItem(
			"bizmoPendingOrder"
		);


	if (!saved) {
		return;
	}


	try {

		const parsed =
			JSON.parse(
				saved
			);


		if (
			parsed &&
			parsed.orderId
		) {

			bizmoPendingOrder =
				parsed;
		}

	} catch (error) {

		console.error(
			"Pending order load error:",
			error
		);

		sessionStorage.removeItem(
			"bizmoPendingOrder"
		);
	}
}


/* =========================
   FINALIZE ORDER
========================= */

function finalizeBizmoOrder() {

	if (bizmoOrderSaving) {
		return;
	}


	loadBizmoPendingOrder();


	if (
		!bizmoPendingOrder ||
		!bizmoPendingOrder.orderId
	) {

		showToast(
			"Order details not found. Please try again."
		);

		return;
	}


	bizmoOrderSaving =
		true;


	const order =
		bizmoPendingOrder;


	/*
	 * Save in the background.
	 *
	 * sendBeacon/fetch does not wait for
	 * the Apps Script response, so the
	 * customer is not stuck on the popup.
	 */

	const saveQueued =
		saveBizmoOrder(
			order
		);


	if (!saveQueued) {

		bizmoOrderSaving =
			false;


		showToast(
			"Unable to save order. Please try again."
		);


		return;
	}


	/* =========================
	   FINALIZE LOCAL ORDER STATE
	========================= */

	sessionStorage.removeItem(
		"bizmoWhatsAppPending"
	);

	sessionStorage.removeItem(
		"bizmoPendingOrder"
	);


	bizmoPendingOrder =
		null;


	bizmoWhatsAppLeftPage =
		false;

	bizmoOrderConfirmShown =
		false;

	bizmoWhatsAppOpenedAt =
		0;


	closeBizmoOrderConfirm();

	closeBizmoEditConfirm();


	/* CLEAR CART */

	cart = [];


	updateCartCount();

	renderCart();

	updateProductButtons();

	updateComboButton();


	/* CLEAR CUSTOMER DETAILS */

	clearCheckoutDetails();


	/* CLOSE CHECKOUT */

	closeCheckout();


	bizmoOrderSaving =
		false;


	/* =========================
	   FINAL SUCCESS POPUP
	========================= */

	showBizmoOrderSuccess(
		order.orderId
	);
}


/* =========================
   ORDER CONFIRMATION BUTTONS
========================= */

document.addEventListener(
	"click",
	e => {

		/* ORDER SENT */

		const orderSentButton =
			e.target.closest(
				"#orderSentBtn"
			);


		if (orderSentButton) {

			e.preventDefault();

			finalizeBizmoOrder();

			return;
		}


		/* I WANT TO EDIT */

		const editOrderButton =
			e.target.closest(
				"#editOrderBtn"
			);


		if (editOrderButton) {

			e.preventDefault();

			clearCheckoutStatus();


			/*
			 * Stop Popup 1 from appearing again.
			 *
			 * Cart and customer details
			 * remain untouched.
			 */

			sessionStorage.removeItem(
				"bizmoWhatsAppPending"
			);


			bizmoWhatsAppLeftPage =
				false;

			bizmoWhatsAppOpenedAt =
				0;


			closeBizmoOrderConfirm();

			showBizmoEditConfirm();

			return;
		}


		/* KEEP ORDER SENT */

		const keepOrderSentButton =
			e.target.closest(
				"#keepOrderSentBtn"
			);


		if (keepOrderSentButton) {

			e.preventDefault();

			finalizeBizmoOrder();

			return;
		}


		/* CONTINUE EDITING */

		const continueEditingButton =
			e.target.closest(
				"#continueEditingBtn"
			);


		if (continueEditingButton) {

			e.preventDefault();

			clearCheckoutStatus();

			closeBizmoEditConfirm();

			updatePageScrollLock();

			return;
		}


		/* SUCCESS POPUP X */

		const successCloseX =
			e.target.closest(
				"#bizmoSuccessCloseX"
			);


		if (successCloseX) {

			e.preventDefault();

			closeBizmoOrderSuccess();

			return;
		}


		/* SUCCESS POPUP CLOSE */

		const successCloseButton =
			e.target.closest(
				"#bizmoSuccessCloseBtn"
			);


		if (successCloseButton) {

			e.preventDefault();

			closeBizmoOrderSuccess();

			return;
		}

	},
	true
);


/* =========================
   WHATSAPP RETURN CHECK
========================= */

function checkBizmoWhatsAppReturn() {

	const pending =
		sessionStorage.getItem(
			"bizmoWhatsAppPending"
		);


	if (
		pending !== "true"
	) {
		return;
	}


	if (
		!bizmoWhatsAppLeftPage
	) {
		return;
	}


	if (
		bizmoOrderConfirmShown
	) {
		return;
	}


	if (
		bizmoWhatsAppOpenedAt &&
		Date.now() -
			bizmoWhatsAppOpenedAt <
			1500
	) {
		return;
	}


	bizmoWhatsAppLeftPage =
		false;

	clearCheckoutStatus();

	showBizmoOrderConfirm();
}


/* =========================
   PAGE / APP LEAVE
========================= */

function markBizmoWhatsAppLeftPage() {

	const pending =
		sessionStorage.getItem(
			"bizmoWhatsAppPending"
		);


	if (
		pending === "true"
	) {

		bizmoWhatsAppLeftPage =
			true;
	}
}


/* =========================
   VISIBILITY CHANGE
========================= */

document.addEventListener(
	"visibilitychange",
	() => {

		if (
			document.visibilityState ===
			"hidden"
		) {

			markBizmoWhatsAppLeftPage();

			return;
		}


		if (
			document.visibilityState ===
			"visible"
		) {

			checkBizmoWhatsAppReturn();
		}

	}
);


/*
 * IMPORTANT:
 *
 * Do NOT use window blur/focus here.
 *
 * Android can trigger blur/focus when
 * the "Open with" WhatsApp chooser
 * appears or disappears.
 *
 * visibilitychange is used instead.
 */


/* =========================
   TOAST
========================= */

function showToast(text) {

	const toast =
		document.getElementById(
			"toast"
		);


	if (!toast) return;


	toast.textContent =
		text + " ✓";


	toast.classList.add(
		"show"
	);


	setTimeout(
		() => {

			toast.classList.remove(
				"show"
			);

		},
		1500
	);
}


/* =========================
   SEARCH
========================= */

function filterProducts() {

	const query =
		(
			document.getElementById(
				"search"
			)?.value || ""
		)
			.toLowerCase()
			.trim();


	document
		.querySelectorAll(
			".product-card"
		)
		.forEach(
			card => {

				card.style.display =
					(
						card.dataset.name ||
						""
					)
						.toLowerCase()
						.includes(
							query
						)
						? ""
						: "none";

			}
		);
}


function focusSearch() {

	const search =
		document.getElementById(
			"search"
		);


	document
		.getElementById(
			"shop"
		)
		?.scrollIntoView({
			behavior:
				"smooth"
		});


	setTimeout(
		() => {

			search?.focus();

		},
		300
	);
}


/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {

	const menu =
		document.getElementById(
			"navMenu"
		);


	const button =
		document.querySelector(
			".mobile-menu"
		);


	if (!menu) return;


	const isOpen =
		menu.classList.toggle(
			"show"
		);


	button?.classList.toggle(
		"menu-open",
		isOpen
	);


	updatePageScrollLock();
}


function highlightContact(e) {

	e?.preventDefault();


	const contact =
		document.getElementById(
			"contact"
		);


	contact?.scrollIntoView({
		behavior:
			"smooth",

		block:
			"center"
	});


	setTimeout(
		() => {

			contact.classList.remove(
				"contact-highlight"
			);


			void contact.offsetWidth;


			contact.classList.add(
				"contact-highlight"
			);

		},
		500
	);
}


function joinWhatsApp() {

	window.open(
		"https://chat.whatsapp.com/CSDbKCy53Yz1gKs1dbX1bx?s=cl&p=a&mlu=4&ilr=4",
		"_blank"
	);
}


function sendQuery() {

	const nameInput =
		document.getElementById(
			"queryName"
		);

	const mobileInput =
		document.getElementById(
			"queryMobile"
		);

	const messageInput =
		document.getElementById(
			"queryMessage"
		);


	const name =
		nameInput.value.trim();

	const mobile =
		mobileInput.value.trim();

	const message =
		messageInput.value.trim();


	if (
		!name ||
		!mobile ||
		!message
	) {

		showToast(
			"Please fill all fields"
		);

		return;
	}


	if (
		!/^[6-9]\d{9}$/.test(
			mobile
		)
	) {

		showToast(
			"Enter a valid mobile number"
		);

		return;
	}


	window.open(
		"https://wa.me/918072381426?text=" +
		encodeURIComponent(
			`New Bizmo Customer Query\n\nName: ${name}\nMobile: ${mobile}\n\nQuery / Feedback:\n${message}`
		),
		"_blank"
	);


	nameInput.value =
		"";

	mobileInput.value =
		"";

	messageInput.value =
		"";
}


/* =========================
   PRODUCT VIEW
========================= */

function setProductView(
	columns
) {

	const productGrid =
		document.querySelector(
			".product-grid"
		);


	if (!productGrid) return;


	productGrid.style.gridTemplateColumns =
		columns === 2
			? "repeat(2,minmax(0,1fr))"
			: "1fr";


	document
		.getElementById(
			"viewOne"
		)
		?.classList.toggle(
			"active",
			columns === 1
		);


	document
		.getElementById(
			"viewTwo"
		)
		?.classList.toggle(
			"active",
			columns === 2
		);
}


/* =========================
   CATEGORY FILTER
========================= */

let selectedCategory =
	"";


const categoryProducts = {

	home: [
		"Toilet Cleaner",
		"Phenyl",
		"Room Spray",
		"Soap Oil"
	],

	kitchen: [
		"Dish Wash Liquid",
		"Washing Liquid",
		"Fabric Conditioner"
	],

	surface: [
		"Floor Cleaner",
		"Glass Cleaner",
		"Tile Salt"
	],

	personal: [
		"Handwash"
	]
};


function filterCategory(
	category
) {

	if (
		selectedCategory ===
		category
	) {

		showAllProducts();

		return;
	}


	selectedCategory =
		category;


	const search =
		document.getElementById(
			"search"
		);


	if (search) {

		search.value =
			"";
	}


	document
		.querySelectorAll(
			".product-card"
		)
		.forEach(
			card => {

				card.style.display =
					(
						categoryProducts[
							category
						] || []
					)
						.includes(
							card.dataset.name
						)
						? ""
						: "none";

			}
		);


	updateCategorySelection();


	document
		.getElementById(
			"shop"
		)
		?.scrollIntoView({
			behavior:
				"smooth"
		});


	document.activeElement?.blur();
}


function showAllProducts() {

	selectedCategory =
		"";


	const search =
		document.getElementById(
			"search"
		);


	if (search) {

		search.value =
			"";
	}


	document
		.querySelectorAll(
			".product-card"
		)
		.forEach(
			card => {

				card.style.display =
					"";

			}
		);


	updateCategorySelection();
}


function updateCategorySelection() {

	document
		.querySelectorAll(
			".category-pill"
		)
		.forEach(
			button => {

				button.classList.remove(
					"category-selected"
				);

			}
		);


	const activeCategory =
		selectedCategory ||
		"all";


	document
		.querySelector(
			`.category-pill[data-category="${activeCategory}"]`
		)
		?.classList.add(
			"category-selected"
		);
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

	return String(value)
		.replace(
			/&/g,
			"&amp;"
		)
		.replace(
			/</g,
			"&lt;"
		)
		.replace(
			/>/g,
			"&gt;"
		)
		.replace(
			/"/g,
			"&quot;"
		)
		.replace(
			/'/g,
			"&#039;"
		);
}


/* =========================
   GLOBAL CLICK HANDLER
========================= */

document.addEventListener(
	"click",
	e => {

		const menu =
			document.getElementById(
				"navMenu"
			);


		const hamburger =
			e.target.closest(
				'[onclick*="toggleMenu"]'
			);


		if (
			menu &&
			!menu.contains(e.target) &&
			!hamburger
		) {

			menu.classList.remove(
				"show"
			);


			document
				.querySelector(
					".mobile-menu"
				)
				?.classList.remove(
					"menu-open"
				);


			updatePageScrollLock();
		}


		const cartDrawer =
			document.getElementById(
				"cartDrawer"
			);


		if (
			e.target ===
			cartDrawer
		) {

			closeCart();
		}


		if (
			e.target ===
			document.getElementById(
				"productModal"
			)
		) {

			closeProductOptions();
		}

	}
);


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
	"keydown",
	e => {

		if (
			e.key ===
			"Escape"
		) {

			const orderConfirmOpen =
				document
					.getElementById(
						"bizmoOrderConfirm"
					)
					?.classList.contains(
						"show"
					);


			const editConfirmOpen =
				document
					.getElementById(
						"bizmoEditConfirm"
					)
					?.classList.contains(
						"show"
					);


			const successOpen =
				document
					.getElementById(
						"bizmoOrderSuccess"
					)
					?.classList.contains(
						"show"
					);


			if (successOpen) {

				closeBizmoOrderSuccess();

				return;
			}


			if (
				orderConfirmOpen ||
				editConfirmOpen
			) {
				return;
			}


			closeProductOptions();

			closeCart();

			closeCheckout();

		}

	}
);


/* =========================
   HERO SLIDER
========================= */

let heroSlideIndex =
	0;

let heroStartX =
	0;

let heroCurrentX =
	0;

let heroDragging =
	false;

let heroAutoSlide;


function goToHeroSlide(
	index
) {

	const slides =
		document.querySelectorAll(
			".hero-slide"
		);

	const dots =
		document.querySelectorAll(
			".hero-dot"
		);


	if (!slides.length) {
		return;
	}


	if (index < 0) {

		index =
			slides.length - 1;
	}


	if (
		index >=
		slides.length
	) {

		index =
			0;
	}


	slides.forEach(
		(slide, i) => {

			slide.classList.remove(
				"active",
				"previous"
			);


			if (i === index) {

				slide.classList.add(
					"active"
				);

			} else if (i < index) {

				slide.classList.add(
					"previous"
				);
			}

		}
	);


	dots.forEach(
		(dot, i) => {

			dot.classList.toggle(
				"active",
				i === index
			);

		}
	);


	heroSlideIndex =
		index;
}


function nextHeroSlide() {

	goToHeroSlide(
		heroSlideIndex + 1
	);
}


function startHeroAutoSlide() {

	clearInterval(
		heroAutoSlide
	);


	heroAutoSlide =
		setInterval(
			() => {

				nextHeroSlide();

			},
			4500
		);
}


function initializeHeroSlider() {

	const hero =
		document.getElementById(
			"heroBanner"
		);


	if (!hero) return;


	hero.addEventListener(
		"touchstart",
		e => {

			heroStartX =
				heroCurrentX =
					e.touches[0].clientX;

			heroDragging =
				true;

		},
		{
			passive: true
		}
	);


	hero.addEventListener(
		"touchmove",
		e => {

			if (
				heroDragging
			) {

				heroCurrentX =
					e.touches[0].clientX;
			}

		},
		{
			passive: true
		}
	);


	hero.addEventListener(
		"touchend",
		() => {

			if (!heroDragging) {
				return;
			}


			const distance =
				heroCurrentX -
				heroStartX;


			heroDragging =
				false;


			if (
				Math.abs(distance) >= 50
			) {

				if (
					distance < 0
				) {

					nextHeroSlide();

				} else {

					goToHeroSlide(
						heroSlideIndex -
							1
					);
				}


				startHeroAutoSlide();
			}

		}
	);


	hero.addEventListener(
		"mousedown",
		e => {

			heroStartX =
				heroCurrentX =
					e.clientX;

			heroDragging =
				true;

		}
	);


	hero.addEventListener(
		"mousemove",
		e => {

			if (
				heroDragging
			) {

				heroCurrentX =
					e.clientX;
			}

		}
	);


	hero.addEventListener(
		"mouseup",
		() => {

			if (!heroDragging) {
				return;
			}


			const distance =
				heroCurrentX -
				heroStartX;


			heroDragging =
				false;


			if (
				Math.abs(distance) >= 50
			) {

				if (
					distance < 0
				) {

					nextHeroSlide();

				} else {

					goToHeroSlide(
						heroSlideIndex -
							1
					);
				}


				startHeroAutoSlide();
			}

		}
	);


	hero.addEventListener(
		"mouseleave",
		() => {

			heroDragging =
				false;

		}
	);


	goToHeroSlide(
		0
	);

	startHeroAutoSlide();
}


/* =========================
   COMBO SLIDER
========================= */

function initializeComboSlider() {

	const comboSlider =
		document.querySelector(
			".combo-slider"
		);

	const comboCards =
		document.querySelectorAll(
			".combo-slider .combo-card"
		);

	const comboDots =
		document.querySelectorAll(
			".combo-dot"
		);


	if (
		!comboSlider ||
		!comboCards.length
	) {
		return;
	}


	comboDots.forEach(
		(dot, index) => {

			dot.addEventListener(
				"click",
				() => {

					const card =
						comboCards[
							index
						];


					if (!card) {
						return;
					}


					comboSlider.scrollTo({
						left:
							card.offsetLeft,

						behavior:
							"smooth"
					});

				}
			);

		}
	);


	const updateActiveComboDot =
		() => {

			if (
				!comboDots.length
			) {
				return;
			}


			const sliderCenter =
				comboSlider.scrollLeft +
				comboSlider.clientWidth /
					2;


			let activeIndex =
				0;

			let smallestDistance =
				Infinity;


			comboCards.forEach(
				(card, index) => {

					const cardCenter =
						card.offsetLeft +
						card.offsetWidth /
							2;


					const distance =
						Math.abs(
							sliderCenter -
							cardCenter
						);


					if (
						distance <
						smallestDistance
					) {

						smallestDistance =
							distance;

						activeIndex =
							index;
					}

				}
			);


			comboDots.forEach(
				(dot, index) => {

					dot.classList.toggle(
						"active",
						index ===
							activeIndex
					);

				}
			);
		};


	comboSlider.addEventListener(
		"scroll",
		updateActiveComboDot
	);


	updateActiveComboDot();
}


/* =========================
   INITIALIZE
========================= */

document.addEventListener(
	"DOMContentLoaded",
	() => {

		ensureBizmoOrderConfirmPopups();

		ensureBizmoSuccessPopup();

		loadBizmoPendingOrder();


		updateCartCount();

		renderCart();

		updateProductButtons();

		updateComboButton();

		initializeHandwashSlider();

		initializeHeroSlider();

		initializeComboSlider();


		document
			.querySelectorAll(
				"#navMenu a"
			)
			.forEach(
				link => {

					link.addEventListener(
						"click",
						() => {

							document
								.getElementById(
									"navMenu"
								)
								?.classList.remove(
									"show"
								);


							document
								.querySelector(
									".mobile-menu"
								)
								?.classList.remove(
									"menu-open"
								);


							updatePageScrollLock();

						}
					);

				}
			);

	}
);


/* =========================
   BACK TO TOP
   SHOW ONLY WHILE SCROLLING
========================= */

document.addEventListener(
	"DOMContentLoaded",
	() => {

		const backToTop =
			document.getElementById(
				"backToTop"
			);


		if (!backToTop) {
			return;
		}


		let hideTimer;


		function showBackToTop() {

			if (
				window.scrollY <= 300
			) {

				backToTop.classList.remove(
					"show"
				);

				return;
			}


			backToTop.classList.add(
				"show"
			);


			clearTimeout(
				hideTimer
			);


			hideTimer =
				setTimeout(
					() => {

						backToTop.classList.remove(
							"show"
						);

					},
					800
				);
		}


		window.addEventListener(
			"scroll",
			showBackToTop,
			{
				passive: true
			}
		);


		backToTop.addEventListener(
			"click",
			() => {

				clearTimeout(
					hideTimer
				);


				window.scrollTo({
					top:
						0,

					left:
						0,

					behavior:
						"smooth"
				});

			}
		);


		backToTop.classList.remove(
			"show"
		);

	}
);


/* =========================
   FAQ ACCORDION
========================= */

document.addEventListener(
	"DOMContentLoaded",
	() => {

		const faqItems =
			document.querySelectorAll(
				".faq-item"
			);


		faqItems.forEach(
			item => {

				const question =
					item.querySelector(
						".faq-question"
					);

				const icon =
					item.querySelector(
						".faq-icon"
					);


				if (!question) {
					return;
				}


				question.addEventListener(
					"click",
					() => {

						const isOpen =
							item.classList.contains(
								"active"
							);


						faqItems.forEach(
							otherItem => {

								otherItem.classList.remove(
									"active"
								);


								const otherIcon =
									otherItem.querySelector(
										".faq-icon"
									);


								if (
									otherIcon
								) {

									otherIcon.textContent =
										"+";
								}

							}
						);


						if (!isOpen) {

							item.classList.add(
								"active"
							);


							if (icon) {

								icon.textContent =
									"−";
							}

						}

					}
				);

			}
		);

	}
);


/* =========================
   CUSTOMER REVIEWS
   LIVE GOOGLE SHEET
========================= */

document.addEventListener(
	"DOMContentLoaded",
	() => {

		const SHEET_URL =
			"https://docs.google.com/spreadsheets/d/e/2PACX-1vSmXiutzdxicv_r8FD0pPAfLgzHbqS0CQARbPwiS6jsehoIMgm4WuVdSaiSkBboHOx4ejqvj8x48njU/pub?gid=0&single=true&output=csv";


		const slider =
			document.getElementById(
				"reviewsSlider"
			);

		const dotsContainer =
			document.getElementById(
				"reviewDots"
			);

		const prevButton =
			document.querySelector(
				".review-prev"
			);

		const nextButton =
			document.querySelector(
				".review-next"
			);

		const stats =
			document.getElementById(
				"reviewStats"
			);


		if (
			!slider ||
			!dotsContainer
		) {
			return;
		}


		let reviews = [];

		let currentReview =
			0;


		/* =========================
		   CSV PARSER
		========================= */

		function parseCSV(text) {

			const rows = [];

			let row = [];

			let value = "";

			let insideQuotes =
				false;


			for (
				let i = 0;
				i < text.length;
				i++
			) {

				const char =
					text[i];

				const next =
					text[i + 1];


				if (
					char === '"' &&
					insideQuotes &&
					next === '"'
				) {

					value += '"';

					i++;

					continue;
				}


				if (
					char === '"'
				) {

					insideQuotes =
						!insideQuotes;

					continue;
				}


				if (
					char === "," &&
					!insideQuotes
				) {

					row.push(
						value.trim()
					);

					value =
						"";

					continue;
				}


				if (
					(
						char === "\n" ||
						char === "\r"
					) &&
					!insideQuotes
				) {

					if (
						char === "\r" &&
						next === "\n"
					) {

						i++;
					}


					row.push(
						value.trim()
					);


					if (
						row.some(
							cell =>
								cell !== ""
						)
					) {

						rows.push(
							row
						);
					}


					row = [];

					value =
						"";

					continue;
				}


				value +=
					char;
			}


			if (
				value !== "" ||
				row.length
			) {

				row.push(
					value.trim()
				);


				if (
					row.some(
						cell =>
							cell !== ""
					)
				) {

					rows.push(
						row
					);
				}
			}


			return rows;
		}


		/* =========================
		   REVIEW STARS
		========================= */

		function createStars(
			rating
		) {

			const number =
				Math.max(
					0,
					Math.min(
						5,
						Number(
							rating
						) || 0
					)
				);


			return (
				"★".repeat(
					number
				) +
				"☆".repeat(
					5 - number
				)
			);
		}


		/* =========================
		   ESCAPE HTML
		========================= */

		function escapeHTML(
			value
		) {

			return String(
				value ?? ""
			)
				.replace(
					/&/g,
					"&amp;"
				)
				.replace(
					/</g,
					"&lt;"
				)
				.replace(
					/>/g,
					"&gt;"
				)
				.replace(
					/"/g,
					"&quot;"
				)
				.replace(
					/'/g,
					"&#039;"
				);
		}


		/* =========================
		   RENDER REVIEWS
		========================= */

		function renderReviews() {

			slider.innerHTML =
				"";

			dotsContainer.innerHTML =
				"";


			if (
				!reviews.length
			) {

				slider.innerHTML = `
					<article class="review-card active">

						<div class="review-stars">
							☆☆☆☆☆
						</div>

						<p class="review-text">
							Customer reviews will appear here soon.
						</p>

						<div class="review-author">

							<div class="review-avatar">
								B
							</div>

							<div>

								<strong>
									Bizmo Chemicals
								</strong>

								<small>
									Customer Reviews
								</small>

							</div>

						</div>

					</article>
				`;

				return;
			}


			reviews.forEach(
				(review, index) => {

					const firstLetter =
						(
							review.name ||
							"C"
						)
							.charAt(0)
							.toUpperCase();


					const card =
						document.createElement(
							"article"
						);


					card.className =
						`review-card ${
							index === 0
								? "active"
								: ""
						}`;


					card.innerHTML = `

						<div class="review-stars">
							${createStars(
								review.rating
							)}
						</div>

						<p class="review-text">
							${escapeHTML(
								review.text
							)}
						</p>

						<div class="review-author">

							<div class="review-avatar">
								${escapeHTML(
									firstLetter
								)}
							</div>

							<div>

								<strong>
									${escapeHTML(
										review.name
									)}
								</strong>

								<small>
									${escapeHTML(
										review.product
									)}
								</small>

							</div>

						</div>

					`;


					slider.appendChild(
						card
					);


					const dot =
						document.createElement(
							"button"
						);


					dot.className =
						`review-dot ${
							index === 0
								? "active"
								: ""
						}`;


					dot.type =
						"button";


					dot.setAttribute(
						"aria-label",
						`Review ${index + 1}`
					);


					dot.addEventListener(
						"click",
						() => {

							showReview(
								index
							);

						}
					);


					dotsContainer.appendChild(
						dot
					);

				}
			);


			currentReview =
				0;
		}


		/* =========================
		   SHOW REVIEW
		========================= */

		function showReview(
			index
		) {

			const cards =
				slider.querySelectorAll(
					".review-card"
				);

			const dots =
				dotsContainer.querySelectorAll(
					".review-dot"
				);


			if (!cards.length) {
				return;
			}


			currentReview =
				(
					index +
					cards.length
				) %
				cards.length;


			cards.forEach(
				(card, i) => {

					card.classList.toggle(
						"active",
						i ===
							currentReview
					);

				}
			);


			dots.forEach(
				(dot, i) => {

					dot.classList.toggle(
						"active",
						i ===
							currentReview
					);

				}
			);
		}


		/* =========================
		   PREVIOUS REVIEW
		========================= */

		if (prevButton) {

			prevButton.addEventListener(
				"click",
				() => {

					showReview(
						currentReview -
							1
					);

				}
			);
		}


		/* =========================
		   NEXT REVIEW
		========================= */

		if (nextButton) {

			nextButton.addEventListener(
				"click",
				() => {

					showReview(
						currentReview +
							1
					);

				}
			);
		}


		/* =========================
		   MOBILE SWIPE
		========================= */

		let touchStartX =
			0;


		slider.addEventListener(
			"touchstart",
			event => {

				touchStartX =
					event
						.changedTouches[0]
						.screenX;

			},
			{
				passive: true
			}
		);


		slider.addEventListener(
			"touchend",
			event => {

				const touchEndX =
					event
						.changedTouches[0]
						.screenX;


				const distance =
					touchEndX -
					touchStartX;


				if (
					Math.abs(
						distance
					) < 50
				) {
					return;
				}


				if (
					distance < 0
				) {

					showReview(
						currentReview +
							1
					);

				} else {

					showReview(
						currentReview -
							1
					);
				}

			},
			{
				passive: true
			}
		);


		/* =========================
		   REVIEW STATS
		   GOOGLE SHEET G:H
		========================= */

		function setMetricTarget(
			metrics,
			metricName,
			target
		) {

			if (!stats) {
				return;
			}


			const counter =
				Array.from(
					stats.querySelectorAll(
						".review-count"
					)
				).find(
					element =>
						element.dataset
							.metric ===
						metricName
				);


			if (!counter) {
				return;
			}


			const number =
				Number(
					String(target)
						.replace(
							/,/g,
							""
						)
						.trim()
				);


			if (
				Number.isFinite(
					number
				)
			) {

				counter.dataset.target =
					number;

				counter.textContent =
					number.toLocaleString() +
					"+";
			}
		}


		function loadMetrics(
			rows
		) {

			if (
				!stats ||
				!rows.length
			) {
				return;
			}


			const headers =
				rows[0].map(
					header =>
						header
							.trim()
							.toLowerCase()
				);


			const metricIndex =
				headers.indexOf(
					"metric"
				);


			const countIndex =
				headers.indexOf(
					"count"
				);


			if (
				metricIndex === -1 ||
				countIndex === -1
			) {

				console.warn(
					"Metric / Count columns not found."
				);

				return;
			}


			const metrics =
				{};


			rows
				.slice(1)
				.forEach(
					row => {

						const metric =
							(
								row[
									metricIndex
								] ||
								""
							)
								.trim()
								.toLowerCase();


						const count =
							(
								row[
									countIndex
								] ||
								""
							).trim();


						if (metric) {

							metrics[
								metric
							] =
								count;
						}

					}
				);


			setMetricTarget(
				metrics,
				"product reviews",
				metrics[
					"product reviews"
				]
			);


			setMetricTarget(
				metrics,
				"happy families",
				metrics[
					"happy families"
				]
			);


			setMetricTarget(
				metrics,
				"products sold",
				metrics[
					"products sold"
				]
			);
		}


		/* =========================
		   RUNNING COUNT
		========================= */

		let statsStarted =
			false;


		function animateCount(
			element
		) {

			const target =
				Number(
					element.dataset.target
				);


			if (
				!Number.isFinite(
					target
				)
			) {
				return;
			}


			const duration =
				1600;


			const startTime =
				performance.now();


			function updateCount(
				currentTime
			) {

				const elapsed =
					currentTime -
					startTime;


				const progress =
					Math.min(
						elapsed /
							duration,
						1
					);


				const eased =
					1 -
					Math.pow(
						1 - progress,
						3
					);


				const current =
					Math.floor(
						target *
						eased
					);


				element.textContent =
					current.toLocaleString() +
					"+";


				if (
					progress < 1
				) {

					requestAnimationFrame(
						updateCount
					);

				} else {

					element.textContent =
						target.toLocaleString() +
						"+";
				}
			}


			requestAnimationFrame(
				updateCount
			);
		}


		function startStatsAnimation() {

			if (
				!stats ||
				statsStarted
			) {
				return;
			}


			statsStarted =
				true;


			const counters =
				stats.querySelectorAll(
					".review-count"
				);


			counters.forEach(
				animateCount
			);
		}


		if (stats) {

			const statsObserver =
				new IntersectionObserver(
					entries => {

						entries.forEach(
							entry => {

								if (
									entry.isIntersecting
								) {

									startStatsAnimation();

									statsObserver.disconnect();
								}

							}
						);

					},
					{
						threshold:
							0.35
					}
				);


			statsObserver.observe(
				stats
			);
		}


		/* =========================
		   LOAD GOOGLE SHEET
		========================= */

		fetch(
			SHEET_URL
		)
			.then(
				response => {

					if (
						!response.ok
					) {

						throw new Error(
							"Unable to load review sheet"
						);
					}


					return response.text();

				}
			)
			.then(
				csv => {

					const rows =
						parseCSV(
							csv
						);


					if (
						rows.length < 2
					) {

						renderReviews();

						return;
					}


					loadMetrics(
						rows
					);


					const headers =
						rows[0].map(
							header =>
								header
									.trim()
									.toLowerCase()
						);


					const nameIndex =
						headers.indexOf(
							"name"
						);

					const productIndex =
						headers.indexOf(
							"product"
						);

					const ratingIndex =
						headers.indexOf(
							"rating"
						);

					const reviewIndex =
						headers.indexOf(
							"review"
						);

					const showIndex =
						headers.indexOf(
							"show"
						);


					reviews =
						rows
							.slice(1)
							.map(
								row => ({

									name:
										row[
											nameIndex
										] ||
										"",

									product:
										row[
											productIndex
										] ||
										"",

									rating:
										row[
											ratingIndex
										] ||
										"0",

									text:
										row[
											reviewIndex
										] ||
										"",

									show:
										row[
											showIndex
										] ||
										""

								})
							)
							.filter(
								review =>
									review.show
										.trim()
										.toLowerCase() ===
									"yes"
							)
							.filter(
								review =>
									review.name &&
									review.text
							)
							.slice(-5)
							.reverse();


					renderReviews();

				}
			)
			.catch(
				error => {

					console.error(
						"Review loading error:",
						error
					);


					renderReviews();

				}
			);

	}
);


/* =========================
   AUTO REVIEW SLIDER
========================= */

setInterval(
	() => {

		const nextButton =
			document.querySelector(
				".review-next"
			);


		if (nextButton) {

			nextButton.click();
		}

	},
	5000
);


/* =========================
   REVIEW STATS COUNT
========================= */

document.addEventListener(
	"DOMContentLoaded",
	() => {

		const stats =
			document.getElementById(
				"reviewStats"
			);


		if (!stats) {
			return;
		}


		let started =
			false;


		function animateCount(
			element
		) {

			const target =
				Number(
					element.dataset.target
				);


			const duration =
				1600;


			const startTime =
				performance.now();


			function updateCount(
				currentTime
			) {

				const elapsed =
					currentTime -
					startTime;


				const progress =
					Math.min(
						elapsed /
							duration,
						1
					);


				const eased =
					1 -
					Math.pow(
						1 - progress,
						3
					);


				const current =
					Math.floor(
						target *
						eased
					);


				element.textContent =
					current.toLocaleString() +
					"+";


				if (
					progress < 1
				) {

					requestAnimationFrame(
						updateCount
					);

				} else {

					element.textContent =
						target.toLocaleString() +
						"+";
				}
			}


			requestAnimationFrame(
				updateCount
			);
		}


		const statsObserver =
			new IntersectionObserver(
				entries => {

					entries.forEach(
						entry => {

							if (
								entry.isIntersecting &&
								!started
							) {

								started =
									true;


								const counters =
									stats.querySelectorAll(
										".review-count"
									);


								counters.forEach(
									animateCount
								);


								statsObserver.disconnect();
							}

						}
					);

				},
				{
					threshold:
						0.35
				}
			);


		statsObserver.observe(
			stats
		);

	}
);
/* =========================
   PINCODE-BASED COD RESTRICTION
   COD is available ONLY for 630702.
   Every other pincode: Online Payment only.
========================= */

const BIZMO_COD_PINCODE = "630702";


function getCheckoutPincodeValue() {

	const field =
		document.getElementById(
			"checkoutPincode"
		);

	if (!field) return "";

	return String(field.value || "")
		.replace(/\D/g, "")
		.trim();
}


function isCodPincodeAllowed() {

	return getCheckoutPincodeValue() ===
		BIZMO_COD_PINCODE;
}


function updateCodAvailability() {

	const codInput =
		document.getElementById(
			"codPayment"
		);

	const onlineInput =
		document.getElementById(
			"onlinePayment"
		);

	const codOption =
		document.getElementById(
			"codOption"
		);

	const message =
		document.getElementById(
			"codRestrictionMessage"
		);


	if (
		!codInput ||
		!onlineInput
	) {
		return;
	}


	const pin =
		getCheckoutPincodeValue();

	const hasFullPin =
		pin.length === 6;

	const allowed =
		pin ===
			BIZMO_COD_PINCODE;


	/*
	 * Restrict COD only AFTER the customer types
	 * a COMPLETE 6-digit pincode that is not 630702.
	 *
	 * Typing (under 6 digits) or empty field ->
	 * both options visible and selectable, no message.
	 */

	const restrict =
		hasFullPin &&
		!allowed;


	codInput.disabled =
		restrict;


	if (codOption) {

		codOption.classList.toggle(
			"cod-unavailable",
			restrict
		);
	}


	if (message) {

		message.style.display =
			restrict
				? "block"
				: "none";
	}


	/*
	 * If the customer had COD selected and then
	 * types an invalid pincode, automatically
	 * switch them to Online Payment.
	 */

	if (
		restrict &&
		codInput.checked
	) {

		codInput.checked =
			false;

		onlineInput.checked =
			true;
	}
}


/* Hook into checkout open + pincode typing */

document.addEventListener(
	"DOMContentLoaded",
	() => {

		const pincodeField =
			document.getElementById(
				"checkoutPincode"
			);


		if (pincodeField) {

			pincodeField.addEventListener(
				"input",
				updateCodAvailability
			);

			pincodeField.addEventListener(
				"change",
				updateCodAvailability
			);
		}

	}
);
//

