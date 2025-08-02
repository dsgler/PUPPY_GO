import { getDB, GetDataByDate } from '@/sqls/indexSql';
import { getDateNumber } from '@/utility/datetool';
import React from 'react';
import { View } from 'react-native';
import { SportList } from '.';
import { EmptyDog } from './EmptyDog';

export async function showData(
  setDataFace: React.Dispatch<React.SetStateAction<React.ReactNode>>,
  t: number | Date,
  isRaw: boolean = false,
) {
  const db = await getDB();
  let dateNumber: number;
  if (typeof t === 'number' && t / 100000000 < 1) {
    dateNumber = t;
  } else {
    dateNumber = getDateNumber(t);
  }
  const ret = await GetDataByDate(db, dateNumber);
  console.log('获得ret');
  if (ret.length === 0) {
    if (isRaw) {
      setDataFace(
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <EmptyDog date={t instanceof Date ? t.getTime() : t} />
        </View>,
      );
    } else {
      setDataFace(
        <View
          style={{
            position: 'absolute',
            flex: 1,
            top: 100,
            left: 0,
            bottom: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <EmptyDog date={t instanceof Date ? t.getTime() : t} />
        </View>,
      );
    }
  } else {
    console.log(ret);
    setDataFace(<SportList sportArr={ret} isRaw={isRaw} />);
  }
}
