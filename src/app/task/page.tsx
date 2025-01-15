"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/organisms/SearchBarTask";
import ProfileHeader from "@/components/organisms/ProfileHeader";
import Sidebar from "@/components/sidebar";
import { DataTable } from "./data-table";
import { NewTaskModal } from "@/components/organisms/NewTaskModal";
import ProtectedRoute from "@/components/protected-route";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  team: string;
  skill: string;
  role: string;
  currentWorkload: number;
  startDate: string;
  avatar?: string;
}

interface Task {
  task_Id: string;
  type: string;
  description: string;
  status: string;
  workload: number;
  start_Date: string;
  end_Date: string;
  employee_Id: string;
  user_Id: string;
}

interface ApiResponse {
  data: {
    employee_Id: string;
    name: string;
    email: string;
    phone: string;
    team: string;
    skill: string;
    role: string;
    current_Workload: number;
    start_Date: string;
    image?: string;
    tasks: Task[];
    techStacks: string[];
  };
  error: null | string;
}

export default function TaskPageId() {
  const router = useRouter();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get<ApiResponse>(
          `https://be-icpworkloadmanagementsystem.up.railway.app/api/emp/read/${id}`
        );

        const result = response.data;

        if (result.error) {
          setError(result.error);
          console.error("API Error:", result.error);
          return;
        }

        if (result.data) {
          const user = result.data;

          // Set employee data
          setSelectedEmployee({
            id: user.employee_Id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            team: user.team,
            skill: user.skill,
            role: user.role,
            currentWorkload: user.current_Workload,
            startDate: user.start_Date,
            avatar: user.image || "/placeholder-avatar.png",
          });

          // Set tasks data
          setTasks(user.tasks || []);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        console.error("Failed to fetch employee data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  const refreshTasks = async () => {
    if (!id) return;

    const response = await axios.get<ApiResponse>(
      `https://be-icpworkloadmanagementsystem.up.railway.app/api/emp/read/${id}`
    );

    const result = response.data;
    if (result.data?.tasks) {
      setTasks(result.data.tasks);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        `https://be-icpworkloadmanagementsystem.up.railway.app/api/emp/read/${id}`
      );

      if (response.data.data?.tasks) {
        setTasks(response.data.data.tasks);
      }

      refreshTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  if (error) {
    return (
      <div className="flex h-screen bg-stale-50">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (

    <div className="flex h-screen bg-stale-50">
      <Sidebar />
      <div className="flex-grow overflow-auto flex items-start justify-center">
        <div className="flex-1 max-h-screen w-[80vw] ml-[0.417vw] py-[1vw] px-[1.667vw] space-y-[1.25vw]">
          <SearchBar />

          {selectedEmployee && (
            <ProfileHeader employee={selectedEmployee} showEditButton={false} />
          )}

          <div className="bg-white rounded-lg shadow">
            <div className="px-[1.25vw] py-[0.625vw]">
              <div className="flex justify-between items-center mb-[0.833vw]">
                <h3 className="text-[1.25vw] ml-[0.833vw] mt-[1.25vw] font-medium">
                  On Going Task
                </h3>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-green-500 hover:bg-green-600 text-white text-[0.8vw] px-[0.833vw] h-[2.5vw] mr-[0.833vw] mt-[1.25vw] rounded-[0.5vw]"
                >
                  Assign New Task
                </Button>
              </div>

              <div className="rounded-lg p-[0.833vw]">
                <DataTable 
                  tasks={tasks} 
                  isLoading={isLoading} 
                  onTaskUpdate={refreshTasks} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewTaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskSubmit={handleSubmit}
      />
    </div>

  );
}
