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
            showAlert("success", "Logged in successfully!");
            window.setTimeout(() => {
                location.assign("/");
            }, 1000);
        }
    } catch (err) {
        let error = err.response.data.error?.details?.errors?.[0];
        error = error ? Object.values(error)[0] : err.response.data.message;
        showAlert("error", error);
    }
};
