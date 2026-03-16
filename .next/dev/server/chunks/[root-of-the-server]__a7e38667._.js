module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/prisma/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/src/app/api/session/[id]/results/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma/client.ts [app-route] (ecmascript)");
;
;
async function GET(request, { params }) {
    const { id } = await params;
    const viewerPlayerId = request.nextUrl.searchParams.get("playerId");
    try {
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.findUnique({
            where: {
                id
            },
            include: {
                restaurant: {
                    select: {
                        name: true
                    }
                },
                dishes: {
                    where: {
                        deletedAt: null
                    },
                    select: {
                        id: true,
                        name: true
                    }
                },
                players: {
                    select: {
                        id: true,
                        displayName: true
                    }
                },
                insights: true
            }
        });
        if (!session) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Not found"
        }, {
            status: 404
        });
        const insights = session.insights;
        const dishAvgRanks = insights?.dishAvgRanks ?? {};
        const playerCorrelations = insights?.playerCorrelations ?? {};
        const playerBestBudsRaw = insights?.playerBestBuds ?? {};
        const hotColdDetail = playerBestBudsRaw.hotColdDetail ?? null;
        // Ranked dishes (group consensus)
        const rankedDishes = session.dishes.map((d)=>({
                id: d.id,
                name: d.name,
                avgRank: dishAvgRanks[d.id] ?? 999
            })).sort((a, b)=>a.avgRank - b.avgRank);
        // Players with match %
        const players = session.players.map((p)=>({
                id: p.id,
                displayName: p.displayName,
                matchPercent: playerCorrelations[p.id] ?? 0
            }));
        // Per-player rankings (for individual view)
        const allRankings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].ranking.findMany({
            where: {
                sessionId: id
            },
            select: {
                sessionPlayerId: true,
                dishId: true,
                rankPosition: true
            }
        });
        const byPlayer = {};
        for (const r of allRankings){
            if (!byPlayer[r.sessionPlayerId]) byPlayer[r.sessionPlayerId] = {};
            byPlayer[r.sessionPlayerId][r.dishId] = r.rankPosition;
        }
        const playersWithRankings = players.map((p)=>{
            const playerRanks = byPlayer[p.id] ?? {};
            const rankedByPlayer = session.dishes.filter((d)=>playerRanks[d.id] !== undefined).map((d)=>({
                    id: d.id,
                    name: d.name,
                    position: playerRanks[d.id]
                })).sort((a, b)=>a.position - b.position);
            return {
                ...p,
                rankedDishes: rankedByPlayer
            };
        });
        // Insight details
        const dishMap = Object.fromEntries(session.dishes.map((d)=>[
                d.id,
                d.name
            ]));
        const playerMap = Object.fromEntries(session.players.map((p)=>[
                p.id,
                p.displayName
            ]));
        const firstCounts = {};
        const lastCounts = {};
        for (const [, playerRanks] of Object.entries(byPlayer)){
            const max = Math.max(...Object.values(playerRanks));
            for (const [dishId, rank] of Object.entries(playerRanks)){
                if (rank === 1) firstCounts[dishId] = (firstCounts[dishId] ?? 0) + 1;
                if (rank === max) lastCounts[dishId] = (lastCounts[dishId] ?? 0) + 1;
            }
        }
        const mostLovedId = insights?.mostLovedDishId ?? null;
        const nachoTypeId = insights?.nachoTypeDishId ?? null;
        const hotColdId = insights?.hotColdDishId ?? null;
        // Best bud for viewer
        let bestBud = null;
        if (viewerPlayerId && playerBestBudsRaw[viewerPlayerId]) {
            const bud = playerBestBudsRaw[viewerPlayerId];
            bestBud = {
                displayName: playerMap[bud.playerId] ?? "someone",
                matchPercent: bud.match
            };
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            restaurant: {
                name: session.restaurant.name
            },
            rankedDishes,
            players: playersWithRankings,
            insights: {
                mostLoved: mostLovedId ? {
                    id: mostLovedId,
                    name: dishMap[mostLovedId],
                    count: firstCounts[mostLovedId] ?? 0
                } : null,
                nachoType: nachoTypeId ? {
                    id: nachoTypeId,
                    name: dishMap[nachoTypeId],
                    count: lastCounts[nachoTypeId] ?? 0
                } : null,
                hotCold: hotColdId ? {
                    id: hotColdId,
                    name: dishMap[hotColdId],
                    highRank: hotColdDetail?.high ?? 1,
                    lowRank: hotColdDetail?.low ?? session.dishes.length
                } : null,
                bestBud
            }
        });
    } catch (error) {
        console.error("Results error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch results"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a7e38667._.js.map