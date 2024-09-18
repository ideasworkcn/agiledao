"use client";
import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getBacklogListByProductId,
  updateBacklog,
  getFeatureListByProductId,
} from "@/api/backlog.api";
import { toast } from "@/components/ui/use-toast";
import EditableDataGrid from "@/components/EditableDataGrid";

const columns = [
  { key: "number", name: "编号", width: 100 },
  {
    key: "name",
    name: "用户故事",
    editable: true,
    width: 300,
    resizable: true,
  },
  {
    key: "importance",
    name: "优先级",
    editable: true,
    sortable: true,
    width: 80,
  },
  {
    key: "initialEstimate",
    name: "估计人天",
    editable: true,
    sortable: true,
    width: 100,
  },
  {
    key: "howToDemo",
    name: "如何演示",
    editable: true,
    width: 250,
    resizable: true,
  },
  { 
    key: "notes", 
    name: "备注", 
    editable: true, 
    width: 200,
    resizable: true,
  },
];

const Backlog = () => {
  const [rows, setRows] = useState([]);
  const [features, setFeatures] = useState([]);
  const [filterId, setFilterId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterHowToDemo, setFilterHowToDemo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFeature, setFilterFeature] = useState("");
  const [statusList, setStatusList] = useState(["计划中", "进行中", "已完成"]);

  useEffect(() => {
    let product = JSON.parse(localStorage.getItem("currentWorkspace"));
    let productId = product.id;

    getBacklogListByProductId(productId).then((data) => {
      setRows(data);
    });
    getFeatureListByProductId(productId).then((data) => {
      setFeatures(data);
    });
  }, []);

  const handleRowsChange = (newRows, data) => {
    if (data && data.indexes && Array.isArray(data.indexes)) {
      for (let i = 0; i < data.indexes.length; i++) {
        updateBacklog(newRows[data.indexes[i]]).then(() => {
          toast({ title: "保存成功", status: "success" });
        });
      }
    } else {
      // Handle the case where data or data.indexes is undefined or not an array
      console.error("Invalid data structure in handleRowsChange");
      toast({ title: "保存失败", status: "error" });
    }
    setRows(newRows);
  };

  const filteredRows = rows.filter((row) => {
    return (
      row.number.includes(filterId) &&
      row.name.toLowerCase().includes(filterName.toLowerCase()) &&
      row.howToDemo.toLowerCase().includes(filterHowToDemo.toLowerCase()) &&
      (filterFeature === "all" || row.featureId.includes(filterFeature)) &&
      (filterStatus === "all" || row.status.toLowerCase().includes(filterStatus.toLowerCase()))
    );
  });
  const [productName, setProductName] = useState("当前产品");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentWorkspace = JSON.parse(localStorage.getItem("currentWorkspace"));
      setProductName(currentWorkspace?.name || "当前产品");
    }
  }, []);

  return (
    <div className="flex flex-col h-full min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-gray-800 flex flex-wrap items-center px-2">
          <span className="text-blue-600 mr-2">{productName}</span>
          <span className="hidden sm:inline mx-2">·</span>
          <span className="w-full sm:w-auto mt-2 sm:mt-0">产品待办列表</span>
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
              onValueChange={(e) => setFilterFeature(e)}
            >
              <SelectTrigger className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200">
                <SelectValue placeholder="所属 Feature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {features.map((feature) => (
                  <SelectItem key={feature.id} value={feature.id}>
                    {feature.content}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(e) => setFilterStatus(e)}
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
            className="w-full"
            style={{ 
              height: 'calc(100vh - 300px)',
              fontSize: '14px',
              border: 'none',
            }}
            headerRowHeight={48}
            rowHeight={52}
          />
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Backlog;
