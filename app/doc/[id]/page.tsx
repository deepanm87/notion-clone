"use client"

import Document from "@/components/Document"
import { useErrorListener } from "@liveblocks/react/suspense"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


export default function DocumentPage({ params: { id } }: { params: { id: string }}) {
  const router = useRouter()

  useErrorListener(error => {
    switch (error.code) {
      case -1:
        router.push("/")
        toast.error("You are not authorized to enter this room")
        break

      case 4001:
        break

      case 4005:
        break
      
        case 4006:
          const newRoomId = error.message
          router.push(`/doc/${newRoomId}`)
          break
    }
  })

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} />
    </div>
  )
}