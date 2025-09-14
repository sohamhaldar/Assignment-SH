'use client'
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const phrases = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
];

// const Separator = () => (
//   <Image src="/star.svg" alt="|" width={20} height={20} className="mx-2" /> 
// );

export const LogoStrip=()=>{
  return (
    <div className='w-full flex items-center flex-wrap justify-between'>
      <div className="w-full py-2 overflow-hidden flex">
        <motion.div 
          className="flex items-center flex-shrink-0"
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...phrases, ...phrases].map((phrase, idx) => (
            <React.Fragment key={idx}>
              <span
                className="font-bold text-2xl text-[#FFA800] tracking-wide uppercase whitespace-nowrap"
                style={{ fontFamily: 'Folklore, sans-serif' }}
              >
                {phrase}
              </span>
            </React.Fragment>
          ))}
        </motion.div>
        <motion.div 
          className="flex items-center flex-shrink-0"
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...phrases, ...phrases].map((phrase, idx) => (
            <React.Fragment key={idx}>
              <span
                className="pr-20 font-bold text-2xl text-[#FFA800] tracking-wide uppercase whitespace-nowrap"
                style={{ fontFamily: 'Folklore, sans-serif' }}
              >
                {phrase}
              </span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  )
}