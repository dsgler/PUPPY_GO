import { BrandColor } from '@/consts/tabs';
import { StyleSheet } from 'react-native';

export const TopBarStyle = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 25,
    alignItems: 'center',
    boxShadow:
      '0 6 30 rgba(0,0,0,0.05),0 16 24 rgba(0,0,0,0.04),0 8 10 rgba(0,0,0,0.08)',
    marginTop: 10,
    marginBottom: 30,
  },
  left: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 5,
    marginVertical: 5,
    borderRadius: 20,
  },
  middle: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 20,
  },
  right: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 5,
    marginVertical: 5,
    borderRadius: 20,
  },
  chosen: {
    backgroundColor: '#FFE7CA',
    borderRadius: 20,
  },
  chosenText: { fontSize: 16, textAlign: 'center', color: BrandColor },
  unchosen: {},
  unchosenText: { fontSize: 16, textAlign: 'center' },
  TouchableRipple: { flex: 1, borderRadius: 20 },
});
