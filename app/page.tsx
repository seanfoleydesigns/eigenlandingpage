import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import Grid from '@/components/Grid';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <TopBar />
      <Grid />
      <Footer />
    </main>
  );
}
