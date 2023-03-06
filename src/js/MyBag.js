import Storage from "./Storage.js";

const myBag = document.querySelector(".product-list");
const bagTotalPrice = document.querySelector(".finalBagPrice");
const checkOutTotal = document.querySelector(".checkoutFinalPrice");
const bagQuantity = document.querySelector(".bagQuantity");
const homeButton  = document.querySelector(".home-icon")
const navQuantity = document.querySelector(".cart-items")
const deliveryFee = document.querySelector(".deliveryFee")
const mainSection = document.querySelector(".main-section")
class MyBag {
  constructor() {
    this.bag = [];
    homeButton.addEventListener("click",()=>location.replace("/public/index.html"))
  }
  getBag(){
    return Storage.getCartItem()
  }
  createBag(bag) {
    let result = "";
    bag.forEach((b) => {
      result += `<li class="list-item" data-id=${b.id}>
            <span class="removeItem"><i class="fa-solid fa-multiply" data-id=${b.id}></i></span>
            <img src="${b.imageUrl}" alt="" class="productPicture">
            <div class="productInfo">
                <p class="proPrice">&dollar;${b.price}</p>
                <p class="proDesc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, voluptates?</p>
                <span class="productLogic">
                    <p class="size">UK 11.5</p>
                    <p class="quantity">QTY ${b.quantity}</p>
                </span>
                <button class="button saveForLater" data-id=${b.id}><i class="fa-solid fa-heart"></i> Save for later</button>
            </div>
        </li>`;
    });
    myBag.innerHTML = result;
    if(this.bag.length ===0){
   const bag =  document.querySelector(".my-bag").style.height = "200px"
    const products = document.querySelector(".cart-products")
    products.style.height = "100px"
   products.innerHTML = `<h2>Your Bag Is Empty!</h2>
<a class="bagEmpty" href="./index.html">Shop Now!</a>`
mainSection.classList.toggle("section-empty")
    }

    this.setCartValue(bag)
    const deleteButtons = document.querySelectorAll(".removeItem").forEach((btn)=>btn.addEventListener("click",(e)=>this.deleteProduct(e)))
    const saveForLater = document.querySelectorAll(".saveForLater").forEach((btn)=>btn.addEventListener("click",(e)=>this.saveForLater(e)))
  }
  setCartValue(bag){
    let tempCartItems = 0
  const cartTotal = bag.reduce((acc,curr)=>{
        tempCartItems += curr.quantity
        return acc + curr.price * curr.quantity
    },0)
    bagTotalPrice.innerHTML ='&dollar;' +  cartTotal
    checkOutTotal.innerHTML = '&dollar;' +  cartTotal
    bagQuantity.innerHTML = tempCartItems + " " +"Items"
    navQuantity.innerText = tempCartItems
    deliveryFee.innerHTML = this.bag.length > 0 ? (tempCartItems > 3 ? "&dollar; 25.00" : "&dollar; 20.00") : "$0"
}
  deleteProduct(e){
    const id = e.target.dataset.id
    Storage.deleteProduct(id);
    this.bag = Storage.getCartItem();
    this.setCartValue(this.bag);
    this.createBag(this.bag)
  }
  saveForLater(e){
  }
}
export default new MyBag();
