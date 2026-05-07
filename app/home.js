const FrameModule = require("@nativescript/core/ui/frame");
const appSettings = require("@nativescript/core/application-settings");

function pageLoaded(args) {
    console.log("Home page loaded");
    
    const token = appSettings.getString("authToken");
    if (!token) {
        console.log("No token found, redirecting to login");
        FrameModule.topmost().navigate({ moduleName: "login", clearHistory: true });
        return;
    }
}

function viewItem(args) {
   
    console.log("View item clicked");
}

function goToProfile(args) {
    FrameModule.topmost().navigate({ moduleName: "profile" });
}

function logout(args) {
    appSettings.remove("authToken");
    FrameModule.topmost().navigate({ moduleName: "login", clearHistory: true });
}

exports.pageLoaded = pageLoaded;
exports.viewItem = viewItem;
exports.goToProfile = goToProfile;
exports.logout = logout;
