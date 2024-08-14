"use strict";
$(() => {
  let currentIndex = 0;
  function showNextSlide() {
    const slides = $(".slide");
    slides.eq(currentIndex).removeClass("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides.eq(currentIndex).addClass("active");
  }
  setInterval(showNextSlide, 3000);
  $(".slide").first().addClass("active");

  $("#searchBar").focus();
  setCartBadgeCount();

  let productList = $(".productList");
  let randomProductList = $(".randomProductList");
  let products = [];

  fetch("../util/data.JSON")
    .then((res) => res.json())
    .then((data) => {
      products = data;
      renderProducts(products);
      randomProduct(products);
    });

  $("#searchBtn").on("click", () => {
    const searchedData = $("#searchBar").val().trim().toLowerCase();
    const filteredProducts = products.reduce((acc, product) => {
      const filteredProductList = product.products.filter((item) => {
        return (
          item.title.toLowerCase().includes(searchedData) ||
          item.description.toLowerCase().includes(searchedData) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchedData))
        );
      });
      return acc.concat(filteredProductList);
    }, []);
    if (filteredProducts.length > 0) {
      renderProducts(filteredProducts);
    } else {
      $(".productList").html('<p class="errorMessage">No results found.</p>');
    }
  });

  function renderProducts(products) {
    productList.empty();
    $.each(products, (index, product) => {
      const productDiv = $("<div>").addClass("product");
      productDiv.html(`
        <a href='../pages/product-list.html?categoryName=${product.title}'>
        <img src='${product.image}' alt='${product.title}'>
        <h2>${product.title}</h2>
        </a>
        `);
      productList.append(productDiv);
    });
  }

  function randomProduct(products) {
    randomProductList.empty();
    $.each(products, (index, productCategory) => {
      const randomProducts = getRandomProduct(productCategory.products, 1)[0];
      if (randomProducts) {
        // console.log(randomProducts);
        const productDiv = $("<div>").addClass("random-product");
        productDiv.html(`
          <a href='./product-list.html?productName=${randomProducts.title}'>
            <img src='${randomProducts.img}' alt='${randomProducts.title}'>
            <h2>${randomProducts.title}</h2>
          </a>
        `);
        randomProductList.append(productDiv);
      }
    });
  }
  function getRandomProduct(productList, count) {
    const randomIndex = Math.floor(Math.random() * productList.length);
    return productList.splice(randomIndex, count);
  }

  function setCartBadgeCount() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItems) {
      $(".cart-badge").text(cartItems.length);
    }
  }
});
