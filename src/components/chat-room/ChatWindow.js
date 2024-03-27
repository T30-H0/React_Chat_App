import React, { useContext, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Avatar, Tooltip, Form, Input, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import Message from "./Message";
import { AppContext } from "../../context/AppProvider";
import { storeToDB } from "../../firebase/services";
import { AuthContext } from "../../context/AuthProvider";
import useFirebaseStore from "../../hooks/useFirebaseStore";
import { IMAGES } from "../../themes/images";

const { Text } = Typography;

const HeaderStyle = styled.div`
  display: flex;
  justify-content: space-between;
  height: 73px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__title {
      margin: 0;
      font-weight: bold;
    }
    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyle = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100vh - 96px);
  display: flex;
  flex-direction: column;
  padding: 11px 11px 30px;
  justify-content: flex-end;
`;

const FormStyle = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0px;
  border: 1px solid rgb(230, 230, 230, 230);
  border-radius: 10px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0px;
  }
`;

const MessageListStyles = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;

  img {
    width: 20%w;
    height: 30vh;
  }
`;

const TextStyle = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  color: gray;
`;
export default function ChatWindow() {
  const [form] = Form.useForm();
  const { selectedRoom, members, setShowInviteMemberModal } =
    useContext(AppContext);

  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const [inputValue, setValue] = useState("");

  const messCondition = useMemo(() => {
    return {
      fieldName: "roomId",
      operator: "==",
      value: selectedRoom.id,
    };
  }, [selectedRoom.id]);

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleSend = () => {
    storeToDB("message", {
      text: inputValue,
      uid,
      photoURL,
      displayName,
      roomId: selectedRoom.id,
    });
    form.resetFields(["message"]);
  };
  const { data: message } = useFirebaseStore("message", messCondition);

  return (
    <WrapperStyle>
      {selectedRoom?.length !== 0 ? (
        <>
          <HeaderStyle>
            <div className="header__info">
              <p className="header__title">{selectedRoom?.name}</p>
              <span className="header__description">
                {selectedRoom?.description}
              </span>
            </div>

            <ButtonGroupStyled>
              <Button
                type="text"
                icon={<UserAddOutlined />}
                onClick={() => setShowInviteMemberModal(true)}
              >
                Invite
              </Button>
              <Avatar.Group size={"small"} maxCount={2}>
                {members.map((member) => (
                  <Tooltip title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}>
                      {member?.photoURL
                        ? ""
                        : member.displayName.charAt(0).toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyle>
          <ContentStyled>
            <MessageListStyles>
              {message.map((mes) => (
                <Message
                  key={mes.id}
                  text={mes.text}
                  displayName={mes.displayName}
                  photoUrl={mes.photoURL}
                  createdAt={mes.createdAt.seconds}
                />
              ))}
            </MessageListStyles>
            <FormStyle form={form}>
              <Form.Item name={"message"}>
                <Input
                  onChange={handleInputChange}
                  bordered={false}
                  autoComplete="off"
                  placeholder="Enter message ..."
                />
              </Form.Item>
              <Button type="primary" onClick={() => handleSend()}>
                Send
              </Button>
            </FormStyle>
          </ContentStyled>
        </>
      ) : (
        <ImageContainer>
          <img src={IMAGES.imgSelectedGif} alt="select" />
          <TextStyle>
            Pick a room to get started with your conversation.
          </TextStyle>
        </ImageContainer>
      )}
    </WrapperStyle>
  );
}
