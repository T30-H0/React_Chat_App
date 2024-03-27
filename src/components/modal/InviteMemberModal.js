import React, { useContext, useMemo, useState } from "react";
import { Modal, Form, Select, Spin, Avatar } from "antd";
import { AuthContext } from "../../context/AuthProvider";
import { storeToDB } from "../../firebase/services";
import { AppContext } from "../../context/AppProvider";
import { debounce } from "lodash";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

function DebounceSelect({ fetchOption, debounceTimeout = 300, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOption = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOption(value, props.curMembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOption, debounceTimeout);
  }, [debounceTimeout, fetchOption, props.curMembers]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin /> : null}
      {...props}
    >
      {options?.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size={"small"} src={opt.photoURL}>
            {opt?.photoURL ? "" : opt.displayName.charAt(0).toUpperCase()}
          </Avatar>
          {opt?.label}
        </Select.Option>
      ))}
    </Select>
  );
}

const fetchUserList = async (search, curMembers) => {
  const q = query(
    collection(db, "users"),
    where("keyWords", "array-contains", search),
    orderBy("displayName"),
    limit(20)
  );

  const querySnapshot = await getDocs(q);
  const options = querySnapshot.docs
    .map((doc) => ({
      label: doc.data().displayName,
      value: doc.data().uid,
      photoURL: doc.data().photoURL,
    }))
    .filter((opt) => !curMembers.includes(opt.value));

  return options;
};

export default function InviteMemberModal() {
  const { showInviteMemberModal, setShowInviteMemberModal, selectedRoom } =
    useContext(AppContext);
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [value, setValue] = useState("");

  const onConfirm = () => {
    const roomRef = doc(db, "rooms", selectedRoom.id);
    updateDoc(roomRef, {
      members: [...selectedRoom.members, ...value.map((val) => val.value)],
    });

    form.resetFields();
    setShowInviteMemberModal(false);
  };

  const onCancel = () => {
    form.resetFields();
    setShowInviteMemberModal(false);
  };

  return (
    <div>
      <Modal
        title="Add New Member"
        open={showInviteMemberModal}
        onOk={onConfirm}
        onCancel={onCancel}
      >
        <Form form={form} layout="vertical">
          <DebounceSelect
            mode="multiple"
            label="member names"
            value={value}
            placeholder={"Enter member name..."}
            fetchOption={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            curMembers={selectedRoom.members}
          />
        </Form>
      </Modal>
    </div>
  );
}
