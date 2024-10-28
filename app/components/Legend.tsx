const Legend = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="size-4 rounded-full bg-blue-500"></span>
        <p className="text-sm lg:text-base">Clinique vétérinaire de jour</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-4 rounded-full bg-red-600"></span>
        <p className="text-sm lg:text-base">Clinique vétérinaire d&apos;urgence 24h/7</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-4 rounded-full bg-green-500"></span>
        <p className="text-sm lg:text-base">Clinique sélectionnée</p>
      </div>
    </div>
  );
};

export default Legend;
