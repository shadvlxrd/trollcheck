var app = new Framework7({
  el: "#app", 
	theme: "ios",	
  name: 'TrollCheck',
	id: 'com.Shadow.TrollCheck',
	serviceWorker: {
		path: "./service-worker.js"
	}
});

var mainView = app.views.create('.view-main');
function toggleDarkMode() {
  
    document.querySelector("html").classList.toggle("dark");
}

function applyDarkModeSetting() {
    const htmlElement = document.querySelector("html");
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyDarkMode = (e) => {
        if (e.matches) {
            htmlElement.classList.add("dark");
        } else {
            htmlElement.classList.remove("dark");
        }
    };

    darkModeQuery.addListener(applyDarkMode);
    applyDarkMode(darkModeQuery);
}

applyDarkModeSetting();

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistration().then(registration => {
        if (!registration) {
            navigator.serviceWorker.register("service-worker.js").then(() => {}).catch(() => {});
        }
    });
	}
