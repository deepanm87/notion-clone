"use server"

import { adminDb } from "@/firebase-admin"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function createNewDocument() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  // Get the full user object which includes email
  const user = await currentUser()

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    throw new Error("User email not found")
  }

  const userEmail = user.emailAddresses[0].emailAddress

  const docCollectionRef = adminDb.collection("documents")
  const docRef = await docCollectionRef.add({
    title: "New Doc"
  })

  await adminDb
    .collection("users")
    .doc(userEmail)
    .collection('rooms')
    .doc(docRef.id)
    .set({
      userId: userEmail,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id
    })

  return { docId: docRef.id }
}