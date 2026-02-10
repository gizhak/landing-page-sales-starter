// Data Service - ניהול נתונים (משתמש, מוצרים, המלצות)
import { storageService } from './storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY_USER = 'userData'
const STORAGE_KEY_PRODUCTS = 'productsData'
const STORAGE_KEY_TESTIMONIALS = 'testimonialsData'

export const dataService = {
    // User data
    getUserData,
    updateUserData,

    // Products CRUD
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    removeProduct,

    // Testimonials CRUD
    getTestimonials,
    getTestimonialById,
    addTestimonial,
    updateTestimonial,
    removeTestimonial,

    // Initialize
    initData,
    resetData  // Reset all data from JSON
}

// Initialize data from JSON file or localStorage
async function initData() {
    try {
        // Check if data exists in localStorage
        const userData = utilService.loadFromStorage(STORAGE_KEY_USER)
        const products = utilService.loadFromStorage(STORAGE_KEY_PRODUCTS)
        const testimonials = utilService.loadFromStorage(STORAGE_KEY_TESTIMONIALS)

        if (!userData || !products || !testimonials) {
            // Load from data.json
            const response = await fetch('data.json')
            const data = await response.json()

            // Save to localStorage
            if (!userData) utilService.saveToStorage(STORAGE_KEY_USER, data.user)
            if (!products) utilService.saveToStorage(STORAGE_KEY_PRODUCTS, data.products)
            if (!testimonials) utilService.saveToStorage(STORAGE_KEY_TESTIMONIALS, data.testimonials)
        }
    } catch (error) {
        console.error('Error initializing data:', error)
        // Use default data
        _setDefaultData()
    }
}

// User Data Functions
function getUserData() {
    const userData = utilService.loadFromStorage(STORAGE_KEY_USER)
    return Promise.resolve(userData || _getDefaultUserData())
}

function updateUserData(userData) {
    utilService.saveToStorage(STORAGE_KEY_USER, userData)
    return Promise.resolve(userData)
}

// Products CRUD Functions
function getProducts() {
    return storageService.query(STORAGE_KEY_PRODUCTS)
}

function getProductById(productId) {
    return storageService.get(STORAGE_KEY_PRODUCTS, productId)
}

function addProduct(product) {
    product.id = utilService.makeId()
    product.createdAt = Date.now()
    return storageService.post(STORAGE_KEY_PRODUCTS, product)
}

function updateProduct(product) {
    product.updatedAt = Date.now()
    return storageService.put(STORAGE_KEY_PRODUCTS, product)
}

function removeProduct(productId) {
    return storageService.remove(STORAGE_KEY_PRODUCTS, productId)
}

// Testimonials CRUD Functions
function getTestimonials() {
    return storageService.query(STORAGE_KEY_TESTIMONIALS)
}

function getTestimonialById(testimonialId) {
    return storageService.get(STORAGE_KEY_TESTIMONIALS, testimonialId)
}

function addTestimonial(testimonial) {
    testimonial.id = utilService.makeId()
    testimonial.createdAt = Date.now()
    return storageService.post(STORAGE_KEY_TESTIMONIALS, testimonial)
}

function updateTestimonial(testimonial) {
    testimonial.updatedAt = Date.now()
    return storageService.put(STORAGE_KEY_TESTIMONIALS, testimonial)
}

function removeTestimonial(testimonialId) {
    return storageService.remove(STORAGE_KEY_TESTIMONIALS, testimonialId)
}

// Reset all data - useful for debugging
function resetData() {
    localStorage.removeItem(STORAGE_KEY_USER)
    localStorage.removeItem(STORAGE_KEY_PRODUCTS)
    localStorage.removeItem(STORAGE_KEY_TESTIMONIALS)
    return initData()
}

// 
// Private Functions
function _setDefaultData() {
    const defaultUser = _getDefaultUserData()
    const defaultProducts = _getDefaultProducts()
    const defaultTestimonials = _getDefaultTestimonials()

    utilService.saveToStorage(STORAGE_KEY_USER, defaultUser)
    utilService.saveToStorage(STORAGE_KEY_PRODUCTS, defaultProducts)
    utilService.saveToStorage(STORAGE_KEY_TESTIMONIALS, defaultTestimonials)
}

function _getDefaultUserData() {
    return {
        brandName: "המותג שלך",
        name: "השם שלך",
        title: "התפקיד המקצועי שלך",
        description: "תיאור מקצועי שלך. הסבר מי אתה ומה אתה עושה.",
        image: "https://via.placeholder.com/300",
        phone: "050-123-4567"
    }
}

function _getDefaultProducts() {
    return [
        {
            id: "p1",
            name: "חבילה בסיסית",
            description: "מושלם למתחילים",
            price: "₪299",
            features: ["תכונה 1", "תכונה 2", "תכונה 3"]
        },
        {
            id: "p2",
            name: "חבילת פרימיום",
            description: "הבחירה הפופולרית ביותר",
            price: "₪599",
            features: ["כל תכונות הבסיס", "תכונה 4", "תכונה 5", "תכונה 6"]
        },
        {
            id: "p3",
            name: "חבילת Pro",
            description: "למקצוענים",
            price: "₪999",
            features: ["כל תכונות הפרימיום", "תכונה 7", "תכונה 8", "תכונה 9"]
        }
    ]
}

function _getDefaultTestimonials() {
    return [
        {
            id: "t1",
            name: "שם הלקוח 1",
            text: "שירות מעולה! ממליץ בחום.",
            image: "https://via.placeholder.com/80"
        },
        {
            id: "t2",
            name: "שם הלקוח 2",
            text: "חוויה נהדרת, מאוד מקצועי.",
            image: "https://via.placeholder.com/80"
        },
        {
            id: "t3",
            name: "שם הלקוח 3",
            text: "שווה כל שקל!",
            image: "https://via.placeholder.com/80"
        }
    ]
}
