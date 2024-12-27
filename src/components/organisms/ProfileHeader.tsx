import { Card, CardContent } from "@/components/ui/card";
import EditEmployeeModal from "./EditEmployeeModal";

export default function ProfileHeader({ employee }: any) {
  const handleUpdateEmployee = (updatedData: any) => {
    // Implement your update logic here
    console.log('Updated employee data:', updatedData);
  };

  return (
    <Card className="bg-[#0A1D56]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-100 overflow-hidden">
              {/* Add avatar image here */}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">{employee.name}</h2>
              <p className="text-slate-300">ID-{employee.id}</p>
              <div className="text-slate-300 mt-4">
                <div className="grid grid-cols-[100px_1fr]">
                  <span>Team</span>
                  <span>: {employee.team}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr]">
                  <span>Role</span>
                  <span>: {employee.role}</span>
                </div>
              </div>
            </div>
          </div>
          <EditEmployeeModal 
            employee={employee}
            onUpdate={handleUpdateEmployee}
          />
        </div>
      </CardContent>
    </Card>
  );
}