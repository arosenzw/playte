(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/Podium.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Podium",
    ()=>Podium
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/canvas-confetti/dist/confetti.module.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const MEDAL = {
    1: {
        bg: "#FFD700",
        border: "#C8A000",
        text: "#7A5000"
    },
    2: {
        bg: "#D8D8D8",
        border: "#A0A0A0",
        text: "#505050"
    },
    3: {
        bg: "#E8A870",
        border: "#B87040",
        text: "#6B3A1F"
    }
};
const CONFIG = {
    1: {
        plates: 8,
        flex: "0 0 36%"
    },
    2: {
        plates: 5,
        flex: "0 0 27%"
    },
    3: {
        plates: 3,
        flex: "0 0 27%"
    }
};
// Reveal order: 3rd → 2nd → 1st
const REVEAL_DELAYS = {
    3: 200,
    2: 700,
    1: 1200
};
const SPACING = 5;
function PlateStack({ count, widthPx }) {
    const plateH = Math.round(widthPx * (300 / 450));
    const totalH = plateH + (count - 1) * SPACING;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full",
        style: {
            height: totalH
        },
        children: Array.from({
            length: count
        }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: "/plate.png",
                alt: "",
                className: "absolute w-full",
                style: {
                    top: i * SPACING,
                    zIndex: count - i,
                    height: plateH,
                    objectFit: "fill"
                }
            }, i, false, {
                fileName: "[project]/src/components/ui/Podium.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Podium.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_c = PlateStack;
function PodiumColumn({ place, name, widthPx, visible }) {
    const { plates, flex } = CONFIG[place];
    const isFirst = place === 1;
    const medal = MEDAL[place];
    const medalSize = isFirst ? 40 : 32;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center",
        style: {
            flex
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-full flex items-center justify-center font-bold shadow-md mx-auto",
                        style: {
                            width: medalSize,
                            height: medalSize,
                            backgroundColor: medal.bg,
                            border: `3px solid ${medal.border}`,
                            color: medal.text,
                            fontSize: isFirst ? 20 : 16
                        },
                        children: place
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Podium.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-[#4B4B4B] text-center leading-tight mt-1 mb-1 px-1 line-clamp-2 ${isFirst ? "text-sm font-semibold" : "text-xs"}`,
                        children: name
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Podium.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/Podium.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: -18
                },
                className: "w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlateStack, {
                    count: plates,
                    widthPx: widthPx
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/Podium.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Podium.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/Podium.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_c1 = PodiumColumn;
const W1 = 132;
const W23 = 99;
function Podium({ dishes, startDelay = 0 }) {
    _s();
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        1: false,
        2: false,
        3: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Podium.useEffect": ()=>{
            [
                3,
                2,
                1
            ].forEach({
                "Podium.useEffect": (place)=>{
                    setTimeout({
                        "Podium.useEffect": ()=>{
                            setVisible({
                                "Podium.useEffect": (prev)=>({
                                        ...prev,
                                        [place]: true
                                    })
                            }["Podium.useEffect"]);
                            if (place === 1) {
                                setTimeout({
                                    "Podium.useEffect": ()=>{
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$canvas$2d$confetti$2f$dist$2f$confetti$2e$module$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                                            particleCount: 120,
                                            spread: 70,
                                            origin: {
                                                y: 0.4
                                            },
                                            colors: [
                                                "#FFD700",
                                                "#FFC200",
                                                "#FFE066",
                                                "#FFFACD",
                                                "#FFA500"
                                            ]
                                        });
                                    }
                                }["Podium.useEffect"], 300);
                            }
                        }
                    }["Podium.useEffect"], startDelay + REVEAL_DELAYS[place]);
                }
            }["Podium.useEffect"]);
        }
    }["Podium.useEffect"], [
        startDelay
    ]);
    const [second, first, third] = [
        dishes[1],
        dishes[0],
        dishes[2]
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-end justify-center gap-2 w-full px-2",
        children: [
            second && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PodiumColumn, {
                place: 2,
                name: second.name,
                widthPx: W23,
                visible: visible[2]
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Podium.tsx",
                lineNumber: 123,
                columnNumber: 18
            }, this),
            first && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PodiumColumn, {
                place: 1,
                name: first.name,
                widthPx: W1,
                visible: visible[1]
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Podium.tsx",
                lineNumber: 124,
                columnNumber: 18
            }, this),
            third && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PodiumColumn, {
                place: 3,
                name: third.name,
                widthPx: W23,
                visible: visible[3]
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Podium.tsx",
                lineNumber: 125,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/Podium.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_s(Podium, "in1QQZY6mCvuNBTr3QkUsxKcTxc=");
_c2 = Podium;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "PlateStack");
__turbopack_context__.k.register(_c1, "PodiumColumn");
__turbopack_context__.k.register(_c2, "Podium");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/ShareCards/PodiumShareCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PodiumShareCard",
    ()=>PodiumShareCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const MEDAL = {
    1: {
        bg: "#FFD700",
        border: "#C8A000",
        text: "#7A5000"
    },
    2: {
        bg: "#D8D8D8",
        border: "#A0A0A0",
        text: "#505050"
    },
    3: {
        bg: "#E8A870",
        border: "#B87040",
        text: "#6B3A1F"
    }
};
const SPACING = 5;
const PLATE_COUNTS = {
    1: 8,
    2: 5,
    3: 3
};
function PlateStack({ count, widthPx }) {
    const plateH = Math.round(widthPx * (300 / 450));
    const totalH = plateH + (count - 1) * SPACING;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "relative",
            width: "100%",
            height: totalH
        },
        children: Array.from({
            length: count
        }, (_, i)=>// eslint-disable-next-line @next/next/no-img-element
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: "/plate.png",
                alt: "",
                style: {
                    position: "absolute",
                    width: "100%",
                    top: i * SPACING,
                    zIndex: count - i,
                    height: plateH,
                    objectFit: "fill"
                }
            }, i, false, {
                fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                lineNumber: 19,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = PlateStack;
function MedalBadge({ place }) {
    const m = MEDAL[place];
    const size = place === 1 ? 44 : 34;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: size,
            height: size,
            borderRadius: "50%",
            background: m.bg,
            border: `3px solid ${m.border}`,
            color: m.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: place === 1 ? 22 : 16
        },
        children: place
    }, void 0, false, {
        fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c1 = MedalBadge;
function PodiumShareCard({ restaurantName, handle, dishes, cardRef }) {
    const top3 = dishes.slice(0, 3);
    const [second, first, third] = [
        top3[1],
        top3[0],
        top3[2]
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: cardRef,
        style: {
            width: 360,
            height: 480,
            background: "#FFF8E8",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 28px 28px",
            fontFamily: "Poppins, sans-serif",
            boxSizing: "border-box",
            gap: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: "/logo_long_red.png",
                alt: "playte",
                style: {
                    width: 130,
                    objectFit: "contain"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                lineNumber: 76,
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
                fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            handle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 4
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "#FE392D",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/logo.png",
                            alt: "",
                            style: {
                                width: 20,
                                height: 20
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: "#FE392D",
                            fontWeight: 700,
                            fontSize: 18,
                            margin: 0
                        },
                        children: [
                            "@",
                            handle
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                lineNumber: 80,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#FE392D",
                    fontWeight: 700,
                    fontSize: 20,
                    margin: "4px 0 0"
                },
                children: "the results are in."
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    gap: 10,
                    width: "100%",
                    marginTop: 16,
                    flex: 1
                },
                children: [
                    {
                        dish: second,
                        place: 2,
                        width: 100
                    },
                    {
                        dish: first,
                        place: 1,
                        width: 130
                    },
                    {
                        dish: third,
                        place: 3,
                        width: 100
                    }
                ].map(({ dish, place, width })=>dish ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MedalBadge, {
                                place: place
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: "#4B4B4B",
                                    fontSize: place === 1 ? 13 : 11,
                                    fontWeight: place === 1 ? 600 : 400,
                                    textAlign: "center",
                                    margin: "6px 0 -18px",
                                    lineHeight: 1.3
                                },
                                children: dish.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlateStack, {
                                count: PLATE_COUNTS[place],
                                widthPx: width
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this)
                        ]
                    }, place, true, {
                        fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, this) : null)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#9CA3AF",
                    fontSize: 10,
                    marginTop: 12
                },
                children: "made with playte"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/ShareCards/PodiumShareCard.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_c2 = PodiumShareCard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "PlateStack");
__turbopack_context__.k.register(_c1, "MedalBadge");
__turbopack_context__.k.register(_c2, "PodiumShareCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/session/[id]/results/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ResultsDishesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Podium$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Podium.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ShareCards$2f$PodiumShareCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ShareCards/PodiumShareCard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function ResultsDishesPage() {
    _s();
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [restaurantName, setRestaurantName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ResultsDishesPage.useState": ()=>sessionStorage.getItem(`restaurant_${id}`) ?? ""
    }["ResultsDishesPage.useState"]);
    const [listVisible, setListVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [podiumDelay, setPodiumDelay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sharing, setSharing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cachedBlob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ResultsDishesPage.useEffect": ()=>{
            fetch(`/api/session/${id}/results`).then({
                "ResultsDishesPage.useEffect": (r)=>r.json()
            }["ResultsDishesPage.useEffect"]).then({
                "ResultsDishesPage.useEffect": (d)=>{
                    setData(d);
                    sessionStorage.setItem(`restaurant_${id}`, d.restaurant.name);
                    setRestaurantName(d.restaurant.name);
                }
            }["ResultsDishesPage.useEffect"]);
        }
    }["ResultsDishesPage.useEffect"], [
        id
    ]);
    const top3 = data?.rankedDishes.slice(0, 3) ?? [];
    const rest = data?.rankedDishes.slice(3) ?? [];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ResultsDishesPage.useEffect": ()=>{
            if (!data) return;
            const count = data.rankedDishes.slice(3).length;
            setTimeout({
                "ResultsDishesPage.useEffect": ()=>setListVisible(true)
            }["ResultsDishesPage.useEffect"], 400);
            setPodiumDelay(count > 0 ? 900 : 400);
        }
    }["ResultsDishesPage.useEffect"], [
        data
    ]);
    async function handleShare() {
        setSharing(true);
        setPreviewing(true);
        await new Promise((r)=>setTimeout(r, 150));
        try {
            await shareImage(cardRef.current, "playte-results.png");
        } finally{
            setPreviewing(false);
            setSharing(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "h-screen bg-[#FFF8E8] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SharePreview, {
                visible: previewing,
                children: data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ShareCards$2f$PodiumShareCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PodiumShareCard"], {
                    restaurantName: restaurantName,
                    dishes: data.rankedDishes,
                    cardRef: cardRef
                }, void 0, false, {
                    fileName: "[project]/src/app/session/[id]/results/page.tsx",
                    lineNumber: 59,
                    columnNumber: 18
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/page.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto flex flex-col items-center px-6 pt-10 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/logo.png",
                        alt: "playte",
                        width: 70,
                        height: 70,
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/src/app/session/[id]/results/page.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[#9CA3AF] italic text-sm mt-2 min-h-[1.25rem]",
                        children: restaurantName
                    }, void 0, false, {
                        fileName: "[project]/src/app/session/[id]/results/page.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-[#FE392D] text-3xl font-bold mt-1 mb-6",
                        children: "the results are in."
                    }, void 0, false, {
                        fileName: "[project]/src/app/session/[id]/results/page.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    top3.length >= 1 && podiumDelay !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Podium$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Podium"], {
                            dishes: top3,
                            startDelay: podiumDelay
                        }, void 0, false, {
                            fileName: "[project]/src/app/session/[id]/results/page.tsx",
                            lineNumber: 69,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/session/[id]/results/page.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-sm flex flex-col gap-2 mt-6",
                        children: rest.map((dish, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                style: {
                                    opacity: listVisible ? 1 : 0,
                                    transform: listVisible ? "translateY(0)" : "translateY(16px)",
                                    transition: "opacity 0.4s ease, transform 0.4s ease"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[#FE392D] text-lg font-bold w-6 text-right flex-shrink-0",
                                        children: i + 4
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/session/[id]/results/page.tsx",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 bg-[#FCCC75]/20 border-2 border-[#FCCC75] rounded-2xl px-4 py-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[#646464] text-base",
                                            children: dish.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/session/[id]/results/page.tsx",
                                            lineNumber: 88,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/session/[id]/results/page.tsx",
                                        lineNumber: 87,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, dish.id, true, {
                                fileName: "[project]/src/app/session/[id]/results/page.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/session/[id]/results/page.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/session/[id]/results/page.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0 px-6 pb-8 pt-4 flex flex-col gap-3 bg-[#FFF8E8] w-full items-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-sm flex flex-col gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleShare,
                            disabled: sharing || !data,
                            className: "w-full bg-[#FE392D] text-white text-xl font-semibold py-4 rounded-full disabled:opacity-60",
                            children: sharing ? "generating..." : "share results"
                        }, void 0, false, {
                            fileName: "[project]/src/app/session/[id]/results/page.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push(`/session/${id}/results/flavor`),
                            className: "w-full bg-[#F88888] text-white text-xl font-semibold py-4 rounded-full",
                            children: "flavor journey →"
                        }, void 0, false, {
                            fileName: "[project]/src/app/session/[id]/results/page.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/session/[id]/results/page.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/session/[id]/results/page.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/session/[id]/results/page.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(ResultsDishesPage, "hTuulsIvub+G0++g0Xu+tfl1z10=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ResultsDishesPage;
var _c;
__turbopack_context__.k.register(_c, "ResultsDishesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_06a2dc1c._.js.map