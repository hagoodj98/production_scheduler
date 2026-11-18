'use client';
import LoginAuth from './LoginAuth';

const Header = () => {
  return (
    <div className="flex items-center justify-between bg-black p-2">
      <h2 className="text-[#FFBB28] text-2xl">Production Scheduler</h2>
      <LoginAuth />
    </div>
  );
};

export default Header;
