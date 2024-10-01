"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import "@/app/globals.css";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import {
  getSprints,
  createSprintByProductId,
  updateSprint,
  deleteSprint,
  getSprintDetail,
  getSprintBacklogList,
  getProductBacklogList,
  addBacklogToSprint,
  removeBacklogFromSprint,
} from "@/api/sprint.api";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import History from "@/components/sprint/History";
import ChooseBacklog from "@/components/sprint/ChooseBacklog";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function SprintManagement() {
  const [product, setProduct] = useState({});
  useEffect(() => {
    let product = JSON.parse(localStorage.getItem("currentWorkspace"));
    setProduct(product);
  }, []);

  const productId = product?.id;
  const [sprint, setSprint] = useState({
    id: "",
    name: "",
    goal: "",
    startDate: "",
    endDate: "",
    demoDate:"",
    dailyStandup: "",
    sprintReview: "",
    status:""
  });
  const [sprintList, setSprintList] = useState([]);
  const [backlogList, setBacklogList] = useState([]);
  const [sprintBacklogList, setSprintBacklogList] = useState([]);

  useEffect(() => {
    if (productId) {
      getSprints(productId).then((res) => {
        setSprintList(res);
        if (res.length > 0) {
          getSprintById(res[0].id);
        }
      });

      getProductBacklogList(productId).then((res) => {
        // 对 res 结果按照 优先级降序排列
        res.sort((a, b) => b.importance - a.importance);

        setBacklogList(res);
      });
    }
  }, [productId]);

  const createSprint = (productId) => {
    createSprintByProductId(productId).then((res) => {
      toast({ title: "创建成功", status: "success" });
      getSprints(productId).then((res) => {
        setSprintList(res);
        getSprintById(res[0].id);
      });
    });
  };

  const getSprintById = (id) => {
    getSprintDetail(id).then((res) => {
      setSprint(res);
      console.log(res)
      getSprintBacklogList(id).then((res) => {
        setSprintBacklogList(res);
      });
    });
  };

  const deleteSprintById = (id) => {
    deleteSprint(id).then(() => {
      toast({ title: "删除成功", status: "success" });
      getSprints(productId).then((res) => {
        setSprintList(res);
        if (res.length > 0) {
          getSprintById(res[0].id);
        } 
      });
    });
  };

  const updateSprintById = (data) => {
    // toast({ title: "保存成功", status: "success" });
    console.log(data)
    setSprint({ 
      id: "",
      name: "",
      goal: "",
      startDate: "",
      endDate: "",
      demoDate:"",
      dailyStandup: "",
      sprintReview: "",
      status:""}
    );
  };

  const saveSprintContent = () => {
    updateSprint(sprint).then((res) => {
      console.log(res);
      toast({ title: "保存成功", status: "success" });
      getSprints(productId).then((res) => {
        setSprintList(res);
      });
    });
  };

  const [productName, setProductName] = useState("当前产品");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentWorkspace = JSON.parse(localStorage.getItem("currentWorkspace"));
      setProductName(currentWorkspace?.name || "当前产品");
    }
  }, []);


  return (
    <>
      <Header />
      <div className="bg-white">
      <div className="container">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800  flex flex-wrap items-center px-2 py-8 sm:py-8">
        
        <div className="border-b-2 border-blue-300">
        <span className="text-blue-600 break-all">{product?.name || "当前产品"}</span>
        <span className="mx-2 hidden sm:inline">·</span>
        <span className="w-full sm:w-auto mt-2 sm:mt-0">迭代计划</span>
        </div>
      </h1>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 border border-gray-100 ">
        <div className="flex flex-1 flex-col md:flex-row w-full bg-white rounded-lg mb-4">
          <History
            sprintList={sprintList}
            getSprintById={getSprintById}
            productId={productId}
            createSprint={createSprint}
            product={product}
            className="w-full md:w-64 lg:w-72 mb-4 md:mb-0"
          />
          <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-4 md:gap-6">
            {!sprint.id || sprintList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="text-2xl font-semibold mb-2">没有 Sprint</div>
                    <p className="text-lg">请选择或创建一个 Sprint</p>
                  </div>
            ) : (
              <>
                <SprintInfo
                  product={product}
                  sprint={sprint}
                  setSprint={setSprint}
                  deleteSprintById={deleteSprintById}
                  updateSprintById={updateSprintById}
                  saveSprint={saveSprintContent}
                  className="w-full"
                />
                <SprintBacklog
                  sprint={sprintList.length > 0 ? sprintList[0] : sprint}
                  backlogList={backlogList}
                  sprintBacklogList={sprintBacklogList}
                  setSprintBacklogList={setSprintBacklogList}
                  setBacklogList={setBacklogList}
                  removeBacklogFromSprint={removeBacklogFromSprint}
                  className="w-full"
                />
              </>
            )}
          </div>
          </main>
        </div>
      </div>
      </div>
      </div>
      <Footer />
    </>
  );
}

function SprintInfo({
  sprint,
  deleteSprintById,
  setSprint,
  // updateSprintById,
  saveSprint,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="text-2xl font-semibold flex w-full sm:w-xl items-center">
          <Input
            className="outline-none border-none focus:outline-none px-0 text-gray-900 text-2xl font-semibold w-full min-w-fit"
            type="text"
            onChange={(e) =>
              setSprint({ ...sprint, name: e.target.value })
            }
            placeholder="Sprint Name"
            value={sprint.name || ""}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveSprint()}
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
        className="outline-none border-none focus:outline-none px-0 text-lg w-full"
        type="text"
        onChange={(e) => setSprint({ ...sprint, goal: e.target.value })}
        placeholder="Sprint 目标"
        value={sprint.goal || ""}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "开始时间", key: "startDate", type: "date" },
          { label: "结束时间", key: "endDate", type: "date" },
          {
            label: "每日站会",
            key: "dailyStandup",
            placeholder: "输入每日站会时间地点",
          },
          {
            label: "评审会议",
            key: "sprintReview",
            placeholder: "输入评审时间地点",
          },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key} className="space-y-2">
            <label htmlFor={key} className="text-sm font-medium text-gray-700">
              {label}
            </label>
            <Input
              id={key}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              type={type || "text"}
              placeholder={placeholder}
              value={sprint[key] || ""}
              onChange={(e) =>
                setSprint({ ...sprint, [key]: e.target.value })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SprintBacklog({
  sprint,
  setBacklogList,
  setSprintBacklogList,
  sprintBacklogList,
  backlogList,
  removeBacklogFromSprint,
}) {
  const deleteBacklogFromSprint = (sprintId, backlogId) => {
    removeBacklogFromSprint(sprintId, backlogId).then(() => {
      setSprintBacklogList(
        sprintBacklogList.filter((row) => row.id !== backlogId)
      );
      getProductBacklogList(sprint.productId).then((res) => {
        // 对 res 结果按照 优先级降序排列
        res.sort((a, b) => b.importance - a.importance);
        setBacklogList(res);
        toast({ title: "移除成功", status: "success" });
      });
    });
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sprint Backlog</h3>
        <ChooseBacklog
          productId={sprint.productId}
          sprint={sprint}
          backlogList={backlogList}
          addBacklogToSprint={addBacklogToSprint}
          setBacklogList={setBacklogList}
          setSprintBacklogList={setSprintBacklogList}
          getSprintBacklogList={getSprintBacklogList}
          getProductBacklogList={getProductBacklogList}
        />
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">编号</th>
              <th className="px-6 py-3">用户故事</th>
              <th className="px-6 py-3 hidden xl:table-cell">人天</th>
              <th className="px-6 py-3 hidden xl:table-cell">如何演示</th>
              <th className="px-6 py-3">状态</th>
              <th className="px-6 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sprintBacklogList.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                  {row.initialEstimate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                  {row.howToDemo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={
                    `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      row.status === "已完成" ? "bg-green-100 text-green-800" :
                      row.status === "进行中" ? "bg-yellow-100 text-yellow-800" :
                      row.status === "计划中" ? "bg-blue-100 text-blue-800" : ""
                    }`
                  }>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => deleteBacklogFromSprint(sprint.id, row.id)}
                  >
                    移除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Toaster />
    </div>
  );
}
