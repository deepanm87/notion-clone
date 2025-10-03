"use server"

import { adminDb } from "@/firebase-admin"
import liveblocks from "@/lib/liveblocks"
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

export async function inviteUserToDocument(roomId: string, email: string) {
   const {userId} = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }
  
  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId
      })

      return {
        success: true
      }
  } catch (error) {
    console.error(error)
    return {
      success: false
    }
  }
}

export async function removeUserFromDocument(roomId: string, email: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    await adminDb 
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete()

      return {
        success: true
      }
  } catch (error) {
    console.error(error)
    return {
      success: false
    }
  }
}

export async function deleteDocument(roomId: string) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    await adminDb.collection("documents").doc(roomId).delete()

    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get()
    const batch = adminDb.batch()

    query.docs.forEach(doc => {
      batch.delete(doc.ref)
    })

    await batch.commit()

    await liveblocks.deleteRoom(roomId)

    return { success: true } 
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}