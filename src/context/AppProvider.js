import React, { createContext, useContext, useMemo, useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFirebaseStore from "../hooks/useFirebaseStore";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const {
    user: { uid },
  } = useContext(AuthContext);

  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState([]);

  const roomCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      value: uid,
    };
  }, [uid]);

  const userCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      value: selectedRoom.members,
    };
  }, [selectedRoom]);

  const { data: rooms } = useFirebaseStore("rooms", roomCondition);
  const { data: members } = useFirebaseStore("users", userCondition);

  return (
    <AppContext.Provider
      value={{
        rooms,
        members,
        showAddRoomModal,
        setShowAddRoomModal,
        showInviteMemberModal,
        setShowInviteMemberModal,
        selectedRoom,
        setSelectedRoom,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
