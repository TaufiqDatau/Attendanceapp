import { useEffect, useState } from "react";
import {
  Space,
  Table,
  Tag,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import type { TablePaginationConfig, TableProps } from "antd";
import moment from "moment"; // moment is a peer dependency of antd
import { apiFetch } from "@/utils/FetchHelper";

// Interface defining the structure of our data type, based on the SQL schema.
interface DataType {
  key: string;
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  birth_date?: string;
  birth_place?: string;
  full_address?: string;
  home_latitude?: number;
  home_longitude?: number;
  status: "active" | "inactive" | "suspended";
}

interface TableParams {
  pagination?: TablePaginationConfig;
}
// Configuration for the table columns.

// Mock data that matches the DataType interface and SQL schema.

export default function Employee() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [editingUser, setEditingUser] = useState<DataType | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      // total will be updated from the API response
    },
  });
  const [form] = Form.useForm();
  const handleEdit = (record: DataType) => {
    console.log(record);
    setEditingUser(record);
    //map the record to match the form
    const mappedRecord = {
      firstName: record.first_name,
      lastName: record.last_name,
      email: record.email,
      phoneNumber: record.phone_number,
      birthDate: record.birth_date,
      birthPlace: record.birth_place,
      fullAddress: record.full_address,
      homeLatitude: record.home_latitude,
      homeLongitude: record.home_longitude,
      status: record.status,
    };
    form.setFieldsValue({
      ...mappedRecord,
      // The DatePicker component expects a moment object, not a string.
      birthDate: record.birth_date
        ? moment(record.birth_date, "YYYY-MM-DD")
        : null,
    });
    setIsModalVisible(true);
  };
  // Function to fetch users from the API using POST method
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("/users", {
        method: "POST",
        auth: true,
        payload: {
          page: tableParams.pagination?.current,
          limit: tableParams.pagination?.pageSize,
        },
      });

      // This part is correct, user data is in `response.data`
      //@ts-ignore
      const users = response.data.map((user: DataType) => ({
        ...user,
        key: user.id.toString(),
      }));
      console.log(users);

      setDataSource(users);

      // Update the total count for pagination
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          // @ts-ignore
          total: response.total.count,
        },
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      messageApi.error("Could not fetch user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      pagination,
    });
  };
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Full Name",
      // Fixed column for better visibility when scrolling horizontally
      fixed: "left",
      width: 180,
      // The render function combines first_name and last_name.
      render: (_, record) => (
        <Typography.Text strong>
          {`${record.first_name} ${record.last_name || ""}`}
        </Typography.Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      width: 150,
    },
    {
      title: "Birth Date",
      dataIndex: "birth_date",
      key: "birth_date",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Typography.Text>
            {record.birth_date
              ? moment(record.birth_date).format("YYYY-MM-DD")
              : ""}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: "Birth Place",
      dataIndex: "birth_place",
      key: "birth_place",
      width: 150,
    },
    {
      title: "Full Address",
      dataIndex: "full_address",
      key: "full_address",
      width: 250,
    },
    {
      title: "Latitude",
      dataIndex: "home_latitude",
      key: "home_latitude",
      width: 120,
    },
    {
      title: "Longitude",
      dataIndex: "home_longitude",
      key: "home_longitude",
      width: 120,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      // Fixed column for better visibility
      fixed: "right",
      width: 100,
      // Render status as a colored Tag for better visual distinction.
      render: (status: DataType["status"]) => {
        let color;
        switch (status) {
          case "active":
            color = "green";
            break;
          case "inactive":
            color = "grey";
            break;
          case "suspended":
            color = "volcano";
            break;
          default:
            color = "default";
        }
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      // Fixed column for better visibility
      fixed: "right",
      width: 80,
      // Render an "Edit" link for each record.
      // CHANGED: The onClick handler now calls `handleEdit` with the current row's record.
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
        </Space>
      ),
    },
  ];
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  // const handleOk = (values: any) => {
  //   console.log("Form Values:", values);
  //   const newUser: DataType = {
  //     ...values,
  //     id: dataSource.length + 1,
  //     key: (dataSource.length + 1).toString(),
  //     birth_date: values.birth_date
  //       ? values.birth_date.format("YYYY-MM-DD")
  //       : undefined,
  //   };
  //   setDataSource([...dataSource, newUser]);
  //   setIsModalVisible(false);
  //   form.resetFields();
  // };
  const handleOk = async (values: any) => {
    // If we are editing, you would handle the update logic here (e.g., call a different endpoint)
    if (editingUser) {
      console.log("Handle user update logic here.");
      // Example: PATCH /api/users/{editingUser.id}
      return;
    }

    console.log(values);
    // --- Logic for Creating a New User ---
    try {
      const payload = {
        ...values,
        birthDate: values.birthDate
          ? values.birthDate.format("YYYY-MM-DD")
          : undefined,
      };

      delete payload.confirm_password;

      console.log("Submitting to API:", payload);

      // Call your apiFetch function to register the new user
      // @ts-ignore
      const response = await apiFetch("/auth/register", {
        method: "POST",
        auth: true, // Assuming registration requires auth or this is a placeholder
        payload: payload,
      });

      // Assuming the API returns the created user object
      // Add the new user to the local state to update the table
      // setDataSource([
      //   ...dataSource,
      //   { ...newUserFromApi, key: newUserFromApi.id.toString() },
      // ]);

      // message.success("User created successfully!"); // 🥳 Success feedback
      messageApi.open({
        type: "success",
        content: "User created successfully!",
        duration: 10,
      });
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to create user:", error);
      message.error("Failed to create user. Please try again."); // 😟 Error feedback
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Add New User
      </Button>

      <Modal
        title={editingUser ? "Edit User" : "Create a New User"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText={editingUser ? "Save Changes" : "Create"}
        // This ensures the form is completely reset when the modal is closed.
        destroyOnHidden
      >
        <Form form={form} layout="vertical" name="userForm" onFinish={handleOk}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name">
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, min: 8 }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          {!editingUser && (
            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birthDate"
            label="Birth Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="birthPlace"
            label="Birth Place"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="fullAddress" label="Full Address">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              placeholder="Select a status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "suspended", label: "Suspended" },
              ]}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>
      <Table<DataType>
        dataSource={dataSource}
        pagination={tableParams.pagination}
        columns={columns}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
      />
    </div>
  );
}
