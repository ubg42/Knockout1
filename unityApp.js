const unityApp = {

    applyCommonFixes: function () {
        // Disable unwanted page scroll.
        window.addEventListener("wheel", (event) => event.preventDefault(), {
            passive: false,
        });

        // Disable unwanted key events.
        window.addEventListener("keydown", (event) => {
            if (["ArrowUp", "ArrowDown"].includes(event.key)) {
                event.preventDefault();
            }
        });

        // Disable context menu appearing after right click outside of the unity canvas.
        window.addEventListener('contextmenu', (event) => event.preventDefault());
        document.addEventListener('contextmenu', (event) => event.preventDefault());
    },

    tryRotationLock() {
        const PORTRAIT_ONLY = "";
        let isPortraitLocked = false;
        if (!unityApp.isEmpty(PORTRAIT_ONLY)) {
            isPortraitLocked = unityApp.toBoolean(PORTRAIT_ONLY);
        }
        console.log("isPortraitLocked", PORTRAIT_ONLY, isPortraitLocked);

        const LANDSCAPE_ONLY = "";
        let isLandscapeLocked = false;
        if (!unityApp.isEmpty(LANDSCAPE_ONLY)) {
            isLandscapeLocked = unityApp.toBoolean(LANDSCAPE_ONLY);
        }
        console.log("isLandscapeLocked", LANDSCAPE_ONLY, isLandscapeLocked);

        if (isPortraitLocked && isLandscapeLocked) {
            throw new Error("Both portrait and landscape lock cannot be enabled at the same time.");
        }

        const root = document.createElement("div");

        // Stretch to full screen.
        root.style.background = 'rgb(10, 10, 10, 0.7)';
        root.style.display = 'flex';
        root.style.position = 'fixed';
        root.style.top = '0';
        root.style.left = '0';
        root.style.width = '100%';
        root.style.height = '100%';

        // Create blur background effect.
        root.style.webkitBackfaceVisibility = 'hidden';
        root.style.webkitPerspective = '1000';
        root.style.webkitTransform = 'translate3d(0,0,0)';
        root.style.webkitTransform = 'translateZ(0)';
        root.style.backfaceVisibility = 'hidden';
        root.style.perspective = '1000';
        root.style.transform = 'translate3d(0,0,0)';
        root.style.transform = 'translateZ(0)';
        root.style.backdropFilter = 'blur(10px)';

        // Create intuitive image instruction for the user.
        const image = document.createElement('img');
        if (isPortraitLocked) {
            image.src = 'TemplateData/portrait-only.png';
        }
        else if (isLandscapeLocked) {
            image.src = 'TemplateData/landscape-only.png';
        }
        image.style.display = 'flex';
        image.style.width = '100px';
        image.style.height = '100px';
        image.style.margin = 'auto';
        root.appendChild(image);

        document.body.appendChild(root);

        function updateRotationLock() {
            let display = 'none';
            if (unityApp.isMobile()) {
                if (isPortraitLocked && isLandscapeLocked) {
                    root.style.display = display;
                    return;
                }
                if (isPortraitLocked) {
                    display = window.innerHeight < window.innerWidth ? 'flex' : 'none';
                }
                else if (isLandscapeLocked) {
                    display = window.innerHeight > window.innerWidth ? 'flex' : 'none';
                }
            }
            root.style.display = display;
        }

        // Subscribe to window and document events.
        window.addEventListener("load", updateRotationLock);
        window.addEventListener("resize", updateRotationLock);
        document.addEventListener("readystatechange", updateRotationLock);
        document.addEventListener("DOMContentLoaded", updateRotationLock);

        // Update rotation lock on start.
        updateRotationLock();
    },

    tryLockAspectRatio() {
        const mobilePortraitAspectRatio = "";
        const mobileLandscapeAspectRatio = "";
        const desktopAspectRatio = "";

        const isMobilePortraitLocked = !this.isEmpty(mobilePortraitAspectRatio);
        const isMobileLandscapeLocked = !this.isEmpty(mobileLandscapeAspectRatio);
        const isDesktopLocked = !this.isEmpty(desktopAspectRatio);

        console.log('tryLockAspectRatio', {
            mobilePortraitAspectRatio: mobilePortraitAspectRatio,
            mobileLandscapeAspectRatio: mobileLandscapeAspectRatio,
            desktopAspectRatio: desktopAspectRatio,
            isMobilePortraitLocked: isMobilePortraitLocked,
            isMobileLandscapeLocked: isMobileLandscapeLocked,
            isDesktopLocked: isDesktopLocked
        });

        const container = document.querySelector("#unity-container");
        const canvas = document.querySelector("#unity-canvas");

        function centerCanvas() {
            canvas.style.margin = "auto";
            canvas.style.top = "0";
            canvas.style.left = "0";
            canvas.style.bottom = "0";
            canvas.style.right = "0";
        }

        function resetAspectRatio() {
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            centerCanvas();
        }

        function isPortraitMode() {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            return containerHeight > containerWidth;
        }

        function recalculateAspectRatio(aspectRatio) {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            if (containerWidth / containerHeight > aspectRatio) {
                canvas.style.width = Math.floor(containerHeight * aspectRatio) + "px";
                canvas.style.height = "100%";
            }
            else {
                canvas.style.width = "100%";
                canvas.style.height = Math.floor(containerWidth / aspectRatio) + "px";
            }
        }

        function updateAspectRatio() {
            resetAspectRatio();
            if (unityApp.isMobile()) {
                if (isPortraitMode()) {
                    if (isMobilePortraitLocked) {
                        recalculateAspectRatio(unityApp.toNumber(mobilePortraitAspectRatio));
                    }
                }
                else {
                    if (isMobileLandscapeLocked) {
                        recalculateAspectRatio(unityApp.toNumber(mobileLandscapeAspectRatio));
                    }
                }
            }
            else {
                if (isDesktopLocked) {
                    recalculateAspectRatio(unityApp.toNumber(desktopAspectRatio));
                }
            }
            centerCanvas();
        }

        // Subscribe to window and document events.
        window.addEventListener("load", updateAspectRatio);
        window.addEventListener("resize", updateAspectRatio);
        document.addEventListener("readystatechange", updateAspectRatio);
        document.addEventListener("DOMContentLoaded", updateAspectRatio);

        // Update aspect ratio on start.
        updateAspectRatio();
    },

startLoading: async function () {
    const canvas = document.querySelector("#unity-canvas");
    const loadingBar = document.querySelector("#unity-loading-bar");
    const progressBarFull = document.querySelector("#unity-progress-bar-full");

    const buildUrl = "Build";

    const wasmName = "knockout[8]-mirraSDK[5.1.2].wasm";
    const wasmParts = 4;

    const loaderUrl =
        buildUrl + "/knockout[8]-mirraSDK[5.1.2].loader.js";

    // --------------------------------------------------
    // Load and combine WASM parts
    // --------------------------------------------------

    async function loadSplitWasm() {
        const parts = [];

        for (let i = 1; i <= wasmParts; i++) {
            const partName =
                wasmName + ".part" + String(i).padStart(2, "0");

            const url = buildUrl + "/" + partName;

            console.log("Loading WASM part:", url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    "Failed to load " +
                    partName +
                    " (" +
                    response.status +
                    " " +
                    response.statusText +
                    ")"
                );
            }

            const buffer = await response.arrayBuffer();

            console.log(
                partName,
                "loaded:",
                buffer.byteLength,
                "bytes"
            );

            parts.push(new Uint8Array(buffer));
        }

        // Calculate total size
        let totalSize = 0;

        for (const part of parts) {
            totalSize += part.byteLength;
        }

        // Combine all parts
        const combined = new Uint8Array(totalSize);

        let offset = 0;

        for (const part of parts) {
            combined.set(part, offset);
            offset += part.byteLength;
        }

        console.log(
            "Combined WASM:",
            combined.byteLength,
            "bytes"
        );

        // Make a browser URL containing the complete WASM
        const blob = new Blob(
            [combined],
            { type: "application/wasm" }
        );

        return URL.createObjectURL(blob);
    }

    try {
        const wasmUrl = await loadSplitWasm();

        console.log("WASM blob URL:", wasmUrl);

        const config = {
            arguments: [],

            dataUrl:
                buildUrl +
                "/knockout[8]-mirraSDK[5.1.2].data.br",

            frameworkUrl:
                buildUrl +
                "/knockout[8]-mirraSDK[5.1.2].framework.js.br",

            // IMPORTANT:
            // Unity now receives the combined WASM
            codeUrl: wasmUrl,

            streamingAssetsUrl: "StreamingAssets",

            companyName: "DefaultCompany",
            productName: "knockout",
            productVersion: "0.1.0",

            showBanner: (msg, type) => {
                switch (type) {
                    case "error":
                        console.error(msg);
                        break;

                    default:
                        console.warn(msg);
                        break;
                }
            }
        };

        loadingBar.style.display = "block";

        createUnityInstance(
            canvas,
            config,
            (progress) => {
                progressBarFull.style.width =
                    (100 * progress) + "%";
            }
        ).then((unityInstance) => {
            loadingBar.style.display = "none";

            window.unityInstance = unityInstance;

            console.log("Unity loaded!");
        }).catch((message) => {
            console.error("Unity loading failed:", message);
        });

    } catch (error) {
        console.error("Failed to load split WASM:", error);
		
		            showBanner: (msg, type) => {
                switch (type) {
                    case 'error': {
                        console.error(msg);
                        break;
                    }
                    default: {
                        console.warn(msg);
                        break;
    }
}

        // By default Unity keeps WebGL canvas render target size matched with
        // the DOM size of the canvas element (scaled by window.devicePixelRatio)
        // Set this to false if you want to decouple this synchronization from
        // happening inside the engine, and you would instead like to size up
        // the canvas DOM size and WebGL render target sizes yourself.
        const matchWebGLToCanvasSize = "";
        console.log("matchWebGLToCanvasSize", matchWebGLToCanvasSize);
        if (!this.isEmpty(matchWebGLToCanvasSize)) {
            config.matchWebGLToCanvasSize = this.toBoolean(matchWebGLToCanvasSize);
        }

        // If you would like all file writes inside Unity Application.persistentDataPath
        // directory to automatically persist so that the contents are remembered when
        // the user revisits the site the next time, uncomment the following line:
        const autoSyncPersistentDataPath = "";
        console.log("autoSyncPersistentDataPath", autoSyncPersistentDataPath);
        if (!this.isEmpty(autoSyncPersistentDataPath)) {
            config.autoSyncPersistentDataPath = this.toBoolean(autoSyncPersistentDataPath);
        }
        // This autosyncing is currently not the default behavior to avoid regressing
        // existing user projects that might rely on the earlier manual
        // JS_FileSystem_Sync() behavior, but in future Unity version, this will be
        // expected to change.

        // To lower canvas resolution on mobile devices to gain some
        // performance, uncomment the following line:
        const devicePixelRatio = this.toNumber("");
        console.log("devicePixelRatio", devicePixelRatio);
        if (this.isNumber(devicePixelRatio)) {
            config.devicePixelRatio = this.toNumber(devicePixelRatio);
        }

        loadingBar.style.display = "block";
        const script = document.createElement("script");
        script.src = loaderUrl;
        script.onload = () => {
            createUnityInstance(canvas, config, (progress) => {
                progressBarFull.style.width = 100 * progress + "%";
            }).then((unityInstance) => {
                loadingBar.style.display = "none";

            }).catch((message) => {
                alert(message);
            });
        };
        document.body.appendChild(script);
    },






// Apply common fixes.
unityApp.applyCommonFixes();

// Lock rotation.
unityApp.tryRotationLock();

// Lock aspect ratio.
unityApp.tryLockAspectRatio();

// Automatically start after script is loaded.
unityApp.startLoading();
