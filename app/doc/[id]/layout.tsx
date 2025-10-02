import RoomProvider from "@/components/RoomProvider"
import { auth } from "@clerk/nextjs/server"

export default function DocLayout({
  children,
  params: { id }
} : {
  children: React.ReactNode
  params: { id: string }
}) {
  auth().protect()

  return <RoomProvider roomId={id}>{children}</RoomProvider>
}