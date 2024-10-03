import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const PlacesSection = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const controls = useAnimation();
  const textRef = useRef(null);

  const headingVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 150, damping: 25, duration: 1.2 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.4 },
    }),
  };

  const checkInView = useCallback(() => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInView) {
        controls.start('visible');
      } else {
        controls.start('hidden');
      }
    }
  }, [controls]);

  useEffect(() => {
    window.addEventListener('scroll', checkInView);
    checkInView();

    return () => window.removeEventListener('scroll', checkInView);
  }, [checkInView]);

  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <motion.span key={index} variants={letterVariants} custom={index}>
        {char}
      </motion.span>
    ));
  };

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  useEffect(() => {
    if (expandedCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [expandedCard]);

  return (
    <section id="places" className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <motion.h2
            ref={textRef}
            className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 inline-block font-bold font-sans-serif"
            variants={headingVariants}
            animate={controls}
          >
            {splitText('Nasze miejsca')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">

          <LocationCard
            title="Sensorium_artlab"
            description="Galeria sztuki, w której prezentowane będą prace z nurtu art&science, dwóch pozornie różnych światów, które jednak doskonale współpracują, dając zaskakujące, nowatorskie projekty."
            fullDescription="Galeria sztuki, w której prezentowane będą prace z nurtu art&science, dwóch pozornie różnych światów, które jednak doskonale współpracują, dając zaskakujące, nowatorskie projekty. W przestrzeni zobaczymy prace artystów, inżynierów, naukowców, którzy eksplorują granice kreatywności i wiedzy. To miejsce ożywa dzięki nowym technologiom i artystycznym poszukiwaniom, tworząc dynamiczną przestrzeń dla kreatywnych eksploracji."
            details={[
              { label: 'Lokalizacja', value: 'Wydział Informatyki AGH, ul. Kawiory 21, Kraków' },
              { value: 'Galeria powstała we współpracy z AGH w Krakowie oraz Fundacją Nówka Sztuka.' },
            ]}
            images={[
              '/Low-res-Sensorium-1.jpg',
              '/Low-res-Sensorium-2.jpg',
              '/Low-res-Sensorium-3.jpg',
              '/Low-res-Sensorium-4.jpg',
              '/Low-res-Sensorium-5.jpg',
              '/Low-res-Sensorium-6.jpg',
              '/Low-res-Sensorium-7.jpg',
              '/Low-res-Sensorium-8.jpg',
            ]}
            isExpanded={expandedCard === 'Sensorium_artlab'}
            onClick={() =>
              setExpandedCard(expandedCard === 'Sensorium_artlab' ? null : 'Sensorium_artlab')
            }
          />

          <LocationCard
            title="Pałac sztuki w Krakowie"
            description="Pałac Sztuki w Krakowie jest siedzibą powstałego w 1854 r. Towarzystwa Przyjaciół Sztuk Pięknych."
            fullDescription="Pałac Sztuki w Krakowie jest siedzibą powstałego w 1854 r. Towarzystwa Przyjaciół Sztuk Pięknych. To zabytkowy budynek, który nie tylko prezentuje dzieła sztuki, ale także jest miejscem spotkań artystów i miłośników sztuki z całej Polski i poza jej granicami. Budynek łączy w sobie historię z nowoczesnością."
            details={[
              { label: 'Adres', value: 'Plac Szczepański 4, 31-011 Kraków' },
              { label: 'Tel/Fax', value: '+ 48 12 422 66 16' },
              { label: 'Godziny otwarcia', value: 'Wt-Pt: 10-18, Sb-Nd: 10-18' },
              { label: 'Strona', value: 'http://palac-sztuki.krakow.pl', isLink: true },
            ]}
            images={[
              '/Low-res-Palac-1.jpg',
              '/Low-res-Palac-2.jpg',
              '/Low-res-Palac-3.jpg',
              '/Low-res-Palac-4.jpg',
              '/Low-res-Palac-5.jpg',
              '/Low-res-Palac-6.jpg',
              '/Low-res-Palac-7.jpg',
              '/Low-res-Palac-8.jpg',
            ]}
            isExpanded={expandedCard === 'Pałac sztuki w Krakowie'}
            onClick={() =>
              setExpandedCard(
                expandedCard === 'Pałac sztuki w Krakowie' ? null : 'Pałac sztuki w Krakowie'
              )
            }
          />
        </div>
      </div>
    </section>
  );
};

const LocationCard = ({
  title,
  description,
  fullDescription,
  details,
  images,
  isExpanded,
  onClick,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.03, y: -10 },
    expanded: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let timeout;
    if (isExpanded && images.length > 1) {
      timeout = setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [isExpanded, images.length, currentImageIndex]);

  const handleImageNavigation = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    if (direction === 'prev') {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    } else {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  return (
    <motion.div
      layout
      variants={containerVariants}
      initial="hidden"
      animate={isExpanded ? 'expanded' : 'visible'}
      whileHover={isExpanded ? {} : 'hover'}
      transition={{ duration: 0.3 }}
      onClick={!isExpanded ? onClick : null}
      className={`
        rounded-xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer
        ${
          isExpanded
            ? 'fixed inset-0 z-50 m-auto w-[90vw] h-[90vh] max-w-6xl max-h-[90vh] bg-gray-900'
            : 'relative border-2'
        }
      `}
      style={{
        backgroundColor: '#1c1c1c',
        borderColor: isExpanded ? 'transparent' : '#1c1c1c',
      }}
    >
      <motion.div
        layout
        className={`relative ${isExpanded ? 'h-[70%]' : 'h-[400px]'}`}
        onClick={(e) => isExpanded && handleImageNavigation(e, 'next')}
      >
        {isExpanded && images.length > 1 ? (
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={images[currentImageIndex]}
                src={images[currentImageIndex]}
                alt={`${title} ${currentImageIndex + 1}`}
                className="w-full h-full object-cover rounded-t-xl absolute top-0 left-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
              />
            </AnimatePresence>
            <button
              onClick={(e) => handleImageNavigation(e, 'prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75"
              aria-label="Poprzedni obraz"
            >
              &#10094;
            </button>
            <button
              onClick={(e) => handleImageNavigation(e, 'next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-75"
              aria-label="Następny obraz"
            >
              &#10095;
            </button>
          </div>
        ) : (
          <img src={images[0]} alt={title} className="w-full h-full object-cover" loading="lazy" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-6">
          <h3 className="text-4xl lg:text-5xl font-bold text-white">{title}</h3>
        </div>
      </motion.div>
      <motion.div
        layout
        className={`p-4 flex-grow flex flex-col ${isExpanded ? 'overflow-y-auto' : ''}`}
      >
        <p className="text-gray-200 text-base mb-2 flex-grow">
          {isExpanded ? fullDescription : description}
        </p>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-1 mt-2"
          >
            {Array.isArray(details) &&
              details.map((detail, index) => (
                <p key={index} className="text-gray-200 text-sm">
                  {detail.label && <span className="font-semibold">{detail.label}: </span>}
                  {detail.isLink ? (
                    <a
                      href={detail.value}
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </p>
              ))}
          </motion.div>
        )}
      </motion.div>
      {isExpanded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="absolute top-4 right-4 text-white text-4xl focus:outline-none hover:text-gray-300"
          aria-label="Zamknij"
        >
          &times;
        </button>
      )}
    </motion.div>
  );
};

export default PlacesSection;