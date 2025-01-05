import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import "tailwindcss/tailwind.css";

const ClientDashboard: React.FC = () => {
  const [openCard, setOpenCard] = useState<string | null>(null);

  const toggleCard = (cardName: string) => {
    setOpenCard(openCard === cardName ? null : cardName);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Cover Photo */}
      <div className="w-full h-48 bg-sky-900 relative">
        <img
          src="https://via.placeholder.com/1500x500"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {/* Profile Picture */}
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-white rounded-full border-4 border-white overflow-hidden">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Content Section */}
      <div className="mt-20 w-3/4">
        {/* Collapsible Cards */}
        {[
          {
            title: "My Tasks",
            links: [],
          },
          {
            title: "Notifications",
            links: [],
          },
          {
            title: "Documents",
            links: [],
          },
        ].map((card, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleCard(card.title)}
              className="w-full bg-gray-200 px-4 py-2 text-left text-lg font-medium focus:outline-none focus:ring flex items-center"
            >
              <span>
                {openCard === card.title ? (
                  <ChevronDownIcon className="w-5 h-5" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5" />
                )}
              </span>
              {card.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;
