import { BrandColor, textColor } from '@/consts/tabs';
import { Text, Pressable, TextInput, StyleSheet, View } from 'react-native';

import RepeatIcon from '@/assets/images/targetPage/repeat';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PressableText from '@/components/public/PressableText';

import { useSQLiteContext } from 'expo-sqlite';
import {
  addGroupOrGetGroupId,
  addTarget,
  getGroups,
  groupNameRow,
} from '@/sqls/targetSql2';
import { useUIStore } from '@/store/alertStore';
import * as consts_frequency from '@/consts/frequency';
import {
  CustomeMonthBlock,
  CustomeWeekBlock,
} from '@/components/public/CustomeMonthBlock';
import { repeatList } from '@/consts/repeatList';
import { RefreshFnCtx, AddTargetStates } from './public';
import { ListChoose, ListChooseListRowType } from './ListChooseListRowType';

export function ModalComponent1({
  setInsertModalV,
  AddTargetStates,
}: {
  setInsertModalV: React.Dispatch<React.SetStateAction<boolean>>;
  AddTargetStates: AddTargetStates;
}) {
  const [targetName, setTargetName] = useState('');
  const db = useSQLiteContext();
  const showAlert = useUIStore((state) => state.showAlert);
  const showHint = useUIStore((state) => state.showHint);
  const RefreshFn = useContext(RefreshFnCtx);
  const [groups, setGroups] = useState<groupNameRow[]>([]);
  const updateGroups = useCallback(() => {
    getGroups(db)
      .then((v) => {
        setGroups(v);
      })
      .catch(showAlert);
  }, [db, showAlert]);
  useEffect(updateGroups, [updateGroups]);
  const groupList = useMemo<ListChooseListRowType[]>(
    () => groups.map((v) => ({ name: v.groupName, Id: v.groupId })),
    [groups],
  );
  const {
    frequencyState: [frequency, updateFrequency],
    dataState: [data, updatedata],
  } = AddTargetStates;

  const MAIN = 0;
  const CHOOSE_GROUP = 1;
  const REPEAT = 2;
  const DURATION = 3;
  const COUNT = 4;

  const [pageType, setPageType] = useState(MAIN);

  if (pageType === MAIN) {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 10,
          }}
        >
          <PressableText
            message="取消"
            color={BrandColor}
            highlightColor="#ffd399"
            TextStyle={{ fontSize: 16 }}
            onPress={() => {
              setInsertModalV(false);
            }}
          />
          <Text style={{ color: textColor, fontSize: 18 }}>创建目标</Text>
          <PressableText
            message="保存"
            color={BrandColor}
            highlightColor="#ffd399"
            TextStyle={{ fontSize: 16 }}
            onPress={() => {
              const t = targetName.trim();
              let alertText = '';
              if (t === '') {
                alertText += '请输入名称\n';
              }
              if (data.groupId === -1) {
                alertText += '请选择分组\n';
              }
              if (alertText !== '') {
                showAlert(alertText.trim());
                return;
              }

              addTarget(db, {
                ...data,
                frequency: JSON.stringify(frequency),
                description: t,
              })
                .then(() => {
                  showHint('保存成功');
                })
                .then(RefreshFn)
                .then(() => {
                  setInsertModalV(false);
                })
                .catch(showAlert);
            }}
          />
        </View>
        <View style={ModalComponent1Style.row}>
          <TextInput
            cursorColor={BrandColor}
            autoFocus={true}
            style={{ fontSize: 16, padding: 0 }}
            value={targetName}
            onChangeText={setTargetName}
            placeholder="请输入目标"
          />
        </View>
        <Pressable
          onPress={() => {
            setPageType(CHOOSE_GROUP);
          }}
        >
          <View style={ModalComponent1Style.row}>
            <Text
              style={{
                fontSize: 16,
                color: data.groupId === -1 ? '#666666' : 'black',
              }}
            >
              {data.groupId === -1
                ? '请选择分组'
                : groups.find((v) => v.groupId === data.groupId)?.groupName}
            </Text>
          </View>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 5, marginBottom: 10 }}>
          <Pressable
            onPress={() => {
              setPageType(REPEAT);
            }}
            style={[
              ModalComponent1Style.block,
              { flexDirection: 'row', alignItems: 'center' },
            ]}
          >
            <RepeatIcon />
            <Text style={{ fontSize: 16, marginLeft: 3 }}>重复</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setPageType(DURATION);
            }}
            style={ModalComponent1Style.block}
          >
            <Text style={{ fontSize: 16 }}>时间</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setPageType(COUNT);
            }}
            style={ModalComponent1Style.block}
          >
            <Text style={{ fontSize: 16 }}>次数</Text>
          </Pressable>
        </View>
      </View>
    );
  } else if (pageType === CHOOSE_GROUP) {
    const CHOOSE_GROUPF = () => {
      const [text, setText] = useState('');

      return (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <PressableText
              message="返回"
              color={BrandColor}
              highlightColor="#ffd399"
              TextStyle={{ fontSize: 16 }}
              onPress={() => {
                setPageType(MAIN);
              }}
            />
          </View>
          <ListChoose
            list={groupList}
            chosenId={data.groupId}
            setId={(newId) => {
              updatedata((data) => {
                data.groupId = newId;
              });
            }}
          />
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              // paddingVertical: 10,
              paddingLeft: 16,
              paddingRight: 16,
              flexDirection: 'row',
              alignItems: 'center',
              height: 45,
            }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              style={{ lineHeight: 25, flex: 1, padding: 0, fontSize: 16 }}
              cursorColor={BrandColor}
              placeholder="添加新分组"
            ></TextInput>
            <PressableText
              message="添加"
              color={BrandColor}
              highlightColor="#ffd399"
              TextStyle={{ fontSize: 16 }}
              onPress={() => {
                if (text.trim() === '') {
                  showAlert('请输入分组名');
                  return;
                }
                addGroupOrGetGroupId(db, text)
                  .then(() => {
                    showHint('添加成功');
                    return updateGroups();
                  })
                  .catch(showAlert);
              }}
            />
          </View>
        </View>
      );
    };
    return <CHOOSE_GROUPF />;
  } else if (pageType === REPEAT) {
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <PressableText
            message="返回"
            color={BrandColor}
            highlightColor="#ffd399"
            TextStyle={{ fontSize: 16 }}
            onPress={() => {
              setPageType(MAIN);
            }}
          />
        </View>
        <ListChoose
          list={repeatList}
          chosenId={frequency.typeId}
          setId={(newId) => {
            updateFrequency((v) => {
              v.typeId = newId;
            });
          }}
        />
        {frequency.typeId === consts_frequency.COSTUM_MONTH ? (
          <CustomeMonthBlock
            date={new Date()}
            chosen={frequency.content}
            setChosen={(arr) => {
              updateFrequency((v) => {
                v.content = arr;
              });
            }}
          />
        ) : null}
        {frequency.typeId === consts_frequency.COSTUM_WEEK ? (
          <CustomeWeekBlock
            chosen={frequency.content}
            setChosen={(arr) => {
              updateFrequency((v) => {
                v.content = arr;
              });
            }}
          />
        ) : null}
      </View>
    );
  } else if (pageType === DURATION) {
    const DURATIONF = () => {
      const [t, setT] = useState(data.duration ? data.duration.toString() : '');

      return (
        <View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PressableText
              message="返回"
              color={BrandColor}
              highlightColor="#ffd399"
              TextStyle={{ fontSize: 16 }}
              onPress={() => {
                setPageType(MAIN);
              }}
            />
            <PressableText
              message="保存"
              color={BrandColor}
              highlightColor="#ffd399"
              TextStyle={{ fontSize: 16 }}
              onPress={() => {
                const nt = Number(t);
                if (isNaN(nt) || t.length > 3 || nt < 0) {
                  showHint('请输入合理数字');
                  return;
                }
                updatedata((data) => {
                  data.duration = nt;
                });

                setPageType(MAIN);
              }}
            />
          </View>
          <View
            style={[
              ModalComponent1Style.row,
              {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: undefined,
              },
            ]}
          >
            <View
              style={{
                height: 56,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-end',
                marginVertical: 10,
              }}
            >
              <TextInput
                style={{
                  width: 90,
                  fontSize: 50,
                  color: '#ffa356',
                  padding: 0,
                  textAlign: 'right',
                  textDecorationLine: 'underline',
                }}
                cursorColor="#ffa356"
                placeholder="0"
                value={t}
                onChangeText={setT}
                keyboardType="numeric"
                autoFocus={true}
              />
              <Text style={{ fontSize: 16 }}>分钟</Text>
            </View>
          </View>
        </View>
      );
    };
    return <DURATIONF />;
  } else if (pageType === COUNT) {
    const COUNTF = () => {
      const [t, setT] = useState(data.count ? data.count.toString() : '');

      return (
        <View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PressableText
              message="返回"
              color={BrandColor}
              highlightColor="#ffd399"
              TextStyle={{ fontSize: 16 }}
              onPress={() => {
                setPageType(MAIN);
              }}
            />
            <PressableText
              message="保存"
              color={BrandColor}
              highlightColor="#ffd399"
              TextStyle={{ fontSize: 16 }}
              onPress={() => {
                const nt = Number(t);
                if (
                  isNaN(nt) ||
                  t.length > 3 ||
                  nt < 0 ||
                  Math.floor(nt) !== nt
                ) {
                  showHint('请输入合理整数');
                  return;
                }
                updatedata((data) => {
                  data.count = nt;
                });
                setPageType(MAIN);
              }}
            />
          </View>
          <View
            style={[
              ModalComponent1Style.row,
              {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: undefined,
              },
            ]}
          >
            <View
              style={{
                height: 56,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-end',
                marginVertical: 10,
              }}
            >
              <TextInput
                style={{
                  width: 90,
                  fontSize: 50,
                  color: '#ffa356',
                  padding: 0,
                  textAlign: 'right',
                  textDecorationLine: 'underline',
                }}
                cursorColor="#ffa356"
                placeholder="0"
                value={t}
                onChangeText={setT}
                keyboardType="numeric"
                autoFocus={true}
              />
              <Text style={{ fontSize: 16 }}>次</Text>
            </View>
          </View>
        </View>
      );
    };

    return <COUNTF />;
  } else {
    throw RangeError(pageType + '不是有意义的pageType');
  }
}

const ModalComponent1Style = StyleSheet.create({
  row: {
    borderRadius: 15,
    backgroundColor: 'white',
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 3,
    height: 45,
    justifyContent: 'center',
  },
  block: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 3,
  },
});
