import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ZoomIn, X } from 'lucide-react';

export const CampusShowcase: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ title: string; image: string } | null>(null);

  const galleryItems = [
    {
      title: 'Director Academic Orientation',
      image: '/ahcas-director-orientation-address.jpg',
      fallback: '/ahcas-orientation-speech.jpg'
    },
    {
      title: 'Matriculated Student Cohort',
      image: '/ahcas-orientation-students-cohort.jpg',
      fallback: '/ahcas-student-cohort.jpg'
    },
    {
      title: 'Coordinator at Official Dais',
      image: '/ahcas-coordinator-podium.jpg',
      fallback: '/ahcas-orientation-podium-full.jpg'
    },
    {
      title: 'Orientation Induction Lecture',
      image: '/ahcas-orientation-speech.jpg',
      fallback: '/ahcas-director-orientation-address.jpg'
    },
    {
      title: 'IJMB Interactive Lecture Hall',
      image: '/ahcas-classroom-lecture.jpg',
      fallback: '/campus-gate.jpg'
    }
  ];

  return (
    <section
      className="py-14 text-white"
      style={{ background: 'linear-gradient(180deg, #196855 0%, #196855 40%, #196855 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-bold font-serif relative inline-block pb-2">
            Gallery Peek
            <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#e69912]"></span>
          </h3>
        </div>

        {/* 5-item Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedPhoto(item)}
              className="relative h-36 rounded-md overflow-hidden shadow-md cursor-pointer group border-2 border-white/60 hover:border-[#e69912] transition-all bg-black/40"
            >
              <img
                src={item.image}
                alt={item.title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = item.fallback;
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-[#e69912] text-white flex items-center justify-center shadow-lg">
                  <ZoomIn size={18} />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-center">
                <span className="text-[10px] font-semibold text-white truncate block">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* More Photos Button */}
        <div className="text-center mt-8">
          <Link
            to="/gallery"
            className="btn-fill-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-md"
          >
            More Photos & Full Gallery...
          </Link>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-lg overflow-hidden border-2 border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#e69912] transition-colors"
            >
              <X size={18} />
            </button>
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              className="w-full max-h-[75vh] object-contain bg-black"
            />
            <div className="p-4 bg-[#196855] text-white flex justify-between items-center">
              <h4 className="font-bold text-sm sm:text-base font-serif">{selectedPhoto.title}</h4>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-xs bg-[#e69912] hover:bg-[#c98207] text-white px-3 py-1 rounded font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CampusShowcase;
