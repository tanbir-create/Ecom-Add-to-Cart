// const cartPage = document.getElementById("cart-page-main");

// if (cartPage) {
// }

document.addEventListener("click", handleUpdateItem);

async function handleUpdateItem(e) {
    // delete item
    if (e.target.classList.contains("delete-btn")) {
        console.log(e.target);
    }
}
