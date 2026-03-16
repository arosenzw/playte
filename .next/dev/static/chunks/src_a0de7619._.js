(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FlavorJourneyShareCard",
    ()=>FlavorJourneyShareCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function InsightRow({ emoji, title, subtitle, value, detail }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: "#FFFCF5",
            borderRadius: 20,
            padding: "14px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#FE392D",
                    fontWeight: 700,
                    fontSize: 15,
                    textAlign: "center",
                    margin: 0
                },
                children: [
                    emoji,
                    "  ",
                    title,
                    "  ",
                    emoji
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#646464",
                    fontSize: 11,
                    textAlign: "center",
                    margin: 0
                },
                children: subtitle
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "rgba(252,204,117,0.2)",
                    border: "2px solid #FCCC75",
                    borderRadius: 12,
                    padding: "10px 14px",
                    color: "#646464",
                    fontSize: 14,
                    textAlign: "center"
                },
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: "#FCCC75",
                    borderRadius: 999,
                    padding: "4px 12px",
                    color: "#646464",
                    fontSize: 11,
                    textAlign: "center",
                    alignSelf: "center"
                },
                children: detail
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = InsightRow;
function FlavorJourneyShareCard({ restaurantName, insights, cardRef }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: cardRef,
        style: {
            width: 360,
            height: 640,
            background: "#FFF8E8",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 24px 24px",
            fontFamily: "Poppins, sans-serif",
            boxSizing: "border-box",
            gap: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: "/logo_long_red.png",
                alt: "playte",
                style: {
                    width: 140,
                    objectFit: "contain"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#9CA3AF",
                    fontSize: 12,
                    fontStyle: "italic",
                    margin: 0
                },
                children: restaurantName
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#FE392D",
                    fontSize: 24,
                    fontWeight: 700,
                    margin: 0
                },
                children: "Flavor Journey"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    width: "100%"
                },
                children: [
                    insights.mostLoved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InsightRow, {
                        emoji: "😍",
                        title: "most loved",
                        subtitle: "clean plate club",
                        value: insights.mostLoved.name,
                        detail: `ranked #1 by ${insights.mostLoved.count}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this),
                    insights.nachoType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InsightRow, {
                        emoji: "🤤",
                        title: "nacho type",
                        subtitle: "zero out of ten, respectfully",
                        value: insights.nachoType.name,
                        detail: `ranked last by ${insights.nachoType.count}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this),
                    insights.hotCold && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InsightRow, {
                        emoji: "😐",
                        title: "hot & cold",
                        subtitle: "most controversial playte debate",
                        value: insights.hotCold.name,
                        detail: `as high as #${insights.hotCold.highRank}, as low as #${insights.hotCold.lowRank}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this),
                    insights.bestBud && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InsightRow, {
                        emoji: "👯",
                        title: "best (taste) buds",
                        subtitle: "you should share next time",
                        value: insights.bestBud.displayName,
                        detail: `${insights.bestBud.matchPercent}% match`
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#9CA3AF",
                    fontSize: 10,
                    marginTop: "auto"
                },
                children: "made with playte"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_c1 = FlavorJourneyShareCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "InsightRow");
__turbopack_context__.k.register(_c1, "FlavorJourneyShareCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/ShareCards/SharePreview.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SharePreview",
    ()=>SharePreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function SharePreview({ visible, children }) {
    if (!visible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none"
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/ShareCards/SharePreview.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = SharePreview;
var _c;
__turbopack_context__.k.register(_c, "SharePreview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/shareImage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shareImage",
    ()=>shareImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html-to-image/es/index.js [app-client] (ecmascript)");
;
async function shareImage(element, filename) {
    const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBlob"])(element, {
        pixelRatio: 2
    });
    if (!blob) throw new Error("Failed to generate image");
    const file = new File([
        blob
    ], filename, {
        type: "image/png"
    });
    if (navigator.canShare?.({
        files: [
            file
        ]
    })) {
        await navigator.share({
            files: [
                file
            ],
            title: "playte"
        });
    } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/session/[id]/results/flavor/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FlavorJourneyPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ShareCards$2f$FlavorJourneyShareCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ShareCards$2f$SharePreview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ShareCards/SharePreview.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shareImage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/shareImage.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function InsightCard({ emoji, title, subtitle, value, detail }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full bg-[#FFFCF5] rounded-2xl px-5 py-4 shadow-sm flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[#FE392D] text-base font-bold text-center",
                children: [
                    emoji,
                    "  ",
                    title,
                    "  ",
                    emoji
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[#646464] text-xs text-center",
                children: subtitle
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#FCCC75]/20 border-2 border-[#FCCC75] rounded-xl px-4 py-3 text-[#646464] text-base text-center",
                children: value
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#FCCC75] rounded-full px-3 py-1 text-[#646464] text-xs text-center self-center",
                children: detail
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_c = InsightCard;
function FlavorJourneyPage() {
    _s();
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sharing, setSharing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [previewing, setPreviewing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FlavorJourneyPage.useEffect": ()=>{
            const playerId = sessionStorage.getItem("playerId");
            const url = `/api/session/${id}/results${playerId ? `?playerId=${playerId}` : ""}`;
            fetch(url).then({
                "FlavorJourneyPage.useEffect": (r)=>r.json()
            }["FlavorJourneyPage.useEffect"]).then(setData);
        }
    }["FlavorJourneyPage.useEffect"], [
        id
    ]);
    const ins = data?.insights;
    async function handleShare() {
        setSharing(true);
        setPreviewing(true);
        await new Promise((r)=>setTimeout(r, 150));
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shareImage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareImage"])(cardRef.current, "playte-flavor-journey.png");
        } finally{
            setPreviewing(false);
            setSharing(false);
        }
    }
    function goToMyRankings() {
        router.push(`/session/${id}/results/players`);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "h-screen bg-[#FFF8E8] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ShareCards$2f$SharePreview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SharePreview"], {
                visible: previewing,
                children: data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ShareCards$2f$FlavorJourneyShareCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlavorJourneyShareCard"], {
                    restaurantName: data.restaurant.name,
                    insights: data.insights,
                    cardRef: cardRef
                }, void 0, false, {
                    fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                    lineNumber: 82,
                    columnNumber: 18
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto flex flex-col items-center px-6 pt-10 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "self-start text-[#9CA3AF] italic text-sm mb-2",
                        children: "← ranking results"
                    }, void 0, false, {
                        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/logo_long_red.png",
                        alt: "playte",
                        width: 180,
                        height: 60,
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#9CA3AF] italic text-sm mt-1",
                        children: data?.restaurant.name ?? ""
                    }, void 0, false, {
                        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-[#FE392D] text-3xl font-bold mt-2 mb-6",
                        children: "Flavor Journey"
                    }, void 0, false, {
                        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-sm flex flex-col gap-4",
                        children: [
                            ins?.mostLoved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InsightCard, {
                                emoji: "😍",
                                title: "most loved",
                                subtitle: "clean plate club",
                                value: ins.mostLoved.name,
                                detail: `ranked #1 by ${ins.mostLoved.count}`
                            }, void 0, false, {
                                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this),
                            ins?.nachoType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InsightCard, {
                                emoji: "🤤",
                                title: "nacho type",
                                subtitle: "zero out of ten, respectfully",
                                value: ins.nachoType.name,
                                detail: `ranked last by ${ins.nachoType.count}`
                            }, void 0, false, {
                                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this),
                            ins?.hotCold && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InsightCard, {
                                emoji: "😐",
                                title: "hot & cold",
                                subtitle: "most controversial playte debate",
                                value: ins.hotCold.name,
                                detail: `as high as #${ins.hotCold.highRank}, as low as #${ins.hotCold.lowRank}`
                            }, void 0, false, {
                                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this),
                            ins?.bestBud && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InsightCard, {
                                emoji: "👯",
                                title: "best (taste) buds",
                                subtitle: "you should share next time",
                                value: ins.bestBud.displayName,
                                detail: `${ins.bestBud.matchPercent}% match`
                            }, void 0, false, {
                                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0 px-6 pb-8 pt-4 bg-[#FFF8E8] w-full flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-sm flex flex-col gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleShare,
                            disabled: sharing || !data,
                            className: "w-full bg-[#FE392D] text-white text-xl font-semibold py-4 rounded-full disabled:opacity-60",
                            children: sharing ? "generating..." : "share flavor journey"
                        }, void 0, false, {
                            fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: goToMyRankings,
                            className: "w-full bg-[#F88888] text-white text-xl font-semibold py-4 rounded-full",
                            children: "individual rankings →"
                        }, void 0, false, {
                            fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_s(FlavorJourneyPage, "vVn0FVp7EudDGkKgLBMM+mp8gAM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = FlavorJourneyPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "InsightCard");
__turbopack_context__.k.register(_c1, "FlavorJourneyPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_a0de7619._.js.map