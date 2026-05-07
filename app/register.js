const dialogs = require("@nativescript/core/ui/dialogs");
const API_BASE_CANDIDATES = [
    "http://10.0.2.2:5000",
    "http://192.168.20.12:5000"
];

function pageLoaded(args) {
    console.log("Register page loaded");
}

function showAlert(title, message) {
    return dialogs.alert({
        title,
        message,
        okButtonText: "OK"
    });
}

function validateFields(fields) {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || value.toString().trim().length === 0) {
            return false;
        }
    }
    return true;
}

async function tryFetch(path, options) {
    const errors = [];

    for (const base of API_BASE_CANDIDATES) {
        try {
            console.log(`Trying API host ${base}${path}`);
            const response = await fetch(`${base}${path}`, options);
            return response;
        } catch (error) {
            const message = `Fetch failed for ${base}${path}: ${error}`;
            console.log(message);
            errors.push(message);
        }
    }

    throw new Error(errors.join(" | ") || "Network request failed");
}

async function sendRequest(path, body) {
    const response = await tryFetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    return response.json();
}

async function register(args) {
    try {
        const page = args.object.page;
        const full_name = page.getViewById("full_name").text;
        const email = page.getViewById("email").text;
        const password = page.getViewById("password").text;

        if (!validateFields({ full_name, email, password })) {
            return await showAlert("Error", "Please fill full name, email and password.");
        }

        const data = await sendRequest("/auth/register", {
            full_name: full_name.trim(),
            name: full_name.trim(),
            email: email.trim(),
            password: password.trim()
        });

        if (data.success) {
            await showAlert("Success", "Register successful");
        } else {
            await showAlert("Error", data.message || "Register failed");
        }
    } catch (error) {
        await showAlert("Error", `Cannot connect to API: ${error}`);
    }
}

exports.pageLoaded = pageLoaded;
exports.register = register;