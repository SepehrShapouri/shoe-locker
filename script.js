const cartModal = document.querySelector(".modal");
const cartBtn = document.querySelector(".cart-icon");
const backDrop = document.querySelector(".backdrop");
const confirmBtn = document.querySelector(".confrim");
const productCenter = document.querySelector(".products");
const cartTotal = document.querySelector(".cart-price");
const cartQuantity = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear");
const searchBar = document.querySelector(".search-bar .search-icon");
const searchInput = document.querySelector(".search-input");
const headText = document.querySelector(".head-text");
const filterType = document.querySelectorAll(".shoe-type")
// global cart variable
let cart = [];
// global add to cart variables
let buttonsDom = [];
let allProductsData = [];
let filters = { searchItems: "" };
// import products
// import { productData } from "./products.js";

//  events
document.addEventListener("DOMContentLoaded", () => {
  const product = new Products();
  const productData = product.getProduct();
  const ui = new UI();
  // call requierd methods
  ui.cartLogic();
  ui.setupApp();
  ui.getCartBtn();
  Storage.saveProducts(productData);
});

cartBtn.addEventListener("click", (e) => {
  cartModal.classList.toggle("modal-active");
  backDrop.classList.toggle("bd-active");
});

searchBar.addEventListener("click", searchActive);

searchInput.addEventListener("input", (e) => {
  filters.searchItems = e.target.value;
  renderProducts(allProductsData, filters);
});
// confrim cart
confirmBtn.addEventListener("click", closeModal);
// close cart
backDrop.addEventListener("click", closeModal);

// classes
class Products {
  //  get products from import
  async getProduct() {
    const ui = new UI();
    await axios
      .get("https://api.jsonbin.io/v3/b/63aa7ba901a72b59f23a0a8e")
      .then((res) => {
        allProductsData = res.data;
        renderProducts(allProductsData, filters);
      })
      .catch((err) => {
        console.log(err);
      });
    Storage.saveProducts(allProductsData);
  }
}

class UI {
  displayProduct(product) {
    let result = "";
    product.forEach((item) => {
      result += `<div class="pro">
    <img src=${item.imageUrl} alt="" class="product-img" />
    <div class="product-info">
      <h3 class="product-name">${item.title}</h3>
      <p class="product-price">&dollar;${item.price}</p>
      <button class="buy-btn" data-id=${item.id}>
        <i class="fa-solid fa-plus"></i>add to cart
      </button>
    </div>
  </div>`;
      productCenter.innerHTML = result;
    });
  }
  getCartBtn() {
    //  get all buttons
    const addToCart = [...document.querySelectorAll(".buy-btn")];
    buttonsDom = addToCart;

    addToCart.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        inCartBtn(btn);
      }
      btn.addEventListener("click", (e) => {
        inCartBtn(btn);
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };
        cart = [...cart, addedProduct];
        Storage.saveCart(cart);
        this.setCartValue(cart);
        this.addToCart(addedProduct);
      });
    });
  }
  setCartValue(cart) {
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `Total Price : ${totalPrice} $`;
    cartQuantity.innerText = tempCartItems;
  }
  addToCart(cartItem) {
    const div = document.createElement("div");
    div.classList.add("modal-product");
    div.innerHTML = `
    <img class="pro-image" src="${cartItem.imageUrl}" alt="">
  <div class="modal-info">
    <h4 class="pro-title">${cartItem.title}</h4>
    <p class="product-price">&dollar;${cartItem.price}</p>
  </div>
  <div class="modal-actions">
  <div class="actions">
      <i class="fa-solid fa-chevron-up increase" data-id="${cartItem.id}"></i>
    <p class="quantity">${cartItem.quantity}</p>
    <i class="fa-solid fa-chevron-down decrease" data-id="${cartItem.id}"></i>
  </div>
<i class="fa-regular fa-trash-can delete" data-id="${cartItem.id}"></i>
  </div>
  </div>`;
    cartContent.appendChild(div);
  }
  setupApp() {
    cart = Storage.getCart() || [];
    cart.forEach((cartItem) => this.addToCart(cartItem));
    this.setCartValue(cart);
  }
  cartLogic() {
    // call clear cart method on click
    clearCart.addEventListener("click", () => this.clearCart());
    // cart functionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("increase")) {
        const addQuantity = event.target;
        // get item from cart
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );

        addedItem.quantity++;
        // update cart value
        this.setCartValue(cart);
        // save cart
        Storage.saveCart(cart);
        // update cart ui
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if (event.target.classList.contains("delete")) {
        const removeItem = event.target;
        const id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
        Storage.saveCart(cart);
      } else if (event.target.classList.contains("decrease")) {
        const subQuantity = event.target;
        const id = subQuantity.dataset.id;
        const substractedItem = cart.find((c) => c.id == id);

        if (substractedItem.quantity === 1) {
          this.removeItem(id);
          cartContent.removeChild(
            subQuantity.parentElement.parentElement.parentElement
          );
          return;
        }

        substractedItem.quantity--;
        // update storage
        Storage.saveCart(cart);
        // update total price
        this.setCartValue(cart);
        // update item quantity :
        // console.log(subQuantity.nextElementSibling);
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  }
  clearCart() {
    // check cart value
    cart.forEach((item) => this.removeItem(item.id));
    // remove cart children
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    // close cart
    closeModal();
  }
  removeItem(id) {
    // resuable method for signle remove and clear all
    cart = cart.filter((cartItem) => cartItem.id != id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    const button = this.getSingleButtons(id);
    button.disabled = false;
    button.classList.remove("inCart");
    button.innerHTML = `<i class="fa-solid fa-plus"></i>add to cart`;
  }
  getSingleButtons(id) {
    return buttonsDom.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
  }
}

class Storage {
  static saveProducts(product) {
    localStorage.setItem("products", JSON.stringify(product));
  }
  static getProduct(id) {
    const _product = JSON.parse(localStorage.getItem("products"));
    return _product.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

// functions

function closeModal() {
  cartModal.classList.remove("modal-active");
  backDrop.classList.remove("bd-active");
}

function inCartBtn(btn) {
  btn.innerText = "in Cart";
  btn.disabled = true;
  btn.classList.toggle("inCart");
}

function searchActive() {
  searchInput.classList.toggle("search-input-active");
  headText.classList.toggle("head-text-nA");
}

function renderProducts(_product, _filters) {
  const filteredProducts = _product.filter((p) => {
    return p.title.toLowerCase().includes(_filters.searchItems.toLowerCase());
  });
  console.log(filteredProducts)
  productCenter.innerHTML = "";
  const ui = new UI();
  ui.displayProduct(filteredProducts);
  ui.getCartBtn()
}


filterType.forEach((btn)=>{
  btn.addEventListener("click",(e)=>{
    const filter = e.target.dataset.filter

    console.log(filter)
    filters.searchItems = filter
    renderProducts(allProductsData,filters)
  })
})
