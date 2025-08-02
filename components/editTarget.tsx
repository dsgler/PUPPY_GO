import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ColorValue,
  StyleSheet,
  TextInput,
  StyleProp,
  ViewStyle,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Pencil from '@/assets/images/targetPage/pencil';
import {
  deleteTarget,
  frequencyType,
  getGroups,
  getTarget,
  groupNameRow,
  targetRow,
  updateTarget,
} from '@/sqls/targetSql2';
import { useSQLiteContext } from 'expo-sqlite';
import RepeatIcon from '@/assets/images/targetPage/repeat';
import {
  CustomeMonthBlock,
  CustomeWeekBlock,
} from './public/CustomeMonthBlock';
import * as consts_frequency from '@/consts/frequency';
import { Updater, useImmer } from 'use-immer';

import { repeatList } from '@/consts/repeatList';
import Animated from 'react-native-reanimated';
import { BrandColor } from '@/consts/tabs';
import { router, useLocalSearchParams } from 'expo-router';
import { myFadeIn, myFadeOut, myLayoutTransition } from '@/consts/anime';
import { useUIStore } from '@/store/alertStore';

const bgYellow = '#FEE6CE';
const bgRed = '#FECECE';
const bgBigRed = '#FF7272';

const emptyData = {};

type ListChooseListRowType = { name: string; Id: number };
function ListChoose({
  list,
  chosenId,
  setId,
}: {
  list: ListChooseListRowType[];
  chosenId: number;
  setId: (newId: number) => void;
}) {
  return (
    <View>
      {list.map((v) => {
        return (
          <Pressable
            onPress={() => {
              setId(v.Id);
            }}
            style={{ marginVertical: 5 }}
            key={v.Id}
          >
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                paddingVertical: 10,
                paddingLeft: 16,
                paddingRight: 16,
                flexDirection: 'row',
                height: 45,
              }}
            >
              <Text style={{ fontSize: 16, flex: 1 }}>{v.name}</Text>
              {chosenId === v.Id ? (
                <AntIcon name="checkcircle" size={21} color={BrandColor} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Page() {
  const db = useSQLiteContext();
  const { targetId: targetIdString } = useLocalSearchParams<{
    targetId: string;
  }>();
  const targetId = Number(targetIdString);

  const [data, updateData] = useImmer(emptyData as targetRow);
  const [frequency, updateFrequency] = useImmer<frequencyType>(
    emptyData as frequencyType,
  );
  const [groups, setGroups] = useState<groupNameRow[]>();
  const groupList = useMemo<ListChooseListRowType[]>(
    () => (groups ?? []).map((v) => ({ name: v.groupName, Id: v.groupId })),
    [groups],
  );

  const myHint = useUIStore((s) => s.showHint);
  const myConfirm = useUIStore((s) => s.showConfirm);
  const myAlert = useUIStore((s) => s.showAlert);

  useEffect(() => {
    getTarget(db, targetId)
      .then((v) => {
        updateData(v);
        updateFrequency(JSON.parse(v.frequency));
      })
      .catch(myAlert);
    getGroups(db).then(setGroups);
  }, [targetId, db, updateFrequency, updateData, myAlert]);

  const groupName = useMemo(
    () => groups?.find((v) => v.groupId === data.groupId)?.groupName,
    [data.groupId, groups],
  );
  const [isFolded, setIsFolded] = useState(true);

  const makeTime = useMemo(() => {
    const d = new Date(data.makeTime);
    return `${d
      .toLocaleDateString()
      .replaceAll('/', '-')} ${d.toLocaleTimeString()}`;
  }, [data.makeTime]);

  if (data === emptyData) {
    return (
      <SafeAreaView>
        <Text>加载中</Text>
      </SafeAreaView>
    );
  }

  if (isNaN(targetId)) {
    return (
      <SafeAreaView>
        <Text>请输入合理的targetId:{targetId}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <Header />
        <View style={{ gap: 10 }}>
          <PencilRow data={data} updateData={updateData} />
          <ColoredRow
            title={<Text style={ColoredRowStyle.title}>所属列表</Text>}
            backgroundColor={bgYellow}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={ColoredRowStyle.content}>{groupName}</Text>
              <Pressable
                onPress={() => {
                  setIsFolded(!isFolded);
                }}
              >
                <AntIcon
                  name={isFolded ? 'rightcircleo' : 'downcircleo'}
                  size={21}
                />
              </Pressable>
            </View>
            {isFolded ? null : (
              <Animated.View entering={myFadeIn} exiting={myFadeOut}>
                <ListChoose
                  list={groupList}
                  chosenId={data.groupId}
                  setId={(newId) => {
                    updateData((data) => {
                      data.groupId = newId;
                    });
                  }}
                />
              </Animated.View>
            )}
          </ColoredRow>
          <ColoredRow
            title={<Text style={ColoredRowStyle.title}>创建时间</Text>}
            backgroundColor={bgYellow}
          >
            <Text style={ColoredRowStyle.content}>{makeTime}</Text>
          </ColoredRow>
          <ColoredRow
            title={<Text style={ColoredRowStyle.title}>目标时长</Text>}
            backgroundColor={bgRed}
            style={{ alignItems: 'flex-start' }}
          >
            <View style={ColoredRowStyle.inputContainer}>
              <TextInput
                value={data.duration.toString()}
                onChangeText={(text) => {
                  const t = Number(text);
                  if (isNaN(t) || text.length > 3 || t < 0) {
                    myHint('请输入合理数字');
                    return;
                  }
                  updateData((data) => {
                    data.duration = t;
                  });
                }}
                style={ColoredRowStyle.inputText}
              />
              <Text style={ColoredRowStyle.inputBesideText}>分钟</Text>
            </View>
          </ColoredRow>
          <ColoredRow
            title={<Text style={ColoredRowStyle.title}>目标次数</Text>}
            backgroundColor={bgRed}
            style={{ alignItems: 'flex-start' }}
          >
            <View style={ColoredRowStyle.inputContainer}>
              <TextInput
                value={data.count.toString()}
                onChangeText={(text) => {
                  const t = Number(text);
                  if (isNaN(t) || text.length > 3 || t < 0) {
                    myHint('请输入合理数字');
                    return;
                  }
                  updateData((data) => {
                    data.count = t;
                  });
                }}
                style={ColoredRowStyle.inputText}
              />
              <Text style={ColoredRowStyle.inputBesideText}>次</Text>
            </View>
          </ColoredRow>
          <ColoredRow
            title={
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <RepeatIcon color={ColoredRowStyle.title.color} />
                <Text style={ColoredRowStyle.title}>重复</Text>
              </View>
            }
            backgroundColor={bgYellow}
          >
            <FlatList
              data={repeatList}
              horizontal={true}
              renderItem={({ item }) => {
                const isChosen = frequency.typeId === item.Id;
                return (
                  <Pressable
                    style={[
                      ColoredRowStyle.frequencyBlock,
                      isChosen
                        ? ColoredRowStyle.frequencyBlockChosen
                        : undefined,
                    ]}
                    onPress={() => {
                      updateFrequency((v) => {
                        v.typeId = item.Id;
                      });
                    }}
                  >
                    <Text
                      style={[
                        ColoredRowStyle.frequencyBlockText,
                        isChosen
                          ? ColoredRowStyle.frequencyBlockChosenText
                          : undefined,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              }}
            />
            <Animated.View>
              {frequency.typeId === consts_frequency.COSTUM_MONTH ? (
                <Animated.View entering={myFadeIn} exiting={myFadeOut}>
                  <CustomeMonthBlock
                    date={new Date()}
                    chosen={frequency.content}
                    setChosen={(arr) => {
                      updateFrequency((v) => {
                        v.content = arr;
                      });
                    }}
                  />
                </Animated.View>
              ) : null}
              {frequency.typeId === consts_frequency.COSTUM_WEEK ? (
                <Animated.View entering={myFadeIn} exiting={myFadeOut}>
                  <CustomeWeekBlock
                    chosen={frequency.content}
                    setChosen={(arr) => {
                      updateFrequency((v) => {
                        v.content = arr;
                      });
                    }}
                  />
                </Animated.View>
              ) : null}
            </Animated.View>
          </ColoredRow>
          <Animated.View layout={myLayoutTransition}>
            <Pressable
              style={{
                height: 40,
                borderRadius: 10,
                backgroundColor: '#FFCC8E',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onPress={() => {
                updateTarget(db, {
                  ...data,
                  frequency: JSON.stringify(frequency),
                })
                  .then(() => {
                    myHint('保存成功');
                    setTimeout(() => {
                      router.back();
                    }, 500);
                  })
                  .catch(myAlert);
              }}
            >
              <Text style={{ color: BrandColor, fontSize: 16 }}>确定</Text>
            </Pressable>
          </Animated.View>
          <Animated.View layout={myLayoutTransition}>
            <Pressable
              style={{
                height: 40,
                borderRadius: 10,
                backgroundColor: '#FFAFAF',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onPress={() => {
                myConfirm('确定删除？', () => {
                  deleteTarget(db, data.Id)
                    .then(() => {
                      myHint('删除成功');
                      setTimeout(() => {
                        router.back();
                      }, 500);
                    })
                    .catch(myAlert);
                });
              }}
            >
              <Text style={{ color: '#E12A2A', fontSize: 16 }}>删除</Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
function Header() {
  const myConfirm = useUIStore((s) => s.showConfirm);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        height: 48,
        alignItems: 'center',
      }}
    >
      <Pressable
        style={{ position: 'absolute', left: 0 }}
        onPress={() => {
          myConfirm('确定不保存退出？', () => {
            router.back();
          });
        }}
      >
        <AntIcon name="leftcircle" size={34} color="#E8A838" />
      </Pressable>
      <Text style={[{ fontSize: 18 }, ColoredRowStyle.bold]}>目标详情</Text>
    </View>
  );
}

const ColoredRowStyle = StyleSheet.create({
  title: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 22,
  },
  content: {
    color: 'rgba(0,0,0,0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 600,
  },
  frequencyBlock: {
    borderRadius: 5,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 3,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  frequencyBlockChosen: {
    backgroundColor: '#FFA772',
  },
  frequencyBlockText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(0,0,0,0.26)',
  },
  frequencyBlockChosenText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: bgBigRed,
    borderRadius: 10,
    paddingHorizontal: 3,
    height: 40,
    alignItems: 'center',
  },
  inputText: {
    fontSize: 26,
    lineHeight: 30,
    width: 40,
    color: '#FFFFFF',
    textAlign: 'right',
    textAlignVertical: 'bottom',
    height: 30,
    fontWeight: 600,
    padding: 0,
    margin: 0,
  },
  inputBesideText: {
    fontSize: 16,
    color: '#FFFFFF',
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
});

function ColoredRow({
  title,
  children,
  backgroundColor,
  style,
}: {
  title: React.JSX.Element;
  children: React.ReactNode | undefined;
  backgroundColor: ColorValue;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Animated.View
      style={[
        {
          paddingHorizontal: 15,
          paddingVertical: 5,
          borderRadius: 10,
          backgroundColor,
          gap: 5,
          overflow: 'hidden',
        },
        style,
      ]}
      layout={myLayoutTransition}
    >
      <View>{title}</View>
      <View>{children}</View>
    </Animated.View>
  );
}

const PencilRow = ({
  data,
  updateData,
}: {
  data: targetRow;
  updateData: Updater<targetRow>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [t, setT] = useState(data.description);
  console.log('isEditing:', isEditing);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {isEditing ? (
        <TextInput
          value={t}
          onChangeText={(text) => {
            setT(text);
            updateData((data) => {
              data.description = text;
            });
          }}
          style={[
            { fontSize: 17, flex: 1, height: 30, lineHeight: 30, padding: 0 },
            ColoredRowStyle.bold,
          ]}
          autoFocus={true}
          cursorColor={BrandColor}
          onBlur={() => {
            setIsEditing(false);
          }}
        />
      ) : (
        <Text
          style={[
            { fontSize: 17, flex: 1, height: 30, lineHeight: 30 },
            ColoredRowStyle.bold,
          ]}
        >
          {data.description}
        </Text>
      )}
      <Pressable
        onPress={() => {
          setIsEditing(!isEditing);
        }}
      >
        <Pencil />
      </Pressable>
    </View>
  );
};
