import { Veterinaries } from "../../utils/schema";
import VeterinaryCard from "./VeterinaryCard";

type VeterinariesListProps = {
  veterinaries?: Veterinaries;
  getVeterinaryId: (id: number) => void;
};

const VeterinariesList = ({ veterinaries, getVeterinaryId }: VeterinariesListProps) => {
  return (
    <div className="mt-5 flex flex-col gap-5 xl:flex-row">
      {veterinaries?.map((veterinary) => (
        <VeterinaryCard
          key={veterinary.id}
          veterinary={veterinary}
          getVeterinaryId={getVeterinaryId}
        />
      ))}
    </div>
  );
};

export default VeterinariesList;
