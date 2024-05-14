const login = async (email, password) => {
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
                email,
                password,
            },
        });

        if (res.data.status === "success") {
            showAlert("success", "Logged in successfully!");
            window.setTimeout(() => {
                const params = new URLSearchParams(window.location.search.split("?")[1]);

                if (params.has("redirect") && params.get("redirect") === "cart") {
                    location.assign("/cart");
                } else {
                    location.assign("/");
                }
            }, 1000);
        }
    } catch (err) {
        let error = err.response.data.error?.details?.errors?.[0];
        error = error ? Object.values(error)[0] : err.response.data.message;

        showAlert("error", error);
    }
};

const loginForm = document.querySelector(".form--login");
if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        login(email, password);
    });
}
const demoUserButton = document.getElementById("demo-user");

if (demoUserButton) {
    demoUserButton.addEventListener("click", async () => {
        const email = "calm@gmail.com";
        const password = "password";
        await login(email, password);
    });
}

document.getElementById("goto-signup")?.addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search.split("?")[1]);

    if (params.has("redirect") && params.get("redirect") === "cart") {
        location.assign("/signup/?redirect=cart");
    } else {
        location.assign("/signup");
    }
});
