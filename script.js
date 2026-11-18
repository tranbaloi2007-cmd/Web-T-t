
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("tetCart")) || [];

    let item = cart.find(p => p.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    localStorage.setItem("tetCart", JSON.stringify(cart));

    alert("Đã thêm " + name + " vào giỏ hàng!");

    updateCartCount();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("tetCart")) || [];

    let count = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach(el => {
        el.textContent = count;
    });
}

function renderCart() {
    let cart = JSON.parse(localStorage.getItem("tetCart")) || [];
    let tbody = document.getElementById("cart-items");

    if (!tbody) return;

    tbody.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        let money = item.price * item.quantity;
        total += money;

        tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price.toLocaleString("vi-VN")}đ</td>
                <td>
                    <input type="number" min="1"
                    value="${item.quantity}"
                    onchange="changeQuantity(${index}, this.value)">
                </td>
                <td>${money.toLocaleString("vi-VN")}đ</td>
                <td>
                    <button class="remove-btn"
                    onclick="removeItem(${index})">Xóa</button>
                </td>
            </tr>
        `;
    });

    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">Giỏ hàng của bạn đang trống!</td>
            </tr>
        `;
    }

    let totalElement = document.getElementById("total-price");

    if (totalElement) {
        totalElement.textContent = total.toLocaleString("vi-VN") + "đ";
    }
}

function changeQuantity(index, quantity) {
    let cart = JSON.parse(localStorage.getItem("tetCart")) || [];

    cart[index].quantity = Math.max(1, parseInt(quantity) || 1);

    localStorage.setItem("tetCart", JSON.stringify(cart));

    renderCart();
    updateCartCount();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("tetCart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("tetCart", JSON.stringify(cart));

    renderCart();
    updateCartCount();
}

function searchProduct() {
    let keyword = document.getElementById("searchInput").value
        .trim().toLowerCase();

    if (!keyword) return;

    let cards = document.querySelectorAll(".product-card");
    let found = 0;

    cards.forEach(card => {
        let name = card.querySelector("h3").textContent.toLowerCase();

        if (name.includes(keyword)) {
            card.style.display = "";
            found++;
        } else {
            card.style.display = "none";
        }
    });

    if (cards.length === 0) {
        window.location.href =
            "index.html?search=" + encodeURIComponent(keyword);
    } else if (found === 0) {
        alert("Không tìm thấy sản phẩm phù hợp!");
    }
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem("tetCart")) || [];

    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    let name = prompt("Nhập họ tên người mua:");
    if (!name || !name.trim()) return;

    let phone = prompt("Nhập số điện thoại:");
    if (!phone || !/^[0-9]{9,11}$/.test(phone.trim())) {
        alert("Số điện thoại không hợp lệ!");
        return;
    }

    alert("Cảm ơn " + name +
        "! Đơn hàng đã được ghi nhận trên website demo.");

    localStorage.removeItem("tetCart");

    renderCart();
    updateCartCount();
}

function submitContact(event) {
    event.preventDefault();
    alert("Cảm ơn bạn đã gửi thông tin đến Tết An Khang!");
    event.target.reset();
}

document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
    renderCart();

    let search = document.getElementById("searchInput");

    if (search) {
        search.addEventListener("keydown", function(event) {
            if (event.key === "Enter") searchProduct();
        });

        let keyword = new URLSearchParams(window.location.search)
            .get("search");

        if (keyword) {
            search.value = keyword;
            searchProduct();
        }
    }
});

// ===== HIỆU ỨNG PHÁO HOA TẾT =====
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let fireworks = [];
let particles = [];

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.5 + 50;
        this.speed = 4 + Math.random() * 3;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    }

    update() {
        this.y -= this.speed;

        if (this.y <= this.targetY) {
            this.explode();
            return false;
        }

        return true;
    }

    explode() {
        for (let i = 0; i < 55; i++) {
            let angle = Math.PI * 2 * i / 55;
            let speed = Math.random() * 4 + 1;

            particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: this.color,
                size: Math.random() * 3 + 1
            });
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks = fireworks.filter(firework => {
        const alive = firework.update();
        firework.draw();
        return alive;
    });

    particles = particles.filter(p => p.alpha > 0.02);

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.025;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.alpha -= 0.012;

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(animateFireworks);
}

setInterval(() => {
    fireworks.push(new Firework());
}, 700);

animateFireworks();
