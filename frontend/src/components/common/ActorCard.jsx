function ActorCard({ actor }) {
  const { name, character, photo } = actor;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02]">
      <img
        src={photo}
        alt={`Фото актора ${name}`}
        className="w-full h-40 object-contain" // Змінено на object-contain
      />

      <div className="p-3">
        <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{character}</p>
      </div>
    </div>
  );
}

export default ActorCard;