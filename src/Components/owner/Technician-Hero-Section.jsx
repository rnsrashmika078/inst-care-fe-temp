import BG from '../../assets/images/technician-hero-bg-5.jpg';
import Technician from '../../assets/images/Technician-image-1.jpg';

export default function TechnicianHeader({ searchTerm, setSearchTerm }) {
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={BG} alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-white/70 z-10" />

      <div className="relative z-20 container mx-auto px-4 pt-8 pb-4 lg:pt-10 lg:pb-6">
        <div className="grid lg:grid-cols-2 gap-4 items-center min-h-[50vh]">
          {/* Left Content */}
          <div className="space-y-4 lg:space-y-12 order-2 lg:order-1">
            <p className="text-lg md:text-xl font-medium text-gray-700">
              Skilled professionals, passionate about precision and performance.
            </p>
            <h1 className="text-8xl font-black text-gray-900 mt-10">
              Find Your Technicians
            </h1>

            {/* Search Bar */}
            <div className="flex flex-wrap w-full max-w-5xl mx-auto p-2 gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm} // controlled input
                  onChange={handleInputChange}
                  placeholder="Search Instrument or Technician"
                  className="w-full border-2 rounded-md px-4 py-2 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]">
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
                <img src={Technician} alt="Technician" className="object-cover w-full h-full" />
              </div>
              <div className="absolute -inset-4 rounded-full border-2 border-white/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
