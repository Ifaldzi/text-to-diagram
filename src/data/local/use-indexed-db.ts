import { useEffect, useState } from "react";
import {
  getAll,
  initDB,
  insert,
  deleteData,
  getData,
  update,
} from "./indexed-db";
import { BaseModel } from "../models/base-model";

export function useIndexedDb() {
  const [db, setDB] = useState<IDBDatabase | null>(null);
  const [isDbLoaded, setIsDbLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!db) {
      initDB()
        .then((result) => {
          setDB(result);
          setIsDbLoaded(true);
        })
        .catch((err) => console.log(err));
    }
  }, [db]);

  function insertData<T extends BaseModel>(
    data: T,
    storeName: string
  ): Promise<T> {
    if (!db) {
      throw new Error("Database is not initialized");
    }
    return insert(db, storeName, data);
  }

  function getAllData<T extends BaseModel>(storeName: string): Promise<T[]> {
    if (!db) {
      throw new Error("Database is not initialized");
    }
    return getAll(db, storeName);
  }

  function deleteDataByKey(storeName: string, key: string): Promise<void> {
    if (!db) {
      throw new Error("Database is not initialized");
    }

    return deleteData(db, storeName, key);
  }

  function getDataByKey<T extends BaseModel>(
    storeName: string,
    key: string
  ): Promise<T | undefined> {
    if (!db) {
      throw new Error("Database is not initialized");
    }
    return getData(db, storeName, key);
  }

  function updateData<T extends BaseModel>(
    storeName: string,
    data: T
  ): Promise<void> {
    if (!db) {
      throw new Error("Database is not initialized");
    }
    return update(db, storeName, data);
  }

  return {
    insertData,
    getAllData,
    deleteDataByKey,
    getDataByKey,
    updateData,
    isDbLoaded,
  };
}
