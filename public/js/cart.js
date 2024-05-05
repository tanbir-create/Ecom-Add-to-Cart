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
        showAlert("error", err.response?.data?.message);
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
        const itemId = res.data?.data?.cart?.items?.find((item) => item.productId === productId);
        inputElement.value = itemId.quantity;
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

            if (!totalItems || totalItems === 0) {
                cartQuantity.innerText = 0;

                const cartContainer = document.querySelector(".cart-page");
                cartContainer.innerHTML = `<h1 class="text-lg font-semibold mb-2 text-center">Cart is empty</h1>
                                          <a href="/" class="sky-400 border-sky-400 text-center font-bold block w-full underline underline-offset-4 text-xl">Home</a>`;

                document.querySelector("aside").remove();
                return;
            }
            totalPriceElemnt.innerText = totalPrice
                ? totalPrice.toLocaleString("hi-IN", {
                      style: "currency",
                      currency: "INR",
                  })
                : 0;
            totalItemElement.innerText = totalItems ? totalItems : 0;
            cartQuantity.innerText = totalItems ? totalItems : 0;
        }
    } catch (error) {
        showAlert("error", "Error updating cart total");
    }
}
