import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <header 
      className="relative h-64 md:h-80 lg:h-96 bg-cover bg-center" 
      style={{ backgroundImage: "url('/images/Ahmadu_bello_university_senate.jpg')" }}
    >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
            <Link href="/">
              <div className="text-center text-white px-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider mb-2">Dr. Abubakar Bokani</h1>
                <p className="text-sm md:text-base lg:text-lg text-gray-200">Senior Lecturer, Faculty of Law, Ahmadu Bello University</p>
              </div>
            </Link>
        </div>
    </header>
  );
};

export default Hero;