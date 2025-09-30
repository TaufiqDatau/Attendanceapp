import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Image,
  Spin,
  Tag,
  Space,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { apiFetch } from "@/utils/FetchHelper";

// --- 1. TYPE DEFINITIONS ---
interface AttendanceRecord {
  key: string;
  user_id: number;
  full_name: string;
  email: string;
  attendance_date: string;
  checkin_time: string | null;
  checkin_object_name: string | null;
  checkout_time: string | null;
  checkout_object_name: string | null;
  status: "Present" | "Incomplete";
}

interface ApiResponse {
  data: Omit<AttendanceRecord, "key" | "status">[]; // Raw data from API
  totalItem: number;
  currentPage: number;
}

const fullMockData = Array.from({ length: 25 }, (_, i) => {
  const userId = 101 + (i % 5);
  const date = new Date("2025-09-30");
  date.setDate(date.getDate() - Math.floor(i / 5));
  const dateString = date.toISOString().split("T")[0];
  const hasCheckout = i % 2 === 0;

  return {
    user_id: userId,
    full_name: `User Name ${userId}`,
    email: `user.${userId}@example.com`,
    attendance_date: dateString,
    checkin_time: `${dateString}T08:${String(i % 60).padStart(2, "0")}:00Z`,
    checkin_object_name: `img_checkin_${userId}_${dateString.replace(/-/g, "")}.jpg`,
    checkout_time: hasCheckout
      ? `${dateString}T17:${String(i % 60).padStart(2, "0")}:00Z`
      : null,
    checkout_object_name: hasCheckout
      ? `img_checkout_${userId}_${dateString.replace(/-/g, "")}.jpg`
      : null,
  };
});


// Simulates fetching an image URL
const fetchImageUrl = (objectName: string): Promise<string> => {
  console.log(`Fetching image URL for: ${objectName}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://placehold.co/600x400?text=Proof\\n${objectName}`);
    }, 500);
  });
};

// --- 3. THE REACT COMPONENT ---
const AttendancePage: React.FC = () => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  // Helper to format time strings
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Missing";
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fetchData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      // Await the promise to get the resolved data directly
      const response: ApiResponse = await apiFetch("/attendance-history", {
        method: "GET",
        params: {
          page: page,
          limit: pageSize,
        },
      });

      // The rest of your logic can now run sequentially
      const processedData: AttendanceRecord[] = response.data.map(
        (record) => ({
          ...record,
          key: `${record.user_id}-${record.attendance_date}`,
          status:
            record.checkin_time && record.checkout_time
              ? "Present"
              : "Incomplete",
        })
      );

      setData(processedData);
      setPagination((prev) => ({
        ...prev,
        total: response.totalItem,
        current: response.currentPage,
      }));

    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
      message.error("Could not load attendance data.");
    } finally {
      // This block runs whether the try succeeded or failed
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchData(pagination.current!, pagination.pageSize!);
  }, []);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchData(newPagination.current!, newPagination.pageSize!);
  };

  const handleViewProof = async (objectName: string | null | undefined) => {
    if (!objectName) {
      message.warning("No image proof available for this entry.");
      return;
    }
    setIsImageLoading(true);
    setIsModalVisible(true);
    try {
      const url = await fetchImageUrl(objectName);
      setImageUrl(url);
    } catch (error) {
      message.error("Failed to load image.");
      setIsModalVisible(false);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setImageUrl("");
  };

  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Date",
      dataIndex: "attendance_date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: AttendanceRecord["status"]) => {
        const color = status === "Present" ? "green" : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Check-in",
      dataIndex: "checkin_time",
      key: "checkin_time",
      render: (time, record) => (
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          <Tag color="green">{formatTime(time)}</Tag>
          <Button
            size="small"
            onClick={() => handleViewProof(record.checkin_object_name)}
            disabled={!record.checkin_object_name}
          >
            View Proof
          </Button>
        </Space>
      ),
    },
    {
      title: "Check-out",
      dataIndex: "checkout_time",
      key: "checkout_time",
      render: (time, record) => (
        <Space direction="vertical" align="center" style={{ width: "100%" }}>
          <Tag color="volcano">{formatTime(time)}</Tag>
          <Button
            size="small"
            onClick={() => handleViewProof(record.checkout_object_name)}
            disabled={!record.checkout_object_name}
          >
            View Proof
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h1>Daily Attendance</h1>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title="Attendance Proof"
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        centered
      >
        {isImageLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Image width="100%" src={imageUrl} alt="Attendance proof" />
        )}
      </Modal>
    </div>
  );
};

export default AttendancePage;