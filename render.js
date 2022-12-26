let allProductsData = [];
let filters = {
    searchItems : ""
};


document.addEventListener("DOMContentLoaded",()=>{
    axios.get("http://localhost:3000/items")
    .then((res)=>{
        allProductsData = res.data
        renderProducts(res.data,filters)
    })
    .catch((err)=>{console.log(err)})
    
})


function renderProducts(_product,_filters){
    const  filteredProducts = _product.filter((p)=>{
        p.title.toLowerCase().includes(_filters.searchItems.toLowerCase())
    })
}