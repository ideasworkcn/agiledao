"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { UserStory,Feature } from "@/types/Model";
import { Toaster } from "@/components/ui/toaster";
import EditableDataGrid from "@/components/backlog/EditableDataGrid";
import { useRouter } from "next/navigation";

interface Column {
  key: keyof UserStory;
  name: string;
  width: string;
  editable?: boolean;
  resizable?: boolean;
  sortable?: boolean;
  type?: 'string' | 'number';
}
const columns: Column[] = [
  { 
    key: "number", 
    name: "编号", 
    width: "100px",
    type: 'number'
  },
  {
    key: "name",
    name: "用户故事",
    editable: true,
    width: "300px",
    resizable: true,
    type: 'string'
  },
  {
    key: "importance",
    name: "优先级",
    editable: true,
    sortable: true,
    type: 'number',
    width: "80px",
  },
  {
    key: "estimate",
    name: "估计人天",
    editable: true,
    sortable: true,
    type: 'number',
    width: "100px",
  },
  {
    key: "howtodemo",
    name: "如何演示",
    editable: true,
    width: "250px",
    resizable: true,
    type: 'string'
  },
];


export default function Backlog() {
  const [rows, setRows] = useState<UserStory[]>([]);
  const [filterId, setFilterId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterFeature, setFilterFeature] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [statusList] = useState(["To Do", "In Progress", "Done"]);
  const [featureList, setFeatureList] = useState<Feature[]>([]);
  const [product, setProduct] = useState({name:""});
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        const product = JSON.parse(localStorage.getItem("currentProduct") || "{}");
        if (!product?.id) {
          toast({ title: "请先选择产品空间", variant: "destructive" });
          router.push('/workspace');
          return;
        }
        
        const response = await fetch(`/api/userstory/product?product_id=${product.id}`);
        if (!response.ok) throw new Error("Failed to fetch user stories");
        
        const data = await response.json();
        setRows(data);
        setProduct(product);
        
        // Extract unique features from user stories
        const featuresMap = new Map<string, Feature>();
        data.forEach((story: any) => {
          if (story.feature && story.feature.id && story.feature.name) {
            featuresMap.set(story.feature.id, story.feature);
          }
        });
        setFeatureList(Array.from(featuresMap.values()));
      } catch (error) {
        console.error("Error fetching user stories:", error);
        toast({ title: "加载失败", variant: "destructive" });
      }
    };

    fetchUserStories();
  }, []);

  const handleRowsChange = (newRows: UserStory[], data: { indexes: number[] }) => {
    if (data?.indexes) {
      const changedRows = data.indexes.filter((index: number) => {
        const updatedRow = newRows[index];
        const originalRow = rows.find(row => row.id === updatedRow.id);
        return !Object.keys(updatedRow as UserStory).every((key: string) => 
          JSON.stringify(updatedRow[key as keyof UserStory]) === JSON.stringify(originalRow?.[key as keyof UserStory])
        );
      });

      if (changedRows.length === 0) return;

      Promise.all(changedRows.map((index: number) => {
        const updatedRow = newRows[index];
        return fetch(`/api/userstory`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRow),
        });
      })).then(() => {
        toast({ title: "保存成功" });
        setRows(newRows);
      }).catch(error => {
        console.error("Error updating user stories:", error);
        toast({ title: "保存失败", variant: "destructive" });
      });
    }
  };

  const filteredRows = rows.filter((row) => {
    return (
      (filterId === "" || row.number?.toString().includes(filterId)) &&
      (filterName === "" || row.name.toLowerCase().includes(filterName.toLowerCase())) &&
      (filterFeature === "" || filterFeature === "all" || row.feature?.id === filterFeature) &&
      (filterStatus === "all" || filterStatus === "" || row.status === filterStatus)
    );
  });

  return (
    <div className="flex flex-col h-full min-h-screen bg-white">
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-gray-800 flex flex-wrap items-center px-2">
          <div className="border-b-2 border-blue-300">
            <span className="text-blue-600 mr-2">{product?.name ?? '产品名称'}</span>
            <span className="hidden sm:inline mx-2">·</span>
            <span className="w-full sm:w-auto mt-2 sm:mt-0">产品待办列表</span>
          </div>
        </h1>
        <div className="bg-gray-50 rounded-2xl shadow-sm py-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            <Input
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
              type="text"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
              placeholder="编号"
            />
            <Input
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="用户故事"
            />
            <Select
              value={filterFeature}
              onValueChange={(value) => setFilterFeature(value)}
            >
              <SelectTrigger className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200">
                <SelectValue placeholder="Feature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {featureList.map((feature) => (
                  <SelectItem key={feature.id} value={feature.id}>
                    {feature.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {statusList.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden px-2 py-8">
          <EditableDataGrid
            columns={columns}
            rows={filteredRows}
            onRowsChange={handleRowsChange}
          />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
