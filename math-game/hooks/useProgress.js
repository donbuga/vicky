import { useEffect, useState } from 'react';
const initial = { stars: 0, completed: [], bestStreak: 0, bestChallenge: 0 };
export function useProgress() { const [stats, setStats] = useState(() => { try {
    return { ...initial, ...JSON.parse(localStorage.getItem('math-adventure-progress') || '{}') };
}
catch {
    return initial;
} }); useEffect(() => localStorage.setItem('math-adventure-progress', JSON.stringify(stats)), [stats]); const finish = (world, correct, streak, challenge) => setStats(s => ({ ...s, stars: s.stars + correct, bestStreak: Math.max(s.bestStreak, streak), bestChallenge: challenge ? Math.max(s.bestChallenge, correct) : s.bestChallenge, completed: world && !s.completed.includes(world) ? [...s.completed, world] : s.completed })); return { stats, finish }; }
