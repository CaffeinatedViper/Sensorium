import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedButton from './about_section/AnimatedButton';
import "../darkMode.css";
import axios from 'axios';

    const FeaturedPostsSection = ({openPost}) => {

      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await axios.get('https://sensorium.ii.agh.edu.pl/index.php/wp-json/wp/v2/posts?acf_format=standard');
            const allPosts = response.data;
            
            // Filter featured posts, sort by featured_position, and transform to match original structure
            const featuredPosts = allPosts
      .filter(post => post.acf && post.acf.featured)
      .sort((a, b) => (a.acf.featured_position || 0) - (b.acf.featured_position || 0))
      .map(post => {
        // Create a temporary element to parse the HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content.rendered;
    
        // Find all gallery elements
        const galleries = tempDiv.querySelectorAll('.gallery, .wp-block-gallery');
    
        // Extract image sources from galleries
        const gallerySources = Array.from(galleries).flatMap(gallery => 
          Array.from(gallery.querySelectorAll('img')).map(img => img.src)
        );
    
        // Combine gallery sources with existing album or use fallback
        const combinedAlbum = [
          ...(post.acf.album || []),
          ...gallerySources
        ];
    
        // If combinedAlbum is empty, use fallback
        const album = combinedAlbum.length > 0 
          ? combinedAlbum 
          : [post.acf.thumbnail || post.featured_media_url].filter(Boolean);
    
        return {
          id: post.id,
          title: post.acf.title,
          excerpt: post.acf.excerpt,
          content: post.acf.content,
          thumbnail: post.acf.thumbnail,
          album: album
        };
      });
            
            setPosts(featuredPosts);
            setLoading(false);
          } catch (err) {
            setError('Failed to fetch posts');
            setLoading(false);
          }
        };
    
        fetchPosts();
      }, []);


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2
          }
        }
      };
    
      const isInView = useInView(useRef(null), { once: false, margin: '-100px' });
    
      if (!Array.isArray(posts) || posts.length === 0) {
        return (
          <section id="posts" className="py-20 dark-mode">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold mb-12 text-center">Wyróżnione posty</h2>
              <p className="text-center ">Brak dostępnych postów.</p>
              <AnimatedButton isInView={isInView} text={"Zobacz wszystkie posty"} route={"/allPosts"}/>
            </div>
          </section>
        );
      }
    
      return (
        <section id="posts" className="py-20 w-full dark-mode flex justify-center">
          <div className="container px-4">
            <h2 className="font-heading text-7xl md:text-8xl font-bold mb-24 text-center ">Wyróżnione posty</h2>
            <motion.div 
              className="flex flex-col gap-8 md:gap-16"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {posts.map((post, index) => (
                <FeaturedPostItem 
                  key={post.id}
                  post={post}
                  index={index}
                  openPost={openPost}
                  isRight={index % 2 !== 0}
                />
              ))}
              <AnimatedButton isInView={isInView} text={"Zobacz wszystkie posty"} route={"/allPosts"}/>
            </motion.div>
          </div>
        </section>
      );
    };
    
    const FeaturedPostItem = ({ post, index, openPost, isRight }) => {
      const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: false
      });
    
      const thumbnailRef = useRef(null);
    
      const handleMouseMove = useCallback((e) => {
        const thumbnail = thumbnailRef.current;
        if (!thumbnail) return;
    
        const rect = thumbnail.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
    
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((centerX - x) / centerX) * 10;
    
        thumbnail.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          scale3d(1.05, 1.05, 1.05)
        `;
      }, []);
    
      const handleMouseLeave = useCallback(() => {
        const thumbnail = thumbnailRef.current;
        if (!thumbnail) return;
    
        thumbnail.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }, []);
    
      const itemVariants = {
        hidden: { opacity: 0, x: isRight ? 50 : -50 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
          }
        },
        exit: { 
          opacity: 0, 
          x: isRight ? 50 : -50,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
          }
        }
      };
    
      return (
        <motion.div
          ref={ref}
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          exit="exit"
          className={`cursor-pointer flex flex-col md:flex-row ${isRight ? 'md:flex-row-reverse md:justify-end' : 'md:justify-start'} items-center md:space-x-8`}
          onClick={() => openPost(post)}
        >
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <div 
              className="overflow-hidden rounded-lg mb-3 aspect-w-16 aspect-h-9"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                ref={thumbnailRef}
                className="w-full h-full transition-transform duration-300 ease-out"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img 
                  src={post.thumbnail} 
                  alt={post.title} 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 text-left">
          <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{post.title}</h3>
          <p className="text-sm md:text-base">{post.excerpt}</p>
          </div>
        </motion.div>
      );
    };

export default FeaturedPostsSection;