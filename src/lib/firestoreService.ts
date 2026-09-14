import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  ResourceItem,
  ChatGroup,
  GroupMessage,
  DirectMessage,
  ProjectCredits,
  PlatformAnnouncement,
  FreelanceGig,
  LiveClass,
  UserProfile,
  BannedUserRecord,
  AcademicSubject,
  AcademicBranch,
  CollegeStats,
} from '../types';
import {
  sampleResources,
  sampleChatGroups,
  sampleGroupMessages,
  initialProjectCredits,
  sampleAnnouncements,
  sampleGigs,
  sampleLiveClasses,
  initialAcademicSubjects,
  initialAcademicBranches,
  initialCollegeStats,
} from '../mockData';

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  RESOURCES: 'resources',
  ACADEMIC_SUBJECTS: 'academicSubjects',
  ACADEMIC_BRANCHES: 'academicBranches',
  COLLEGE_STATS: 'collegeStats',
  CHAT_GROUPS: 'chatGroups',
  GROUP_MESSAGES: 'groupMessages',
  DIRECT_MESSAGES: 'directMessages',
  PROJECT_CREDITS: 'projectCredits',
  ANNOUNCEMENTS: 'announcements',
  GIGS: 'gigs',
  LIVE_CLASSES: 'liveClasses',
  BANNED_USERS: 'bannedUsers',
} as const;

// 1. Initial Firestore Seeding helper
export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    // Check academic subjects
    const subSnap = await getDocs(collection(db, COLLECTIONS.ACADEMIC_SUBJECTS));
    if (subSnap.empty) {
      console.log('Seeding Academic Subjects to Cloud Firestore...');
      for (const subj of initialAcademicSubjects) {
        await setDoc(doc(db, COLLECTIONS.ACADEMIC_SUBJECTS, subj.id), subj);
      }
    }

    // Check academic branches
    const branchSnap = await getDocs(collection(db, COLLECTIONS.ACADEMIC_BRANCHES));
    if (branchSnap.empty) {
      console.log('Seeding Academic Branches to Cloud Firestore...');
      for (const b of initialAcademicBranches) {
        await setDoc(doc(db, COLLECTIONS.ACADEMIC_BRANCHES, b.code), b);
      }
    }

    // Check college stats
    const statsDoc = await getDoc(doc(db, COLLECTIONS.COLLEGE_STATS, 'jdcoem_overview'));
    if (!statsDoc.exists()) {
      console.log('Seeding College Stats to Cloud Firestore...');
      await setDoc(doc(db, COLLECTIONS.COLLEGE_STATS, 'jdcoem_overview'), initialCollegeStats);
    }

    // Check resources
    const resSnap = await getDocs(collection(db, COLLECTIONS.RESOURCES));
    if (resSnap.empty) {
      console.log('Seeding initial Resources to Cloud Firestore...');
      for (const res of sampleResources) {
        await setDoc(doc(db, COLLECTIONS.RESOURCES, res.id), res);
      }
    }

    // Check Chat Groups
    const groupSnap = await getDocs(collection(db, COLLECTIONS.CHAT_GROUPS));
    if (groupSnap.empty) {
      console.log('Seeding initial Chat Groups to Cloud Firestore...');
      for (const group of sampleChatGroups) {
        await setDoc(doc(db, COLLECTIONS.CHAT_GROUPS, group.id), group);
      }
    }

    // Check Group Messages
    const msgSnap = await getDocs(collection(db, COLLECTIONS.GROUP_MESSAGES));
    if (msgSnap.empty) {
      console.log('Seeding initial Group Messages to Cloud Firestore...');
      for (const [groupId, msgs] of Object.entries(sampleGroupMessages)) {
        for (const msg of msgs) {
          await setDoc(doc(db, COLLECTIONS.GROUP_MESSAGES, msg.id), {
            ...msg,
            groupId,
          });
        }
      }
    }

    // Check Project Credits
    const creditDoc = await getDoc(doc(db, COLLECTIONS.PROJECT_CREDITS, 'academic_credits'));
    if (!creditDoc.exists()) {
      console.log('Seeding Project Credits (HOD & Contributors) to Cloud Firestore...');
      await setDoc(doc(db, COLLECTIONS.PROJECT_CREDITS, 'academic_credits'), {
        ...initialProjectCredits,
        updatedAt: new Date().toISOString(),
      });
    }

    // Check Announcements
    const annSnap = await getDocs(collection(db, COLLECTIONS.ANNOUNCEMENTS));
    if (annSnap.empty) {
      for (const ann of sampleAnnouncements) {
        await setDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, ann.id), ann);
      }
    }

    // Check Gigs
    const gigSnap = await getDocs(collection(db, COLLECTIONS.GIGS));
    if (gigSnap.empty) {
      for (const gig of sampleGigs) {
        await setDoc(doc(db, COLLECTIONS.GIGS, gig.id), gig);
      }
    }

    // Check Live Classes
    const liveSnap = await getDocs(collection(db, COLLECTIONS.LIVE_CLASSES));
    if (liveSnap.empty) {
      for (const lc of sampleLiveClasses) {
        await setDoc(doc(db, COLLECTIONS.LIVE_CLASSES, lc.id), lc);
      }
    }
  } catch (err) {
    console.warn('Firestore auto-seed notice (will retry or use offline fallback):', err);
  }
}

// 2. Real-time Project Credits
export function subscribeToProjectCredits(
  callback: (credits: ProjectCredits) => void
): Unsubscribe {
  const creditRef = doc(db, COLLECTIONS.PROJECT_CREDITS, 'academic_credits');
  return onSnapshot(
    creditRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as ProjectCredits);
      } else {
        callback(initialProjectCredits);
      }
    },
    (error) => {
      console.error('Error listening to Project Credits:', error);
    }
  );
}

export async function saveProjectCreditsToFirestore(
  credits: ProjectCredits
): Promise<void> {
  const creditRef = doc(db, COLLECTIONS.PROJECT_CREDITS, 'academic_credits');
  await setDoc(creditRef, {
    ...credits,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

// 3. Real-time Resources
export function subscribeToResources(
  callback: (resources: ResourceItem[]) => void
): Unsubscribe {
  const q = collection(db, COLLECTIONS.RESOURCES);
  return onSnapshot(
    q,
    (snapshot) => {
      const items: ResourceItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as ResourceItem), id: docSnap.id });
      });
      if (items.length > 0) {
        callback(items);
      }
    },
    (error) => {
      console.error('Error listening to resources:', error);
    }
  );
}

export async function addResourceToFirestore(
  resource: ResourceItem
): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.RESOURCES, resource.id), resource);
}

export async function updateResourceInFirestore(
  id: string,
  updates: Partial<ResourceItem>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.RESOURCES, id), updates);
}

export async function deleteResourceFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.RESOURCES, id));
}

// 3.1 Real-time Academic Subjects
export function subscribeToAcademicSubjects(
  callback: (subjects: AcademicSubject[]) => void
): Unsubscribe {
  const q = collection(db, COLLECTIONS.ACADEMIC_SUBJECTS);
  return onSnapshot(
    q,
    (snapshot) => {
      const subjects: AcademicSubject[] = [];
      snapshot.forEach((docSnap) => {
        subjects.push({ ...(docSnap.data() as AcademicSubject), id: docSnap.id });
      });
      if (subjects.length > 0) {
        callback(subjects);
      }
    },
    (error) => {
      console.warn('Firestore academic subjects listener warning:', error);
    }
  );
}

export async function saveAcademicSubjectToFirestore(subject: AcademicSubject): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.ACADEMIC_SUBJECTS, subject.id), subject, { merge: true });
}

export async function deleteAcademicSubjectFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.ACADEMIC_SUBJECTS, id));
}

// 3.2 Real-time Academic Branches
export function subscribeToAcademicBranches(
  callback: (branches: AcademicBranch[]) => void
): Unsubscribe {
  const q = collection(db, COLLECTIONS.ACADEMIC_BRANCHES);
  return onSnapshot(
    q,
    (snapshot) => {
      const branches: AcademicBranch[] = [];
      snapshot.forEach((docSnap) => {
        branches.push({ ...(docSnap.data() as AcademicBranch), code: docSnap.id });
      });
      if (branches.length > 0) {
        callback(branches);
      }
    },
    (error) => {
      console.warn('Firestore academic branches listener warning:', error);
    }
  );
}

export async function saveAcademicBranchToFirestore(branch: AcademicBranch): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.ACADEMIC_BRANCHES, branch.code), branch, { merge: true });
}

export async function deleteAcademicBranchFromFirestore(code: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.ACADEMIC_BRANCHES, code));
}

// 3.3 Real-time College Stats & Courses
export function subscribeToCollegeStats(
  callback: (stats: CollegeStats) => void
): Unsubscribe {
  const docRef = doc(db, COLLECTIONS.COLLEGE_STATS, 'jdcoem_overview');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as CollegeStats);
      }
    },
    (error) => {
      console.warn('Firestore college stats listener warning:', error);
    }
  );
}

export async function saveCollegeStatsToFirestore(stats: CollegeStats): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.COLLEGE_STATS, 'jdcoem_overview'), stats, { merge: true });
}

// 4. Real-time Chat Groups
export function subscribeToChatGroups(
  callback: (groups: ChatGroup[]) => void
): Unsubscribe {
  const q = collection(db, COLLECTIONS.CHAT_GROUPS);
  return onSnapshot(
    q,
    (snapshot) => {
      const groups: ChatGroup[] = [];
      snapshot.forEach((docSnap) => {
        groups.push({ ...(docSnap.data() as ChatGroup), id: docSnap.id });
      });
      if (groups.length > 0) {
        callback(groups);
      }
    },
    (error) => {
      console.error('Error listening to chat groups:', error);
    }
  );
}

export async function saveChatGroupToFirestore(group: ChatGroup): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.CHAT_GROUPS, group.id), group);
}

export async function deleteChatGroupFromFirestore(groupId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.CHAT_GROUPS, groupId));
}

// 5. Real-time Group Messages
export function subscribeToGroupMessages(
  callback: (messagesByGroup: Record<string, GroupMessage[]>) => void
): Unsubscribe {
  const q = collection(db, COLLECTIONS.GROUP_MESSAGES);
  return onSnapshot(
    q,
    (snapshot) => {
      const grouped: Record<string, GroupMessage[]> = {};
      snapshot.forEach((docSnap) => {
        const msg = { ...(docSnap.data() as GroupMessage & { groupId: string }), id: docSnap.id };
        const gId = msg.groupId;
        if (gId) {
          if (!grouped[gId]) grouped[gId] = [];
          grouped[gId].push(msg);
        }
      });

      // Sort messages chronologically
      for (const gId in grouped) {
        grouped[gId].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      }

      callback(grouped);
    },
    (error) => {
      console.error('Error listening to group messages:', error);
    }
  );
}

export async function addGroupMessageToFirestore(
  groupId: string,
  message: GroupMessage
): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.GROUP_MESSAGES, message.id), {
    ...message,
    groupId,
    createdAt: message.createdAt || Date.now(),
  });
}

export async function deleteGroupMessageFromFirestore(messageId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.GROUP_MESSAGES, messageId));
}

export async function updateGroupMessageReactionsInFirestore(
  messageId: string,
  reactions: Record<string, string[]>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.GROUP_MESSAGES, messageId), {
    reactions,
  });
}

// 6. Real-time Direct Messages
export function subscribeToDirectMessages(
  callback: (dms: Record<string, DirectMessage[]>) => void
): Unsubscribe {
  const q = collection(db, COLLECTIONS.DIRECT_MESSAGES);
  return onSnapshot(
    q,
    (snapshot) => {
      const dms: Record<string, DirectMessage[]> = {};
      snapshot.forEach((docSnap) => {
        const dm = { ...(docSnap.data() as DirectMessage), id: docSnap.id };
        const otherUser = (dm.senderId === 'user-101' ? (dm.receiverId || dm.conversationPartnerId) : dm.senderId) || 'unknown';
        if (!dms[otherUser]) dms[otherUser] = [];
        dms[otherUser].push(dm);
      });

      for (const key in dms) {
        dms[key].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      }

      callback(dms);
    },
    (error) => {
      console.error('Error listening to DMs:', error);
    }
  );
}

export async function addDirectMessageToFirestore(dm: DirectMessage): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.DIRECT_MESSAGES, dm.id), {
    ...dm,
    createdAt: dm.createdAt || Date.now(),
  });
}

// 7. Banned Users & Moderation
export function subscribeToBannedUsers(
  callback: (bannedList: BannedUserRecord[]) => void
): Unsubscribe {
  const q = collection(db, COLLECTIONS.BANNED_USERS);
  return onSnapshot(
    q,
    (snapshot) => {
      const list: BannedUserRecord[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as BannedUserRecord), id: docSnap.id });
      });
      callback(list);
    },
    (error) => {
      console.warn('Firestore banned users listener warning:', error);
    }
  );
}

export async function saveBannedUserToFirestore(record: BannedUserRecord): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.BANNED_USERS, record.userId || record.id), record, { merge: true });
  // Also sync on user doc if it exists
  if (record.userId) {
    await updateDoc(doc(db, COLLECTIONS.USERS, record.userId), {
      isBanned: record.status === 'active_ban',
      banReason: record.reason,
      bannedAt: record.bannedAt,
      bannedBy: record.bannedBy,
      banDuration: record.duration,
    }).catch(() => {
      // User doc might not exist yet, that's okay
    });
  }
}

export async function removeBannedUserFromFirestore(userId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.BANNED_USERS, userId));
  await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
    isBanned: false,
    banReason: null,
    bannedAt: null,
    bannedBy: null,
  }).catch(() => {});
}

// 8. User Profile Avatar and Field Updates
export async function updateUserProfileAvatarInFirestore(userId: string, avatarUrl: string): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.USERS, userId), {
    avatar: avatarUrl,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function updateUserBanStatusInFirestore(
  userId: string,
  isBanned: boolean,
  banDetails?: { reason?: string; bannedAt?: string; duration?: string; bannedBy?: string }
): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.USERS, userId), {
    isBanned,
    banReason: banDetails?.reason || null,
    bannedAt: banDetails?.bannedAt || null,
    banDuration: banDetails?.duration || null,
    bannedBy: banDetails?.bannedBy || null,
  }, { merge: true });
}
