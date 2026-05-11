export const checkPrimeStatus = async (user) => {
  // User is required to check prime status
  if (!user) {
    throw new Error("User object is required to check prime status.");
  }

  if (!user.isPrime && !user.primeExpiresAt) {
    // User is not prime and has no expiration date, so no update is needed
    return {updated: false, user};
  }

  if (!user.isPrime && user.primeExpiresAt) {
    // User is not prime but has an expiration date, which means they were prime before
    user.primeExpiresAt = null; // Clear the expiration date since they are no longer prime
    try {
        await user.save(); // Save the updated user document to the database
        return {updated: true, user};
    }
    catch (error) {
        throw new Error("Error updating user prime status: " + error.message);
    }
  }

  // Check if the user's prime status has expired
  const now = new Date();
  if (user.isPrime && user.primeExpiresAt && user.primeExpiresAt < now) {
    user.isPrime = false; // Update prime status to false if expired
    user.primeExpiresAt = null; // Clear the expiration date
    try {
        await user.save(); // Save the updated user document to the database
        return {updated: true, user};
    }
    catch (error) {
        throw new Error("Error updating user prime status: " + error.message);
    }
  }
  return {updated: false, user};
};