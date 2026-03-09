function toggleMenu(){
    document.getElementById("menu").classList.toggle("active");
}

console.log('script.js chargé');

// smooth scroll for buttons/links (modern browsers support CSS scroll-behavior too)
document.addEventListener('DOMContentLoaded', () => {
    const shopBtn = document.getElementById('shop-now');
    shopBtn.addEventListener('click', () => {
        document.getElementById('produits').scrollIntoView({ behavior: 'smooth' });
    });

    // add-to-cart buttons inside cards
    document.querySelectorAll('.card').forEach(card => {
        const btn = card.querySelector('.add-cart');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const title = card.querySelector('h3').innerText;
                const priceText = card.querySelector('p').innerText.replace(/[^0-9]/g, '');
                const image = card.querySelector('img').src;
                addToCart({ title, price: parseInt(priceText, 10), image });
            });
        }
        // allow keyboard interaction on card itself if needed
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && btn) btn.click();
        });
    });

    // cart data and functions
    const cart = [];
    const cartCountEl = document.getElementById('cart-count');
    const cartPanel = document.getElementById('cart-panel');
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // discount state: if firstPurchase not yet used
    let firstPurchase = localStorage.getItem('firstPurchase') !== 'true';
    let promoApplied = false;

    function applyPromo(code) {
        if (code === 'EMMANUEL10' && !promoApplied) {
            promoApplied = true;
            alert('15% appliqué au panier !');
            updateCartDisplay();
        }
    }


    function updateCartDisplay() {
        cartItemsEl.innerHTML = '';
        let total = 0;
        cart.forEach((item, idx) => {
            const li = document.createElement('li');
            li.style.cssText = 'display:flex;gap:10px;align-items:center;margin-bottom:15px;padding:10px;background:#f5f5f5;border-radius:5px;';
            
            const img = document.createElement('img');
            img.src = item.image;
            img.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:5px;';
            
            const info = document.createElement('div');
            info.style.cssText = 'flex:1;text-align:left;';
            info.innerHTML = `<strong>${item.title}</strong><br><span style="color:#ff2e63;font-weight:bold;">${item.price} FCFA</span>`;
            
            const remove = document.createElement('button');
            remove.textContent = '✖';
            remove.style.cssText = 'background:#ff2e63;color:white;border:none;padding:5px 8px;border-radius:3px;cursor:pointer;';
            remove.onclick = () => {
                cart.splice(idx, 1);
                updateCartDisplay();
            };
            
            li.appendChild(img);
            li.appendChild(info);
            li.appendChild(remove);
            cartItemsEl.appendChild(li);
            total += item.price;
        });
        // apply promo if user has copied code (15%)
        if (promoApplied && cart.length > 0) {
            const discount = Math.round(total * 0.15);
            const discounted = total - discount;
            cartTotalEl.textContent = `${discounted} (15% promo)`;
        } else if (firstPurchase && cart.length > 0) {
            const discount = Math.round(total * 0.10);
            const discounted = total - discount;
            cartTotalEl.textContent = `${discounted} (10% réduit)`;
        } else {
            cartTotalEl.textContent = total;
        }
        cartCountEl.textContent = cart.length;
    }

    function addToCart(item) {
        cart.push(item);
        updateCartDisplay();
    }

    window.toggleCart = function() {
        cartPanel.classList.toggle('open');
    };

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Votre panier est vide.');
            return;
        }
        // compute final total with possible discount
        let total = cart.reduce((sum, i) => sum + i.price, 0);
        if (promoApplied) {
            const discount = Math.round(total * 0.15);
            total -= discount;
        } else if (firstPurchase) {
            const discount = Math.round(total * 0.10);
            total -= discount;
            // mark first purchase used
            localStorage.setItem('firstPurchase', 'true');
            firstPurchase = false;
        }
        let message = 'Bonjour, je souhaite commander :%0A';
        cart.forEach(i => {
            message += `${i.title} - ${i.price} FCFA%0A`;
        });
        message += `Total: ${total} FCFA`;
        // change phone number accordingly
        const whatsappNumber = '2250101166376';
        const url = `https://wa.me/${whatsappNumber}?text=${message}`;
        window.open(url, '_blank');
    });

    // contact form submission
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Merci pour votre message !');
        form.reset();
    });

    // feedback textarea submission
    const feedbackBtn = document.getElementById('feedback-submit');
    if(feedbackBtn) {
        feedbackBtn.addEventListener('click', () => {
            const txt = document.getElementById('feedback-text').value;
            if(txt) {
                alert('Merci pour votre avis !');
                document.getElementById('feedback-text').value = '';
            }
        });
    }

    // collapse menu when a nav link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('menu').classList.remove('active');
        });
    });

    // hero typewriter phrases
    const phrases = [
        'Révélez votre beauté',
        'Brillez chaque jour',
        'Sentez-vous confiante',
        'Soyez éblouissante'
    ];
    let pIndex = 0;
    const heroHeading = document.getElementById('hero-heading');
    setInterval(() => {
        heroHeading.textContent = phrases[pIndex];
        pIndex = (pIndex + 1) % phrases.length;
    }, 4000);

    // promo countdown (2 minutes)
    let countdown = 120;
    const countdownEl = document.getElementById('promo-countdown');
    const interval = setInterval(() => {
        const m = Math.floor(countdown/60);
        const s = countdown%60;
        countdownEl.textContent = `${m}:${s.toString().padStart(2,'0')}`;
        countdown--;
        if(countdown<0) clearInterval(interval);
    },1000);

    // newsletter modal popup
    const modal = document.getElementById('newsletter-modal');
    const closeBtn = document.querySelector('.close-btn');
    const submitBtn = document.getElementById('newsletter-submit');
    setTimeout(() => { modal.style.display='block'; }, 5000);
    closeBtn.onclick = () => modal.style.display='none';
    window.onclick = (e) => { if(e.target===modal) modal.style.display='none'; };
    submitBtn.onclick = () => {
        const email = document.getElementById('newsletter-email').value;
        if(email) {
            // replace modal content with promo code message
            const content = modal.querySelector('.modal-content');
            content.innerHTML = `
                <span class="close-btn">&times;</span>
                <h3>Félicitations ! 🎁</h3>
                <p>Votre code promo est :</p>
                <div style="display:flex;justify-content:center;align-items:center;gap:10px;">
                    <p id="promo-code" style="font-size:20px;font-weight:bold;color:#ff2e63;">EMMANUEL10</p>
                    <button id="copy-code" style="padding:4px 8px;border:none;background:#ff2e63;color:white;border-radius:4px;cursor:pointer;">Copier</button>
                </div>
                <p>Merci à bientôt !</p>
            `;
            // rebind close button inside new content
            const newClose = content.querySelector('.close-btn');
            newClose.onclick = () => modal.style.display='none';
            // add copy behavior
            const copyBtn = content.querySelector('#copy-code');
            copyBtn.onclick = () => {
                const code = document.getElementById('promo-code').innerText;
                navigator.clipboard.writeText(code).then(() => {
                    alert('Code copié ! Il sera appliqué automatiquement.');
                    applyPromo(code);
                });
            };
        }
    };

    // fade-in on scroll
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .card, .hero-text, .banner').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});