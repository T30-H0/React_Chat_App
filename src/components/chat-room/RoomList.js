import React, { useContext } from "react";
import { Collapse, Typography, Button } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppProvider";

const { Panel } = Collapse;

const BACKGROUND_ROOM_COLOR = "#007a3f";
const PanelStyle = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }
    .ant-collapse-content-box {
      padding: 0 40xp;
    }
    .add-room {
      color: white;
      padding: 0px;
      margin-top: 20px;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: flex;
  color: red;
  margin-top: 10px;
  margin-left: 24px;
  padding: 2px 12px;
  border-radius: 4px;
  &:hover {
    color: blue; /* Change color to blue on hover */
    background-color: BACKGROUND_ROOM_COLOR;
  }
`;

export default function RoomList() {
  const { rooms, setShowAddRoomModal, setSelectedRoom, selectedRoom } =
    useContext(AppContext);

  const selectedRoomId = selectedRoom.id;

  const handleAddRoom = () => {
    setShowAddRoomModal(true);
  };

  const onSelectRoom = (room) => {
    if (selectedRoomId === room.id) {
      setSelectedRoom([]);
      return;
    }
    setSelectedRoom(room);
  };

  return (
    <Collapse ghost defaultActiveKey={["1"]}>
      <PanelStyle header="Room chats" key={"1"}>
        {rooms?.map((room) => (
          <LinkStyled
            key={room.id}
            onClick={() => onSelectRoom(room)}
            style={{
              color: "white",
              backgroundColor:
                selectedRoomId === room.id ? BACKGROUND_ROOM_COLOR : undefined,
            }}
          >
            {room.name}
          </LinkStyled>
        ))}
        <Button
          type="text"
          className="add-room"
          icon={<PlusSquareOutlined />}
          onClick={handleAddRoom}
        >
          Add Room
        </Button>
      </PanelStyle>
    </Collapse>
  );
}
