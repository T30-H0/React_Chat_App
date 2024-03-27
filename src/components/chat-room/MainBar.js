import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";
import UserInfo from "./UserInfo";
import RoomList from "./RoomList";

const MainBarStyles = styled.div`
  background-color: #4e316d;
  height: 100vh;
`;
export default function MainBar() {
  return (
    <MainBarStyles>
      <Row>
         
        <Col span={24}>
          <UserInfo />
        </Col>
        <Col span={24}>
          <RoomList />
        </Col>
      </Row>
    </MainBarStyles>
  );
}
