import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../darkMode.css";

const TeamSection = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimation();
  const textRef = useRef(null);
  const imageContainerRef = useRef(null);

  const headingVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 150, damping: 25, duration: 1.2 } },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 },
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
      <motion.span
        key={index}
        variants={letterVariants}
        custom={index}
      >
        {char}
      </motion.span>
    ));
  };

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Prof. Alicja Panasiewicz",
      role: "Profesor sztuki, Artystka wizualna",
      image: "/osoba_1.png",
      description:
        'Absolwentka ASP w Krakowie, specjalizuje się w instalacjach multimedialnych. Wykładowca na UP w Krakowie, organizatorka targów "Nówka Sztuka".',
    },
    {
      id: 2,
      name: "Prof. Aleksander Byrski",
      role: "Profesor nauk informatycznych",
      image: "/osoba_2.png",
      description:
        "Zastępca Dziekana ds. Współpracy na Wydziale Informatyki AGH. Specjalista w obliczeniach metaheurystycznych i systemach agentowych.",
    },
    {
      id: 3,
      name: "Prof. Jacek Wachowski",
      role: "Profesor nauk humanistycznych",
      image: "/osoba_3.png",
      description:
        "Profesor w Katedrze Teatru i Sztuki Mediów UAM. Specjalista w performatyce i komunikacji społecznej.",
    },
  ];

  const handleMemberClick = (member) => {
    setDirection(selectedMember && selectedMember.id < member.id ? 1 : -1);
    setTimeout(() => {
      if (selectedMember && selectedMember.id === member.id) {
        setSelectedMember(null);
        return;
      }
      setSelectedMember(member);
    }, 50);
  };

  const waveVariants = {
    enter: (direction) => ({
      scale: 0.8,
      y: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: (direction) => ({
      scale: 0.8,
      y: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  const handleMouseMove = (e) => {
    if (imageContainerRef.current) {
      const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      const tiltX = y * 30; // Zwiększono do 30 stopni
      const tiltY = -x * 30; // Zwiększono do 30 stopni
      const scale = 1.05; // Dodano efekt powiększenia

      imageContainerRef.current.style.transform = `
        perspective(1000px) 
        rotateX(${tiltX}deg) 
        rotateY(${tiltY}deg)
        scale(${scale})
        translateZ(50px)
      `;
      imageContainerRef.current.style.boxShadow = `
        ${-tiltY * 2}px ${-tiltX * 2}px 20px rgba(0,0,0,0.2)
      `;
    }
  };

  const handleMouseLeave = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
      imageContainerRef.current.style.boxShadow = 'none';
    }
  };

  return (
    <section id="team" className="py-20 dark-mode">
      <div className="container mx-auto px-4">
        <div className="text-center mb-40">
          <motion.h2
            ref={textRef}
            className="font-heading text-7xl md:text-9xl mb-6 inline-block font-bold"
            variants={headingVariants}
            animate={controls}
          >
            {splitText('Nasz zespół')}
          </motion.h2>
        </div>
        <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-12">
          {/* Left side - Image */}
          {!isMobile && (
            <div
              className="w-3/4 h-full md:w-1/2 relative overflow-visible rounded-lg"
              style={{ height: "450px" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                ref={imageContainerRef}
                className="w-full h-full" 
                style={{ 
                  perspective: "1000px",
                  transition: "all 0.3s ease-out",
                  transformStyle: "preserve-3d"
                }}
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={selectedMember ? selectedMember.id : "placeholder"}
                    src={selectedMember ? selectedMember.image : "/placeholder.png"}
                    alt={selectedMember ? selectedMember.name : "Select a team member"}
                    className="w-full h-full object-contain absolute top-0 left-0"
                    variants={waveVariants}
                    custom={direction}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{
                      filter: "grayscale(100%)",
                      backfaceVisibility: "hidden"
                    }}
                  />
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Right side - Names and Info */}
          <div className="w-full md:w-1/2">
            <ul className="space-y-4">
              {teamMembers.map((member) => (
                <li key={member.id} className="team-member">
                  <button
                    onClick={() => handleMemberClick(member)}
                    className={`text-left w-full p-4 rounded-lg transition-all ${
                      selectedMember && selectedMember.id === member.id
                        ? "bg-gray-200 text-gray-800"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex flex-start items-center">
                      {selectedMember && selectedMember.id === member.id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                      <h3 className="text-xl font-semibold pl-6">
                        {member.name}
                      </h3>
                    </div>
                    {selectedMember && selectedMember.id === member.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="text-gray-600 mt-2">{member.role}</p>
                        <p className="text-gray-700 mt-2">
                          {member.description}
                        </p>
              
                        {/* Mobile Photo */}
                        {isMobile && (
                          <div
                            className="w-full h-full md:w-1/2 relative overflow-hidden rounded-lg flex justify-center"
                            style={{ height: "450px" }}
                          >
                            <div
                              className="w-full h-full"
                              style={{ perspective: "1000px" }}
                            >
                              <img
                                key={selectedMember ? selectedMember.id : "placeholder"}
                                src={selectedMember ? selectedMember.image : "/placeholder.png"}
                                alt={selectedMember ? selectedMember.name : "Select a team member"}
                                className="w-full h-full object-contain absolute top-0 left-0"
                                style={{
                                  filter: "grayscale(100%)",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;