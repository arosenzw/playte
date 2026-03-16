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
function FlavorJourneyShareCard({ restaurantName, insights, cardRef }) {
    const rows = [
        insights.mostLoved && {
            emoji: "😍",
            label: "most loved",
            value: insights.mostLoved.name
        },
        insights.nachoType && {
            emoji: "🥴",
            label: "nacho type",
            value: insights.nachoType.name
        },
        insights.hotCold && {
            emoji: "😐",
            label: "hot & cold",
            value: insights.hotCold.name
        },
        insights.bestBud && {
            emoji: "👯",
            label: "best (taste) buds",
            value: insights.bestBud.displayName
        }
    ].filter(Boolean);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: cardRef,
        style: {
            width: 360,
            background: "#FFF8E8",
            display: "flex",
            flexDirection: "column",
            padding: "32px 28px 28px",
            fontFamily: "Poppins, sans-serif",
            boxSizing: "border-box",
            gap: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: "/logo_long_red.png",
                alt: "playte",
                style: {
                    width: 120,
                    objectFit: "contain",
                    marginBottom: 4
                }
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#9CA3AF",
                    fontSize: 12,
                    fontStyle: "italic",
                    margin: "0 0 4px"
                },
                children: restaurantName
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#FE392D",
                    fontWeight: 700,
                    fontSize: 22,
                    margin: "0 0 20px"
                },
                children: "Flavor Journey"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 10
                },
                children: rows.map(({ emoji, label, value })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#FFFCF5",
                            borderRadius: 16,
                            padding: "14px 18px",
                            display: "flex",
                            alignItems: "center",
                            gap: 14
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 28,
                                    lineHeight: 1,
                                    flexShrink: 0
                                },
                                children: emoji
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                                lineNumber: 60,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#9CA3AF",
                                            fontSize: 11,
                                            margin: 0
                                        },
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                                        lineNumber: 62,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#FE392D",
                                            fontWeight: 600,
                                            fontSize: 15,
                                            margin: 0
                                        },
                                        children: value
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                                        lineNumber: 63,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, this)
                        ]
                    }, label, true, {
                        fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#C8C8C8",
                    fontSize: 10,
                    textAlign: "center",
                    marginTop: 20
                },
                children: "made with playte"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/ShareCards/FlavorJourneyShareCard.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = FlavorJourneyShareCard;
var _c;
__turbopack_context__.k.register(_c, "FlavorJourneyShareCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/shareImage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pregenerateBlob",
    ()=>pregenerateBlob,
    "shareBlob",
    ()=>shareBlob
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html-to-image/es/index.js [app-client] (ecmascript)");
;
async function pregenerateBlob(element) {
    // First pass warms up html-to-image's image cache
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBlob"])(element, {
        pixelRatio: 2
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$to$2d$image$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toBlob"])(element, {
        pixelRatio: 2
    });
}
async function shareBlob(blob, filename) {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shareImage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/shareImage.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[#646464] text-xs text-center",
                children: subtitle
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#FCCC75]/20 border-2 border-[#FCCC75] rounded-xl px-4 py-3 text-[#646464] text-base text-center",
                children: value
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#FCCC75] rounded-full px-3 py-1 text-[#646464] text-xs text-center self-center",
                children: detail
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
        lineNumber: 31,
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
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cachedBlob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FlavorJourneyPage.useEffect": ()=>{
            if (!data) return;
            setTimeout({
                "FlavorJourneyPage.useEffect": async ()=>{
                    if (cardRef.current) cachedBlob.current = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shareImage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pregenerateBlob"])(cardRef.current);
                }
            }["FlavorJourneyPage.useEffect"], 800);
        }
    }["FlavorJourneyPage.useEffect"], [
        data
    ]);
    const ins = data?.insights;
    async function handleShare() {
        if (!cachedBlob.current) return;
        setSharing(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shareImage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareBlob"])(cachedBlob.current, "playte-flavor-journey.png");
        } finally{
            setSharing(false);
        }
    }
    function goToMyRankings() {
        router.push(`/session/${id}/results/players`);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "h-screen bg-[#FFF8E8] flex flex-col",
        children: [
            data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    top: 0,
                    left: "-9999px",
                    pointerEvents: "none"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ShareCards$2f$FlavorJourneyShareCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlavorJourneyShareCard"], {
                    restaurantName: data.restaurant.name,
                    insights: data.insights,
                    cardRef: cardRef
                }, void 0, false, {
                    fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                    lineNumber: 87,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 86,
                columnNumber: 9
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
                        lineNumber: 92,
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
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#9CA3AF] italic text-sm mt-1",
                        children: data?.restaurant.name ?? ""
                    }, void 0, false, {
                        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-[#FE392D] text-3xl font-bold mt-2 mb-6",
                        children: "Flavor Journey"
                    }, void 0, false, {
                        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                        lineNumber: 97,
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
                                lineNumber: 101,
                                columnNumber: 13
                            }, this),
                            ins?.nachoType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InsightCard, {
                                emoji: "🥴",
                                title: "nacho type",
                                subtitle: "zero out of ten, respectfully",
                                value: ins.nachoType.name,
                                detail: `ranked last by ${ins.nachoType.count}`
                            }, void 0, false, {
                                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                                lineNumber: 104,
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
                                lineNumber: 107,
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
                                lineNumber: 110,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 91,
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
                            lineNumber: 117,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: goToMyRankings,
                            className: "w-full bg-[#F88888] text-white text-xl font-semibold py-4 rounded-full",
                            children: "individual rankings →"
                        }, void 0, false, {
                            fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/session/[id]/results/flavor/page.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(FlavorJourneyPage, "hXMrQ1Scul/U3CkyKL/rYxd1d1s=", false, function() {
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

//# sourceMappingURL=src_7defe258._.js.map