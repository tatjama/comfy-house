//variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('close-cart');
const clearCartBtn = document.querySelector('clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
//cart
let cart = [];
//classes
//getting products
class Products {
   async getProducts() {
       try {
            let result = await fetch('products.json');
            let data  = await result.json();
            let products = data.items;
            products = products.map((item) => {
                const {id} = item.sys;
                const {title, price} = item.fields;
                const image = item.fields.image.fields.file.url;
                return {id, title, price, image}
            })
            return products;
       } catch (error) {
           console.log(error);
       }
      
    }
}
//display products
class UI{
    displayProducts(products){
        console.log(products);
        let result = "";
        products.forEach(product => {
           result +=`
            <!--single product-->
            <article class="product">             
                <div class="img-container">
                <img src=${product.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to bag
                    </button>                 
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>             
            </article>
         <!--end of single product-->
            `
        })
        productsDOM.innerHTML = result;
    }
}
//local storage
class Storage{

}

document.addEventListener("DOMContentLoaded",() => {
    const ui = new UI();
    const products = new Products();

    //getting all Products
    products.getProducts().then((products) => ui.displayProducts(products))
})




