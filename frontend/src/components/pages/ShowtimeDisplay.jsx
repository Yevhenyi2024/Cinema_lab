import React from 'react';

function ShowtimeDisplay({ showtimes }) {
    if (!showtimes || !Array.isArray(showtimes) || showtimes.length === 0) {
        return <p className="text-gray-500">Немає доступних сеансів.</p>;
    }

    return (
        <div className="space-y-4">
            {showtimes.map(showtime => (
                <div key={showtime.id} className="p-4 border rounded-md shadow-sm bg-gray-50 flex flex-col sm:flex-row justify-between items-center">
                    <div>
                        <p className="text-md text-gray-800 font-semibold">
                            Час: {showtime.time} | Зал: {showtime.hall} | Ціна: {showtime.price} грн
                        </p>
                     </div>
                    <button className="btn btn-primary mt-2 sm:mt-0">Купити квиток</button>
                </div>
            ))}
        </div>
    );
}

export default ShowtimeDisplay;