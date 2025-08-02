import AIplanPage from '@/components/AIplanPage/AIplanPage';
import Header from '@/components/AIplanPage/header';
import LinearBackground from '@/components/public/LinearBackground';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Page() {
  return (
    <>
      <LinearBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <AIplanPage />
      </SafeAreaView>
    </>
  );
}
