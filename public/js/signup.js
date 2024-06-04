const signupForm = document.querySelector(".form--signup");

if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        signup(email, password, confirmPassword);
    });
}

const signup = async (email, password, confirmPassword) => {
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/signup",
            data: {
                email,
                password,
                confirmPassword,
            },
        });

        if (res.data.status === "success") {
            showAlert("success", "Sign up successful! Welcome");
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
        // let error = err.response.data.error?.details?.errors?.[0];
        // error = error ? Object.values(error)[0] : err.response.data.message;
        showAlert("error", err.response.data?.message);
    }
};

document.getElementById("goto-login")?.addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search.split("?")[1]);

    if (params.has("redirect") && params.get("redirect") === "cart") {
        location.assign("/login/?redirect=cart");
    } else {
        location.assign("/login");
    }
});
