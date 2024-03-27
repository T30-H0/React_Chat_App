import React, { useContext } from "react";
import { Modal, Form, Input } from "antd";
import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthProvider";
import { storeToDB } from "../../firebase/services";
export default function AddRoomModal() {
  const { showAddRoomModal, setShowAddRoomModal } = useContext(AppContext);
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [form] = Form.useForm();
  const onConfirm = () => {
    storeToDB("rooms", { ...form.getFieldsValue(), members: [uid] });
    setShowAddRoomModal(false);
    form.resetFields();
  };

  const onCancel = () => {
    form.resetFields();
    setShowAddRoomModal(false);
  };

  return (
    <div>
      <Modal
        title="Add New Room"
        open={showAddRoomModal}
        onOk={onConfirm}
        onCancel={onCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name">
            <Input placeholder="Room Name..." />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Description..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
