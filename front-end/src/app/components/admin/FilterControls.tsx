'use client';

type Props = {
    filterThisWeek: boolean;
    setFilterThisWeek: (value: boolean) => void;
    filterRoom: string;
    setFilterRoom: (value: string) => void;
    sortBy: string;
    setSortBy: (value: 'created_at' | 'check_in' | 'check_out') => void;
    uniqueRooms: string[];
};

export default function FilterControls({
    filterThisWeek,
    setFilterThisWeek,
    filterRoom,
    setFilterRoom,
    sortBy,
    setSortBy,
    uniqueRooms
}: Props) {
    return (
        <div className="flex flex-wrap gap-4 items-center mb-6">
            <label className="flex items-center gap-2 text-sm font-medium">
                <input
                    type="checkbox"
                    checked={filterThisWeek}
                    onChange={() => setFilterThisWeek(!filterThisWeek)}
                />
                Show Check-in This Week Only
            </label>

            <select
                className="border rounded px-3 py-1 text-sm"
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
            >
                <option value="all">All Rooms</option>
                {uniqueRooms.map((room) => (
                    <option key={room} value={room}>
                        {room}
                    </option>
                ))}
            </select>

            <select
                className="border rounded px-3 py-1 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'created_at' | 'check_in' | 'check_out')}
            >
                <option value="created_at">Sort by Created At</option>
                <option value="check_in">Sort by Check-In</option>
                <option value="check_out">Sort by Check-Out</option>
            </select>
        </div>
    );
}
