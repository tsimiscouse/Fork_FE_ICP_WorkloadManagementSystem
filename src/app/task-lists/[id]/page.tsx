"use client";

import { useState, useEffect, use } from "react";
import Sidebar from "@/components/sidebar";
import TaskTimeline from "@/components/organisms/tasks-list-calendar";
import TaskListTimeline from "@/components/organisms/TasklistTimeline";
import { Task } from "@/components/organisms/types/tasks";
import { TaskDetails } from "@/components/organisms/TaskDetails";
import LoadingScreen from "@/components/organisms/LoadingScreen";
import ProtectedRoute from "@/components/protected-route";

interface Employee {
  employee_Id: string;
  name: string;
  image?: string;
  email?: string;
  team?: string;
  skill?: string;
  phone?: string;
  current_Workload: number;
}

interface ApiTask {
  task_Id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  priority: string;
  workload: number;
  start_Date: string;
  end_Date: string;
  user_Id: string;
  assigns?: Array<{
    employee_Id: string;
    employee: Employee;
  }>;
}

function convertApiTaskToTask(apiTask: ApiTask): Task {
  return {
    id: apiTask.task_Id,
    title: apiTask.title,
    startDate: new Date(apiTask.start_Date),
    endDate: new Date(apiTask.end_Date),
    workload: apiTask.workload.toString(),
    urgency:
      apiTask.priority.toLowerCase() === "high"
        ? "critical"
        : apiTask.priority.toLowerCase() === "medium"
        ? "high"
        : "normal",
    description: apiTask.description,
    priority: (
      parseInt(
        apiTask.priority === "High"
          ? "8"
          : apiTask.priority === "Medium"
          ? "5"
          : "2"
      ) + Math.random()
    ).toFixed(1),
    status: apiTask.status as "Ongoing" | "Done" | "Approved",
  };
}

export default function TaskLists({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const empId = resolvedParams.id; // Use the resolved params
        const response = await fetch(
          `https://be-icpworkloadmanagementsystem.up.railway.app/api/task/emp/read/${empId}`
        );
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        console.log("API Response:", data);

        // Check if data is in the expected format and handle the response structure
        const apiTasks: ApiTask[] = Array.isArray(data.data)
          ? data.data
          : data.data || [];
        const convertedTasks = apiTasks.map(convertApiTaskToTask);
        setTasks(convertedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [resolvedParams.id]);

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleStatusUpdate = (
    taskId: string,
    newStatus: "Ongoing" | "Done" | "Approved"
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    if (selectedTask?.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-stale-50">
        <Sidebar />
        <div className="flex-grow overflow-auto flex items-start justify-center">
          <div className="w-[65vw] flex-1  h-screen ml-[0.417vw] py-[1vw]  space-y-[1.25vw]">
            <TaskTimeline
              selectedTask={selectedTask}
              onTaskSelect={handleTaskSelect}
              tasks={tasks}
              statusFilter={statusFilter}
            />
            <TaskDetails
              selectedTask={selectedTask}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
          <div className="w-[15vw]  h-full ml-[0.417vw] py-[1vw] space-y-[1.25vw]">
            <TaskListTimeline
              onTaskSelect={handleTaskSelect}
              tasks={tasks}
              statusFilter={statusFilter}
              onStatusFilter={handleStatusFilter}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
