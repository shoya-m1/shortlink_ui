import React, { useEffect, useState } from "react";
import { getUserLevels } from "./auth";
import { Trophy, TrendingUp, Lock, Unlock, Star } from "lucide-react";

const UserLevelsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getUserLevels();
                setData(result);
                console.log(result);
            } catch (error) {
                console.error("Failed to fetch user levels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-6 text-center">Loading levels...</div>;
    }

    if (!data) {
        return <div className="p-6 text-center text-red-500">Failed to load data.</div>;
    }

    const { card, levels } = data;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                My Level Progress
            </h1>

            {/* Current Level Card */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1">
                        <div className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">Current Status</div>
                        <div className="text-4xl font-bold mb-2">{card.current_level}</div>
                        <div className="flex items-center gap-2 text-indigo-100">
                            <Star className="w-5 h-5 fill-current text-yellow-300" />
                            <span>CPM Bonus: <strong>{card.current_level_cpm}%</strong></span>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Progress to {card.next_level_id || "Max Level"}</span>
                            <span className="font-bold">{card.progress_percent}%</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-4 mb-2">
                            <div
                                className="bg-yellow-400 h-4 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                style={{ width: `${card.progress_percent}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-indigo-200 flex justify-between">
                            <span>${card.current_earnings} earned</span>
                            {card.next_level_min > 0 && (
                                <span>Target: ${card.next_level_min}</span>
                            )}
                        </div>
                        {card.needed_to_next_level > 0 && (
                            <div className="mt-2 text-sm bg-white/10 inline-block px-3 py-1 rounded-lg">
                                🚀 Need <strong>${card.needed_to_next_level}</strong> more to level up!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Levels List */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Level Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {levels.map((level, index) => (
                    <div
                        key={index}
                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${level.locked
                                ? "bg-gray-50 border-gray-200 text-gray-500"
                                : "bg-white border-indigo-100 shadow-md hover:shadow-lg hover:border-indigo-300"
                            }`}
                    >
                        <div className="flex text-gray-700 justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${level.locked ? 'bg-gray-200' : 'bg-indigo-100 text-indigo-600'}`}>
                                <Trophy className="w-6 h-6" />
                            </div>
                            {level.locked ? (
                                <Lock className="w-5 h-5 text-gray-400" />
                            ) : (
                                <Unlock className="w-5 h-5 text-green-500" />
                            )}
                        </div>

                        <h3 className="text-lg font-bold mb-1 text-gray-700">{level.title}</h3>
                        <div className="text-sm text-gray-700 mb-4">
                            {level.locked ? "Locked" : "Unlocked"}
                        </div>

                        <div className="space-y-3">
                            <div className="flex text-gray-700 justify-between items-center text-sm">
                                <span>Min Earnings</span>
                                <span className="font-mono font-medium">${level.min_earnings}</span>
                            </div>
                            <div className="flex text-gray-700 justify-between items-center text-sm">
                                <span>CPM Bonus</span>
                                <span className={`font-bold ${level.locked ? '' : 'text-green-600'}`}>
                                    +{level.cpm_bonus_percent}%
                                </span>
                            </div>
                        </div>

                        {!level.locked && card.current_level === level.title && (
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                CURRENT
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserLevelsPage;
