import { Tabs } from "@mantine/core";
import Card from "./Card";
import { useEffect, useState } from "react";
import { getHistory } from "../../Services/JobService";
import { useDispatch, useSelector } from "react-redux";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";
import { IconBriefcase } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

const JobHistory = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Chỉ giữ các tab liên quan đến quá trình ứng tuyển
  const TABS = ["APPLIED", "OFFERED", "INTERVIEWING"] as const;

  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam && TABS.includes(tabParam as (typeof TABS)[number])) {
      return tabParam;
    }
    return "APPLIED";
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [showList, setShowList] = useState<any[]>([]);

  useEffect(() => {
    dispatch(showOverlay());
    // Load dữ liệu cho tab hiện tại
    loadJobHistory(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user.id]);

  // Update tab khi query param thay đổi
  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const loadJobHistory = async (status: string) => {
    if (!user.id) {
      setShowList([]);
      dispatch(hideOverlay());
      return;
    }

    try {
      const result = await getHistory(user.id, status);
      setShowList(result);
    } catch (err) {
      console.error("Error loading job history:", err);
      setShowList([]);
    } finally {
      dispatch(hideOverlay());
    }
  };

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    setActiveTab(value);
    // URL sẽ được đồng bộ tự động qua useEffect khi activeTab thay đổi
    navigate(`?tab=${value}`, { replace: true });
  };

  const handleStatusUpdated = () => {
    loadJobHistory(activeTab);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Lịch sử việc làm
        </h1>
        <p className="text-gray-500 mt-2">
          Theo dõi các công việc bạn đã ứng tuyển và lưu lại
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="unstyled"
      >
        <Tabs.List className="border-b border-gray-200 mb-8 flex gap-6">
          {[
            { label: "Đã ứng tuyển", value: "APPLIED" },
            { label: "Được đề nghị", value: "OFFERED" },
            { label: "Phỏng vấn", value: "INTERVIEWING" },
          ].map((tab) => (
            <Tabs.Tab
              key={tab.value}
              value={tab.value}
              className="pb-3 text-lg font-medium text-gray-500 relative data-[active=true]:text-green-600"
            >
              {tab.label}
              {activeTab === tab.value && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-green-600 rounded-full" />
              )}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value={activeTab}>
          
          {showList.length > 0 ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showList.map((item: any, index: any) => (
                <Card
                  key={index}
                  {...item}
                  {...{ [activeTab.toLowerCase()]: true }}
                  onStatusUpdated={handleStatusUpdated}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <IconBriefcase size={60} className="text-gray-300 mb-5" />
              <h3 className="text-xl font-semibold text-gray-700">
                Không có dữ liệu
              </h3>
              <p className="text-gray-500 mt-2 mb-6">
                Bạn chưa có hoạt động nào trong mục này
              </p>
              <a
                href="/find-jobs"
                className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
              >
                Tìm việc ngay
              </a>
            </div>
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default JobHistory;