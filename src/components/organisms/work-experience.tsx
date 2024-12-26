import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const calculateExperience = (joinDate) => {
  const start = new Date(joinDate);
  const today = new Date();
  
  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months };
};

const WorkExperience = ({ experience }) => {
  const { years, months } = calculateExperience(experience.joinDate);
  
  return (
    <Card className="bg-[#0A1D56] h-[160px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-white">Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-white">{experience.role}</h3>
            <Badge variant="secondary" className="text-xs">
              {experience.classification}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-200">
              Join Date: {new Date(experience.joinDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-200">
              Duration: {years} Year{years !== 1 ? 's' : ''}, {months} Month{months !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkExperience;