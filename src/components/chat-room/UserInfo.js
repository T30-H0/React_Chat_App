import React, { useContext } from "react";
import { Button, Typography, Avatar } from "antd";
import styled from "styled-components";
import { auth } from "../../firebase/firebaseConfig";
import { AuthContext } from "../../context/AuthProvider";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid aliceblue;

  .username {
    color: white;
    margin-left: 12px;
  }
`;
export default function UserInfo() {
  const {
    user: { displayName, photoURL },
  } = useContext(AuthContext);

  const onSignOut = () => {
    auth.signOut();
  };

  return (
    <Wrapper>
      <div>
        <Avatar src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography.Text className="username">{displayName}</Typography.Text>
      </div>
      <Button ghost onClick={onSignOut}>
        Sign out
      </Button>
    </Wrapper>
  );
}
