import { StyleSheet } from 'react-native';

export const ViewStyle = StyleSheet.create({
  Text: { fontSize: 16 },
  preInputText: { width: 80, fontSize: 16 },
  Input: { flex: 1, fontSize: 16, lineHeight: 36, padding: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#e7e7e7',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  mainText: { fontSize: 24, fontWeight: 500, marginBottom: 5 },
  subText: { fontSize: 12, color: 'rgba(0,0,0,0.6)' },
});
