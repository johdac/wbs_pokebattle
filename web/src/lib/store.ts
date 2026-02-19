const ROSTER_KEY = "pokemon-roster";
export const getRoster = (): number[] => {
  const data = localStorage.getItem(ROSTER_KEY);
  return data ? JSON.parse(data) : [];
};

export const addToRoster = (id: number): boolean => {
  const roster = getRoster();
  if (roster.includes(id)) return false;
  roster.push(id);
  localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
  return true;
};

export const removeFromRoster = (id: number): void => {
  const roster = getRoster().filter((pid) => pid !== id);
  localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
};

export const isInRoster = (id: number): boolean => {
  return getRoster().includes(id);
};

// export const getLeaderboard = (): LeaderboardEntry[] => {

// };
