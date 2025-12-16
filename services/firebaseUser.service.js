export const normalizeFirebaseUser = (firebaseUser) => {
    return {
      firebaseUid: firebaseUser.uid,
      phone: firebaseUser.phone_number || null,
      name: firebaseUser.name || null,
    };
  };
  