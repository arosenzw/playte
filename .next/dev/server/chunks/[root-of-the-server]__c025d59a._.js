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
"[project]/src/app/api/session/[id]/rank/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma/client.ts [app-route] (ecmascript)");
;
;
function spearman(a, b) {
    const dishes = Object.keys(a).filter((d)=>b[d] !== undefined);
    const n = dishes.length;
    if (n < 2) return 50;
    const dSq = dishes.reduce((sum, d)=>sum + (a[d] - b[d]) ** 2, 0);
    const rho = 1 - 6 * dSq / (n * (n * n - 1));
    return Math.max(0, Math.round((rho + 1) / 2 * 100));
}
async function computeInsights(sessionId) {
    const allRankings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].ranking.findMany({
        where: {
            sessionId
        },
        select: {
            sessionPlayerId: true,
            dishId: true,
            rankPosition: true
        }
    });
    const byPlayer = {};
    const byDish = {};
    for (const r of allRankings){
        if (!byPlayer[r.sessionPlayerId]) byPlayer[r.sessionPlayerId] = {};
        byPlayer[r.sessionPlayerId][r.dishId] = r.rankPosition;
        if (!byDish[r.dishId]) byDish[r.dishId] = [];
        byDish[r.dishId].push(r.rankPosition);
    }
    const dishAvgRanks = {};
    const dishRankVariance = {};
    for (const [dishId, ranks] of Object.entries(byDish)){
        const avg = ranks.reduce((a, b)=>a + b, 0) / ranks.length;
        dishAvgRanks[dishId] = avg;
        dishRankVariance[dishId] = ranks.reduce((sum, r)=>sum + (r - avg) ** 2, 0) / ranks.length;
    }
    // Consensus ranks: dishes sorted by avg rank → position 1, 2, 3...
    const consensusRanks = {};
    Object.entries(dishAvgRanks).sort((a, b)=>a[1] - b[1]).forEach(([dishId], i)=>{
        consensusRanks[dishId] = i + 1;
    });
    // Most loved / nacho type
    const firstCounts = {};
    const lastCounts = {};
    for (const playerRanks of Object.values(byPlayer)){
        const max = Math.max(...Object.values(playerRanks));
        for (const [dishId, rank] of Object.entries(playerRanks)){
            if (rank === 1) firstCounts[dishId] = (firstCounts[dishId] ?? 0) + 1;
            if (rank === max) lastCounts[dishId] = (lastCounts[dishId] ?? 0) + 1;
        }
    }
    const mostLovedDishId = Object.entries(firstCounts).sort((a, b)=>b[1] - a[1])[0]?.[0] ?? null;
    const nachoTypeDishId = Object.entries(lastCounts).sort((a, b)=>b[1] - a[1])[0]?.[0] ?? null;
    const hotColdSorted = Object.entries(dishRankVariance).sort((a, b)=>b[1] - a[1]);
    const hotColdDishId = (hotColdSorted[0]?.[1] ?? 0) > 0 ? hotColdSorted[0][0] : null;
    // Player correlation with group consensus
    const playerCorrelations = {};
    for (const [playerId, playerRanks] of Object.entries(byPlayer)){
        playerCorrelations[playerId] = spearman(playerRanks, consensusRanks);
    }
    // Best buds: for each player, highest correlation with another player
    const playerBestBuds = {};
    const playerIds = Object.keys(byPlayer);
    for(let i = 0; i < playerIds.length; i++){
        let best = -1, bestId = "";
        for(let j = 0; j < playerIds.length; j++){
            if (i === j) continue;
            const corr = spearman(byPlayer[playerIds[i]], byPlayer[playerIds[j]]);
            if (corr > best) {
                best = corr;
                bestId = playerIds[j];
            }
        }
        if (bestId) playerBestBuds[playerIds[i]] = {
            playerId: bestId,
            match: best
        };
    }
    // Hot/cold: find actual min/max rank for the most variance dish
    const hotColdRanks = hotColdDishId ? byDish[hotColdDishId] : [];
    const hotColdDetail = hotColdDishId ? {
        high: Math.min(...hotColdRanks),
        low: Math.max(...hotColdRanks)
    } : null;
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sessionInsight.upsert({
        where: {
            sessionId
        },
        create: {
            sessionId,
            mostLovedDishId,
            nachoTypeDishId,
            hotColdDishId,
            dishAvgRanks,
            dishRankVariance,
            playerCorrelations,
            playerBestBuds: {
                ...playerBestBuds,
                hotColdDetail
            }
        },
        update: {
            mostLovedDishId,
            nachoTypeDishId,
            hotColdDishId,
            dishAvgRanks,
            dishRankVariance,
            playerCorrelations,
            playerBestBuds: {
                ...playerBestBuds,
                hotColdDetail
            }
        }
    });
}
async function POST(request, { params }) {
    const { id } = await params;
    try {
        const { playerId, guestToken, rankings } = await request.json();
        // rankings: [{ dishId: string, rankPosition: number }]
        if (!playerId || !guestToken || !Array.isArray(rankings)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing fields"
            }, {
                status: 400
            });
        }
        const player = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sessionPlayer.findFirst({
            where: {
                id: playerId,
                sessionId: id,
                guestToken
            }
        });
        if (!player) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 403
            });
        }
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.findUnique({
            where: {
                id
            },
            select: {
                restaurantId: true,
                status: true,
                _count: {
                    select: {
                        players: true
                    }
                }
            }
        });
        if (!session || session.status !== "ranking") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Session not in ranking phase"
            }, {
                status: 400
            });
        }
        const now = new Date();
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction([
            // Delete existing rankings for this player in case of resubmit
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].ranking.deleteMany({
                where: {
                    sessionPlayerId: playerId,
                    sessionId: id
                }
            }),
            // Create new rankings
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].ranking.createMany({
                data: rankings.map(({ dishId, rankPosition })=>({
                        sessionPlayerId: playerId,
                        dishId,
                        sessionId: id,
                        restaurantId: session.restaurantId,
                        rankPosition,
                        submittedAt: now
                    }))
            }),
            // Mark player as submitted
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sessionPlayer.update({
                where: {
                    id: playerId
                },
                data: {
                    submittedAt: now
                }
            })
        ]);
        // Check if all players have submitted
        const submittedCount = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].sessionPlayer.count({
            where: {
                sessionId: id,
                submittedAt: {
                    not: null
                }
            }
        });
        if (submittedCount >= session._count.players) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].session.update({
                where: {
                    id
                },
                data: {
                    status: "results",
                    resultsRevealedAt: now
                }
            });
            await computeInsights(id);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch (error) {
        console.error("Submit ranking error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to submit ranking"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c025d59a._.js.map