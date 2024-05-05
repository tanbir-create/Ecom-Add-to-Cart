// const cartPage = document.getElementById("cart-page-main");

// if (cartPage) {
// }

document.addEventListener("click", handleUpdateItem);

async function handleUpdateItem(e) {
    // delete item
    try {
        if (e.target.classList.contains("delete-btn")) {
            return await deleteItem(e);
        } else if (e.target.classList.contains("update-btn")) {
            return await updateItem(e);
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
}

async function updateItem(e) {
    const productId = e.target.dataset.itemId;
    const inputElement = document.getElementById(`quantity-${productId}`);
    const quantity = inputElement.value;

    const url = `/api/v1/cart/`;

    const res = await axios({
        method: "PATCH",
        url,
        data: {
            productId,
            quantity,
        },
    });

    if (res.data.status === "success") {
        showAlert("success", res.data.message ? res.data.message : "Cart quantity updated");

        await updateTotalItemsAndPrice();
    }
}

async function deleteItem(e) {
    const productId = e.target.dataset.itemId;
    const element = document.getElementById(`product-${productId}`);

    const url = `/api/v1/cart/${productId}`;

    const res = await axios({
        method: "DELETE",
        url,
    });

    if (res.data.status === "success") {
        showAlert("success", res.data.message ? res.data.message : "Deleted product");
        element?.remove();

        await updateTotalItemsAndPrice();
    }
}

async function updateTotalItemsAndPrice() {
    try {
        const totalItemElement = document.getElementById("cart-total-items");
        const totalPriceElemnt = document.getElementById("cart-total-price");

        const res = await axios({
            method: "GET",
            url: "/api/v1/cart/",
        });

        if (res.data.status === "success") {
            const { totalPrice, totalItems } = res.data.data;

            if (totalPrice)
                totalPriceElemnt.innerText = totalPrice.toLocaleString("hi-IN", { style: "currency", currency: "INR" });
            if (totalItems) totalItemElement.innerText = totalItems;
            cartQuantity.innerText = totalItems;
        }
    } catch (error) {
        console.log(error);
        showAlert("error", "Error updating cart total");
    }
}
