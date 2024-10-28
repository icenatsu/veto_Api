"use client"
import { useState } from "react";

type SearchbarProps = {
  onSearch: (searchQuery: string) => void;
};

const Searchbar = ({ onSearch }: SearchbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      value={searchQuery}
      onChange={handleChange}
      placeholder="Nom, ville ou code postal"
      className="w-full rounded-3xl border px-4 py-2"
    />
  );
};

export default Searchbar;
