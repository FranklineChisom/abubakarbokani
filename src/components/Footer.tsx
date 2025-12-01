import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
                <div className="text-center w-full">
                    <p>© {new Date().getFullYear()} Dr. Abubakar Bokani</p>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;