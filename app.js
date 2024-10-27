var app = new Framework7({
  el: "#app", 
	theme: "ios",	
  name: 'TSChecker',
	id: 'com.TSChecker.trollstore',
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
var selectedVersionType = 'release';
var selectedArchitecture = 'arm64';

function setVersionType(versionType) {
  selectedVersionType = versionType;
  document.getElementById('betaButton').classList.remove('button-active');
  document.getElementById('releaseButton').classList.remove('button-active');
  if (versionType === 'beta') {
    document.getElementById('betaButton').classList.add('button-active');
  } else {
    document.getElementById('releaseButton').classList.add('button-active');
  }
}

function setArchitecture(architecture) {
  selectedArchitecture = architecture;
  document.getElementById('arm64Button').classList.remove('button-active');
  document.getElementById('arm64eButton').classList.remove('button-active');
  if (architecture === 'arm64') {
    document.getElementById('arm64Button').classList.add('button-active');
  } else {
    document.getElementById('arm64eButton').classList.add('button-active');
  }
}

function checkSupport() {
  var iOSVersion = document.getElementById("iOSVersion").value.trim();
  var versionType = selectedVersionType;
  var architecture = selectedArchitecture;

  var trollStoreSupportData = [
    { fromVersion: "14.0 beta 1", toVersion: "14.0 beta 2", platforms: "arm64 (A8) - arm64 (A9-A11)", supported: {} },
    { fromVersion: "14.0 beta 2", toVersion: "14.8.1", platforms: "arm64 (A8) - arm64 (A9-A11)", supported: { "TrollInstallerX": "https://github.com/alfiecg24/TrollInstallerX", "TrollHelperOTA": "https://ios.cfw.guide/installing-trollstore-trollhelperota" } },
    { fromVersion: "15.0", toVersion: "15.0", platforms: "arm64 (A8) - arm64e (A12-A17/M1-M2)", supported: { "TrollInstallerX": "https://github.com/alfiecg24/TrollInstallerX", "TrollHelperOTA": "https://ios.cfw.guide/installing-trollstore-trollhelperota" } },
    { fromVersion: "15.0 beta 1", toVersion: "15.5 beta 4", platforms: "arm64 (A8) - arm64e (A12-A17/M1-M2)", supported: { "TrollHelperOTA": "https://ios.cfw.guide/installing-trollstore-trollhelperota" } },
    { fromVersion: "15.5", toVersion: "15.5", platforms: "arm64 (A8) - arm64e (A12-A17/M1-M2)", supported: { "TrollHelperOTA": "https://ios.cfw.guide/installing-trollstore-trollhelperota", "TrollInstallerX": "https://github.com/alfiecg24/TrollInstallerX", "TrollInstallerMDC": "https://dhinakg.github.io/apps.html" } },
    { fromVersion: "16.0 beta 1", toVersion: "16.0 beta 3", platforms: "arm64 (A8) - arm64e (A12-A17/M1-M2)", supported: {} },
    { fromVersion: "16.0 beta 4", toVersion: "16.6.1", platforms: "arm64 (A8) - arm64e (A12-A17/M1-M2)", supported: { "TrollInstallerX": "https://github.com/alfiecg24/TrollInstallerX", "TrollHelperOTA": "https://ios.cfw.guide/installing-trollstore-trollhelperota" } },
    { fromVersion: "16.7 RC", toVersion: "16.7 RC", platforms: "arm64 (A8) - arm64e (A12-A17/M1-M2)", supported: { "TrollHelper": "https://ios.cfw.guide/installing-trollstore-trollhelper", "No Install Method": "" } },
    { fromVersion: "16.7", toVersion: "16.7.7", platforms: "arm64 (A8) - arm64e (A12-A17/M1-M2)", supported: { "Unsupported": "" } },
    { fromVersion: "17.0 beta 1", toVersion: "17.0 beta 4", platforms: "arm64 (A8) - arm64e (A12-A17/M1-M2)", supported: { "TrollInstallerX": "https://github.com/alfiecg24/TrollInstallerX", "No Install Method": "" } },
    { fromVersion: "17.0 beta 5", toVersion: "17.0", platforms: "arm64 (A8) - arm64e (A12-A17/M1-M2)", supported: { "TrollHelper": "https://ios.cfw.guide/installing-trollstore-trollhelper", "No Install Method": "" } },
    { fromVersion: "17.0.1 and later", toVersion: "17.0.1 and later", platforms: "arm64 (A8) - arm64e (A12-A17/M1-M2)", supported: { "Unsupported": "" } }
  ];

  var result = trollStoreSupportInfo(iOSVersion, versionType, architecture, trollStoreSupportData);
  var supportInfoDiv = document.getElementById("supportInfo");

  if (result.supported) {
    supportInfoDiv.innerHTML =
      "<p>iOS Version: " + iOSVersion + "</p>" +
      "<p>TrollStore Support: <span class='supported'>Supported</span></p>";

    if (result.supportedRange) {
      supportInfoDiv.innerHTML += "<p>" + result.supportedRange + "</p>";
    }

    if (result.officialWebsites) {
      supportInfoDiv.innerHTML += "<h3>Official Websites</h3>";
      result.officialWebsites.forEach(function (website) {
        supportInfoDiv.innerHTML += "<button class='button button-raised button-fill' onclick=\"openURL('" + website[1] + "')\">" + website[0] + " Official Website</button>";
      });
    }

    if (result.installationGuides) {
      supportInfoDiv.innerHTML += "<h3>Installation Guides</h3>";
      result.installationGuides.forEach(function (guide) {
        supportInfoDiv.innerHTML += "<button class='button button-raised button-fill' onclick=\"openURL('" + guide[1] + "')\">" + guide[0] + " Installation Guide</button>";
      });
    }
  } else {
    supportInfoDiv.innerHTML = "<h2>Support Information</h2>" +
      "<p>iOS Version: " + iOSVersion + "</p>" +
      "<p>TrollStore Support: <span class='not-supported'>Not Supported</span></p>";
  }
}

function trollStoreSupportInfo(iOSVersion, versionType, architecture, trollStoreSupportData) {
  var version = iOSVersion;
  if (versionType === "beta" && !version.includes("beta")) {
    version += " beta";
  }

  for (var i = 0; i < trollStoreSupportData.length; i++) {
    var data = trollStoreSupportData[i];
    if (isVersionInRange(version, data.fromVersion, data.toVersion)) {
      if (data.platforms.includes(architecture)) {
        if (Object.keys(data.supported).length > 0) {
          var officialWebsites = [];
          var installationGuides = [];

          for (var key in data.supported) {
            if (key === "TrollInstallerX") {
              officialWebsites.push([key, "https://github.com/alfiecg24/TrollInstallerX"]);
              installationGuides.push([key, "https://ios.cfw.guide/installing-trollstore-trollinstallerx/"]);
            } else {
              officialWebsites.push([key, data.supported[key]]);
              installationGuides.push([key, data.supported[key]]);
            }
          }

          return {
            supported: true,
            supportedRange: "Supported from " + data.fromVersion + " to " + data.toVersion,
            officialWebsites: officialWebsites,
            installationGuides: installationGuides
          };
        } else {
          return {
            supported: Object.keys(data.supported).length > 0,
            supportedRange: "Supported from " + data.fromVersion + " to " + data.toVersion,
            officialWebsites: null,
            installationGuides: null
          };
        }
      }
    }
  }
  return { supported: false, supportedRange: null, officialWebsites: null, installationGuides: null };
}

function isVersionInRange(version, fromVersion, toVersion) {
  var versionComponents = version.replace(" beta", "").split(".").map(Number);
  var fromComponents = fromVersion.replace(" beta", "").split(".").map(Number);
  var toComponents = toVersion.replace(" beta", "").split(".").map(Number);

  if (compareVersion(versionComponents, fromComponents) >= 0 && compareVersion(versionComponents, toComponents) <= 0) {
    return true;
  }
  return false;
}

function compareVersion(version1, version2) {
  for (var i = 0; i < Math.max(version1.length, version2.length); i++) {
    var v1 = version1[i] || 0;
    var v2 = version2[i] || 0;

    if (v1 < v2) {
      return -1;
    } else if (v1 > v2) {
      return 1;
    }
  }
  return 0;
}

function openURL(url) {
  window.open(url, '_blank');
}
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistration().then(registration => {
        if (!registration) {
            navigator.serviceWorker.register("service-worker.js").then(() => {}).catch(() => {});
        }
    });
	}