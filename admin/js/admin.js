// ============================================================
// SHOPIRE Admin Panel - admin.js
// Location: admin/js/admin.js
// ============================================================

// ── GUARD: Admin only - redirect to admin login if not logged in ──
document.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) { window.location.href = 'login.html'; return; }
  if (!isAdmin())    { window.location.href = 'login.html'; return; }
  const user = getUser();
  if (user) document.getElementById('adminName').textContent = user.name || 'Admin';
  loadAll();
});

// ── STATE ──
let allOrders = [];
let allProducts = [];
let currentOrderFilter = 'all';
let editingProductId = null;

// ── LOAD ALL DATA ──
async function loadAll() {
  await Promise.all([loadOrders(), loadProducts()]);
}

async function refreshData() {
  showAdminToast('🔄 Refreshing data...','info');
  await loadAll();
  showAdminToast('✅ Data refreshed!');
}

// ── ORDERS ──
async function loadOrders() {
  try {
    const data = await Orders.allOrders();
    allOrders = Array.isArray(data) ? data : [];
    updateStats();
    renderRecentOrders();
    renderOrdersTable();
    const pending = allOrders.filter(o => o.status === 'pending').length;
    document.getElementById('pendingBadge').textContent = pending;
  } catch(e) {
    showError('ordersTableWrap', e.message);
    showError('recentOrdersTable', e.message);
  }
}

// ── PRODUCTS ──
async function loadProducts() {
  try {
    const data = await Products.getAll();
    allProducts = Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);
    renderProductsGrid();
    populateCatFilter();
    updateStats();
  } catch(e) {
    showError('productsGridWrap', e.message);
  }
}

// ── STATS ──
function updateStats() {
  const total     = allOrders.length;
  const pending   = allOrders.filter(o=>o.status==='pending').length;
  const shipped   = allOrders.filter(o=>o.status==='shipped').length;
  const delivered = allOrders.filter(o=>o.status==='delivered').length;
  const revenue   = allOrders
    .filter(o=>o.status!=='cancelled')
    .reduce((s,o)=>s+parseFloat(o.total||0),0);
  const inStock = allProducts.filter(p=>parseInt(p.stock||0)>0).length;

  document.getElementById('statOrders').textContent = total;
  document.getElementById('statPendingOrders').innerHTML = `<i class="fas fa-clock"></i> ${pending} pending`;
  document.getElementById('statRevenue').textContent = '$' + revenue.toFixed(0);
  document.getElementById('statRevenueChange').innerHTML = `<i class="fas fa-check-circle"></i> ${delivered} delivered`;
  document.getElementById('statProducts').textContent = allProducts.length;
  document.getElementById('statProductsChange').innerHTML = `<i class="fas fa-check"></i> ${inStock} in stock`;
  document.getElementById('statShipped').textContent = shipped;
  document.getElementById('statDelivered').innerHTML = `<i class="fas fa-check-circle"></i> ${delivered} delivered`;
}

// ── RECENT ORDERS (dashboard) ──
function renderRecentOrders() {
  const recent = [...allOrders].slice(0, 6);
  const el = document.getElementById('recentOrdersTable');
  if (!recent.length) {
    el.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i><h3>No orders yet</h3><p>Orders will appear here</p></div>`;
    return;
  }
  el.innerHTML = renderOrdersTableHTML(recent, true);
}

// ── ORDERS TABLE ──
function filterOrders(status, btn) {
  currentOrderFilter = status;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderOrdersTable();
}

function renderOrdersTable() {
  const search = (document.getElementById('orderSearch')?.value||'').toLowerCase();
  const sort   = document.getElementById('orderSort')?.value || 'newest';
  const el     = document.getElementById('ordersTableWrap');
  if(!el) return;

  let filtered = [...allOrders];
  if(currentOrderFilter !== 'all') filtered = filtered.filter(o=>o.status===currentOrderFilter);
  if(search) filtered = filtered.filter(o=>{
    return String(o.id).includes(search) ||
      (o.name||'').toLowerCase().includes(search) ||
      (o.user_name||'').toLowerCase().includes(search) ||
      (o.city||'').toLowerCase().includes(search) ||
      (o.user_email||'').toLowerCase().includes(search);
  });

  if(sort==='oldest')  filtered.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
  else if(sort==='high') filtered.sort((a,b)=>parseFloat(b.total)-parseFloat(a.total));
  else if(sort==='low')  filtered.sort((a,b)=>parseFloat(a.total)-parseFloat(b.total));
  else filtered.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));

  document.getElementById('ordersCount').textContent = `${filtered.length} order${filtered.length!==1?'s':''}`;

  if(!filtered.length){
    el.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><h3>No orders found</h3><p>Try changing filters</p></div>`;
    return;
  }
  el.innerHTML = renderOrdersTableHTML(filtered, false);
}

function renderOrdersTableHTML(orders, compact) {
  return `<table class="data-table">
    <thead><tr>
      <th>Order #</th>
      <th>Customer</th>
      ${compact?'':'<th>Items</th>'}
      <th>Amount</th>
      <th>Date</th>
      <th>Status</th>
      <th>Actions</th>
    </tr></thead>
    <tbody>
      ${orders.map(o=>`
        <tr>
          <td><div class="order-id">#${o.id}</div></td>
          <td>
            <div class="customer">${o.user_name||o.name||'—'}</div>
            <div class="email">${o.user_email||o.email||''}</div>
            ${o.city?`<div class="email"><i class="fas fa-map-marker-alt" style="color:var(--red)"></i> ${o.city}</div>`:''}
          </td>
          ${compact?'':`<td><div class="order-items-mini">${o.items_summary||'—'}</div></td>`}
          <td><span class="amount">$${parseFloat(o.total||0).toFixed(2)}</span></td>
          <td style="font-size:13px;color:var(--muted)">${formatDate(o.created_at)}</td>
          <td>
            <select class="status-select" data-id="${o.id}" onchange="updateOrderStatus(${o.id},this.value)">
              ${['pending','processing','shipped','delivered','cancelled'].map(s=>
                `<option value="${s}" ${o.status===s?'selected':''}>${capitalize(s)}</option>`
              ).join('')}
            </select>
          </td>
          <td>
            <button class="action-btn view" onclick="viewOrderDetail(${o.id})">
              <i class="fas fa-eye"></i> View
            </button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>`;
}

// ── UPDATE ORDER STATUS ──
async function updateOrderStatus(id, status) {
  try {
    await Orders.updateStatus(id, status);
    const order = allOrders.find(o=>o.id===id);
    if(order) order.status = status;
    updateStats();
    showAdminToast(`✅ Order #${id} → ${capitalize(status)}`);
    const pending = allOrders.filter(o=>o.status==='pending').length;
    document.getElementById('pendingBadge').textContent = pending;
  } catch(e) {
    showAdminToast('❌ ' + e.message, 'error');
    renderOrdersTable();
  }
}

// ── VIEW ORDER DETAIL ──
function viewOrderDetail(id) {
  const o = allOrders.find(o=>o.id===id);
  if(!o) return;
  document.getElementById('orderModalTitle').textContent = `Order #${id} Details`;
  document.getElementById('orderModalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div><div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;margin-bottom:3px">Customer</div>
        <div style="font-weight:700">${o.user_name||o.name||'—'}</div>
        <div style="font-size:13px;color:var(--muted)">${o.user_email||o.email||''}</div>
      </div>
      <div><div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;margin-bottom:3px">Contact</div>
        <div style="font-weight:700">${o.phone||'—'}</div>
        <div style="font-size:13px;color:var(--muted)">${o.city||''} ${o.address||''}</div>
      </div>
      <div><div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;margin-bottom:3px">Date</div>
        <div style="font-weight:700">${formatDate(o.created_at)}</div>
      </div>
      <div><div style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;margin-bottom:3px">Status</div>
        <span class="badge badge-${o.status}">${o.status}</span>
      </div>
    </div>
    <div style="background:var(--gray);border-radius:10px;padding:14px;margin-bottom:14px">
      <div style="font-size:12px;color:var(--muted);font-weight:700;text-transform:uppercase;margin-bottom:8px">Items Ordered</div>
      <div style="font-size:14px;font-weight:600;color:var(--text)">${o.items_summary||'Details not available'}</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-top:2px solid var(--gray2)">
      <span style="font-weight:700;font-size:15px">Total Amount</span>
      <span style="font-size:22px;font-weight:900;color:var(--red)">$${parseFloat(o.total||0).toFixed(2)}</span>
    </div>
    <div style="margin-top:14px">
      <div style="font-size:12px;font-weight:700;margin-bottom:8px;text-transform:uppercase;color:var(--muted)">Update Status</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${['pending','processing','shipped','delivered','cancelled'].map(s=>`
          <button class="action-btn ${o.status===s?'save':'view'}"
            onclick="updateOrderStatus(${o.id},'${s}');closeModal('orderModal')"
            style="${o.status===s?'opacity:.6;cursor:default':''}">
            ${capitalize(s)}
          </button>
        `).join('')}
      </div>
    </div>
  `;
  openModal('orderModal');
}

// ── PRODUCTS GRID ──
function populateCatFilter() {
  const cats = [...new Set(allProducts.map(p=>p.category).filter(Boolean))].sort();
  const sel = document.getElementById('productCatFilter');
  if(!sel) return;
  const cur = sel.value;
  sel.innerHTML = `<option value="">All Categories</option>` +
    cats.map(c=>`<option value="${c}" ${c===cur?'selected':''}>${c}</option>`).join('');
}

function renderProductsGrid() {
  const search = (document.getElementById('productSearch')?.value||'').toLowerCase();
  const cat    = document.getElementById('productCatFilter')?.value || '';
  const stockF = document.getElementById('productStockFilter')?.value || '';
  const el     = document.getElementById('productsGridWrap');
  if(!el) return;

  let prods = [...allProducts];
  if(search) prods = prods.filter(p=>
    (p.name||'').toLowerCase().includes(search) ||
    (p.brand||'').toLowerCase().includes(search)
  );
  if(cat) prods = prods.filter(p=>p.category===cat);
  if(stockF==='in')  prods = prods.filter(p=>parseInt(p.stock||0)>4);
  if(stockF==='low') prods = prods.filter(p=>parseInt(p.stock||0)>0&&parseInt(p.stock||0)<=4);
  if(stockF==='out') prods = prods.filter(p=>parseInt(p.stock||0)<=0);

  if(!prods.length){
    el.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><h3>No products found</h3><p>Try different filters</p></div>`;
    return;
  }
  el.innerHTML = `<div class="products-grid">
    ${prods.map(p=>{
      const stock = parseInt(p.stock||0);
      const stockClass = stock<=0?'out':stock<=4?'low':'in';
      const stockLabel = stock<=0?'Out of Stock':stock<=4?`Low: ${stock}`:`${stock} in stock`;
      return `
        <div class="product-admin-card">
          <div class="product-admin-img">
            ${p.image?`<img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
            <div class="no-img" style="${p.image?'display:none':'display:flex'}"><i class="fas fa-image"></i></div>
            <span class="stock-pill ${stockClass}">${stockLabel}</span>
          </div>
          <div class="product-admin-info">
            <div class="product-admin-name" title="${p.name}">${p.name}</div>
            <div class="product-admin-cat">${p.category||'—'} ${p.brand?'· '+p.brand:''}</div>
            <div class="product-admin-price">$${parseFloat(p.price||0).toFixed(2)}</div>
            <div class="product-admin-actions">
              <button class="action-btn edit" onclick="openEditProduct(${p.id})"><i class="fas fa-edit"></i> Edit</button>
              <button class="action-btn del" onclick="deleteProduct(${p.id},'${(p.name||'').replace(/'/g,'')}')"><i class="fas fa-trash"></i> Del</button>
            </div>
          </div>
        </div>
      `;
    }).join('')}
  </div>`;
}

// ── ADD/EDIT PRODUCT ──
function openAddProduct() {
  editingProductId = null;
  document.getElementById('productModalTitle').textContent = 'Add New Product';
  document.getElementById('productSubmitBtn').innerHTML = '<i class="fas fa-plus"></i> Add Product';
  ['pName','pCategory','pPrice','pOldPrice','pStock','pBrand','pImage','pDesc'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.value='';
  });
  openModal('productModal');
}

function openEditProduct(id) {
  const p = allProducts.find(p=>p.id===id);
  if(!p) return;
  editingProductId = id;
  document.getElementById('productModalTitle').textContent = 'Edit Product';
  document.getElementById('productSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Save Changes';
  document.getElementById('pName').value     = p.name||'';
  document.getElementById('pCategory').value = p.category||'';
  document.getElementById('pPrice').value    = p.price||'';
  document.getElementById('pOldPrice').value = p.old_price||'';
  document.getElementById('pStock').value    = p.stock||'';
  document.getElementById('pBrand').value    = p.brand||'';
  document.getElementById('pImage').value    = p.image||'';
  document.getElementById('pDesc').value     = p.description||'';
  openModal('productModal');
}

async function submitProduct() {
  const name        = document.getElementById('pName').value.trim();
  const category    = document.getElementById('pCategory').value;
  const price       = parseFloat(document.getElementById('pPrice').value);
  const old_price   = parseFloat(document.getElementById('pOldPrice').value)||null;
  const stock       = parseInt(document.getElementById('pStock').value)||0;
  const brand       = document.getElementById('pBrand').value.trim();
  const image       = document.getElementById('pImage').value.trim();
  const description = document.getElementById('pDesc').value.trim();

  if(!name||!category||isNaN(price)){
    showAdminToast('❌ Name, Category and Price are required!','error'); return;
  }

  const btn = document.getElementById('productSubmitBtn');
  btn.disabled=true; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...';

  try {
    const data = {name,category,price,old_price,stock,brand,image,description};
    if(editingProductId) {
      await Products.update(editingProductId, data);
      showAdminToast('✅ Product updated!');
    } else {
      await Products.add(data);
      showAdminToast('✅ Product added!');
    }
    closeModal('productModal');
    await loadProducts();
  } catch(e) {
    showAdminToast('❌ '+e.message,'error');
  } finally {
    btn.disabled=false;
    btn.innerHTML=editingProductId?'<i class="fas fa-save"></i> Save Changes':'<i class="fas fa-plus"></i> Add Product';
  }
}

async function deleteProduct(id, name) {
  if(!confirm(`"${name}" delete karna chahte hain?`)) return;
  try {
    await Products.delete(id);
    showAdminToast(`🗑️ "${name}" deleted!`);
    await loadProducts();
  } catch(e) {
    showAdminToast('❌ '+e.message,'error');
  }
}

// ── PAGE NAVIGATION ──
function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+name)?.classList.add('active');
  document.querySelectorAll('.sidebar-link').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  else {
    document.querySelectorAll('.sidebar-link').forEach(b=>{
      if(b.textContent.trim().toLowerCase().startsWith(name)) b.classList.add('active');
    });
  }
  const titles = {
    dashboard:'<i class="fas fa-chart-pie" style="color:var(--red);margin-right:8px"></i>Dashboard',
    orders:'<i class="fas fa-box-open" style="color:var(--red);margin-right:8px"></i>Orders',
    products:'<i class="fas fa-tags" style="color:var(--red);margin-right:8px"></i>Products'
  };
  document.getElementById('pageTitle').innerHTML = titles[name]||name;
  closeSidebar();
}

// ── MODAL ──
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.addEventListener('click',e=>{
  if(e.target.classList.contains('modal-overlay')) e.target.classList.remove('open');
});

// ── SIDEBAR (mobile) ──
function openSidebar() {
  document.getElementById('adminSidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeSidebar() {
  document.getElementById('adminSidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.body.style.overflow='';
}

// ── LOGOUT ──
function doAdminLogout(e) {
  e.preventDefault();
  localStorage.removeItem('shopire_token');
  localStorage.removeItem('shopire_user');
  window.location.href = 'login.html';
}

// ── HELPERS ──
function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function formatDate(d){
  if(!d) return '—';
  return new Date(d).toLocaleDateString('en-PK',{year:'numeric',month:'short',day:'numeric'});
}
function showError(elId, msg){
  const el = document.getElementById(elId);
  if(el) el.innerHTML=`<div class="empty-state"><i class="fas fa-exclamation-triangle" style="color:var(--red)"></i><h3>Error</h3><p>${msg}</p></div>`;
}

let toastTimer;
function showAdminToast(msg, type='success'){
  const t = document.getElementById('admin-toast');
  t.textContent = msg;
  t.style.background = type==='error'?'#ef4444':type==='info'?'#3b82f6':'#111';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'),3000);
}
