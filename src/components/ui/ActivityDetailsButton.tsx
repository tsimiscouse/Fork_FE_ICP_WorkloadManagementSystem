import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ActivityDetailsButtonProps {
  employeeId: string;  // Changed from taskId to employeeId
}

const ActivityDetailsButton: React.FC<ActivityDetailsButtonProps> = ({ employeeId }) => {
  return (
    <Link
      href={`/activity/${employeeId}`}  // Changed from /activity/${taskId} to /task/${employeeId}
      className="w-full bg-[#40BFFF] hover:bg-[#2CB5FF] text-white py-[0.625vw] px-[0.625vw] rounded-[0.625vw] flex items-center justify-between transition-colors duration-200"
    >
      <span className="text-[1vw] px-[1vw] font-medium">See Task Details</span>
      <ChevronRight className="w-[0.833vw] h-[0.833vw]" />
    </Link>
  );
};

export default ActivityDetailsButton;