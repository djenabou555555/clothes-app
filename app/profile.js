const dialogs = require("@nativescript/core/ui/dialogs");
const FrameModule = require("@nativescript/core/ui/frame");
const appSettings = require("@nativescript/core/application-settings");
const API_BASE_CANDIDATES = [
    "http://10.0.2.2:5000",
    "http://192.168.20.12:5000"
];

function pageLoaded(args) {
    console.log("Profile page loaded");
    const page = args.object;

    // Check if user is logged in
    const token = appSettings.getString("authToken");
    if (!token) {
        console.log("No token found, redirecting to login");
        FrameModule.topmost().navigate({ moduleName: "login", clearHistory: true });
        return;
    }
    loadUserProfile(page);
}

function showAlert(title, message) {
    return dialogs.alert({
        title,
        message,
        okButtonText: "OK"
    });
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

async function sendRequest(path, options = {}) {
    const token = appSettings.getString("authToken");
    const defaultOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        }
    };

    const response = await tryFetch(path, { ...defaultOptions, ...options });
    return response.json();
}

async function loadUserProfile(page) {
    const loadingIndicator = page.getViewById("loadingIndicator");
    const fullNameLabel = page.getViewById("fullNameLabel");
    const emailLabel = page.getViewById("emailLabel");

    if (!loadingIndicator || !fullNameLabel || !emailLabel) {
        console.error("Profile page views not found", {
            loadingIndicator: !!loadingIndicator,
            fullNameLabel: !!fullNameLabel,
            emailLabel: !!emailLabel
        });
        await showAlert("Error", "Impossible de charger le profil : éléments introuvables.");
        return;
    }

    try {
        loadingIndicator.busy = true;
        loadingIndicator.visibility = "visible";

        const data = await sendRequest("/users/me");

        if (data.success) {
            fullNameLabel.text = data.user.full_name || "N/A";
            emailLabel.text = data.user.email || "N/A";
        } else {
            await showAlert("Error", data.message || "Failed to load profile");
        }
    } catch (error) {
        console.error("Profile load error:", error);
        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
            appSettings.remove("authToken");
            await showAlert("Session expirée", "Votre session a expiré. Veuillez vous reconnecter.");
            FrameModule.topmost().navigate({ moduleName: "login", clearHistory: true });
        } else {
            await showAlert("Error", `Cannot load profile: ${error}`);
        }
    } finally {
        loadingIndicator.busy = false;
        loadingIndicator.visibility = "collapsed";
    }
}

function goBack(args) {
    FrameModule.topmost().goBack();
}

function logout(args) {
    appSettings.remove("authToken");
    FrameModule.topmost().navigate({ moduleName: "login", clearHistory: true });
}

exports.pageLoaded = pageLoaded;
exports.goBack = goBack;
exports.logout = logout;