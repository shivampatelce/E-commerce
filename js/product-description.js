
// const $ = selector => document.querySelector(selector);


function setProductDetails(product,productArray) {
    document.getElementById("quantity").addEventListener("keyup",handleQuantityValue(product))
    document.getElementById('product-name').textContent = product.title;
    document.getElementById('product-main-image').src = `${product.img}`
    document.getElementById('price-value').textContent = `$${product.price}`;
    const actualPrice = product.price - product.discount;
    document.getElementById('actual-price').textContent =`$${actualPrice}`;
    document.getElementById('product-info').textContent = product.description;
    const features = product.features[0];
    document.getElementById('feature-display').textContent = features.display;
    document.getElementById('feature-battery').textContent = features.battery;
    document.getElementById('feature-gpu').textContent = features.GPU;
    document.getElementById('feature-cpu').textContent = features.CPU;
    document.getElementById('feature-ram').textContent = features.RAM;
    document.getElementById('feature-storage').textContent = features.storage;

    // extract element whose id is product-main-image
let productMainImage= document.getElementById("product-main-image");

// extract element whose class name is thumbnail
let productSmallImage = document.getElementsByClassName("thumbnail");
//when user click on first small image that image will be show in place of main image
productSmallImage[0].addEventListener("click",()=>{
   productMainImage.src= productSmallImage[0].src
})

//when user click on second small image that image will be show in place of main image
productSmallImage[1].addEventListener("click",()=>{
   productMainImage.src= productSmallImage[1].src
})

//when user click on third small image that image will be show in place of main image
productSmallImage[2].addEventListener("click",()=>{
   productMainImage.src= productSmallImage[2].src
})

// //when user click on fourth small image that image will be show in place of main image
productSmallImage[3].addEventListener("click",()=>{
   productMainImage.src= productSmallImage[3].src
})

document.getElementById('increment').addEventListener('click', () => {
    let quantity = parseInt(document.getElementById('quantity').value);
    document.getElementById('quantity').value = quantity + 1;
    handleQuantityValue(product); 
});

document.getElementById('decrement').addEventListener('click', () => {
    let quantity = parseInt(document.getElementById('quantity').value);
    if (quantity >= 1) {
        document.getElementById('quantity').value = quantity - 1;
        handleQuantityValue(product); 
    }
});

document.getElementById('add-to-cart-button').addEventListener('click', () => {
    let cartList = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItem = cartList.find((item)=>item.title === product.title);
    const itemCount = parseInt(document.getElementById('quantity').value);
    if(cartItem){
        cartList = cartList.map((item)=> item.title === product.title ? {...item, quantity: itemCount} : item);
    } else {
        cartList.push({title: product.title, quantity: itemCount});
    }
    localStorage.setItem("cart", JSON.stringify(cartList))
    window.location.href="../pages/cart.html"
});

function photo(){
    $("#product-main-image").hover(
        function(){
            $("#product-main-image").css({
                height:"370px",
                width:"auto",
                top:"-2%"
            });
        },
        function(){
            $("#product-main-image").css({height:"350px",
        width:"auto",top:"0"});
        }
    );
}
photo();

showSimilarProducts(product, productArray);

}

function showSimilarProducts(product, PRODUCT_DATA) {
    const similarProductsContainer = document.getElementById('similar-products');
    similarProductsContainer.innerHTML = ''; // Clear any existing similar products

    // Find the category of the current product
    const category = PRODUCT_DATA.find(category => category.products.some(p => p.title === product.title));

    if (category) {
        // Filter out the current product and select similar products (up to 4)
        const similarProducts = category.products.filter(p => p.title !== product.title).slice(0, 4);

        similarProducts.forEach(similarProduct => {
            const productCard = document.createElement('div');
            productCard.className = 'similar-product-card';

            productCard.innerHTML = `
                <img src="${similarProduct.img}" alt="${similarProduct.title}">
                <p id="similar-product-title">${similarProduct.title}</p>
                <p id="similar-product-price">$${similarProduct.price}</p>
                <a href="?productName=${encodeURIComponent(similarProduct.title)}">View Product</a>
            `;

            similarProductsContainer.appendChild(productCard);
        });
    }
}

function extractProductName(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
}

const fetchData = async () => {
    try {
        // Make a GET request to the JSON file
        const response = await fetch("../util/data.JSON");
        
        // Check if the response is ok (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON data
        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const handleQuantityValue = (product)=>{
    let quantity = document.getElementById("quantity").value;
    let realPrice = product.price - product.discount;
    let subTotal =  quantity*realPrice;
    document.getElementById("sub-total").innerHTML = subTotal.toFixed(2)
    let tax = (subTotal*3)/100;
    document.getElementById("tax").innerHTML = tax.toFixed(2)
    let total = subTotal+tax;
    document.getElementById("Total").innerHTML = total.toFixed(2);
}



document.addEventListener('DOMContentLoaded', async function(){
    let productArray = [];
    productArray = await fetchData();
    const productName = extractProductName('productName').replace(/'/g, ""); 
    let extractProductValue = null;
    for (let i = 0; i < productArray.length; i++) {
        const category = productArray[i];
        for (let j = 0; j < category.products.length; j++) {
            const product = category.products[j];
            if (product.title === productName) {
                extractProductValue = product;
                break; 
            }
        }
        if (extractProductValue) {
            break; 
        }
    }

    const cartList = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = cartList.find((item)=> item.title === productName);
    if(cartItem) {
        document.getElementById('quantity').value = cartItem.quantity;
    }

    if (extractProductValue) {
        setProductDetails(extractProductValue,productArray);
    } else {
        console.error("Product not found!");
        
    }
});


