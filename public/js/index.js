const showAlert = (type, msg) => {
    hideAlert();
    let svg = "";
    if (type === "success") {
        svg = `<svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`;
    } else {
        svg = `<svg class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>
`;
    }
    const markUp = `<div class="fixed top-10 right-1/2 translate-x-2/4 mb-4 mr-4 z-50 shadow-md" id="popup">
  <div class="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        ${svg}
      </div>
      <div class="ml-3 w-full">
        <p class="text-sm leading-5 font-medium text-gray-900">
          ${msg}
        </p>
      </div>
    </div>
  </div>
</div>`;

    document.querySelector("body").insertAdjacentHTML("afterbegin", markUp);

    setTimeout(() => {
        hideAlert();
    }, 3000);
};

const hideAlert = () => {
    const el = document.getElementById("popup");
    if (el) el.parentElement.removeChild(el);
};

const cartQuantity = document.getElementById("cart-quantity");

async function setCartQuantity() {
    const res = await axios({
        method: "GET",
        url: "/api/v1/cart/cart_quantity",
    });

    cartQuantity.innerText = res.data.data?.quantity;
}
document.addEventListener("DOMContentLoaded", setCartQuantity);

document.addEventListener("click", async function name(e) {
    try {
        console.log();
        if (e.target.dataset?.productId) {
            const productId = e.target.dataset.productId;

            const res = await axios({
                method: "POST",
                url: "/api/v1/cart/",
                data: {
                    productId,
                    quantity: 1,
                },
            });
            await setCartQuantity();
            const message = res.data?.message;

            if (res.data.status === "success") {
                showAlert("success", message);
            }
        }
    } catch (err) {
        let error = err.response.data?.message;

        showAlert("error", error);
    }
});

const logOutBtn = document.getElementById("logout");
if (logOutBtn) logOutBtn.addEventListener("click", logout);

async function logout() {
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/logout",
        });
        console.log(res);
        if (res.status === 204) {
            location.reload(true);
        }
    } catch (err) {
        showAlert("error", "Error logging out! Try again");
    }
}
