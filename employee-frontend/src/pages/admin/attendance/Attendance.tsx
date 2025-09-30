import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Image,
  Spin,
  Tag,
  Space,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";

// --- 1. TYPE DEFINITIONS ---
// This interface matches the raw data from your MySQL table
interface RawAttendanceRecord {
  id: number;
  user_id: number;
  attendance_date: string; // 'YYYY-MM-DD'
  time: string; // ISO timestamp string
  latitude: number;
  longitude: number;
  action: "checkin" | "checkout" | "onLeave";
  notes?: string | null;
  object_name?: string | null; // The image identifier
}

// This interface is the transformed data structure for the AntD table
interface AggregatedAttendanceRecord {
  key: string; // Unique key for React (e.g., 'userId-date')
  userId: number;
  date: string;
  checkInTime?: string;
  checkInImage?: string | null;
  checkOutTime?: string;
  checkOutImage?: string | null;
  notes?: string;
  status: "Present" | "On Leave" | "Incomplete";
}

// --- 2. MOCK API AND DATA ---
// This simulates the raw data you'd get from your backend API
const mockRawData: RawAttendanceRecord[] = [
  {
    id: 1,
    user_id: 101,
    attendance_date: "2025-09-30",
    time: "2025-09-30T08:01:15Z",
    latitude: -6.175,
    longitude: 106.828,
    action: "checkin",
    notes: "Starting the day.",
    object_name: "img_checkin_101_20250930.jpg",
  },
  {
    id: 2,
    user_id: 101,
    attendance_date: "2025-09-30",
    time: "2025-09-30T17:05:20Z",
    latitude: -6.176,
    longitude: 106.829,
    action: "checkout",
    notes: null,
    object_name: "img_checkout_101_20250930.jpg",
  },
  {
    id: 3,
    user_id: 102,
    attendance_date: "2025-09-30",
    time: "2025-09-30T09:00:00Z",
    latitude: -6.2,
    longitude: 106.85,
    action: "onLeave",
    notes: "Annual leave.",
    object_name: null,
  },
  {
    id: 4,
    user_id: 103,
    attendance_date: "2025-09-30",
    time: "2025-09-30T08:30:45Z",
    latitude: -6.185,
    longitude: 106.835,
    action: "checkin",
    notes: "Feeling great!",
    object_name: "img_checkin_103_20250930.jpg",
  },
  {
    id: 5,
    user_id: 101,
    attendance_date: "2025-09-29",
    time: "2025-09-29T08:05:00Z",
    latitude: -6.175,
    longitude: 106.828,
    action: "checkin",
    notes: null,
    object_name: "img_checkin_101_20250929.jpg",
  },
  {
    id: 6,
    user_id: 101,
    attendance_date: "2025-09-29",
    time: "2025-09-29T17:00:10Z",
    latitude: -6.176,
    longitude: 106.829,
    action: "checkout",
    notes: "Finished project X.",
    object_name: "img_checkout_101_20250929.jpg",
  },
];

// Simulates fetching the raw attendance data
const fetchRawAttendanceData = (): Promise<RawAttendanceRecord[]> => {
  console.log("Fetching raw attendance data...");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRawData);
    }, 1000); // 1-second delay to simulate network
  });
};

// Simulates hitting an API to get a temporary image URL from an object name
const fetchImageUrl = (objectName: string): Promise<string> => {
  console.log(`Fetching image URL for: ${objectName}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this URL would come from your backend (e.g., a signed S3 URL)
      resolve(`https://placehold.co/600x400?text=Proof\\n${objectName}`);
    }, 500);
  });
};

// --- 3. THE REACT COMPONENT ---
const AttendancePage: React.FC = () => {
  const [data, setData] = useState<AggregatedAttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  /**
   * This is the core logic. It transforms the flat list of records
   * into an aggregated list, grouping by user and date.
   */
  const processAttendanceData = (
    records: RawAttendanceRecord[]
  ): AggregatedAttendanceRecord[] => {
    const aggregationMap = new Map<string, AggregatedAttendanceRecord>();

    records.forEach((record) => {
      const key = `${record.user_id}-${record.attendance_date}`;
      const time = new Date(record.time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      if (!aggregationMap.has(key)) {
        aggregationMap.set(key, {
          key,
          userId: record.user_id,
          date: record.attendance_date,
          status: "Incomplete", // Default status
        });
      }

      const aggregatedRecord = aggregationMap.get(key)!;

      switch (record.action) {
        case "checkin":
          aggregatedRecord.checkInTime = time;
          aggregatedRecord.checkInImage = record.object_name;
          aggregatedRecord.notes = record.notes || aggregatedRecord.notes;
          break;
        case "checkout":
          aggregatedRecord.checkOutTime = time;
          aggregatedRecord.checkOutImage = record.object_name;
          // Checkout notes can append to check-in notes if needed, or overwrite.
          // Here we just prefer the latest note.
          if (record.notes) aggregatedRecord.notes = record.notes;
          break;
        case "onLeave":
          aggregatedRecord.status = "On Leave";
          aggregatedRecord.notes = record.notes || "On Leave";
          break;
      }

      // Update status
      if (aggregatedRecord.checkInTime && aggregatedRecord.checkOutTime) {
        aggregatedRecord.status = "Present";
      }
    });

    return Array.from(aggregationMap.values());
  };

  useEffect(() => {
    setLoading(true);
    fetchRawAttendanceData()
      .then((rawData) => {
        const processedData = processAttendanceData(rawData);
        setData(processedData);
      })
      .catch((error) => {
        console.error("Failed to fetch attendance data:", error);
        message.error("Could not load attendance data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
    setImageUrl(""); // Clear the URL for the next time
  };

  // --- Table Column Definitions ---
  const columns: ColumnsType<AggregatedAttendanceRecord> = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Present", value: "Present" },
        { text: "On Leave", value: "On Leave" },
        { text: "Incomplete", value: "Incomplete" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: AggregatedAttendanceRecord["status"]) => {
        let color = "blue";
        if (status === "Present") color = "green";
        if (status === "On Leave") color = "orange";
        if (status === "Incomplete") color = "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Check-in",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (_, record) =>
        record.status === "On Leave" ? (
          <Typography.Text type="secondary">N/A</Typography.Text>
        ) : (
          <Space direction="vertical">
            <Tag color="green">{record.checkInTime || "Missing"}</Tag>
            <Button
              size="small"
              onClick={() => handleViewProof(record.checkInImage)}
              disabled={!record.checkInImage}
            >
              View Proof
            </Button>
          </Space>
        ),
    },
    {
      title: "Check-out",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (_, record) =>
        record.status === "On Leave" ? (
          <Typography.Text type="secondary">N/A</Typography.Text>
        ) : (
          <Space direction="vertical">
            <Tag color="volcano">{record.checkOutTime || "Missing"}</Tag>
            <Button
              size="small"
              onClick={() => handleViewProof(record.checkOutImage)}
              disabled={!record.checkOutImage}
            >
              View Proof
            </Button>
          </Space>
        ),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (notes) =>
        notes || <Typography.Text type="secondary">No notes</Typography.Text>,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h1>Daily Attendance</h1>
      <Table columns={columns} dataSource={data} loading={loading} bordered />

      <Modal
        title="Attendance Proof"
        open={isModalVisible}
        onCancel={handleCancelModal}
        footer={null} // We don't need OK/Cancel buttons
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
