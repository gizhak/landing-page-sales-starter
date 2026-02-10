// App Controller - ניהול האפליקציה הראשי
import { utilService } from './services/util.service.js'
import { dataService } from './services/data.service.js'

// To make things easier in this project structure 
// functions that are called from DOM are defined on a global app object
window.app = {
    onInit,
    onToggleMenu,
    onScrollToSection,
    onProductClick,
    onRemoveProduct,
    onEditProduct,
    onRemoveTestimonial,
    onEditTestimonial
}

window.onload = onInit

async function onInit() {
    try {
        await dataService.initData()
        await renderApp()
        setupEventListeners()
    } catch (err) {
        console.error('Error initializing app:', err)
        flashMsg('שגיאה בטעינת הנתונים')
    }
}

async function renderApp() {
    await renderUserData()
    await renderProducts()
    await renderTestimonials()
    renderFooter()
}

async function renderUserData() {
    try {
        const userData = await dataService.getUserData()

        document.getElementById('brand-name').textContent = userData.brandName
        document.getElementById('user-image').src = userData.image
        document.getElementById('user-image').alt = userData.name
        document.getElementById('user-name').textContent = userData.name
        document.getElementById('user-title').textContent = userData.title
        document.getElementById('user-description').textContent = userData.description
        document.title = userData.brandName + ' - דף נחיתה'

        // Store phone for later use
        window.userData = userData
    } catch (err) {
        console.error('Error rendering user data:', err)
    }
}

async function renderProducts() {
    try {
        const products = await dataService.getProducts()
        const productsGrid = document.getElementById('products-grid')

        const strHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}" onclick="app.onProductClick('${product.id}')">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
                <ul class="product-features">
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <button class="product-button">הזמן עכשיו</button>
            </div>
        `).join('')

        productsGrid.innerHTML = strHTML || '<p>אין מוצרים להצגה</p>'
    } catch (err) {
        console.error('Error rendering products:', err)
    }
}

async function renderTestimonials() {
    try {
        const testimonials = await dataService.getTestimonials()
        const testimonialsGrid = document.getElementById('testimonials-grid')

        const strHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <img src="${testimonial.image}" alt="${testimonial.name}">
                <p class="testimonial-text">"${testimonial.text}"</p>
                <p class="testimonial-name">${testimonial.name}</p>
            </div>
        `).join('')

        testimonialsGrid.innerHTML = strHTML || '<p>אין המלצות להצגה</p>'
    } catch (err) {
        console.error('Error rendering testimonials:', err)
    }
}

function renderFooter() {
    const userData = window.userData
    if (userData) {
        document.getElementById('phone-number').textContent = userData.phone
        document.getElementById('phone-link').href = `tel:${userData.phone}`
    }
    document.getElementById('current-year').textContent = new Date().getFullYear()
}

function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger')
    const navMenu = document.getElementById('nav-menu')

    hamburger.addEventListener('click', () => {
        onToggleMenu()
    })

    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-menu button')
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const sectionId = e.target.getAttribute('data-section')
            onScrollToSection(sectionId)
        })
    })

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('open')
            navMenu.classList.remove('open')
        }
    })
}

// Navigation Functions
function onToggleMenu() {
    const hamburger = document.getElementById('hamburger')
    const navMenu = document.getElementById('nav-menu')

    hamburger.classList.toggle('open')
    navMenu.classList.toggle('open')
}

function onScrollToSection(sectionId) {
    const element = document.getElementById(sectionId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        // Close menu
        document.getElementById('hamburger').classList.remove('open')
        document.getElementById('nav-menu').classList.remove('open')
    }
}

// Product Functions
async function onProductClick(productId) {
    try {
        const product = await dataService.getProductById(productId)
        const userData = window.userData

        if (!userData || !userData.phone) {
            flashMsg('מספר טלפון לא זמין')
            return
        }

        const message = `שלום, אני מעוניין/ת ב${product.name} (${product.price})`
        const cleanPhone = userData.phone.replace(/\D/g, '')
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    } catch (err) {
        console.error('Error handling product click:', err)
        flashMsg('שגיאה בפתיחת WhatsApp')
    }
}

async function onRemoveProduct(productId) {
    try {
        await dataService.removeProduct(productId)
        flashMsg('המוצר הוסר בהצלחה')
        await renderProducts()
    } catch (err) {
        console.error('Error removing product:', err)
        flashMsg('שגיאה במחיקת המוצר')
    }
}

async function onEditProduct(productId) {
    // This function can be expanded for admin panel
    console.log('Edit product:', productId)
}

// Testimonial Functions
async function onRemoveTestimonial(testimonialId) {
    try {
        await dataService.removeTestimonial(testimonialId)
        flashMsg('ההמלצה הוסרה בהצלחה')
        await renderTestimonials()
    } catch (err) {
        console.error('Error removing testimonial:', err)
        flashMsg('שגיאה במחיקת ההמלצה')
    }
}

async function onEditTestimonial(testimonialId) {
    // This function can be expanded for admin panel
    console.log('Edit testimonial:', testimonialId)
}

// Utility Functions
function flashMsg(msg) {
    const el = document.createElement('div')
    el.className = 'user-msg'
    el.innerText = msg
    document.body.appendChild(el)

    setTimeout(() => {
        el.classList.add('open')
    }, 10)

    setTimeout(() => {
        el.classList.remove('open')
        setTimeout(() => el.remove(), 500)
    }, 3000)
}
