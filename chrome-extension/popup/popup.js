let extractProductInfoButton = document.getElementById(
  "extractProductInfoButton"
);
let productInfoList = document.getElementById("productInfoList");

//Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //Get Emails
  let productDetails = {
    title: request.productTitle,
    color: request.productColor,
    brand: request.productBrand,
    productCategory: request.productCategory,
  };

  console.log(productDetails);
  if (productDetails == null) {
    let li = document.createElement("li");
    li.innerText = "Product details are NULL";
    productInfoList.appendChild(li);
  } else {
    //Add image to Original Product Info
    let originalProductImage = document.createElement("img");
    originalProductImage.src = request.imageLink;
    originalProductImage.width = 100;
    productInfoList.appendChild(originalProductImage);

    // List all product details passed in
    for (const [key, value] of Object.entries(productDetails)) {
      console.log(key, value);
      let li = document.createElement("li");
      li.innerText = key + ": " + value;
      productInfoList.appendChild(li);
    }
  }
});

// Buttons click event listener
extractProductInfoButton.addEventListener("click", async () => {
  //Get current active tab of chrome window
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Execute script to parse emails on page
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getProductColor,
  });
});

// Function to scrape emails
function getProductColor() {
  //RegEx to parse emails fom HTML code
  const productColor =
    document.getElementsByClassName("color-name")[0].innerText;

  const productTitle =
    document.getElementsByClassName("product-title")[0].innerText;

  const productBrand =
    document.getElementsByClassName("product-brand")[0].innerText;

  const productCategory = document
    .querySelector(".breadcrumbs")
    .querySelector("li:last-child")
    .textContent.trim();

  const imageLink = document.querySelector(".product-image-frame").href;

  //Send emails to popup
  chrome.runtime.sendMessage({
    productColor,
    productTitle,
    productBrand,
    productCategory,
    imageLink,
  });
}
