
export default class Storage{
    static async fetchAllProducts(){
     await axios.get("https://my-json-server.typicode.com/SepehrShapouri/json-database/items")
       .then((res)=>{
        this.saveProducts(res.data)
       })
       .catch((err) => {
        console.log(err);
      });
    }
    static saveProducts(data){
        localStorage.setItem("products",JSON.stringify(data))
    }
    static getProducts(){
        return JSON.parse(localStorage.getItem("products")) || []
    }
    static saveCartItem(item){
      const items =   this.getCartItem()
      const existedItem = items.find((i)=>{
        return parseInt(i.id) == parseInt(item.id)
      })
      if(existedItem){
        existedItem.quantity = item.quantity
      }else{
      items.push(item)
      }
      localStorage.setItem("cart",JSON.stringify(items))
    }
    static getCartItem(){
        return JSON.parse(localStorage.getItem("cart")) || []
    }
    static deleteProduct(id){
      const savedProducts = this.getCartItem()
      const filteredProducts = savedProducts.filter((product)=>{
        return parseInt(product.id) != parseInt(id)
      })
      localStorage.setItem("cart",JSON.stringify(filteredProducts))
    }
}
