const loginForm = document.querySelector(".form--login");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        login(email, password);
    });
}

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
                location.assign("/");
            }, 1000);
        }

        console.log(res);
    } catch (err) {
        let error = err.response.data.error?.details?.errors?.[0];
        error = error ? Object.values(error)[0] : err.response.data.message;

        showAlert("error", error);
    }
};
