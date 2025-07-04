import type { Metadata } from 'next'
import ParthenonServerPage from 'app/parthenon/ParthenonServerPage'

export const metadata: Metadata = {
  title: 'Parthenon Minecraft Server',
  description: 'Dashboard to start and stop minecraft server',
  icons: '/assets/favicon-32.ico',
}

export default function ParthenonPage() {
  return (
    <ParthenonServerPage />
  );
}
