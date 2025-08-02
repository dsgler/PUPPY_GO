import AddPage from '@/components/addPage/addPage';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { router } from 'expo-router';
import { useUIStore } from '@/store/alertStore';

export default function Add() {
  const showConfirm = useUIStore((s) => s.showConfirm);

  useEffect(() => {
    const i = BackHandler.addEventListener('hardwareBackPress', () => {
      showConfirm('确认退出吗？', router.back);
      return true;
    });

    return () => {
      i.remove();
    };
  }, [showConfirm]);

  return <AddPage />;
}
