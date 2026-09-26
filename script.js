let cart = [];
let selectedProduct = "";
let selectedSize = "";
let selectedFlavour = "";
let modalQty = 1;


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
		flavours: ["Rose", "Lemon"]
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
	"Combo 1": 339,
	"Combo 2": 499,
	"Combo 3": 599
};


/* =========================
   HANDWASH SLIDER
========================= */

function updateHandwashSlider(slider, index) {

	const track =
		slider.querySelector(".handwash-track");

	if (track) {
		track.style.transform =
			`translateX(-${index * 100}%)`;
	}
}


function goToHandwashSlide(slider, index) {

	const slides =
		slider.querySelectorAll(".handwash-slide");

	if (!slides.length) return;

	if (index < 0) {
		index = slides.length - 1;
	}

	if (index >= slides.length) {
		index = 0;
	}

	slider.dataset.slideIndex = index;

	updateHandwashSlider(slider, index);

	slider
		.querySelectorAll(".handwash-dot")
		.forEach((dot, n) => {

			dot.classList.toggle(
				"active",
				n === index
			);

		});
}


function initializeHandwashSlider() {

	const sliders =
		document.querySelectorAll(
			".handwash-slider"
		);

	sliders.forEach(slider => {

		if (
			slider.dataset.sliderInitialized ===
			"true"
		) {
			return;
		}

		slider.dataset.sliderInitialized = "true";
		slider.dataset.slideIndex = "0";

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
					currentX - startX;

				isDragging = false;

				if (Math.abs(distance) >= 50) {

					const currentIndex =
						Number(
							slider.dataset.slideIndex || 0
						);

					goToHandwashSlide(
						slider,
						currentIndex +
							(distance < 0 ? 1 : -1)
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

				slider.classList.add("dragging");

			}
		);

		slider.addEventListener(
			"mousemove",
			e => {

				if (isDragging) {
					currentX = e.clientX;
				}

			}
		);

		slider.addEventListener(
			"mouseup",
			() => {

				if (!isDragging) return;

				const distance =
					currentX - startX;

				isDragging = false;

				slider.classList.remove(
					"dragging"
				);

				if (Math.abs(distance) >= 50) {

					const currentIndex =
						Number(
							slider.dataset.slideIndex || 0
						);

					goToHandwashSlide(
						slider,
						currentIndex +
							(distance < 0 ? 1 : -1)
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

	});
}


/* =========================
   PRODUCT OPTIONS MODAL
========================= */

function openProductOptions(productName) {

	const product =
		productCatalog[productName];

	if (!product) return;

	selectedProduct = productName;
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
		nameElement.textContent = productName;
	}

	if (qtyElement) {
		qtyElement.textContent = "1";
	}

	if (!flavourOptions || !sizeOptions) return;

	flavourOptions.innerHTML = "";
	sizeOptions.innerHTML = "";

	if (
		product.flavours &&
		product.flavours.length
	) {

		if (flavourLabel) {
			flavourLabel.style.display = "block";
		}

		flavourOptions.style.display = "grid";

		product.flavours.forEach(flavour => {

			const button =
				document.createElement("button");

			button.type = "button";
			button.textContent = flavour;

			button.addEventListener(
				"click",
				() => {
					selectFlavour(
						button,
						flavour
					);
				}
			);

			flavourOptions.appendChild(button);

		});

	} else {

		if (flavourLabel) {
			flavourLabel.style.display = "none";
		}

		flavourOptions.style.display = "none";
	}


	Object.entries(product.sizes)
		.forEach(([size, price]) => {

			const button =
				document.createElement("button");

			button.type = "button";

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

			sizeOptions.appendChild(button);

		});


	/* PHENYL DEFAULT */

	if (productName === "Phenyl") {

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
		.getElementById("productModal")
		?.classList.add("show");
}


function closeProductOptions() {

	document
		.getElementById("productModal")
		?.classList.remove("show");
}


function selectSize(button, size) {

	document
		.querySelectorAll(
			"#sizeOptions button"
		)
		.forEach(b =>
			b.classList.remove("selected")
		);

	button.classList.add("selected");

	selectedSize = size;

	updateModalPrice();
}


function selectFlavour(button, flavour) {

	document
		.querySelectorAll(
			"#flavourOptions button"
		)
		.forEach(b =>
			b.classList.remove("selected")
		);

	button.classList.add("selected");

	selectedFlavour = flavour;


	/* PHENYL SPECIAL SIZE LOGIC */

	if (selectedProduct === "Phenyl") {

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

		Object.entries(sizes)
			.forEach(([size, price]) => {

				const button =
					document.createElement(
						"button"
					);

				button.type = "button";

				button.textContent =
					`${size} - ₹${price}`;

				const disabled =
					(
						flavour === "White Phenyl" &&
						size === "5 L"
					) ||
					(
						flavour === "Black Phenyl" &&
						size === "1 L"
					);

				if (disabled) {

					button.disabled = true;

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

				sizeOptions.appendChild(button);

			});

		const validSize =
			flavour === "White Phenyl"
				? "1 L"
				: "5 L";

		const validButton =
			[
				...sizeOptions.querySelectorAll(
					"button"
				)
			].find(
				button =>
					button.textContent.startsWith(
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


function changeModalQty(change) {

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
		qty.textContent = modalQty;
	}

	updateModalPrice();
}


function updateModalPrice() {

	const product =
		productCatalog[selectedProduct];

	const price =
		document.getElementById(
			"modalPrice"
		);

	if (!price) return;

	if (
		!product ||
		!selectedSize
	) {

		price.textContent = "₹0";

		return;
	}

	price.textContent =
		`₹${product.sizes[selectedSize] * modalQty}`;
}


/* =========================
   PRODUCT CART
========================= */

function confirmAddToCart() {

	const product =
		productCatalog[selectedProduct];

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
		product.sizes[selectedSize];

	const existing =
		cart.find(
			item =>
				item.name === selectedProduct &&
				item.size === selectedSize &&
				item.flavour === selectedFlavour
		);


	if (existing) {

		existing.qty += modalQty;

	} else {

		cart.push({
			name: selectedProduct,
			size: selectedSize,
			flavour: selectedFlavour || "",
			price: Number(price),
			qty: modalQty
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
		.querySelectorAll(".product-card")
		.forEach(card => {

			const name =
				card.dataset.name;

			const info =
				card.querySelector(
					".product-info"
				);

			if (!name || !info) return;


			const inCart =
				cart.some(
					item =>
						item.name === name &&
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


			/*
			 * FALLBACK:
			 * Find a normal button if
			 * product-add-btn class
			 * isn't present.
			 */
			if (!addButton && !cartButtons) {

				const buttons =
					info.querySelectorAll(
						"button"
					);

				if (buttons.length) {
					addButton =
						buttons[buttons.length - 1];
				}
			}


			/* IN CART */

			if (inCart) {

				if (cartButtons) return;

				if (!addButton) return;


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

				addMore.type = "button";
				addMore.className =
					"add-more-btn";
				addMore.textContent =
					"+ Add More";

				addMore.addEventListener(
					"click",
					() => {
						openProductOptions(name);
					}
				);


				const edit =
					document.createElement(
						"button"
					);

				edit.type = "button";
				edit.className =
					"edit-cart-btn";
				edit.textContent =
					"- Edit";

				edit.addEventListener(
					"click",
					openCart
				);


				area.appendChild(addMore);
				area.appendChild(edit);

				addButton.replaceWith(area);

				return;
			}


			/* NOT IN CART */

			if (cartButtons) {

				const button =
					document.createElement(
						"button"
					);

				button.type = "button";
				button.className =
					"product-add-btn";
				button.textContent =
					"Add to Cart";

				button.addEventListener(
					"click",
					() => {
						openProductOptions(name);
					}
				);

				cartButtons.replaceWith(button);

				return;
			}


			if (addButton) {

				addButton.classList.add(
					"product-add-btn"
				);

				/* Prevent duplicate listeners */
				if (
					addButton.dataset.cartReady !==
					"true"
				) {

					addButton.dataset.cartReady =
						"true";

					addButton.addEventListener(
						"click",
						() => {
							openProductOptions(name);
						}
					);
				}
			}

		});
}


/* =========================
   COMBO CART
========================= */

function getComboName(card) {

	if (!card) return "";

	const button =
		card.querySelector("[data-combo]");

	if (button?.dataset.combo) {

		const name =
			button.dataset.combo.trim();

		if (comboPrices[name]) {
			return name;
		}
	}

	const heading =
		card.querySelector(".combo-copy h2");

	if (heading) {

		const name =
			heading.textContent.trim();

		if (comboPrices[name]) {
			return name;
		}
	}

	const kicker =
		card.querySelector(".kicker");

	if (kicker) {

		const name =
			kicker.textContent
				.trim()
				.replace(/^COMBO\s+/i, "Combo ");

		if (comboPrices[name]) {
			return name;
		}
	}

	return "";
}


function addComboToCart(comboName) {

	const price =
		Number(comboPrices[comboName]);

	if (!comboName || !price) {

		showToast("Unable to add combo");

		return;
	}

	const existing =
		cart.find(
			item =>
				item.name === comboName &&
				!item.size
		);

	if (existing) {

		existing.qty += 1;

	} else {

		cart.push({
			name: comboName,
			price: price,
			qty: 1
		});
	}

	updateCartCount();
	renderCart();
	updateProductButtons();
	updateComboButton();

	showToast(
		comboName + " added to cart"
	);
}


/* =========================
   COMBO BUTTON UPDATE
========================= */

function updateComboButton() {

	document
		.querySelectorAll(".combo-card")
		.forEach(card => {

			const comboName =
				getComboName(card);

			if (!comboName) return;

			const existing =
				cart.find(
					item =>
						item.name === comboName &&
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


			/* =====================
			   COMBO ALREADY IN CART
			===================== */

			if (existing) {

				if (cartButtons) {
					return;
				}

				if (addButton) {

					const area =
						document.createElement("div");

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

					addButton.replaceWith(area);
				}

				return;
			}


			/* =====================
			   COMBO NOT IN CART
			===================== */

			if (cartButtons) {

				const button =
					document.createElement("button");

				button.type = "button";
				button.className =
					"combo-add-btn";

				button.dataset.combo =
					comboName;

				button.textContent =
					"Add to Cart";

				cartButtons.replaceWith(button);

			}

			if (addButton) {

				addButton.dataset.combo =
					comboName;
			}

		});
}


/* =========================
   COMBO CLICK HANDLER
========================= */

document.addEventListener(
	"click",
	e => {

		/* ADD TO CART */

		const addButton =
			e.target.closest(
				".combo-add-btn"
			);

		if (addButton) {

			e.preventDefault();
			e.stopPropagation();

			const comboName =
				addButton.dataset.combo;

			addComboToCart(comboName);

			return;
		}


		/* + ADD MORE */

		const addMoreButton =
			e.target.closest(
				".combo-add-more"
			);

		if (addMoreButton) {

			e.preventDefault();
			e.stopPropagation();

			const comboName =
				addMoreButton.dataset.combo;

			addComboToCart(comboName);

			return;
		}


		/* - EDIT */

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

function addToCart(name, price) {

	if (comboPrices[name]) {

		addComboToCart(name);

		return;
	}

	const existing =
		cart.find(
			item =>
				item.name === name &&
				!item.size
		);

	if (existing) {

		existing.qty += 1;

	} else {

		cart.push({
			name: name,
			price: Number(price) || 0,
			qty: 1
		});
	}

	updateCartCount();
	renderCart();
	updateProductButtons();
	updateComboButton();

	showToast(
		name + " added to cart"
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
				total + (item.qty || 0),
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

	if (!box || !totalBox) return;


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
								${escapeHTML(item.name)}

								${
									item.flavour
										? `<small>${escapeHTML(item.flavour)}</small>`
										: ""
								}

								${
									item.size
										? `<small>${escapeHTML(item.size)}</small>`
										: ""
								}
							</span>

							<div class="cart-controls">

								<button
									type="button"
									onclick="changeCartQty(${index},-1)"
								>
									${item.qty === 1 ? "🗑" : "−"}
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


function changeCartQty(index, change) {

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
}


function closeCart() {

	document
		.getElementById(
			"cartDrawer"
		)
		?.classList.remove("open");
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
		message.textContent = "";
	}

	document
		.getElementById(
			"checkoutModal"
		)
		?.classList.add("show");
}


function closeCheckout() {

	document
		.getElementById(
			"checkoutModal"
		)
		?.classList.remove("show");
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

	if (!box || !totalBox) return;


	box.innerHTML =
		cart
			.map(
				item =>
					`
					<div class="checkout-item">

						<div>

							<span class="checkout-item-name">
								${escapeHTML(item.name)}
							</span>

							<span class="checkout-item-detail">
								${
									item.flavour
										? escapeHTML(item.flavour) + " • "
										: ""
								}

								${
									item.size
										? escapeHTML(item.size) + " • "
										: ""
								}

								Qty: ${item.qty}
							</span>

						</div>

						<span class="checkout-item-price">
							₹${item.price * item.qty}
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
		!/^\d{6}$/.test(pin)
	) {

		message.textContent =
			"Please enter a valid 6-digit pincode.";

		message.style.color =
			"#e31f4f";

		return;
	}


	const payment =
		document.querySelector(
			'input[name="paymentMethod"]:checked'
		)?.value ||
		"Cash on Delivery";


	const total =
		cart.reduce(
			(sum, item) =>
				sum +
				item.price *
				item.qty,
			0
		);


	let text =
		"New Bizmo Order\n\n" +
		"Customer Details\n" +
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
				`   Price: ₹${item.price * item.qty}\n\n`;
		}
	);


	text +=
		`Total: ₹${total}\nPayment: ${payment}`;


	window.open(
		"https://wa.me/918220025541?text=" +
		encodeURIComponent(text),
		"_blank"
	);


	message.textContent =
		"Order details prepared successfully.";

	message.style.color =
		"#159447";


	showToast(
		"Order details sent to WhatsApp"
	);
}


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

	toast.classList.add("show");


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
		.forEach(card => {

			card.style.display =
				(
					card.dataset.name ||
					""
				)
				.toLowerCase()
				.includes(query)
					? ""
					: "none";

		});
}


function focusSearch() {

	const search =
		document.getElementById(
			"search"
		);


	document
		.getElementById("shop")
		?.scrollIntoView({
			behavior: "smooth"
		});


	setTimeout(
		() => search?.focus(),
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
}


function highlightContact(e) {

	e?.preventDefault();


	const contact =
		document.getElementById(
			"contact"
		);


	contact?.scrollIntoView({
		behavior: "smooth",
		block: "center"
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
		"https://wa.me/918220025541?text=" +
		encodeURIComponent(
			`New Bizmo Customer Query\n\nName: ${name}\nMobile: ${mobile}\n\nQuery / Feedback:\n${message}`
		),
		"_blank"
	);


	nameInput.value = "";
	mobileInput.value = "";
	messageInput.value = "";
}


/* =========================
   PRODUCT VIEW
========================= */

function setProductView(columns) {

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
		.getElementById("viewOne")
		?.classList.toggle(
			"active",
			columns === 1
		);


	document
		.getElementById("viewTwo")
		?.classList.toggle(
			"active",
			columns === 2
		);
}


/* =========================
   CATEGORY FILTER
========================= */

let selectedCategory = "";

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


function filterCategory(category) {

	if (
		selectedCategory ===
		category
	) {

		showAllProducts();

		return;
	}


	selectedCategory = category;


	const search =
		document.getElementById(
			"search"
		);

	if (search) {
		search.value = "";
	}


	document
		.querySelectorAll(
			".product-card"
		)
		.forEach(card => {

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

		});


	updateCategorySelection();


	document
		.getElementById("shop")
		?.scrollIntoView({
			behavior: "smooth"
		});


	document.activeElement?.blur();
}


function showAllProducts() {

	selectedCategory = "";


	const search =
		document.getElementById(
			"search"
		);

	if (search) {
		search.value = "";
	}


	document
		.querySelectorAll(
			".product-card"
		)
		.forEach(
			card => {
				card.style.display = "";
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

		if (e.key === "Escape") {

			closeProductOptions();
			closeCart();
			closeCheckout();

		}

	}
);


/* =========================
   HERO SLIDER
========================= */

let heroSlideIndex = 0;
let heroStartX = 0;
let heroCurrentX = 0;
let heroDragging = false;
let heroAutoSlide;


function goToHeroSlide(index) {

	const slides =
		document.querySelectorAll(
			".hero-slide"
		);

	const dots =
		document.querySelectorAll(
			".hero-dot"
		);


	if (!slides.length) return;


	if (index < 0) {
		index =
			slides.length - 1;
	}


	if (
		index >=
		slides.length
	) {

		index = 0;
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


	heroSlideIndex = index;
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

			heroDragging = true;

		},
		{
			passive: true
		}
	);


	hero.addEventListener(
		"touchmove",
		e => {

			if (heroDragging) {

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

			if (!heroDragging) return;


			const distance =
				heroCurrentX -
				heroStartX;


			heroDragging = false;


			if (
				Math.abs(distance) >= 50
			) {

				if (distance < 0) {

					nextHeroSlide();

				} else {

					goToHeroSlide(
						heroSlideIndex - 1
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

			heroDragging = true;

		}
	);


	hero.addEventListener(
		"mousemove",
		e => {

			if (heroDragging) {

				heroCurrentX =
					e.clientX;
			}

		}
	);


	hero.addEventListener(
		"mouseup",
		() => {

			if (!heroDragging) return;


			const distance =
				heroCurrentX -
				heroStartX;


			heroDragging = false;


			if (
				Math.abs(distance) >= 50
			) {

				if (distance < 0) {

					nextHeroSlide();

				} else {

					goToHeroSlide(
						heroSlideIndex - 1
					);
				}


				startHeroAutoSlide();
			}

		}
	);


	hero.addEventListener(
		"mouseleave",
		() => {

			heroDragging = false;
		}
	);


	goToHeroSlide(0);

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
						comboCards[index];

					if (!card) return;


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

			if (!comboDots.length) {
				return;
			}


			const sliderCenter =
				comboSlider.scrollLeft +
				comboSlider.clientWidth / 2;


			let activeIndex = 0;

			let smallestDistance =
				Infinity;


			comboCards.forEach(
				(card, index) => {

					const cardCenter =
						card.offsetLeft +
						card.offsetWidth / 2;


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
						index === activeIndex
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

		if (!backToTop) return;

		let hideTimer;


		function showBackToTop() {

			/* Don't show at the very top */
			if (window.scrollY <= 300) {

				backToTop.classList.remove(
					"show"
				);

				return;
			}

			backToTop.classList.add(
				"show"
			);


			/* Hide when scrolling stops */
			clearTimeout(hideTimer);

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

				clearTimeout(hideTimer);

				window.scrollTo({
					top: 0,
					left: 0,
					behavior: "smooth"
				});

			}
		);


		/* Start hidden */
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

		faqItems.forEach(item => {

			const question =
				item.querySelector(
					".faq-question"
				);

			const icon =
				item.querySelector(
					".faq-icon"
				);

			if (!question) return;


			question.addEventListener(
				"click",
				() => {

					const isOpen =
						item.classList.contains(
							"active"
						);


					/* Close all FAQs */

					faqItems.forEach(
						otherItem => {

							otherItem.classList.remove(
								"active"
							);

							const otherIcon =
								otherItem.querySelector(
									".faq-icon"
								);

							if (otherIcon) {
								otherIcon.textContent =
									"+";
							}

						}
					);


					/* Open selected FAQ */

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

		});

	}
);
/* =========================
   CUSTOMER REVIEWS SLIDER
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const reviewCards = document.querySelectorAll(".review-card");
  const reviewDots = document.querySelectorAll(".review-dot");
  const prevReview = document.querySelector(".review-prev");
  const nextReview = document.querySelector(".review-next");

  if (!reviewCards.length) return;

  let currentReview = 0;

  function showReview(index) {

    currentReview =
      (index + reviewCards.length) % reviewCards.length;

    reviewCards.forEach((card, i) => {
      card.classList.toggle(
        "active",
        i === currentReview
      );
    });

    reviewDots.forEach((dot, i) => {
      dot.classList.toggle(
        "active",
        i === currentReview
      );
    });
  }

  if (prevReview) {
    prevReview.addEventListener("click", () => {
      showReview(currentReview - 1);
    });
  }

  if (nextReview) {
    nextReview.addEventListener("click", () => {
      showReview(currentReview + 1);
    });
  }

  reviewDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showReview(index);
    });
  });

  /* Mobile swipe */

  const slider = document.querySelector(".reviews-slider");

  if (slider) {

    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].screenX;
      },
      { passive: true }
    );

    slider.addEventListener(
      "touchend",
      (event) => {

        touchEndX = event.changedTouches[0].screenX;

        const swipeDistance =
          touchEndX - touchStartX;

        if (Math.abs(swipeDistance) < 50) {
          return;
        }

        if (swipeDistance < 0) {
          showReview(currentReview + 1);
        } else {
          showReview(currentReview - 1);
        }
      },
      { passive: true }
    );
  }

  showReview(0);

});