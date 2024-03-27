import React from "react";
import { Row, Col, Typography, Button } from "antd";
import { signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebaseConfig";
import {
  COLLECTIONS,
  generateKeywords,
  storeToDB,
} from "../../firebase/services";

const { Title } = Typography;
export default function Login() {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { isNewUser } = getAdditionalUserInfo(result);

      if (isNewUser) {
        const { displayName, email, uid, photoURL, phoneNumber, providerId } =
          result?.user || {};
        storeToDB(COLLECTIONS.USERS, {
          displayName,
          email,
          uid,
          phoneNumber,
          providerId,
          photoURL,
          keyWords: generateKeywords(displayName),
        });
      }
    } catch (error) {
      console.warn("Error signing in with Google", error);
    }
  };

  return (
    <div>
      <Row justify={"center"} style={{ height: 800 }}>
        <Col span={8}>
          <Title level={3} style={{ textAlign: "center" }}>
            Chat
          </Title>
          <Button
            onClick={signInWithGoogle}
            style={{ width: "100%", marginBottom: 15 }}
          >
            Sign in with Google
          </Button>
          <Button style={{ width: "100%" }}>Sign in with Facebook</Button>
        </Col>
      </Row>
    </div>
  );
}
