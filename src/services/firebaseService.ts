import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Car,
  Booking,
  HomeContent,
  SiteSettings,
  BlogPost,
  defaultHomeContent,
  defaultSiteSettings,
} from '@/types';

// Cars
export const getCars = async (): Promise<Car[]> => {
  try {
    const carsRef = collection(db, 'cars');
    const snapshot = await getDocs(carsRef);
    const cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Car[];
    
    return cars.sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
    });
  } catch (error) {
    console.warn('Failed to fetch cars:', error);
    return [];
  }
};

export const getAvailableCars = async (): Promise<Car[]> => {
  try {
    const carsRef = collection(db, 'cars');
    const q = query(carsRef, where('available', '==', true));
    const snapshot = await getDocs(q);
    const cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Car[];
    
    // Sort by order then by date
    return cars.sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
    });
  } catch (error) {
    console.warn('Failed to fetch available cars:', error);
    return [];
  }
};

export const getCar = async (id: string): Promise<Car | null> => {
  const carRef = doc(db, 'cars', id);
  const snapshot = await getDoc(carRef);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate(),
    updatedAt: snapshot.data().updatedAt?.toDate(),
  } as Car;
};

export const addCar = async (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const carsRef = collection(db, 'cars');
  const docRef = await addDoc(carsRef, {
    ...car,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateCar = async (id: string, car: Partial<Car>): Promise<void> => {
  const carRef = doc(db, 'cars', id);
  await updateDoc(carRef, {
    ...car,
    updatedAt: Timestamp.now(),
  });
};

export const deleteCar = async (id: string): Promise<void> => {
  const carRef = doc(db, 'cars', id);
  await deleteDoc(carRef);
};

// Bookings
export const getBookings = async (): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      pickupDate: doc.data().pickupDate?.toDate(),
      dropoffDate: doc.data().dropoffDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Booking[];
  } catch (error) {
    console.warn('Failed to fetch bookings:', error);
    return [];
  }
};

export const getCarBookings = async (carId: string): Promise<Booking[]> => {
  const bookingsRef = collection(db, 'bookings');
  const q = query(
    bookingsRef,
    where('carId', '==', carId),
    where('status', 'in', ['pending', 'confirmed'])
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    pickupDate: doc.data().pickupDate?.toDate(),
    dropoffDate: doc.data().dropoffDate?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Booking[];
};

export const generateBookingNumber = (): string => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `GEN-${random}`;
};

export const checkDateAvailability = async (
  carId: string,
  pickupDate: Date,
  dropoffDate: Date
): Promise<boolean> => {
  const bookings = await getCarBookings(carId);
  
  for (const booking of bookings) {
    const bookingStart = new Date(booking.pickupDate);
    const bookingEnd = new Date(booking.dropoffDate);
    
    if (
      (pickupDate >= bookingStart && pickupDate <= bookingEnd) ||
      (dropoffDate >= bookingStart && dropoffDate <= bookingEnd) ||
      (pickupDate <= bookingStart && dropoffDate >= bookingEnd)
    ) {
      return false;
    }
  }
  
  return true;
};

export const addBooking = async (booking: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>): Promise<Booking> => {
  const bookingsRef = collection(db, 'bookings');
  const bookingNumber = generateBookingNumber();
  
  // Clean up the booking data to remove undefined values
  const cleanBooking = {
    ...booking,
    customerEmail: booking.customerEmail || '',
    notes: booking.notes || '',
  };
  
  const newBooking = {
    ...cleanBooking,
    bookingNumber,
    pickupDate: Timestamp.fromDate(booking.pickupDate),
    dropoffDate: Timestamp.fromDate(booking.dropoffDate),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(bookingsRef, newBooking);
  
  return {
    id: docRef.id,
    ...cleanBooking,
    bookingNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const updateBooking = async (id: string, booking: Partial<Booking>): Promise<void> => {
  const bookingRef = doc(db, 'bookings', id);
  const updateData: any = {
    ...booking,
    updatedAt: Timestamp.now(),
  };
  
  if (booking.pickupDate) {
    updateData.pickupDate = Timestamp.fromDate(booking.pickupDate);
  }
  if (booking.dropoffDate) {
    updateData.dropoffDate = Timestamp.fromDate(booking.dropoffDate);
  }
  
  await updateDoc(bookingRef, updateData);
};

export const deleteBooking = async (id: string): Promise<void> => {
  const bookingRef = doc(db, 'bookings', id);
  await deleteDoc(bookingRef);
};

// Home Content
export const getHomeContent = async (): Promise<HomeContent> => {
  try {
    const contentRef = doc(db, 'settings', 'homeContent');
    const snapshot = await getDoc(contentRef);
    if (!snapshot.exists()) return defaultHomeContent;
    return snapshot.data() as HomeContent;
  } catch (error) {
    console.warn('Failed to fetch home content, using defaults:', error);
    return defaultHomeContent;
  }
};

export const updateHomeContent = async (content: Partial<HomeContent>): Promise<void> => {
  const contentRef = doc(db, 'settings', 'homeContent');
  await setDoc(contentRef, content, { merge: true });
};

// Site Settings
export const getSiteSettings = async (): Promise<SiteSettings> => {
  const settingsRef = doc(db, 'settings', 'siteSettings');
  const snapshot = await getDoc(settingsRef);
  if (!snapshot.exists()) return defaultSiteSettings;
  return snapshot.data() as SiteSettings;
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>): Promise<void> => {
  const settingsRef = doc(db, 'settings', 'siteSettings');
  await setDoc(settingsRef, settings, { merge: true });
};

// Blog
const mapBlogPost = (id: string, data: Record<string, unknown>): BlogPost =>
  ({
    id,
    ...data,
    publishedAt: (data.publishedAt as { toDate?: () => Date })?.toDate?.() || undefined,
    createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() || new Date(),
    updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() || new Date(),
  }) as BlogPost;

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const refCol = collection(db, 'blogPosts');
    const snapshot = await getDocs(refCol);
    const posts = snapshot.docs.map((d) => mapBlogPost(d.id, d.data() as Record<string, unknown>));
    return posts.sort((a, b) => {
      const da = a.publishedAt?.getTime() || a.createdAt?.getTime() || 0;
      const db_ = b.publishedAt?.getTime() || b.createdAt?.getTime() || 0;
      return db_ - da;
    });
  } catch (error) {
    console.warn('Failed to fetch blog posts:', error);
    return [];
  }
};

export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const refCol = collection(db, 'blogPosts');
    const q = query(refCol, where('published', '==', true));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map((d) => mapBlogPost(d.id, d.data() as Record<string, unknown>));
    return posts.sort((a, b) => {
      const da = a.publishedAt?.getTime() || a.createdAt?.getTime() || 0;
      const db_ = b.publishedAt?.getTime() || b.createdAt?.getTime() || 0;
      return db_ - da;
    });
  } catch (error) {
    console.warn('Failed to fetch published blog posts:', error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const refCol = collection(db, 'blogPosts');
    const q = query(refCol, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return mapBlogPost(d.id, d.data() as Record<string, unknown>);
  } catch (error) {
    console.warn('Failed to fetch blog post by slug:', error);
    return null;
  }
};

export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
  const postRef = doc(db, 'blogPosts', id);
  const snapshot = await getDoc(postRef);
  if (!snapshot.exists()) return null;
  return mapBlogPost(snapshot.id, snapshot.data() as Record<string, unknown>);
};

export const addBlogPost = async (
  post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const refCol = collection(db, 'blogPosts');
  const payload: Record<string, unknown> = {
    ...post,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  if (post.publishedAt) {
    payload.publishedAt = Timestamp.fromDate(post.publishedAt);
  } else if (post.published) {
    payload.publishedAt = Timestamp.now();
  }
  const docRef = await addDoc(refCol, payload);
  return docRef.id;
};

export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<void> => {
  const postRef = doc(db, 'blogPosts', id);
  const payload: Record<string, unknown> = {
    ...post,
    updatedAt: Timestamp.now(),
  };
  delete payload.id;
  delete payload.createdAt;
  if (post.publishedAt instanceof Date) {
    payload.publishedAt = Timestamp.fromDate(post.publishedAt);
  }
  if (post.published === true && !post.publishedAt) {
    payload.publishedAt = Timestamp.now();
  }
  await updateDoc(postRef, payload);
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'blogPosts', id));
};
