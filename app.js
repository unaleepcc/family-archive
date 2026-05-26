/* -------------------------------------------------------------
 * app.js
 * 家庭紀錄網站 MVP 第一版 - 業務邏輯與資料持久化控制中心
 * ------------------------------------------------------------- */

// ==========================================
// 1. 初始化資料結構與預設範例資料
// ==========================================

const DEFAULT_ITEMS = [
  {
    id: "item-1",
    name: "Sony BRAVIA 65吋 4K電視",
    category: "家電",
    purchaseDate: "2025-05-10",
    purchasePrice: 42000,
    purchaseLocation: "Sony 官方旗艦店",
    warrantyExpiryDate: "2027-05-10",
    notes: "客廳的主電視。保固貼紙已貼在電視背面左下角。",
    isRelatedToEvent: true,
    eventId: "event-1"
  },
  {
    id: "item-2",
    name: "IKEA LANDSKRONA 三人座沙發",
    category: "家具",
    purchaseDate: "2025-05-15",
    purchasePrice: 24900,
    purchaseLocation: "IKEA 敦北店",
    warrantyExpiryDate: "2035-05-15",
    notes: "非常耐看耐髒的皮革沙發，附帶 10 年品質保證書在書房抽屜中。",
    isRelatedToEvent: true,
    eventId: "event-1"
  },
  {
    id: "item-3",
    name: "Petkit 佩奇自動貓砂盆",
    category: "寵物",
    purchaseDate: "2026-02-12",
    purchasePrice: 8500,
    purchaseLocation: "蝦皮商城",
    warrantyExpiryDate: "2027-02-12",
    notes: "咪咪專用的豪華公廁。需要定期更換淨味濾芯與專用垃圾袋。",
    isRelatedToEvent: true,
    eventId: "event-2"
  },
  {
    id: "item-4",
    name: "Dyson V15 Detect 吸塵器",
    category: "清潔",
    purchaseDate: "2026-05-10",
    purchasePrice: 22900,
    purchaseLocation: "SOGO 百貨",
    warrantyExpiryDate: "2028-05-10",
    notes: "附帶雷射探測與智能吸力調節。保固說明書在客廳置物櫃。",
    isRelatedToEvent: false,
    eventId: null
  },
  {
    id: "item-5",
    name: "Panasonic 610公升變頻四門冰箱",
    category: "家電",
    purchaseDate: "2024-11-20",
    purchasePrice: 38900,
    purchaseLocation: "全國電子",
    warrantyExpiryDate: "2025-11-20",
    notes: "一級能效節能冰箱。保固卡釘在紙本說明書背面。",
    isRelatedToEvent: true,
    eventId: "event-3"
  },
  {
    id: "item-6",
    name: "Bosch 獨立式洗碗機",
    category: "廚房",
    purchaseDate: "2024-12-05",
    purchasePrice: 45000,
    purchaseLocation: "Bosch 專賣店",
    warrantyExpiryDate: "2026-06-20", // 設定即將到期（約 30 天內）
    notes: "家庭和諧的守護神。使用的是專用軟水鹽與光潔劑。",
    isRelatedToEvent: true,
    eventId: "event-3"
  },
  {
    id: "item-7",
    name: "Apple Watch Series 10",
    category: "其他",
    purchaseDate: "2025-09-20",
    purchasePrice: 13500,
    purchaseLocation: "Apple 官網",
    warrantyExpiryDate: "2026-04-20", // 設定已過期
    notes: "生日禮物。包裝盒放在書房書櫃最上層。",
    isRelatedToEvent: false,
    eventId: null
  },
  {
    id: "item-8",
    name: "Petkit 佩奇智能自動餵食機",
    category: "寵物",
    purchaseDate: "2026-02-15",
    purchasePrice: 3200,
    purchaseLocation: "淘寶網代購",
    warrantyExpiryDate: "", // 未填保固
    notes: "出遠門時幫忙餵咪咪的利器。支持手機 App 控制與語音錄音。",
    isRelatedToEvent: true,
    eventId: "event-2"
  }
];

const DEFAULT_EVENTS = [
  {
    id: "event-1",
    title: "溫馨客廳裝修完工",
    date: "2025-05-20",
    category: "裝修",
    description: "經過一個多月的規劃與施工，客廳的油漆與系統櫃終於完工！換上了超舒服的大三人座沙發，還掛上了 Sony 的 65吋大電視。這下全家人晚上可以舒服地擠在一起看電影了。",
    mood: "開心",
    relatedItemIds: ["item-1", "item-2"]
  },
  {
    id: "event-2",
    title: "迎接新成員：貓咪咪咪來到我們家",
    date: "2026-02-16",
    category: "家庭活動",
    description: "今天去浪浪收容所帶回了三個月大的小虎斑貓，我們叫她「咪咪」。她一開始有點害羞躲在沙發底下，但一看到自動餵食機掉飼料和自動貓砂盆運作時，露出了好奇的大眼睛。家裡多了一份溫馨的生機！",
    mood: "重要",
    relatedItemIds: ["item-3", "item-8"]
  },
  {
    id: "event-3",
    title: "廚房現代化電器大升級",
    date: "2024-12-10",
    category: "家電汰換",
    description: "使用了十幾年的舊冰箱常常漏水，洗碗也是大家推託的家事。我們這次狠下心，一次裝了 Bosch 的洗碗機和 Panasonic 的節能大冰箱。廚房做菜和收拾的體驗瞬間升級，簡直是太棒的決定。",
    mood: "花錢",
    relatedItemIds: ["item-5", "item-6"]
  },
  {
    id: "event-4",
    title: "正式搬遷入新家啦！",
    date: "2025-04-01",
    category: "搬家",
    description: "打包了幾十個紙箱，搬家公司來回跑了兩趟，終於在新家安頓了下來。雖然腰酸背痛，但看著陽光灑在乾淨的木地板上，對未來美好的家庭生活充滿了無限的憧憬。",
    mood: "辛苦",
    relatedItemIds: []
  },
  {
    id: "event-5",
    title: "結婚十週年紀念日",
    date: "2025-10-10",
    category: "家庭活動",
    description: "一轉眼我們已經結合理整整十年了。回憶起過去這些年共同奮鬥的點點滴滴，心中滿是感激。晚上我們去吃了當時求婚時的那家法式餐廳，並許下承諾，未來還要一起把家裝扮得更美麗。",
    mood: "紀念",
    relatedItemIds: []
  }
];

// 全域狀態
let items = [];
let events = [];

// ==========================================
// 2. 生命週期與 LocalStorage 操作
// ==========================================

function initData() {
  const localItems = localStorage.getItem("family_items");
  const localEvents = localStorage.getItem("family_events");

  if (!localItems || !localEvents) {
    // 寫入預設範例資料
    localStorage.setItem("family_items", JSON.stringify(DEFAULT_ITEMS));
    localStorage.setItem("family_events", JSON.stringify(DEFAULT_EVENTS));
    items = [...DEFAULT_ITEMS];
    events = [...DEFAULT_EVENTS];
  } else {
    items = JSON.parse(localItems);
    events = JSON.parse(localEvents);
  }
  
  // 檢查資料一致性，修正可能因為手動修改 localStorage 導致的關聯破裂
  sanitizeRelationships();
}

function saveData() {
  localStorage.setItem("family_items", JSON.stringify(items));
  localStorage.setItem("family_events", JSON.stringify(events));
  updateStats();
}

function sanitizeRelationships() {
  // 確保 item 指向的 event 存在，若不存在則將 eventId 設為 null
  items.forEach(item => {
    if (item.isRelatedToEvent && item.eventId) {
      const exists = events.some(e => e.id === item.eventId);
      if (!exists) {
        item.isRelatedToEvent = false;
        item.eventId = null;
      }
    }
  });

  // 確保 event 中 relatedItemIds 清單裡的 item 均存在，且這些 item 的 eventId 也是該 event
  events.forEach(event => {
    event.relatedItemIds = event.relatedItemIds.filter(itemId => {
      const item = items.find(i => i.id === itemId);
      if (item) {
        item.isRelatedToEvent = true;
        item.eventId = event.id;
        return true;
      }
      return false;
    });
  });
}

// ==========================================
// 3. 全域統計卡片計算
// ==========================================

function updateStats() {
  const today = new Date();
  const currentMonthStr = today.toISOString().substring(0, 7); // yyyy-mm
  const currentYearStr = today.getFullYear().toString(); // yyyy

  // 1. 物品總數
  document.getElementById("stat-total-items").innerText = items.length;

  // 2. 本月新增物品
  const thisMonthItems = items.filter(item => {
    if (!item.purchaseDate) return false;
    return item.purchaseDate.substring(0, 7) === currentMonthStr;
  });
  document.getElementById("stat-month-items").innerText = thisMonthItems.length;

  // 3. 即將保固到期數
  let warningCount = 0;
  items.forEach(item => {
    const status = getWarrantyStatus(item.warrantyExpiryDate);
    if (status.type === "warning") {
      warningCount++;
    }
  });
  document.getElementById("stat-warranty-alert").innerText = warningCount;

  // 4. 已關聯事件的物品數
  const relatedCount = items.filter(item => item.isRelatedToEvent && item.eventId).length;
  document.getElementById("stat-related-items").innerText = relatedCount;

  // 5. 今年重大事件數
  const thisYearEvents = events.filter(event => {
    if (!event.date) return false;
    return event.date.substring(0, 4) === currentYearStr;
  });
  document.getElementById("stat-year-events").innerText = thisYearEvents.length;
}

// 保固狀態計算小工具
function getWarrantyStatus(expiryStr) {
  if (!expiryStr) {
    return {
      type: "none",
      text: "未填保固",
      class: "tag-warranty-none"
    };
  }

  const today = new Date();
  // 消除今天日期的時分秒，只保留年月日進行比較
  today.setHours(0, 0, 0, 0);

  const expiryDate = new Date(expiryStr);
  expiryDate.setHours(0, 0, 0, 0);

  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      type: "expired",
      text: "保固已過期",
      class: "tag-warranty-err"
    };
  } else if (diffDays <= 30) {
    return {
      type: "warning",
      text: `即將到期 (${diffDays} 天)`,
      class: "tag-warranty-warn"
    };
  } else {
    return {
      type: "ok",
      text: `保固中 (${diffDays} 天)`,
      class: "tag-warranty-ok"
    };
  }
}

// ==========================================
// 4. UI 渲染邏輯
// ==========================================

// --- A. 物品頁面渲染 ---
function renderItems() {
  const container = document.getElementById("items-grid-container");
  const searchQuery = document.getElementById("item-search").value.trim().toLowerCase();
  const categoryFilter = document.getElementById("item-category-filter").value;
  const sortSelect = document.getElementById("item-sort-select").value;

  // 複製並過濾資料
  let filteredItems = [...items];

  // 關鍵字過濾
  if (searchQuery) {
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery))
    );
  }

  // 類別過濾
  if (categoryFilter !== "all") {
    filteredItems = filteredItems.filter(item => item.category === categoryFilter);
  }

  // 排序：最新到最舊(desc) / 最舊到最新(asc)
  filteredItems.sort((a, b) => {
    const dateA = new Date(a.purchaseDate || "1970-01-01");
    const dateB = new Date(b.purchaseDate || "1970-01-01");
    return sortSelect === "desc" ? dateB - dateA : dateA - dateB;
  });

  // 渲染清單
  container.innerHTML = "";

  if (filteredItems.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: span 3;">
        <div class="empty-icon">📦</div>
        <div class="empty-text">找不到符合條件的物品資料</div>
      </div>
    `;
    return;
  }

  filteredItems.forEach(item => {
    const warranty = getWarrantyStatus(item.warrantyExpiryDate);
    const event = item.isRelatedToEvent && item.eventId ? events.find(e => e.id === item.eventId) : null;
    
    const card = document.createElement("div");
    card.className = "item-card";
    card.id = `item-card-${item.id}`;

    // 格式化金額數字
    const formattedPrice = new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 }).format(item.purchasePrice);

    card.innerHTML = `
      <div>
        <div class="item-header">
          <h3 class="item-title">${escapeHTML(item.name)}</h3>
          <div class="card-actions">
            <button class="action-icon-btn edit-item-btn" data-id="${item.id}" title="編輯物品">✏️</button>
            <button class="action-icon-btn delete-item-btn" data-id="${item.id}" title="刪除物品">🗑️</button>
          </div>
        </div>

        <div class="tags-row">
          <span class="tag tag-category ${escapeHTML(item.category)}">${escapeHTML(item.category)}</span>
          <span class="tag ${warranty.class}">${escapeHTML(warranty.text)}</span>
        </div>

        <div class="item-details">
          <div class="detail-label">購買日期</div>
          <div class="detail-value">${escapeHTML(item.purchaseDate)}</div>
          
          <div class="detail-label">購買金額</div>
          <div class="detail-value">${formattedPrice}</div>
          
          <div class="detail-label">購買地點</div>
          <div class="detail-value">${escapeHTML(item.purchaseLocation) || "未填"}</div>
          
          <div class="detail-label">保固期限</div>
          <div class="detail-value">${escapeHTML(item.warrantyExpiryDate) || "無限制"}</div>
          
          ${item.notes ? `
            <div class="item-notes">
              ${escapeHTML(item.notes)}
            </div>
          ` : ""}
        </div>
      </div>

      <div class="item-relation">
        ${event ? `
          <a class="relation-link go-to-event" data-event-id="${event.id}">
            🔗 關聯事件：${escapeHTML(event.title)}
          </a>
        ` : `
          <span style="font-size: 0.8rem; color: var(--text-light);">未關聯任何事件</span>
        `}
      </div>
    `;

    container.appendChild(card);
  });

  // 綁定編輯與刪除按鈕事件
  container.querySelectorAll(".edit-item-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openItemModal(btn.dataset.id);
    });
  });

  container.querySelectorAll(".delete-item-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteItem(btn.dataset.id);
    });
  });

  container.querySelectorAll(".go-to-event").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToEvent(link.dataset.eventId);
    });
  });
}

// --- B. 重大事件時間軸渲染 ---
function renderTimeline() {
  const container = document.getElementById("timeline-container-el");
  const searchQuery = document.getElementById("event-search").value.trim().toLowerCase();
  const categoryFilter = document.getElementById("event-category-filter").value;

  // 篩選與過濾
  let filteredEvents = [...events];

  if (searchQuery) {
    filteredEvents = filteredEvents.filter(event => 
      event.title.toLowerCase().includes(searchQuery) ||
      event.description.toLowerCase().includes(searchQuery) ||
      event.category.toLowerCase().includes(searchQuery)
    );
  }

  if (categoryFilter !== "all") {
    filteredEvents = filteredEvents.filter(event => event.category === categoryFilter);
  }

  // 排序：日期由新到舊排列（從近到遠）
  filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 按年份分組
  const groupedEvents = {};
  filteredEvents.forEach(event => {
    const year = event.date ? event.date.substring(0, 4) : "未分类";
    if (!groupedEvents[year]) {
      groupedEvents[year] = [];
    }
    groupedEvents[year].push(event);
  });

  container.innerHTML = "";

  const years = Object.keys(groupedEvents).sort((a, b) => b - a); // 年份由新到舊排序

  if (years.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⏳</div>
        <div class="empty-text">找不到符合條件的重大事件資料</div>
      </div>
    `;
    return;
  }

  years.forEach(year => {
    const yearGroup = document.createElement("div");
    yearGroup.className = "timeline-year-group";
    yearGroup.id = `timeline-year-group-${year}`;

    // 年度分隔標題
    const yearTitle = document.createElement("div");
    yearTitle.className = "timeline-year-title";
    yearTitle.innerText = year;
    yearGroup.appendChild(yearTitle);

    // 該年份下的所有事件
    groupedEvents[year].forEach(event => {
      const card = document.createElement("div");
      card.className = "timeline-event-card";
      card.id = `event-card-${event.id}`;

      // 取得關聯的物品清單
      const relatedItems = items.filter(item => event.relatedItemIds.includes(item.id));

      card.innerHTML = `
        <div class="timeline-event-node" id="node-${event.id}"></div>
        <div class="event-header">
          <h3 class="event-title">${escapeHTML(event.title)}</h3>
          <div class="card-actions">
            <button class="action-icon-btn edit-event-btn" data-id="${event.id}" title="編輯事件">✏️</button>
            <button class="action-icon-btn delete-event-btn" data-id="${event.id}" title="刪除事件">🗑️</button>
          </div>
        </div>

        <div class="event-meta">
          <span class="event-date">📅 ${escapeHTML(event.date)}</span>
          <span class="tag tag-category ${escapeHTML(event.category)}">${escapeHTML(event.category)}</span>
          <span class="tag tag-mood ${escapeHTML(event.mood)}">${escapeHTML(event.mood)}</span>
        </div>

        <div class="event-desc">${escapeHTML(event.description)}</div>

        ${relatedItems.length > 0 ? `
          <div class="event-related-items">
            <div class="related-items-label">📦 相關家庭物品：</div>
            <div class="related-items-list">
              ${relatedItems.map(item => `
                <span class="related-item-tag view-item-detail" data-item-id="${item.id}">
                  🔍 ${escapeHTML(item.name)}
                </span>
              `).join("")}
            </div>
          </div>
        ` : ""}
      `;

      yearGroup.appendChild(card);
    });

    container.appendChild(yearGroup);
  });

  // 綁定編輯、刪除與物品詳情檢視事件
  container.querySelectorAll(".edit-event-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openEventModal(btn.dataset.id);
    });
  });

  container.querySelectorAll(".delete-event-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteEvent(btn.dataset.id);
    });
  });

  container.querySelectorAll(".view-item-detail").forEach(tag => {
    tag.addEventListener("click", (e) => {
      e.stopPropagation();
      openItemDetailModal(tag.dataset.itemId);
    });
  });
}

// ==========================================
// 5. 頁面切換控制與雙向跳轉
// ==========================================

function switchPage(pageId) {
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));

  if (pageId === "items") {
    document.getElementById("items-page").classList.add("active");
    document.getElementById("nav-items-btn").classList.add("active");
    renderItems();
  } else if (pageId === "timeline") {
    document.getElementById("timeline-page").classList.add("active");
    document.getElementById("nav-timeline-btn").classList.add("active");
    renderTimeline();
  }
}

// 物品頁點擊跳轉到事件時間軸
function navigateToEvent(eventId) {
  // 1. 切換至時間軸頁面
  switchPage("timeline");

  // 2. 找到該事件卡片
  setTimeout(() => {
    const card = document.getElementById(`event-card-${eventId}`);
    if (card) {
      // 滾動到事件卡片中央
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // 加上高亮發光動畫 class
      card.classList.add("highlight");
      
      // 2 秒後移除發光 class
      setTimeout(() => {
        card.classList.remove("highlight");
      }, 2000);
    }
  }, 100);
}

// ==========================================
// 6. 物品 新增/編輯/刪除 操作
// ==========================================

function openItemModal(itemId = null) {
  const modal = document.getElementById("item-modal");
  const form = document.getElementById("item-form");
  const modalTitle = document.getElementById("item-modal-title");
  
  // 初始化事件關聯下拉選單的選項列表
  const relationSelect = document.getElementById("form-item-relation-select");
  relationSelect.innerHTML = `<option value="none">無關聯重大事件</option>`;
  events.forEach(evt => {
    relationSelect.innerHTML += `<option value="${evt.id}">📅 [${evt.date}] ${evt.title}</option>`;
  });

  form.reset();
  
  if (itemId) {
    // 編輯模式
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    modalTitle.innerText = "編輯物品資訊";
    document.getElementById("item-id").value = item.id;
    document.getElementById("form-item-name").value = item.name;
    document.getElementById("form-item-category").value = item.category;
    document.getElementById("form-item-purchase-date").value = item.purchaseDate;
    document.getElementById("form-item-price").value = item.purchasePrice;
    document.getElementById("form-item-location").value = item.purchaseLocation || "";
    document.getElementById("form-item-warranty-expiry").value = item.warrantyExpiryDate || "";
    document.getElementById("form-item-notes").value = item.notes || "";
    
    if (item.isRelatedToEvent && item.eventId) {
      relationSelect.value = item.eventId;
    } else {
      relationSelect.value = "none";
    }
  } else {
    // 新增模式
    modalTitle.innerText = "新增物品";
    document.getElementById("item-id").value = "";
    // 設定購買日期預設值為今天 (格式 yyyy-MM-dd)
    document.getElementById("form-item-purchase-date").value = new Date().toISOString().substring(0, 10);
  }

  modal.classList.add("active");
}

function closeItemModal() {
  document.getElementById("item-modal").classList.remove("active");
}

function handleItemFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("item-id").value;
  const name = document.getElementById("form-item-name").value.trim();
  const category = document.getElementById("form-item-category").value;
  const purchaseDate = document.getElementById("form-item-purchase-date").value;
  const purchasePrice = parseInt(document.getElementById("form-item-price").value, 10) || 0;
  const purchaseLocation = document.getElementById("form-item-location").value.trim();
  const warrantyExpiryDate = document.getElementById("form-item-warranty-expiry").value;
  const notes = document.getElementById("form-item-notes").value.trim();
  const relationVal = document.getElementById("form-item-relation-select").value;

  const isRelated = relationVal !== "none";
  const eventId = isRelated ? relationVal : null;

  if (id) {
    // 【編輯】
    const itemIdx = items.findIndex(i => i.id === id);
    if (itemIdx === -1) return;

    const oldEventId = items[itemIdx].eventId;

    // 更新物品資料
    items[itemIdx] = {
      ...items[itemIdx],
      name, category, purchaseDate, purchasePrice, purchaseLocation, warrantyExpiryDate, notes,
      isRelatedToEvent: isRelated,
      eventId
    };

    // 同步關聯事件狀態
    if (oldEventId !== eventId) {
      // 1. 若以前有關聯其他事件，從該舊事件的 relatedItemIds 中移除此物品
      if (oldEventId) {
        const oldEvt = events.find(e => e.id === oldEventId);
        if (oldEvt) {
          oldEvt.relatedItemIds = oldEvt.relatedItemIds.filter(itemId => itemId !== id);
        }
      }
      // 2. 若現在關聯了新事件，加入該新事件的 relatedItemIds 中
      if (eventId) {
        const newEvt = events.find(e => e.id === eventId);
        if (newEvt && !newEvt.relatedItemIds.includes(id)) {
          newEvt.relatedItemIds.push(id);
        }
      }
    }
  } else {
    // 【新增】
    const newId = `item-${Date.now()}`;
    const newItem = {
      id: newId,
      name, category, purchaseDate, purchasePrice, purchaseLocation, warrantyExpiryDate, notes,
      isRelatedToEvent: isRelated,
      eventId
    };
    items.push(newItem);

    // 同步加入關聯的事件中
    if (eventId) {
      const evt = events.find(e => e.id === eventId);
      if (evt) {
        evt.relatedItemIds.push(newId);
      }
    }
  }

  saveData();
  closeItemModal();
  renderItems();
}

function deleteItem(itemId) {
  if (!confirm("確定要刪除這筆物品紀錄嗎？刪除後將無法還原。")) return;

  // 1. 從所有事件關聯清單中移除此物品 ID
  events.forEach(evt => {
    evt.relatedItemIds = evt.relatedItemIds.filter(id => id !== itemId);
  });

  // 2. 從物品列表中移除此物品
  items = items.filter(i => i.id !== itemId);

  saveData();
  renderItems();
}

// ==========================================
// 7. 事件 新增/編輯/刪除 操作
// ==========================================

function openEventModal(eventId = null) {
  const modal = document.getElementById("event-modal");
  const form = document.getElementById("event-form");
  const modalTitle = document.getElementById("event-modal-title");
  
  // 建立可勾選的家庭物品清單
  const itemsContainer = document.getElementById("form-event-items-list");
  itemsContainer.innerHTML = "";

  if (items.length === 0) {
    itemsContainer.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-light);">目前無任何家庭物品可供關聯。</span>`;
  } else {
    items.forEach(item => {
      itemsContainer.innerHTML += `
        <label class="item-checkbox-label">
          <input type="checkbox" name="related_items" value="${item.id}" id="chk-${item.id}">
          <span>[${escapeHTML(item.category)}] ${escapeHTML(item.name)}</span>
        </label>
      `;
    });
  }

  form.reset();

  if (eventId) {
    // 編輯模式
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    modalTitle.innerText = "編輯重大事件";
    document.getElementById("event-id").value = event.id;
    document.getElementById("form-event-title").value = event.title;
    document.getElementById("form-event-date").value = event.date;
    document.getElementById("form-event-category").value = event.category;
    document.getElementById("form-event-mood").value = event.mood;

    // 勾選原本已關聯的物品
    event.relatedItemIds.forEach(itemId => {
      const chk = document.getElementById(`chk-${itemId}`);
      if (chk) chk.checked = true;
    });
  } else {
    // 新增模式
    modalTitle.innerText = "新增重大事件";
    document.getElementById("event-id").value = "";
    // 設定事件日期預設為今天
    document.getElementById("form-event-date").value = new Date().toISOString().substring(0, 10);
  }

  modal.classList.add("active");
}

function closeEventModal() {
  document.getElementById("event-modal").classList.remove("active");
}

function handleEventFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("event-id").value;
  const title = document.getElementById("form-event-title").value.trim();
  const date = document.getElementById("form-event-date").value;
  const category = document.getElementById("form-event-category").value;
  const mood = document.getElementById("form-event-mood").value;
  const description = document.getElementById("form-event-desc").value.trim();

  // 取得所有勾選的物品 ID 清單
  const chkItems = Array.from(document.querySelectorAll("input[name='related_items']:checked")).map(chk => chk.value);

  if (id) {
    // 【編輯】
    const eventIdx = events.findIndex(e => e.id === id);
    if (eventIdx === -1) return;

    const oldRelatedIds = events[eventIdx].relatedItemIds;

    // 更新事件
    events[eventIdx] = {
      ...events[eventIdx],
      title, date, category, mood, description,
      relatedItemIds: chkItems
    };

    // 雙向資料更新：
    // 1. 原先關聯但在此次被移除勾選的物品，解除事件綁定
    oldRelatedIds.forEach(itemId => {
      if (!chkItems.includes(itemId)) {
        const item = items.find(i => i.id === itemId);
        if (item) {
          item.isRelatedToEvent = false;
          item.eventId = null;
        }
      }
    });

    // 2. 新增勾選的物品，將其綁定至此事件中
    chkItems.forEach(itemId => {
      const item = items.find(i => i.id === itemId);
      if (item) {
        // 如果該物品原本有關聯別的事件，需要先從別的事件中移除該物品 ID
        if (item.isRelatedToEvent && item.eventId && item.eventId !== id) {
          const prevEvt = events.find(e => e.id === item.eventId);
          if (prevEvt) {
            prevEvt.relatedItemIds = prevEvt.relatedItemIds.filter(iId => iId !== itemId);
          }
        }
        item.isRelatedToEvent = true;
        item.eventId = id;
      }
    });

  } else {
    // 【新增】
    const newId = `event-${Date.now()}`;
    const newEvent = {
      id: newId,
      title, date, category, mood, description,
      relatedItemIds: chkItems
    };
    events.push(newEvent);

    // 將被勾選的物品關聯指向本事件
    chkItems.forEach(itemId => {
      const item = items.find(i => i.id === itemId);
      if (item) {
        // 若該物品原本有關聯別的事件，從原事件移除
        if (item.isRelatedToEvent && item.eventId) {
          const prevEvt = events.find(e => e.id === item.eventId);
          if (prevEvt) {
            prevEvt.relatedItemIds = prevEvt.relatedItemIds.filter(iId => iId !== itemId);
          }
        }
        item.isRelatedToEvent = true;
        item.eventId = newId;
      }
    });
  }

  saveData();
  closeEventModal();
  renderTimeline();
}

function deleteEvent(eventId) {
  if (!confirm("確定要刪除這筆重大事件紀錄嗎？刪除後將無法還原。")) return;

  // 1. 將所有關聯此事件的物品，解除關聯狀態
  items.forEach(item => {
    if (item.eventId === eventId) {
      item.isRelatedToEvent = false;
      item.eventId = null;
    }
  });

  // 2. 從事件清單中刪除該事件
  events = events.filter(e => e.id !== eventId);

  saveData();
  renderTimeline();
}

// ==========================================
// 8. 物品詳情檢視彈窗 (在時間軸中點擊物品標籤)
// ==========================================

function openItemDetailModal(itemId) {
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  const modal = document.getElementById("detail-modal");
  const modalTitle = document.getElementById("detail-modal-title");
  const modalBody = document.getElementById("detail-modal-body");

  modalTitle.innerText = "📦 家庭物品詳細資訊";
  
  const warranty = getWarrantyStatus(item.warrantyExpiryDate);
  const formattedPrice = new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 }).format(item.purchasePrice);

  modalBody.innerHTML = `
    <div class="detail-view">
      <div class="detail-view-title">${escapeHTML(item.name)}</div>
      
      <div style="margin-bottom: 14px;">
        <span class="tag tag-category ${escapeHTML(item.category)}">${escapeHTML(item.category)}</span>
        <span class="tag ${warranty.class}">${escapeHTML(warranty.text)}</span>
      </div>

      <div class="detail-view-grid">
        <div class="detail-label">購買日期</div>
        <div class="detail-value">${escapeHTML(item.purchaseDate)}</div>

        <div class="detail-label">購買金額</div>
        <div class="detail-value">${formattedPrice}</div>

        <div class="detail-label">購買地點</div>
        <div class="detail-value">${escapeHTML(item.purchaseLocation) || "未填"}</div>

        <div class="detail-label">保固期限</div>
        <div class="detail-value">${escapeHTML(item.warrantyExpiryDate) || "無限制"}</div>
      </div>

      ${item.notes ? `
        <div class="detail-label" style="font-weight:600; margin-bottom:6px;">備註說明：</div>
        <div class="detail-view-notes">${escapeHTML(item.notes)}</div>
      ` : ""}
    </div>
  `;

  modal.classList.add("active");
}

function closeDetailModal() {
  document.getElementById("detail-modal").classList.remove("active");
}

// ==========================================
// 9. 安全 HTML 跳脫防 XSS
// ==========================================

function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// 10. 事件接聽與初始化
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. 綁定密碼驗證事件監聽
  document.getElementById("auth-submit-btn").addEventListener("click", submitAuth);
  document.getElementById("auth-password-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      submitAuth();
    }
  });

  // 2. 執行驗證檢查
  checkAuth();

  // 3. 導覽列按鈕切換
  document.getElementById("nav-items-btn").addEventListener("click", () => switchPage("items"));
  document.getElementById("nav-timeline-btn").addEventListener("click", () => switchPage("timeline"));
  document.getElementById("brand-logo").addEventListener("click", (e) => {
    e.preventDefault();
    switchPage("items");
  });

  // 4. 物品搜尋與篩選事件監聽
  document.getElementById("item-search").addEventListener("input", renderItems);
  document.getElementById("item-category-filter").addEventListener("change", renderItems);
  document.getElementById("item-sort-select").addEventListener("change", renderItems);

  // 5. 事件搜尋與篩選事件監聽
  document.getElementById("event-search").addEventListener("input", renderTimeline);
  document.getElementById("event-category-filter").addEventListener("change", renderTimeline);

  // 6. 物品 Modal 操作
  document.getElementById("add-item-btn").addEventListener("click", () => openItemModal());
  document.getElementById("item-modal-close-btn").addEventListener("click", closeItemModal);
  document.getElementById("item-modal-cancel").addEventListener("click", closeItemModal);
  document.getElementById("item-form").addEventListener("submit", handleItemFormSubmit);

  // 7. 事件 Modal 操作
  document.getElementById("add-event-btn").addEventListener("click", () => openEventModal());
  document.getElementById("event-modal-close-btn").addEventListener("click", closeEventModal);
  document.getElementById("event-modal-cancel").addEventListener("click", closeEventModal);
  document.getElementById("event-form").addEventListener("submit", handleEventFormSubmit);

  // 8. 詳情 Modal 操作
  document.getElementById("detail-modal-close-btn").addEventListener("click", closeDetailModal);
  document.getElementById("detail-modal-ok-btn").addEventListener("click", closeDetailModal);

  // 9. 點擊 Modal 背景關閉彈窗
  window.addEventListener("click", (e) => {
    const itemModal = document.getElementById("item-modal");
    const eventModal = document.getElementById("event-modal");
    const detailModal = document.getElementById("detail-modal");

    if (e.target === itemModal) closeItemModal();
    if (e.target === eventModal) closeEventModal();
    if (e.target === detailModal) closeDetailModal();
  });

  // 10. 備份與還原按鈕監聽
  document.getElementById("nav-export-btn").addEventListener("click", exportBackup);
  document.getElementById("nav-import-btn").addEventListener("click", () => {
    document.getElementById("import-file-input").click();
  });
  document.getElementById("import-file-input").addEventListener("change", handleImportBackup);
});

// ==========================================
// 11. 資料備份與還原 (匯出/匯入 JSON) 具體實作
// ==========================================

function exportBackup() {
  const dataStr = JSON.stringify({ items, events }, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const today = new Date();
  const dateStr = today.toISOString().substring(0, 10).replace(/-/g, "");
  const tempLink = document.createElement("a");
  tempLink.href = url;
  tempLink.download = `family_archive_backup_${dateStr}.json`;
  
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  URL.revokeObjectURL(url);
}

function handleImportBackup(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const importedData = JSON.parse(evt.target.result);
      
      // 驗證結構是否正確
      if (!importedData.items || !Array.isArray(importedData.items) ||
          !importedData.events || !Array.isArray(importedData.events)) {
        alert("資料還原失敗：備份檔案結構不正確。");
        return;
      }

      if (!confirm("匯入備份將會覆蓋目前的所有紀錄！確定要繼續嗎？")) {
        return;
      }

      items = importedData.items;
      events = importedData.events;
      
      sanitizeRelationships();
      saveData();
      
      // 重新渲染畫面
      updateStats();
      const currentActiveTab = document.querySelector(".nav-btn.active").id;
      if (currentActiveTab === "nav-items-btn") {
        renderItems();
      } else {
        renderTimeline();
      }
      
      alert("🎉 家庭紀錄已成功從備份中還原！");
    } catch (err) {
      alert("資料還原失敗：無法解析此備份檔案。");
      console.error(err);
    }
  };
  reader.readAsText(file);
  e.target.value = ""; // 重設值，允許重複選擇同一個檔案
}

// ==========================================
// 12. 密碼驗證邏輯 具體實作
// ==========================================

const CORRECT_PASSWORD = "DDHOME";

function checkAuth() {
  const isAuthedLocal = localStorage.getItem("family_auth") === "true";
  const isAuthedSession = sessionStorage.getItem("family_auth") === "true";

  if (isAuthedLocal || isAuthedSession) {
    document.getElementById("auth-page").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    
    // 初始化資料與統計
    initData();
    updateStats();
    renderItems();
  } else {
    document.getElementById("auth-page").style.display = "flex";
    document.getElementById("main-content").style.display = "none";
    
    // 聚焦於密碼輸入框
    setTimeout(() => {
      const pwdInput = document.getElementById("auth-password-input");
      if (pwdInput) pwdInput.focus();
    }, 100);
  }
}

function submitAuth() {
  const pwdInput = document.getElementById("auth-password-input");
  const errorMsg = document.getElementById("auth-error-msg");
  const rememberMe = document.getElementById("auth-remember-me");
  
  const enteredPwd = pwdInput.value;

  if (enteredPwd === CORRECT_PASSWORD) {
    errorMsg.innerText = "";
    
    if (rememberMe.checked) {
      localStorage.setItem("family_auth", "true");
    } else {
      sessionStorage.setItem("family_auth", "true");
    }
    
    document.getElementById("auth-page").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    
    // 初始化資料與統計
    initData();
    updateStats();
    renderItems();
  } else {
    errorMsg.innerText = "❌ 密碼錯誤，請重新輸入。";
    pwdInput.value = "";
    pwdInput.focus();
  }
}
