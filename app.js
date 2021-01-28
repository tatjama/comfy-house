//variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

//cart
let cart = [];
let buttonsDOM = [];
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
    getBagButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = buttons;
        console.log(buttons);
        buttons.forEach((button) => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
               button.innerText = "in cart";
               button.disabled = true; 
            }else{
                button.addEventListener('click', (event) =>{
                    event.target.innerText = "in cart";
                    event.target.disabled = true;
                    //get product from products
                    let cartItem = {...Storage.getProducts(id), amount:1}
                    //add product to the cart
                    cart.push(cartItem);
                    // save cart to local Storage
                    Storage.saveCart(cart)
                    //set card values
                    this.setCartValues(cart);
                    //display  cart item
                    this.addCartItem(cartItem);
                    //show the cart
                    this.showCart();
                })
            }
        })
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map((item) => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
            cartTotal.innerHTML = parseFloat(tempTotal).toFixed(2);
            cartItems.innerHTML = itemsTotal;
        })
    }
    addCartItem(item){
        console.log(item)
        const div = document.createElement("div");
        div.classList.add('cart-item');
        div.innerHTML = `<img src=${item.image} alt="product"/>
                <div>  
                    <h4>${item.title}</h4>
                    <h5>$ ${item.price}</h5>
                    <div class="remove-item" data-id = ${item.id} >remove</div>
                </div>
                <div>  
                    <i class="fas fa-chevron-up" data-id = ${item.id} ></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-chevron-down" data-id = ${item.id} ></i>
                </div>        
        `        
        cartContent.appendChild(div);
    }
     showCart(){
         cartOverlay.classList.add('transparentBcg');
         cartDOM.classList.add('showCart');
        //cartOverlay.style.visibility = 'visible';
        //cartDOM.style.transform = 'translate(0%)';
    }
    setupApp(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.closeCart);
    }
    populateCart(cart){
        cart.forEach((item) => this.addCartItem(item))

    }
    closeCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
}
//local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProducts(id){
       let products = JSON.parse(localStorage.getItem("products"));
       console.log(products);
       let product = products.find((item) => {
            return item.id === id
       })
       return product
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart(){
       return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")): []
    }
}

document.addEventListener("DOMContentLoaded",() => {
    const ui = new UI();
    const products = new Products();
    ui.setupApp();
    //getting all Products
    products.getProducts().then((products) => {
        ui.displayProducts(products)
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
    })
})




