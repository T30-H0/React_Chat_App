import React from "react";
import { Row, Col } from "antd";
import ChatWindow from "./ChatWindow";
import MainBar from "./MainBar";

export default function ChatRoom() {
  return (
    <div>
      <Row>
        <Col span={4}>{<MainBar />}</Col>
        <Col span={20}>
          <ChatWindow />
        </Col>
      </Row>
    </div>
  );
}
