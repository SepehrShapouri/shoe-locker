const cartModal = document.querySelector(".modal");
const cartModalBtn = document.querySelector(".cart-icon");
const backdrop = document.querySelector(".backdrop");
const confirmModalBtn = document.querySelector(".confrim");
const cartTotal = document.querySelector(".cart-price");
const cartQuantity = document.querySelector(".cart-items");
const clearCart = document.querySelector(".clear");
const cartContent = document.querySelector(".cart-content");
const searchBtn = document.querySelector(".search-icon")
const searchInput = document.querySelector(".search-input")
const appTitle = document.querySelector(".head-text")
const sortButtons = document.querySelectorAll(".shoe-type")
const appBarSearch = document.querySelector(".icon.search-icon")
const confirmCart = document.querySelector(".btn.primary.confrim")
import Storage from "./Storage.js";
class AppUI {
  constructor() {
    cartModalBtn.addEventListener("click", () => this.toggleCartModal());
    backdrop.addEventListener("click", () => this.toggleCartModal());
    confirmModalBtn.addEventListener("click", () => this.toggleCartModal());
    clearCart.addEventListener("click", (e) => this.clearCart(this.cart))
    searchBtn.addEventListener("click",(e)=>this.toggleSearchInput());
    searchInput.addEventListener("input",(e)=>this.searchProducts(e.target.value))
    appBarSearch.addEventListener("click",(e)=>this.toggleSearchInput())
    confirmCart.addEventListener("click",(e)=>this.checkOutPage(e))
    sortButtons.forEach((btn)=>btn.addEventListener("click",(e)=>this.searchProducts(e.target.dataset.filter)))
    this.allProducts = [];
    this.cart = [];
    this.buttonsDOM = []
  }
  createProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `<div class="pro">
        <img src=${product.imageUrl} alt="" class="product-img" />
        <div class="product-info">
          <h3 class="product-name">${product.title}</h3>
          <p class="product-price">&dollar;${product.price}</p>
          <button class="buy-btn" data-id=${product.id}>
            <i class="fa-solid fa-plus"></i>add to cart
          </button>
        </div>
      </div>`;
    });
    const productList = document.querySelector(".products");
    productList.innerHTML = result;
    const addToCartBtn = [...document.querySelectorAll(".buy-btn")].forEach(
      (btn) => btn.addEventListener("click", (e) => this.addToCartBtn(e))
    );
    const buttons = [...document.querySelectorAll(".buy-btn")]
   this.buttonsDOM = buttons
  }
  setApp() {
    Storage.fetchAllProducts();
    this.allProducts = Storage.getProducts();
    this.createProducts(this.allProducts);
    this.cart = Storage.getCartItem();
    this.addToCart(this.cart);
    this.setCartValue(this.cart);
    this.activeButton(this.cart)
  }
  addToCartBtn(e) {
    const id = e.target.dataset.id;
    const activeProduct = this.allProducts.find((c) => {
      return parseInt(c.id) === parseInt(id);
    });
    const activeButton = this.getActiveBtn(id)
    this.toggleBuyBtnText(activeButton);
    const addedProduct = {
      id: activeProduct.id,
      price: activeProduct.price,
      title: activeProduct.title,
      quantity: 1,
      imageUrl: activeProduct.imageUrl,
    };
    Storage.saveCartItem(addedProduct);
    this.cart = Storage.getCartItem();
    this.addToCart(this.cart);
    this.setCartValue(this.cart);
  }
  toggleCartModal() {
    cartModal.classList.toggle("modal-active");
    backdrop.classList.toggle("bd-active");
  }
  toggleBuyBtnText(btn) {
    btn.innerText = "in Cart";
    btn.disabled = true;
    btn.classList.toggle("inCart");
  }
  addToCart(cart) {
    let result = "";
    cart.forEach((cartItem) => {
      result += `
      <div class="modal-product" data-id=${cartItem.id}>
  <img class="pro-image" src="${cartItem.imageUrl}" alt="">
<div class="modal-info">
  <h4 class="pro-title">${cartItem.title}</h4>
  <p class="product-price">&dollar;${cartItem.price}</p>
</div>
<div class="modal-actions">
<div class="actions" data-id=${cartItem.id}>
  <span class="chev-up">
    <i class="fa-solid fa-chevron-up"></i>
  </span>
  <p class="quantity" data-id=${cartItem.id}>${cartItem.quantity}</p>
<span class="chev-down">
  <i class="fa-solid fa-chevron-down"></i>
</span>
</div>
<span class="delete" ><i class="fa-solid fa-trash-can" data-id=${cartItem.id}></i></span>
</div>
</div>`;
      const cartContent = (document.querySelector(".cart-content").innerHTML =
        result);
    });
    const cartActions = document
      .querySelectorAll(".actions")
      .forEach((action) =>
        action.addEventListener("click", (e) => this.cartActions(e))
      );
    const deleteButtons = [...document.querySelectorAll(".delete")].forEach(
      (btn) => btn.addEventListener("click", (e) => this.deleteProduct(e))
    );
  }
  cartActions(e) {
    const classList = [...e.target.classList];
    if (classList.includes("fa-chevron-up")) {
      this.increaseQuantity(e);
    } else if (classList.includes("fa-chevron-down")) {
      this.decreaseQuantity(e);
    }
  }
  increaseQuantity(e) {
    const activeProductId = e.target.parentElement.parentElement.dataset.id;
    const activeProduct = this.cart.find((c) => {
      return parseInt(c.id) === parseInt(activeProductId);
    });
    activeProduct.quantity++;
    this.applyCartLogic(activeProductId, activeProduct);
  }
  decreaseQuantity(e) {
    const activeProductId = e.target.parentElement.parentElement.dataset.id;
    const activeProduct = this.cart.find((c) => {
      return parseInt(c.id) === parseInt(activeProductId);
    });
    if (activeProduct.quantity > 1) {
      activeProduct.quantity--;
    } else {
      return;
    }
    this.applyCartLogic(activeProductId, activeProduct);
  }
  applyCartLogic(id, activeProduct) {
    const quantity = ([...document.querySelectorAll(".quantity")].find((c) => {
      return parseInt(c.dataset.id) == parseInt(id);
    }).innerText = activeProduct.quantity);
    Storage.saveCartItem(activeProduct);
    this.setCartValue(this.cart);
  }
  deleteProduct(e) {
    const id = e.target.dataset.id;
    Storage.deleteProduct(id);
    this.cart = Storage.getCartItem();
    this.setCartValue(this.cart);
    this.addToCart(this.cart);
    if (this.cart.length === 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    const activeButton = this.getActiveBtn(id)
    this.renableBuyBtn(activeButton)
  }
  setCartValue(cart) {
    let tempCartItems = 0;
    const cartTotalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `Total Price : ${cartTotalPrice} $`;
    cartQuantity.innerText = tempCartItems;
  }
  renableBuyBtn(button) {
    button.disabled = false;
    button.classList.remove("inCart");
    button.innerHTML = `<i class="fa-solid fa-plus"></i>add to cart`;
  }
  clearCart(cart) {
    cart.forEach((c) => Storage.deleteProduct(c.id));
    this.cart = Storage.getCartItem();
    this.setCartValue(this.cart);
    this.addToCart(this.cart);
    this.toggleCartModal();
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.buttonsDOM.forEach((btn)=>this.renableBuyBtn(btn))
  }
  getActiveBtn(id){
    return this.buttonsDOM.find((btn)=> parseInt(btn.dataset.id) == parseInt(id))
  }
  activeButton(cart){
    cart.forEach((cart)=>{
      const cartId = cart.id
     const activeButton = this.getActiveBtn(cartId)
     this.toggleBuyBtnText(activeButton)
    })
  }
  toggleSearchInput(){
    searchInput.classList.toggle("search-input-active")
    appTitle.classList.toggle("head-text-nA")
  }
  searchProducts(value){
    const filteredProducts = this.allProducts.filter((c)=>{
      return c.title.toLowerCase().includes(value.toLowerCase())
    })
    this.createProducts(filteredProducts)
    this.activeButton(this.cart)
    console.log(value)
  }
  checkOutPage(e){
    location.replace("/public/checkout.html")
  }
}
export default new AppUI();
