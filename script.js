// ===== ข้อมูลร้าน: แก้เบอร์โทร Line ID และลิงก์ Facebook ที่นี่ =====
const CFG = {
  phone: "095-935-3370",
  line: "@n_oxus",
  fb: "https://www.facebook.com/",
};
const normalizeLineId = (value = "") => {
  const id = String(value).trim();
  if (!id) return "";
  return id.replace(/^@/, "").replace(/^~/, "").replace(/\s+/g, "");
};
const STORAGE_KEY = "shop-products-v1";
const ADMIN_PASSWORD = "174978";
const ADMIN_AUTH_KEY = "shop-admin-auth-v1";
// ===== รูปสินค้า: เลือกโฟลเดอร์ภาพตามที่เปิดหน้าเว็บ =====
const IMG_BASE = (() => {
  const path = (location.pathname || "").replace(/\\/g, "/");
  return path.includes("/bamboo-basket-site/")
    ? "images/"
    : "bamboo-basket-site/images/";
})();
const IMGS = {
  1: `${IMG_BASE}1.jpg`,
  2: `${IMG_BASE}2.jpg`,
  3: `${IMG_BASE}3.jpg`,
  4: `${IMG_BASE}4.jpg`,
  5: `${IMG_BASE}5.jpg`,
  6: `${IMG_BASE}6.jpg`,
  7: `${IMG_BASE}7.jpg`,
  8: `${IMG_BASE}8.jpg`,
  9: `${IMG_BASE}9.jpg`,
  10: `${IMG_BASE}10.jpg`,
  11: `${IMG_BASE}11.jpg`,
  12: `${IMG_BASE}12.jpg`,
  13: `${IMG_BASE}13.jpg`,
  14: `${IMG_BASE}14.jpg`,
  15: `${IMG_BASE}15.jpg`,
};
const LINE_ID = normalizeLineId(CFG.line);
const LINE = LINE_ID ? `https://line.me/R/ti/p/@${LINE_ID}` : "https://line.me/";
const C = {
  lace: "ลูกไม้",
  ribbon: "ริบบิ้นและดอกไม้",
  garland: "พวงมาลัยขาว",
  mini: "มินิและธรรมชาติ",
};
const OPTION_SET = {
  lace: {
    colors: ["ธรรมชาติ", "ชมพู", "ฟ้า", "ขาว", "ส้ม", "แดง"],
    sizes: ["เล็ก", "กลาง", "ใหญ่"],
    decor: ["ลูกไม้", "ดอกกล้วยไม้", "ริบบิ้นทอง"],
  },
  ribbon: {
    colors: ["ชมพู", "ครีม", "ส้ม", "แดง", "เขียว", "ฟ้า"],
    sizes: ["เล็ก", "กลาง", "ใหญ่"],
    decor: ["ริบบิ้น", "ดอกไม้", "ลูกไม้"],
  },
  garland: {
    colors: ["ขาว", "ชมพู", "ฟ้า", "เหลือง", "ม่วง", "ส้ม", "แดง"],
    sizes: ["สั้น", "กลาง", "ยาว"],
    decor: ["ดอกไม้", "ริบบิ้น", "ลายธรรมชาติ"],
  },
  mini: {
    colors: ["ขาว", "ชมพู", "ฟ้า", "เขียว", "เหลือง", "ชมพูอมแดง"],
    sizes: ["S", "M", "L"],
    decor: ["ธรรมชาติ", "ริบบิ้นเล็ก", "ดอกไม้"],
  },
};
const state = {
  product: null,
  color: "",
  size: "",
  decor: [],
};
const DEFAULT_PRODUCTS = [
  ["lace", 1, "ชะลอมลูกไม้ ดอกกล้วยไม้ชมพู", 590],
  ["lace", 2, "ชะลอมลูกไม้ กุหลาบครีมริบบิ้นทอง", 590],
  ["lace", 7, "ชะลอมลูกไม้ ฟ้าขาว", 550],
  ["ribbon", 4, "ชะลอมหูหิ้ว ริบบิ้นส้มทอง", 450],
  ["ribbon", 5, "ชะลอมริบบิ้นชมพู", 390],
  ["ribbon", 6, "ชะลอมกุหลาบแดง ริบบิ้นแดงทอง", 420],
  ["garland", 8, "ชุดพวงมาลัยขาว บัวชมพู", 690],
  ["garland", 9, "ชุดพวงมาลัยขาว บัวเขียว", 690],
  ["garland", 10, "ชุดพวงมาลัยขาว บัวเหลือง", 690],
  ["garland", 11, "ชุดพวงมาลัยขาว บัวม่วง", 690],
  ["garland", 12, "ชุดพวงมาลัยขาว บัวแดง", 690],
  ["garland", 14, "ชุดพวงมาลัยขาว บัวส้ม", 690],
  ["garland", 15, "ชุดพวงมาลัยขาว บัวฟ้า", 690],
  ["mini", 13, "ชุดมินิ เลือกได้ 6 สี", 350],
  ["mini", 3, "ชะลอมสานไม้ไผ่ธรรมชาติ", 290],
];
const slugify = (text) =>
  String(text || "custom")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\wก-๙-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "custom";
const parseSizePriceMap = (input, sizes = []) => {
  if (!input) return {};
  const entries = String(input)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const parsed = {};
  entries.forEach((entry) => {
    const match = entry.match(/^(.+?)(?:=|:|\s+)(\d+(?:\.\d+)?)$/);
    if (!match) return;
    const [, rawSize, rawPrice] = match;
    const size = rawSize.trim();
    const price = Number(rawPrice);
    if (size && Number.isFinite(price)) {
      parsed[size] = price;
    }
  });

  if (Object.keys(parsed).length === 0 && sizes.length) {
    sizes.forEach((size) => {
      const fallback = String(input).match(new RegExp(`(^|,\\s*)${size.replace(/[.*+?^${}()|[\]\\]/g, "\\$")}\\s*(?:=|:|\\s+)(\\d+(?:\\.\\d+)?)`, "i"));
      if (fallback && fallback[2]) {
        parsed[size] = Number(fallback[2]);
      }
    });
  }

  return parsed;
};
const formatSizePriceMap = (sizePrices = {}, sizes = []) => {
  const entries = sizes.length ? sizes : Object.keys(sizePrices || {});
  return entries
    .map((size) => {
      const value = Number(sizePrices?.[size]);
      return value ? `${size}=${value}` : "";
    })
    .filter(Boolean)
    .join(", ");
};
const resolveSelectedPrice = (product, size) => {
  if (!product) return 0;

  if (size && product.sizePrices && Number.isFinite(Number(product.sizePrices[size]))) {
    return Number(product.sizePrices[size]);
  }

  return Number(product.price || 0);
};
const normalizeProduct = (raw) => {
  if (Array.isArray(raw)) {
    const [categoryKey, imageId, name, price] = raw;
    const key = slugify(categoryKey || "custom");
    const finalName = String(name || "สินค้าใหม่");
    return {
      id: `${key}-${slugify(finalName)}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      categoryKey: key,
      categoryLabel: C[key] || String(categoryKey || "อื่นๆ"),
      imageId: imageId,
      imageUrl: IMGS[imageId] || "",
      name: finalName,
      price: Number(price || 0),
      sizePrices: {},
      description: "",
    };
  }

  const categoryKey = String(raw.categoryKey || raw.category || "custom");
  const name = String(raw.name || "สินค้าใหม่");
  const imageUrl = raw.imageUrl || raw.image || IMGS[raw.imageId] || "";
  const sizes = Array.isArray(raw.sizes) ? raw.sizes : (raw.sizeOptions || ["เล็ก", "กลาง", "ใหญ่"]);
  const sizePrices = raw.sizePrices && typeof raw.sizePrices === "object"
    ? raw.sizePrices
    : parseSizePriceMap(raw.sizePriceText || raw.sizePricesText || raw.sizePrice || "", sizes);

  return {
    id: String(raw.id || `${slugify(categoryKey)}-${slugify(name)}-${Date.now()}`),
    categoryKey: slugify(categoryKey),
    categoryLabel: raw.categoryLabel || C[slugify(categoryKey)] || String(raw.category || categoryKey),
    imageId: raw.imageId || (imageUrl && Object.entries(IMGS).find(([, path]) => path === imageUrl)?.[0]) || 1,
    imageUrl,
    name,
    price: Number(raw.price || 0),
    colors: Array.isArray(raw.colors) ? raw.colors : (raw.colorOptions || ["ธรรมชาติ", "ชมพู", "ฟ้า", "ขาว"]),
    sizes,
    sizePrices,
    description: raw.description || "",
  };
};
const loadProducts = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(saved) && saved.length) {
      return saved.map(normalizeProduct);
    }
  } catch (error) {
    console.warn("Unable to load product data from localStorage", error);
  }
  return DEFAULT_PRODUCTS.map(normalizeProduct);
};
let P = loadProducts();
const persistProducts = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(P));
};
const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
const getCategoryEntries = () => {
  const map = new Map(Object.entries(C));
  P.forEach((product) => {
    map.set(product.categoryKey, product.categoryLabel || C[product.categoryKey] || product.categoryKey);
  });
  return [...map.entries()];
};
const $ = (id) => document.getElementById(id);
const fill = (r) =>
  r
    .querySelectorAll("img[data-img]")
    .forEach((i) => (i.src = IMGS[i.dataset.img]));
function renderOptionList(id, values, selectedValue, type) {
  const el = $(id);
  if (!el) return;
  el.innerHTML = values
    .map(
      (value) =>
        `<button type="button" class="option-btn ${selectedValue === value ? "selected" : ""}" data-type="${type}" data-value="${value}" aria-pressed="${selectedValue === value}">${value}</button>`,
    )
    .join("");
}
function renderDecorList(values, selectedValues) {
  const el = $("decor-options");
  if (!el) return;
  const selected = new Set(selectedValues || []);
  el.innerHTML = values
    .map(
      (value) =>
        `<button type="button" class="option-btn ${selected.has(value) ? "selected" : ""}" data-type="decor" data-value="${value}">${value}</button>`,
    )
    .join("");
}
function updateCustomizerPrice() {
  const currentPrice = resolveSelectedPrice(state.product, state.size);
  $("customizer-price").textContent = `฿${currentPrice}`;
}
function openCustomizer(productName, category, price, image) {
  const product =
    P.find((item) => item.name === productName && item.categoryKey === category) ||
    P.find((item) => item.name === productName);
  if (!product) return;

  state.product = product;
  const optionSet = {
    colors: product.colors && product.colors.length ? product.colors : (OPTION_SET[product.categoryKey]?.colors || OPTION_SET.lace.colors),
    sizes: product.sizes && product.sizes.length ? product.sizes : (OPTION_SET[product.categoryKey]?.sizes || OPTION_SET.lace.sizes),
    decor: OPTION_SET[product.categoryKey]?.decor || OPTION_SET.lace.decor,
  };
  state.color = optionSet.colors[0] || "";
  state.size = optionSet.sizes[0] || "";
  state.decor = optionSet.decor.length ? [optionSet.decor[0]] : [];

  $("customizer-image").src = image || product.imageUrl || IMGS[product.imageId] || "";
  $("customizer-title").textContent = product.name;
  $("customizer-category").textContent = product.categoryLabel || C[product.categoryKey] || product.categoryKey;

  renderOptionList("color-options", optionSet.colors, state.color, "color");
  renderOptionList("size-options", optionSet.sizes, state.size, "size");
  renderDecorList(optionSet.decor, state.decor);
  updateCustomizerPrice();

  $("customizer").classList.remove("hidden");
  $("customizer").setAttribute("aria-hidden", "false");
}
function closeCustomizer() {
  $("customizer").classList.add("hidden");
  $("customizer").setAttribute("aria-hidden", "true");
}
function confirmSelection() {
  if (!state.product) return;
  const product = state.product;
  const finalPrice = resolveSelectedPrice(product, state.size);
  const decorText = state.decor.length ? state.decor.join(", ") : "-";
  const message = [
    "สวัสดีครับ ข้าพเจ้าต้องการสั่งสินค้า",
    `สินค้า: ${product.name}`,
    `หมวด: ${product.categoryLabel || C[product.categoryKey] || product.categoryKey}`,
    `สี: ${state.color}`,
    `ขนาด: ${state.size}`,
    `ของตกแต่ง: ${decorText}`,
    `ราคา: ฿${finalPrice}`,
    "",
    "กรุณาตรวจสอบและช่วยยืนยันรายละเอียดเพิ่มเติมครับ",
  ].join("\n");

  window.open(`${LINE}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  closeCustomizer();
}
function renderAdminProductList() {
  const list = $("admin-product-list");
  const activeId = $("admin-product-id")?.value || P[0]?.id || "";
  list.innerHTML = P.map((product) => {
    const label = product.categoryLabel || C[product.categoryKey] || product.categoryKey;
    const activeClass = product.id === activeId ? "active" : "";
    return `<button type="button" class="admin-product-item ${activeClass}" data-admin-product-id="${product.id}">
      <div class="meta">
        <strong>${product.name}</strong>
        <span class="tiny">${label} • ฿${product.price}</span>
      </div>
      <span class="tiny">แก้ไข</span>
    </button>`;
  }).join("");
}
function renderAdminPreview() {
  const value = $("admin-image-data").value || $("admin-image").value || IMGS[1];
  $("admin-image-preview").src = value || IMGS[1];
}
async function handleAdminImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) {
    $("admin-image-data").value = "";
    return;
  }

  try {
    const dataUrl = await readFileAsDataUrl(file);
    $("admin-image-data").value = dataUrl;
    renderAdminPreview();
  } catch (error) {
    console.warn("Unable to read uploaded image", error);
    $("admin-image-data").value = "";
  }
}
function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
}
function openLoginPanel() {
  $("admin-login-panel").classList.remove("hidden");
  $("admin-login-panel").setAttribute("aria-hidden", "false");
  $("admin-password").value = "";
  $("admin-login-message").textContent = "";
}
function closeLoginPanel() {
  $("admin-login-panel").classList.add("hidden");
  $("admin-login-panel").setAttribute("aria-hidden", "true");
}
function openAdminPanel() {
  if (!isAdminAuthenticated()) {
    openLoginPanel();
    return;
  }

  $("admin-panel").classList.remove("hidden");
  $("admin-panel").setAttribute("aria-hidden", "false");
  renderAdminProductList();
  if (P.length) {
    selectAdminProduct(P[0].id);
  }
}
function closeAdminPanel() {
  $("admin-panel").classList.add("hidden");
  $("admin-panel").setAttribute("aria-hidden", "true");
}
function authenticateAdmin(password) {
  if (String(password).trim() === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
    closeLoginPanel();
    openAdminPanel();
    return true;
  }

  $("admin-login-message").textContent = "รหัสผ่านไม่ถูกต้อง";
  return false;
}
function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
  closeAdminPanel();
  closeLoginPanel();
}
function selectAdminProduct(id) {
  const product = P.find((item) => item.id === id) || P[0];
  if (!product) return;
  $("admin-product-id").value = product.id;
  $("admin-name").value = product.name;
  $("admin-category").value = product.categoryLabel || C[product.categoryKey] || product.categoryKey;
  $("admin-price").value = product.price;
  $("admin-image-data").value = product.imageUrl || "";
  $("admin-image").value = "";
  $("admin-colors").value = (product.colors || []).join(", ");
  $("admin-sizes").value = (product.sizes || []).join(", ");
  $("admin-size-prices").value = formatSizePriceMap(product.sizePrices || {}, product.sizes || []);
  $("admin-description").value = product.description || "";
  renderAdminPreview();
  renderAdminProductList();
}
function createBlankProduct() {
  const defaultCategory = Object.values(C)[0];
  const product = normalizeProduct([
    slugify(defaultCategory),
    1,
    "สินค้าใหม่",
    0,
  ]);
  product.id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  product.categoryLabel = defaultCategory;
  product.description = "";
  P.unshift(product);
  persistProducts();
  renderAdminProductList();
  selectAdminProduct(product.id);
}
function openDeleteConfirmation() {
  const selectedId = $("admin-product-id").value;
  const product = P.find((item) => item.id === selectedId) || P[0];
  if (!product) return;

  $("confirm-delete-message").textContent = `คุณต้องการลบ “${product.name}” ออกจากรายการสินค้าใช่หรือไม่?`;
  $("confirm-delete-panel").classList.remove("hidden");
  $("confirm-delete-panel").setAttribute("aria-hidden", "false");
}
function closeDeleteConfirmation() {
  $("confirm-delete-panel").classList.add("hidden");
  $("confirm-delete-panel").setAttribute("aria-hidden", "true");
}
function deleteSelectedProduct() {
  const selectedId = $("admin-product-id").value;
  if (!selectedId) return;

  const nextProducts = P.filter((product) => product.id !== selectedId);
  if (nextProducts.length === P.length) {
    closeDeleteConfirmation();
    return;
  }

  P = nextProducts;
  persistProducts();
  draw("all");
  renderAdminProductList();
  closeDeleteConfirmation();

  if (P.length) {
    selectAdminProduct(P[0].id);
  } else {
    createBlankProduct();
  }
}
function draw(f) {
  const categoryEntries = getCategoryEntries();
  const validCategoryKeys = new Set(P.map((product) => product.categoryKey));
  const visibleCategories = [["all", "ทั้งหมด"], ...categoryEntries.filter(([key]) => validCategoryKeys.has(key))];

  $("chips").innerHTML = visibleCategories
    .map(([k, v]) => `<button data-f="${k}">${v}</button>`)
    .join("");

  $("grid").innerHTML = P.filter((p) => f == "all" || p.categoryKey == f)
    .map((product) => {
      const image = product.imageUrl || IMGS[product.imageId] || IMGS[1];
      const categoryName = product.categoryLabel || C[product.categoryKey] || product.categoryKey;
      return `<article class="card"><div class="ph"><img src="${image}" alt="${product.name}" loading="lazy"></div><div class="p-4"><span class="pill">${categoryName}</span><h3 class="serif">${product.name}</h3><div class="flex items-center justify-between gap-2"><b class="price">฿${product.price}</b><span class="flex gap-1.5"><button type="button" class="btn product-select" data-product="${product.name}" data-category="${product.categoryKey}" data-price="${product.price}" data-image="${image}">เลือกสินค้า</button><a class="btn ghost" href="${CFG.fb}" target="_blank" rel="noopener">Facebook</a></span></div></div></article>`;
    })
    .join("");

  $("chips")
    .querySelectorAll("button")
    .forEach((b) => b.classList.toggle("on", b.dataset.f == f));
}
$("chips").onclick = (e) => {
  const b = e.target.closest("button");
  if (b) {
    draw(b.dataset.f);
    go(0 + $("gallery").offsetLeft);
  }
};
document.addEventListener("click", (event) => {
  const adminLoginTrigger = event.target.closest("[data-close='login']");
  if (adminLoginTrigger) {
    closeLoginPanel();
    return;
  }

  const confirmDeleteBtn = event.target.closest("#confirm-delete-btn");
  if (confirmDeleteBtn) {
    event.stopPropagation();
    deleteSelectedProduct();
    return;
  }

  const adminDeleteBtn = event.target.closest("#admin-delete-product");
  if (adminDeleteBtn) {
    event.stopPropagation();
    openDeleteConfirmation();
    return;
  }

  const adminItem = event.target.closest(".admin-product-item");
  if (adminItem) {
    selectAdminProduct(adminItem.dataset.adminProductId);
    return;
  }

  const productButton = event.target.closest(".product-select");
  if (productButton) {
    openCustomizer(
      productButton.dataset.product,
      productButton.dataset.category,
      Number(productButton.dataset.price || 0),
      productButton.dataset.image,
    );
    return;
  }

  const optionButton = event.target.closest(".option-btn");
  if (optionButton) {
    const type = optionButton.dataset.type;
    const value = optionButton.dataset.value;

    if (type === "color") {
      state.color = value;
      const optionSet = state.product?.colors?.length
        ? { colors: state.product.colors }
        : OPTION_SET[state.product.categoryKey] || OPTION_SET.lace;
      renderOptionList("color-options", optionSet.colors, state.color, "color");
      return;
    }

    if (type === "size") {
      state.size = value;
      const optionSet = state.product?.sizes?.length
        ? { sizes: state.product.sizes }
        : OPTION_SET[state.product.categoryKey] || OPTION_SET.lace;
      renderOptionList("size-options", optionSet.sizes, state.size, "size");
      updateCustomizerPrice();
      return;
    }

    if (type === "decor") {
      if (state.decor.includes(value)) {
        state.decor = state.decor.filter((item) => item !== value);
      } else {
        state.decor = [...state.decor, value];
      }
      const optionSet = OPTION_SET[state.product.categoryKey] || OPTION_SET.lace;
      renderDecorList(optionSet.decor, state.decor);
      return;
    }
  }

  const closeTarget = event.target.closest("[data-close='true']");
  if (closeTarget) {
    closeCustomizer();
  }

  const adminCloseTarget = event.target.closest("[data-close='admin']");
  if (adminCloseTarget) {
    closeAdminPanel();
  }

  const confirmDeleteCloseTarget = event.target.closest("[data-close='confirm-delete']");
  if (confirmDeleteCloseTarget) {
    closeDeleteConfirmation();
  }

  const loginCloseTarget = event.target.closest("[data-close='login']");
  if (loginCloseTarget) {
    closeLoginPanel();
  }
});
$("confirm-order").addEventListener("click", confirmSelection);
$("admin-add-product").addEventListener("click", createBlankProduct);
$("admin-logout-btn").addEventListener("click", () => {
  logoutAdmin();
});
$("admin-delete-product").addEventListener("click", (event) => {
  event.stopPropagation();
  openDeleteConfirmation();
});
$("confirm-delete-btn").addEventListener("click", (event) => {
  event.stopPropagation();
  deleteSelectedProduct();
});
$("admin-image").addEventListener("change", handleAdminImageUpload);
$("admin-image-data").addEventListener("input", renderAdminPreview);
$("admin-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const id = $("admin-product-id").value;
  const name = $("admin-name").value.trim();
  const categoryLabel = $("admin-category").value.trim();
  const price = Number($("admin-price").value || 0);
  const imageUrl = $("admin-image-data").value || $("admin-image").value.trim();
  const colors = $("admin-colors").value.split(",").map((item) => item.trim()).filter(Boolean);
  const sizes = $("admin-sizes").value.split(",").map((item) => item.trim()).filter(Boolean);
  const sizePrices = parseSizePriceMap($("admin-size-prices").value, sizes);
  const description = $("admin-description").value.trim();

  if (!name || !categoryLabel) return;

  const categoryKey = slugify(categoryLabel);
  const product = {
    id: id || `${categoryKey}-${Date.now()}`,
    categoryKey,
    categoryLabel,
    imageId: imageUrl && Object.entries(IMGS).find(([, path]) => path === imageUrl)?.[0] ? Number(Object.entries(IMGS).find(([, path]) => path === imageUrl)[0]) : 1,
    imageUrl: imageUrl || IMGS[1],
    name,
    price: price || Object.values(sizePrices)[0] || 0,
    colors: colors.length ? colors : ["ธรรมชาติ", "ชมพู", "ฟ้า", "ขาว"],
    sizes: sizes.length ? sizes : ["เล็ก", "กลาง", "ใหญ่"],
    sizePrices,
    description,
  };

  const index = P.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    P[index] = product;
  } else {
    P.unshift(product);
  }

  persistProducts();
  draw("all");
  renderAdminProductList();
  selectAdminProduct(product.id);
});
const adminPanelEl = $("admin-panel");
adminPanelEl?.querySelector(".admin-backdrop")?.addEventListener("click", closeAdminPanel);
$("admin-login-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const password = $("admin-password").value;
  authenticateAdmin(password);
});
$("admin-login-panel")?.querySelector(".admin-backdrop")?.addEventListener("click", closeLoginPanel);
$("admin-login-panel")?.querySelector("[data-close='login']")?.addEventListener("click", closeLoginPanel);
document.querySelector(".admin-toggle")?.addEventListener("click", openAdminPanel);
draw("all");
fill(document);
$("tel").href = "#";
$("tel").setAttribute("role", "button");
$("tel").setAttribute("aria-label", "คัดลอกเบอร์โทรศัพท์");
$("tel").addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    await navigator.clipboard.writeText(CFG.phone);
    $("st").textContent = "คัดลอกเบอร์โทรแล้ว";
  } catch (error) {
    $("st").textContent = "ไม่สามารถคัดลอกอัตโนมัติได้ กรุณา copy เบอร์เอง";
  }
});
$("tel").lastChild.textContent = CFG.phone;
$("line").href = LINE;
$("line").lastChild.textContent = CFG.line;
$("fb").href = CFG.fb;
$("f").onsubmit = (e) => {
  e.preventDefault();
  const d = new FormData(e.target);
  const t = `สนใจ: ${d.get("c")}\nชื่อ: ${d.get("n")}\nติดต่อ: ${d.get("t")}\nรายละเอียด: ${d.get("m") || "-"}`;
  try {
    navigator.clipboard.writeText(t);
  } catch (x) {}
  const a = document.createElement("a");
  a.href = LINE;
  a.target = "_blank";
  a.rel = "noopener";
  a.click();
  $("st").textContent = "คัดลอกข้อความแล้ว วางในแชท Line เพื่อส่งให้ร้านได้เลย";
};

document.addEventListener("contextmenu", (event) => {
  if (event.target.closest("input, textarea, select, button, a")) {
    return;
  }
  event.preventDefault();
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const blocked = [
    "f12",
    "meta",
    "control",
    "shift",
    "alt",
    "u",
    "s",
    "i",
    "j",
    "c",
  ];

  if (event.ctrlKey && blocked.includes(key)) {
    event.preventDefault();
    return;
  }

  if (event.key === "F12" || (event.ctrlKey && event.shiftKey && key === "i")) {
    event.preventDefault();
  }
});

const sc = $("sc"),
  bar = $("bar"),
  mq = matchMedia("(min-width:1024px)");
let cur = 0,
  tgt = 0,
  raf = 0,
  drag = null;
const max = () => sc.scrollWidth - sc.clientWidth;
function loop() {
  cur += (tgt - cur) * 0.1;
  if (Math.abs(tgt - cur) < 0.5) cur = tgt;
  sc.scrollLeft = cur;
  raf = cur === tgt ? 0 : requestAnimationFrame(loop);
}
function go(x) {
  tgt = Math.max(0, Math.min(max(), x));
  if (!raf) raf = requestAnimationFrame(loop);
}
function prog() {
  const p = mq.matches
    ? sc.scrollLeft / (max() || 1)
    : scrollY / (document.documentElement.scrollHeight - innerHeight || 1);
  bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
}
sc.addEventListener("scroll", () => {
  if (!raf) cur = tgt = sc.scrollLeft;
  prog();
});
addEventListener("scroll", prog);
addEventListener("resize", prog);
sc.addEventListener(
  "wheel",
  (e) => {
    if (!mq.matches) return;
    e.preventDefault();
    go(tgt + (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX));
  },
  { passive: false },
);
sc.addEventListener("pointerdown", (e) => {
  if (
    e.pointerType != "mouse" ||
    !mq.matches ||
    e.target.closest("a,button,input,textarea,select")
  )
    return;
  drag = { x: e.clientX, s: tgt };
  sc.classList.add("drag");
});
addEventListener("pointermove", (e) => {
  if (drag) go(drag.s - (e.clientX - drag.x) * 1.4);
});
addEventListener("pointerup", () => {
  drag = null;
  sc.classList.remove("drag");
});
sc.addEventListener("dragstart", (e) => e.preventDefault());
addEventListener("keydown", (e) => {
  if (!mq.matches || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  if (e.key == "ArrowRight") go(tgt + 420);
  if (e.key == "ArrowLeft") go(tgt - 420);
});
document.querySelectorAll("[data-to]").forEach((a) =>
  a.addEventListener("click", (e) => {
    if (!mq.matches) return;
    e.preventDefault();
    go($(a.getAttribute("href").slice(1)).offsetLeft);
  }),
);
prog();
