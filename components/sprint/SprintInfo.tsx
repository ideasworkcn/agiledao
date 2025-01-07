
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sprint } from "@/types/Model";

interface SprintInfoProps {
    sprint: Sprint;
    deleteSprintById: (id: string) => void;
    setSprint: (sprint: Sprint) => void;
    saveSprint: () => void;
}

function SprintInfo({
    sprint,
    deleteSprintById,
    setSprint,
    saveSprint,
}: SprintInfoProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSprint({ ...sprint, [name]: value });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-2xl font-semibold flex w-full sm:w-xl items-center">
                    <Input
                        name="name"
                        className="outline-none border-none focus:outline-none px-0 text-gray-900 text-2xl font-semibold w-full min-w-fit"
                        type="text"
                        onChange={handleInputChange}
                        placeholder="Sprint Name"
                        value={sprint.name || ""}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={saveSprint}
                        className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors w-full sm:w-auto"
                    >
                        保存 Sprint
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (window.confirm("确定要删除这个 Sprint 吗？删除后无法恢复")) {
                                deleteSprintById(sprint.id);
                            }
                        }}
                        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                    >
                        删除 Sprint
                    </Button>
                </div>
            </div>
            <Input
                name="goal"
                className="outline-none border-none focus:outline-none px-0 text-lg w-full"
                type="text"
                onChange={handleInputChange}
                placeholder="Sprint 目标"
                value={sprint.goal || ""}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { label: "开始时间", key: "start_date", type: "date" },
                    { label: "结束时间", key: "end_date", type: "date" },
                    {
                        label: "每日站会",
                        key: "daily_standup",
                        placeholder: "输入每日站会时间地点",
                    },
                    {
                        label: "评审会议",
                        key: "sprint_review",
                        placeholder: "输入评审时间地点",
                    },
                ].map(({ label, key, type, placeholder }) => (
                    <div key={key} className="space-y-2">
                        <label htmlFor={key} className="text-sm font-medium text-gray-700">
                            {label}
                        </label>
                        <Input
                            id={key}
                            name={key}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            type={type || "text"}
                            placeholder={placeholder}
                            value={String(sprint[key as keyof Sprint] || "")}
                            onChange={handleInputChange}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
export default SprintInfo;