import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { CardBody, CardContainer, CardItem } from "./3d-card";
import "@fontsource/inter";
import { FlipWords } from "./flip-words";
import "../arrow.css"
import { ArrowDown } from 'lucide-react';

const ParallaxStars = () => {
  const [stars, setStars] = useState([]);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const generateStars = () => {
      const starCount = 250;
      return Array.from({ length: starCount }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 130,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        speedX: Math.random() * 0.05 + 0.02,
        speedY: Math.random() * 0.03 + 0.01
      }));
    };

    setStars(generateStars());

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateStars = () => {
      setStars(prevStars => 
        prevStars.map(star => {
          let newX = star.x + star.speedX;
          let newY = star.y + star.speedY;

          if (newX > 100 || newY > 130) {
            if (Math.random() < 0.3) {
              newX = Math.random() * 100;
              newY = -5;
            } else {
              newX = -5;
              newY = Math.random() * 130;
            }
            star.speedX = Math.random() * 0.05 + 0.02;
            star.speedY = Math.random() * 0.03 + 0.01;
          }

          return {
            ...star,
            x: newX,
            y: newY
          };
        })
      );

      if (containerRef.current) {
        const speed = 0.05;
        const x = (window.innerWidth - mouseX * speed) / 100;
        const y = (window.innerHeight - mouseY * speed) / 100;
        containerRef.current.style.transform = `translateX(${x}px) translateY(${y}px)`;
      }

      animationRef.current = requestAnimationFrame(animateStars);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animateStars();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ height: '130vh' }}>
      <div ref={containerRef} className="absolute inset-0" style={{ height: '130vh' }}>
        {stars.map((star, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 corner-vignette" style={{ height: '130vh' }}></div>
    </div>
  );
};

const Card = ({ title, description, imageUrl, index }) => {
  const cardRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(
    scrollYProgress,
    [0, 0.3],
    [index % 2 === 0 ? '-100%' : '100%', 0]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ 
        x,
        opacity,
      }}
      className="w-full mb-16"
    >
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black w-full h-auto rounded-xl p-8 font-inter border border-white/[0.2]">
          <div className="max-w-6xl mx-auto">
            <CardItem
              translateZ="50"
              className="text-4xl font-bold text-neutral-600 dark:text-white"
            >
              {title}
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-xl mt-4 dark:text-neutral-300"
            >
              {description}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-8">
              <img
                src={imageUrl}
                className="w-full h-[400px] object-cover rounded-xl group-hover/card:shadow-xl"
                alt={title}
              />
            </CardItem>
            <div className="flex justify-center items-center mt-12">
              <CardItem
                translateZ={20}
                as="button"
                className="px-8 py-4 rounded-xl bg-white text-black text-lg font-bold hover:bg-gray-200 transition-colors"
              >
                Dowiedz się więcej
              </CardItem>
            </div>
          </div>
        </CardBody>
      </CardContainer>
    </motion.div>
  );
};

const HomeSection = ({videoRef, scrollToSection}) => {
  const titleControls = useAnimation();
  const { scrollYProgress } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    titleControls.start({
      opacity: 1,
      transition: { duration: 2, ease: "easeOut" }
    });

    const unsubscribe = scrollYProgress.onChange((value) => {
      console.log('Scroll progress:', value);
    });

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [titleControls, scrollYProgress]);

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 1,
        ease: "easeOut"
      }
    })
  };

  const flipWords = [
    "Odkryj nowe wymiary sztuki",
    "Poznaj naukę",
    "Doświadcz sztuki",
    "Połącz zmysły"
  ];

  return (
    <div className="bg-[#001e28] text-white overflow-hidden">
      <div className="relative min-h-[130vh]">
        <ParallaxStars />
        <div className="absolute inset-0 flex flex-col items-center justify-center h-screen">
          <motion.h1 
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold text-center leading-none tracking-tighter z-10 mb-8 px-4"
            initial={{ opacity: 0 }}
            animate={titleControls}
          >
            {"SENSORIUM".split('').map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center z-20 px-4 text-white">
  <FlipWords words={flipWords} duration={2000} />
</div>
          {!hasScrolled && (
            <ArrowDown 
              className={`text-white animate-bounce ${hasScrolled ? 'fade-out' : 'fade-in'}`} 
              onClick={() => scrollToSection('infoCards')} 
              style={{
                position: "absolute",
                left: "50%",
                bottom: "4rem",
                transform: "translateX(-50%)",
                width: "2rem",
                height: "2rem",
                color: "white",
                cursor: "pointer",
                opacity: 0.8
              }}
            />
          )}
        </div>
      </div>
      <div className="w-full px-4 py-16 bg-black relative">
        <svg className="absolute top-0 left-0 w-full h-32 transform -translate-y-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polygon points="0,100 100,0 100,100" fill="#000000" />
        </svg>
        <div id="infoCards" className="flex flex-col md:flex-row justify-center items-stretch gap-16">
          <Card 
            title="Sztuka w Sensorium"
            description="Odkryj nowatorskie postawy artystyczne na styku technologii i kultury."
            imageUrl="https://images.unsplash.com/photo-1558865869-c93f6f8482af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2081&q=80"
            index={0}
          />
          <Card 
            title="Nauka w Sensorium"
            description="Zgłęb fascynujący świat badań naukowych w kontekście sztuki i nauki."
            imageUrl="https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            index={1}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeSection;