import Tabs from '../../components/Audits/Tabs';

export default function AutitPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sesje, które jeszcze nie zostały rozliczone</h1>
      <Tabs />
    </main>
  );
}