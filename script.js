// ===========================
// CONFIGURAÇÃO
// ===========================
const TELEFONE = "5521964770258";

// ===========================
// ESTADO
// ===========================
let cart = [];

// ===========================
// CARRINHO: ABRIR / FECHAR
// ===========================
function toggleCart() {
    const modal   = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    const isOpen  = modal.classList.contains('open');

    modal.classList.toggle('open', !isOpen);
    overlay.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
}

// ===========================
// ADICIONAR AO CARRINHO
// ===========================
function addToCart(nome, preco) {
    const item = cart.find(i => i.nome === nome);

    if (item) {
        item.qty++;
    } else {
        cart.push({ nome, preco, qty: 1 });
    }

    renderCart();
    showToast(`✅ ${nome} adicionado!`);
}

// ===========================
// ALTERAR QUANTIDADE
// ===========================
function changeQty(nome, delta) {
    const idx = cart.findIndex(i => i.nome === nome);
    if (idx === -1) return;

    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);

    renderCart();
}

// ===========================
// REMOVER ITEM
// ===========================
function removeItem(nome) {
    cart = cart.filter(i => i.nome !== nome);
    renderCart();
}

// ===========================
// RENDERIZAR CARRINHO
// ===========================
function renderCart() {
    const itemsEl  = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const cartBar  = document.getElementById('cartBar');
    const badgeEl  = document.getElementById('cartBarBadge');
    const totalEl  = document.getElementById('cartBarTotal');
    const cartTotalEl = document.getElementById('cartTotal');

    const totalQty   = cart.reduce((s, i) => s + i.qty, 0);
    const totalPreco = cart.reduce((s, i) => s + i.preco * i.qty, 0);

    // Barra do rodapé
    cartBar.style.display  = cart.length > 0 ? 'block' : 'none';
    badgeEl.textContent    = totalQty;
    totalEl.textContent    = fmtPreco(totalPreco);

    if (cartTotalEl) cartTotalEl.textContent = fmtPreco(totalPreco);

    if (cart.length === 0) {
        itemsEl.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
        if (footerEl) footerEl.style.display = 'none';
        return;
    }

    if (footerEl) footerEl.style.display = 'flex';

    itemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <p class="cart-item-name">${item.nome}</p>
                <p class="cart-item-price">${fmtPreco(item.preco * item.qty)}</p>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQty('${esc(item.nome)}', -1)" aria-label="Remover um">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${esc(item.nome)}', 1)" aria-label="Adicionar um">+</button>
                <button class="remove-btn" onclick="removeItem('${esc(item.nome)}')">🗑</button>
            </div>
        </div>
    `).join('');
}

// ===========================
// ENVIAR PEDIDO VIA WHATSAPP
// ===========================
function enviarPedido() {
    if (cart.length === 0) {
        showToast('Adicione itens antes de confirmar.');
        return;
    }

    const nome      = document.getElementById('nomeCliente').value.trim();
    const endereco  = document.getElementById('enderecoCliente').value.trim();
    const pagamento = document.querySelector('input[name="pagamento"]:checked')?.value || 'Não informado';

    if (!nome || !endereco) {
        showToast('Preencha nome e endereço.');
        return;
    }

    const totalPreco = cart.reduce((s, i) => s + i.preco * i.qty, 0);

    const itens = cart.map(i =>
        `%20%20%E2%80%A2%20${i.qty}x%20${encodeURIComponent(i.nome)}%20%3D%20${encodeURIComponent(fmtPreco(i.preco * i.qty))}`
    ).join('%0A');

    const msg =
        `*Novo%20Pedido%20-%20Del%C3%ADcias%20da%20Mira*%20%F0%9F%8D%BD%EF%B8%8F%0A` +
        `---%0A` +
        `*Cliente:*%20${encodeURIComponent(nome)}%0A` +
        `*Endere%C3%A7o:*%20${encodeURIComponent(endereco)}%0A` +
        `*Pagamento:*%20${encodeURIComponent(pagamento)}%0A` +
        `---%0A` +
        `*Itens:*%0A${itens}%0A` +
        `---%0A` +
        `*Total:%20${encodeURIComponent(fmtPreco(totalPreco))}*`;

    window.open(`https://wa.me/${TELEFONE}?text=${msg}`, '_blank');
}

// ===========================
// PIX: MOSTRAR / OCULTAR
// ===========================
document.addEventListener('change', function(e) {
    if (e.target.name === 'pagamento') {
        const pixBox = document.getElementById('pixBox');
        if (pixBox) {
            pixBox.style.display = e.target.value === 'PIX' ? 'block' : 'none';
        }
    }
});

function copiarPix() {
    const chave = document.getElementById('pixKeyText').textContent;
    navigator.clipboard.writeText(chave)
        .then(() => showToast('Chave PIX copiada!'))
        .catch(() => showToast('Copie manualmente: ' + chave));
}

// ===========================
// FILTRO POR CATEGORIA
// ===========================
function filtrar(btn) {
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');

    const filtro = btn.dataset.filter;

    document.querySelectorAll('.product-row').forEach(row => {
        const cat = row.dataset.category;
        row.classList.toggle('hidden', filtro !== 'todos' && cat !== filtro);
    });

    // Oculta/mostra títulos de seção
    document.querySelectorAll('.menu-section').forEach(sec => {
        const visivel = sec.querySelectorAll('.product-row:not(.hidden)').length > 0;
        sec.style.display = visivel ? '' : 'none';
    });

    // Scroll suave para a seção, se filtro específico
    if (filtro !== 'todos') {
        const sec = document.getElementById(`sec-${filtro}`);
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===========================
// BARRA FIXA AO SCROLL
// ===========================
(function initCatBarSticky() {
    const catBar = document.getElementById('catBar');
    if (!catBar) return;

    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    catBar.parentNode.insertBefore(sentinel, catBar);

    const obs = new IntersectionObserver(([entry]) => {
        catBar.classList.toggle('stuck', !entry.isIntersecting);
    }, { threshold: 0 });

    obs.observe(sentinel);
})();

// ===========================
// UTILITÁRIOS
// ===========================
function fmtPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function esc(str) {
    return str.replace(/'/g, "\\'");
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ===========================
// INICIALIZAR
// ===========================
renderCart();
