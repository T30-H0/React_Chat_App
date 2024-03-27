import { useEffect, useState, useCallback } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function useFirebaseStore(collectionName, condition) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      if (!condition || !condition.value || !condition.value.length) {
        return;
      }

      const collectionRef = collection(db, collectionName);
      const { fieldName, operator, value } = condition;

      const q = query(collectionRef, where(fieldName, operator, value));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchData = [];
        querySnapshot.forEach((doc) => {
          fetchData.push({ id: doc.id, ...doc.data() });
        });
        setData(fetchData);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, [collectionName, condition]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading };
}
