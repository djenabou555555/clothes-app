const dialogs = require("@nativescript/core/ui/dialogs");
const FrameModule = require("@nativescript/core/ui/frame");
const appSettings = require("@nativescript/core/application-settings");
const API_BASE_CANDIDATES = [
    "http://10.0.2.2:5000",
    "http://192.168.20.12:5000"
];

function pageLoaded(args) {
    console.log("Login page loaded");
    // Check if user is already logged in
    const token = appSettings.getString("authToken");
    if (token) {
        console.log("User already logged in, redirecting to home");
        FrameModule.topmost().navigate({ moduleName: "home", clearHistory: true });
    }
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

async function login(args) {
    const page = args.object.page;
    const email = page.getViewById("email").text;
    const password = page.getViewById("password").text;
    const loginButton = page.getViewById("loginButton");

    try {
        if (!validateFields({ email, password })) {
            return await showAlert("Error", "Please fill both email and password.");
        }

        loginButton.isEnabled = false;
        loginButton.text = "Logging in...";

        const data = await sendRequest("/auth/login", {
            email: email.trim(),
            password: password.trim()
        });

        if (data.success) {
            // Store JWT token securely
            appSettings.setString("authToken", data.token);
            await showAlert("Success", "Login successful");
            FrameModule.topmost().navigate({ moduleName: "home", clearHistory: true });
        } else {
            await showAlert("Error", data.message || "Login failed");
        }
    } catch (error) {
        await showAlert("Error", `Cannot connect to API: ${error}`);
    } finally {
        loginButton.isEnabled = true;
        loginButton.text = "Login";
    }
}

async function register(args) {
    const page = args.object.page;
    const full_name = page.getViewById("full_name").text;
    const email = page.getViewById("email").text;
    const password = page.getViewById("password").text;
    const registerButton = page.getViewById("registerButton");

    try {
        if (!validateFields({ full_name, email, password })) {
            return await showAlert("Error", "Please fill full name, email and password.");
        }

        registerButton.isEnabled = false;
        registerButton.text = "Registering...";

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
    } finally {
        registerButton.isEnabled = true;
        registerButton.text = "Register";
    }
}

exports.pageLoaded = pageLoaded;
exports.login = login;
exports.register = register;
