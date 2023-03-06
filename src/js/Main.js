import Storage from "./Storage.js";
import MyBag from "./MyBag.js";
document.addEventListener("DOMContentLoaded",()=>{
    MyBag.bag = MyBag.getBag()
    MyBag.createBag(MyBag.bag)
})