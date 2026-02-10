// Admin Controller - ניהול תוכן דרך CRUD
import { dataService } from './services/data.service.js'

window.onload = onInit

async function onInit() {
    try {
        await dataService.initData()
        await loadUserData()
        await loadProducts()
        await loadTestimonials()
        setupEventListeners()
    } catch (err) {
        console.error('Error initializing admin:', err)
        flashMsg('שגיאה בטעינת הנתונים')
    }
}

function setupEventListeners() {
    // User Form
    document.getElementById('user-form').addEventListener('submit', onSaveUser)

    // Product Form
    document.getElementById('product-form').addEventListener('submit', onAddProduct)

    // Testimonial Form
    document.getElementById('testimonial-form').addEventListener('submit', onAddTestimonial)
}

// ===== USER DATA =====
async function loadUserData() {
    try {
        const userData = await dataService.getUserData()

        document.getElementById('brand-name').value = userData.brandName
        document.getElementById('user-name').value = userData.name
        document.getElementById('user-title').value = userData.title
        document.getElementById('user-description').value = userData.description
        document.getElementById('user-image').value = userData.image
        document.getElementById('user-phone').value = userData.phone
    } catch (err) {
        console.error('Error loading user data:', err)
    }
}

async function onSaveUser(ev) {
    ev.preventDefault()

    try {
        const userData = {
            brandName: document.getElementById('brand-name').value,
            name: document.getElementById('user-name').value,
            title: document.getElementById('user-title').value,
            description: document.getElementById('user-description').value,
            image: document.getElementById('user-image').value,
            phone: document.getElementById('user-phone').value
        }

        await dataService.updateUserData(userData)
        flashMsg('פרטי המשתמש עודכנו בהצלחה!')
    } catch (err) {
        console.error('Error saving user data:', err)
        flashMsg('שגיאה בשמירת הנתונים')
    }
}

// ===== PRODUCTS CRUD =====
async function loadProducts() {
    try {
        const products = await dataService.getProducts()
        const listEl = document.getElementById('products-list')

        const strHTML = products.map(product => `
            <li>
                <div>
                    <strong>${product.name}</strong> - ${product.price}
                    <br>
                    <small>${product.description}</small>
                </div>
                <div class="item-actions">
                    <button class="btn" onclick="onEditProduct('${product.id}')">ערוך</button>
                    <button class="btn btn-danger" onclick="onDeleteProduct('${product.id}')">מחק</button>
                </div>
            </li>
        `).join('')

        listEl.innerHTML = strHTML || '<li>אין מוצרים</li>'
    } catch (err) {
        console.error('Error loading products:', err)
    }
}

async function onAddProduct(ev) {
    ev.preventDefault()

    try {
        const featuresStr = document.getElementById('product-features').value
        const features = featuresStr.split(',').map(f => f.trim()).filter(f => f)

        const product = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-desc').value,
            price: document.getElementById('product-price').value,
            features: features.length > 0 ? features : ['תכונה 1', 'תכונה 2']
        }

        await dataService.addProduct(product)
        flashMsg('המוצר נוסף בהצלחה!')

        // Clear form
        document.getElementById('product-form').reset()

        // Reload list
        await loadProducts()
    } catch (err) {
        console.error('Error adding product:', err)
        flashMsg('שגיאה בהוספת המוצר')
    }
}

window.onEditProduct = async function (productId) {
    try {
        const product = await dataService.getProductById(productId)

        // Fill form
        document.getElementById('product-name').value = product.name
        document.getElementById('product-desc').value = product.description
        document.getElementById('product-price').value = product.price
        document.getElementById('product-features').value = product.features.join(', ')

        // Change form to edit mode
        const form = document.getElementById('product-form')
        const submitBtn = form.querySelector('button[type=submit]')
        submitBtn.textContent = 'עדכן מוצר'
        submitBtn.onclick = async (ev) => {
            ev.preventDefault()

            const featuresStr = document.getElementById('product-features').value
            const features = featuresStr.split(',').map(f => f.trim()).filter(f => f)

            product.name = document.getElementById('product-name').value
            product.description = document.getElementById('product-desc').value
            product.price = document.getElementById('product-price').value
            product.features = features

            await dataService.updateProduct(product)
            flashMsg('המוצר עודכן בהצלחה!')

            // Reset form
            form.reset()
            submitBtn.textContent = 'הוסף מוצר'
            submitBtn.onclick = null

            await loadProducts()
        }
    } catch (err) {
        console.error('Error editing product:', err)
        flashMsg('שגיאה בעריכת המוצר')
    }
}

window.onDeleteProduct = async function (productId) {
    if (!confirm('בטוח שברצונך למחוק מוצר זה?')) return

    try {
        await dataService.removeProduct(productId)
        flashMsg('המוצר נמחק בהצלחה!')
        await loadProducts()
    } catch (err) {
        console.error('Error deleting product:', err)
        flashMsg('שגיאה במחיקת המוצר')
    }
}

// ===== TESTIMONIALS CRUD =====
async function loadTestimonials() {
    try {
        const testimonials = await dataService.getTestimonials()
        const listEl = document.getElementById('testimonials-list')

        const strHTML = testimonials.map(testimonial => `
            <li>
                <div>
                    <strong>${testimonial.name}</strong>
                    <br>
                    <small>${testimonial.text}</small>
                </div>
                <div class="item-actions">
                    <button class="btn" onclick="onEditTestimonial('${testimonial.id}')">ערוך</button>
                    <button class="btn btn-danger" onclick="onDeleteTestimonial('${testimonial.id}')">מחק</button>
                </div>
            </li>
        `).join('')

        listEl.innerHTML = strHTML || '<li>אין המלצות</li>'
    } catch (err) {
        console.error('Error loading testimonials:', err)
    }
}

async function onAddTestimonial(ev) {
    ev.preventDefault()

    try {
        const testimonial = {
            name: document.getElementById('testimonial-name').value,
            text: document.getElementById('testimonial-text').value,
            image: document.getElementById('testimonial-image').value
        }

        await dataService.addTestimonial(testimonial)
        flashMsg('ההמלצה נוספה בהצלחה!')

        // Clear form
        document.getElementById('testimonial-form').reset()

        // Reload list
        await loadTestimonials()
    } catch (err) {
        console.error('Error adding testimonial:', err)
        flashMsg('שגיאה בהוספת ההמלצה')
    }
}

window.onEditTestimonial = async function (testimonialId) {
    try {
        const testimonial = await dataService.getTestimonialById(testimonialId)

        // Fill form
        document.getElementById('testimonial-name').value = testimonial.name
        document.getElementById('testimonial-text').value = testimonial.text
        document.getElementById('testimonial-image').value = testimonial.image

        // Change form to edit mode
        const form = document.getElementById('testimonial-form')
        const submitBtn = form.querySelector('button[type=submit]')
        submitBtn.textContent = 'עדכן המלצה'
        submitBtn.onclick = async (ev) => {
            ev.preventDefault()

            testimonial.name = document.getElementById('testimonial-name').value
            testimonial.text = document.getElementById('testimonial-text').value
            testimonial.image = document.getElementById('testimonial-image').value

            await dataService.updateTestimonial(testimonial)
            flashMsg('ההמלצה עודכנה בהצלחה!')

            // Reset form
            form.reset()
            submitBtn.textContent = 'הוסף המלצה'
            submitBtn.onclick = null

            await loadTestimonials()
        }
    } catch (err) {
        console.error('Error editing testimonial:', err)
        flashMsg('שגיאה בעריכת ההמלצה')
    }
}

window.onDeleteTestimonial = async function (testimonialId) {
    if (!confirm('בטוח שברצונך למחוק המלצה זו?')) return

    try {
        await dataService.removeTestimonial(testimonialId)
        flashMsg('ההמלצה נמחקה בהצלחה!')
        await loadTestimonials()
    } catch (err) {
        console.error('Error deleting testimonial:', err)
        flashMsg('שגיאה במחיקת ההמלצה')
    }
}

// ===== UTILITIES =====
async function onResetData() {
    if (!confirm('⚠️ האם אתה בטוח? פעולה זו תמחק את כל השינויים ותטען את הנתונים מחדש מ-data.json')) {
        return
    }

    try {
        await dataService.resetData()
        flashMsg('הנתונים אופסו בהצלחה! טוען מחדש...')

        setTimeout(() => {
            location.reload()
        }, 1500)
    } catch (err) {
        console.error('Error resetting data:', err)
        flashMsg('שגיאה באיפוס הנתונים')
    }
}

window.onResetData = onResetData

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
