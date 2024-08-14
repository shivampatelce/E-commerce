/** 
Name: Shivam Patel
Student Number: 8994760 
*/

// Available option for sorting items
const SortOptions = Object.freeze({
  PRICE_HIGH_TO_LOW: "priceHighToLow",
  PRICE_LOW_TO_HIGH: "priceLowToHigh",
  RATING_HIGH_TO_LOW: "ratingHighToLow",
  RATING_LOW_TO_HIGH: "ratingLowToHigh",
  MORE_DISCOUNT: "moreDiscount",
});

// Selected sorting option
let selectedSortingOption = SortOptions.DEFAULT;

// Filter price min price
let minPrice = 0;

// Filter price max price
let maxPrice = 3000;

// Selected brands for filtering
let selectedBrands = [];

const url = "../util/data.json";

// fetch data from json file
const fetchData = async () => {
  try {
    // Make a GET request to the JSON file
    const response = await fetch(url);

    // Check if the response status is 200
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

// Get products list from category name
const getProductsByCategoryName = (categoryName, PRODUCT_DATA) => {
  const category = PRODUCT_DATA.find(
    (category) =>
      category.title.toLowerCase() ==
        (categoryName && categoryName.toLowerCase()) ||
      (categoryName.length > 3 &&
        category.title.toLowerCase().includes(categoryName.toLowerCase())) ||
      (categoryName.length > 3 &&
        categoryName.toLowerCase().includes(category.title.toLowerCase()))
  );
  return category && category.products;
};

// Get product list from company name
const getProductsByTitle = (categoryName, PRODUCT_DATA) => {
  $("#open-sidebar").addClass("hide");

  const productList = [];
  PRODUCT_DATA.forEach(({ products }) => {
    products.forEach((product) => {
      product.title.toLowerCase().includes(categoryName.toLowerCase()) &&
        productList.push(product);
    });
  });
  return productList;
};

// Display product list
const setProductList = (productList, categoryName) => {
  // Clear card list before adding products.
  $(".card-list").html("");

  productList.forEach((product) => {
    const { title, description, price, img, discount, isInStock, rating } =
      product;

    const favorites = JSON.parse(localStorage.getItem("wishlist")) || [];
    let isFavorite = favorites.includes(title);

    const card = $(`
                  <a href="./product.html?productName='${title}'">
                      <div class="card">
                          <div class="image">
                              <img
                                  src="${img}"
                                  height="240px"
                                  width="300px"
                                  alt="${title}"
                              />
                          </div>
                          <div class="details">
                              <div id="title">
                                  ${title}
                              </div>
                              <div id="description">
                                  ${description}
                              </div>
                              <div id="star-rating"></div>
                              <div id="price">$${price}</div>
                              ${
                                discount
                                  ? `<span id="discount">Save $${discount}</span>`
                                  : ""
                              }
                                <div>
                                    <button class="fav-btn card-btn">
                                        <i class="fa-${
                                          isFavorite ? "solid" : "regular"
                                        } fa-heart"></i>
                                    </button>
                                </div>
                              <div id="freeDelivery">Available to ship</div>
                              ${
                                isInStock
                                  ? `<span id="inStock">In stock</span>`
                                  : `<span id="outOfStock">Out of stock</span>`
                              }
                          </div>
                      </div>
                  </a>
              `);

    // Display rating view
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        card
          .find("#star-rating")
          .append('<span class="star filled">&#9733;</span>');
      } else {
        card.find("#star-rating").append('<span class="star">&#9733;</span>');
      }
    }

    $(".card-list").append(card);

    // Add event listener for the favorite button
    card.find(".fav-btn").on("click", (event) => {
      event.preventDefault();
      const button = $(event.target);

      // Check is favorite button is selected or not
      let favorites = JSON.parse(localStorage.getItem("wishlist")) || [];
      if (isFavorite) {
        const itemIndex = favorites.indexOf(title);
        if (itemIndex > -1) {
          favorites.splice(itemIndex, 1);
        }
        button.find("i").addClass("fa-regular");
        button.find("i").removeClass("fa-solid");
      } else {
        favorites.push(title);
        button.find("i").addClass("fa-solid");
        button.find("i").removeClass("fa-regular");
      }
      favorites = [...new Set(favorites)];
      localStorage.setItem("wishlist", JSON.stringify(favorites));
      isFavorite = !isFavorite;
    });
  });

  // open the sidebar
  $("#open-sidebar").click(function () {
    $("#sidebar").css("right", "0");
  });

  // close the sidebar
  $("#sidebar .close-btn").click(function () {
    $("#sidebar").css("right", "-250px");
  });
};

// Display message if product not available
const productNotAvailableMessage = (categoryName) => {
  $("#notAvailable").removeClass("hide");
  $("#notAvailable").html(`
        <div><b>No results available for "${categoryName}"</b></div>
        <div>Try checking your spelling or use more general terms</div>
        `);
};

// Set page details
const setPageDetails = (categoryName, PRODUCT_DATA) => {
  let productList =
    getProductsByCategoryName(categoryName, PRODUCT_DATA) ||
    getProductsByTitle(categoryName, PRODUCT_DATA);

  // Update product list as per selected filtering.
  if (productList && productList.length) {
    productList = sortProductList(productList);

    productList = filterProductByPriceRange(productList);

    if (selectedBrands.length) {
      productList = filterProductByPriceRange(
        sortProductList(
          getProductsByCategoryName(categoryName, PRODUCT_DATA) ||
            getProductsByTitle(categoryName, PRODUCT_DATA)
        ),
        maxPrice,
        minPrice
      ).filter((product) => selectedBrands.includes(product.brand));
    } else {
      productList = filterProductByPriceRange(
        sortProductList(
          getProductsByCategoryName(categoryName, PRODUCT_DATA) ||
            getProductsByTitle(categoryName, PRODUCT_DATA)
        ),
        maxPrice,
        minPrice
      );
    }

    setProductList(productList, categoryName);
  } else {
    productNotAvailableMessage(categoryName);
  }
};

// Update product list based on selected price range
const filterProductByPriceRange = (productList) => {
  if (!productList) return [];

  return productList.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );
};

// Update product list based on selected sorting option
const sortProductList = (productList) => {
  switch (selectedSortingOption) {
    case SortOptions.PRICE_HIGH_TO_LOW:
      return productList.sort((a, b) => b.price - a.price);
    case SortOptions.PRICE_LOW_TO_HIGH:
      return productList.sort((a, b) => a.price - b.price);
    case SortOptions.RATING_HIGH_TO_LOW:
      return productList.sort((a, b) => b.rating - a.rating);
    case SortOptions.RATING_LOW_TO_HIGH:
      return productList.sort((a, b) => a.rating - b.rating);
    case SortOptions.MORE_DISCOUNT:
      return productList.sort((a, b) => b.discount - a.discount);
    default:
      return productList;
  }
};

// Get max price available in product list to set price filter max limit
const calculateMaxPrice = (PRODUCT_DATA) => {
  return (PRODUCT_DATA || []).reduce(
    (max, product) => Math.max(max, product.price),
    0
  );
};

// Set available brand filter option
const setBrandFilter = (categoryName, PRODUCT_DATA) => {
  const brands = getAllBrand(categoryName, PRODUCT_DATA);
  brands.forEach((brand) => {
    $("#brand-option").append(`
        <input type="checkbox" class="brand-input" id="${brand}" name="${brand}" value="${brand}">
        <label for="${brand}">${brand}</label><br>
    `);
  });
};

// Get all brands name available in list
const getAllBrand = (categoryName, PRODUCT_DATA) => {
  const productsData = PRODUCT_DATA.find(
    (category) =>
      category.title === categoryName ||
      category.title.toLowerCase().includes(categoryName.toLowerCase()) ||
      categoryName.toLowerCase().includes(category.title.toLowerCase())
  );
  return [
    ...new Set(
      productsData ? productsData.products.map((product) => product.brand) : []
    ),
  ];
};

const setCartBadgeCount = () => {
  const cartItems = JSON.parse(localStorage.getItem("cart") || []);
  $(".cart-badge").text(cartItems.length);
};

$(async () => {
  let PRODUCT_DATA = [];

  await fetchData().then((res) => {
    PRODUCT_DATA = res;
  });

  // Get the query string from the URL
  const queryString = window.location.search;

  // Create a URLSearchParams object
  const urlParams = new URLSearchParams(queryString);

  // Get specific query parameters
  const categoryName = urlParams.get("categoryName");
  const isSearchedCategory = urlParams.get("isSearchedCategory");

  setCartBadgeCount();

  // Redirect to home page if category name not entered
  if (categoryName) {
    setBrandFilter(categoryName, PRODUCT_DATA);
    setPageDetails(categoryName, PRODUCT_DATA);

    if (isSearchedCategory) {
      $("#searchBar").val(categoryName);
    }
  } else {
    window.location.href = "../index.html";
  }

  // Listen sorting value change
  $(".sorting-input").change(function () {
    selectedSortingOption = $('input[name="sort_item"]:checked').val();
    setPageDetails(categoryName, PRODUCT_DATA);
  });

  maxPrice = calculateMaxPrice(
    getProductsByCategoryName(categoryName, PRODUCT_DATA)
  );

  // Initialize price slider range
  $("#slider-range").slider({
    range: true,
    min: 0,
    max: maxPrice,
    values: [0, maxPrice],
    slide: (event, ui) => {
      minPrice = ui.values[0];
      maxPrice = ui.values[1];
      $("#amount").val("$" + minPrice + " - $" + maxPrice);
      setPageDetails(categoryName, PRODUCT_DATA);
    },
  });

  $("#amount").val("$" + minPrice + " - $" + maxPrice);

  // Handle brand selection change
  $(".brand-input").change(() => {
    const checkedBrands = [];
    $(".brand-input:checked").each((index, brandInput) => {
      checkedBrands.push($(brandInput).val());
    });

    selectedBrands = checkedBrands;

    setPageDetails(categoryName, PRODUCT_DATA);
  });

  // Handle favorite button click
  $(".fav-btn").click((event) => {
    event.preventDefault();
  });

  // Search button click
  $("#searchBtn").on("click", () => {
    const searchedData = $("#searchBar").val().trim();
    if (searchedData) {
      window.location.href = `product-list.html?categoryName=${searchedData}&isSearchedCategory=${true}`;
    }
  });
});
