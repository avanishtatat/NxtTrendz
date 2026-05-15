import axios from "axios";

const tokenCache = {
  prime: { token: null, expiresAt: null },
  free: { token: null, expiresAt: null },
};

const pendingRequests = {
  prime: null,
  free: null,
};

const REQUIRED_ENV = [
  "NXTWAVE_PRIME_USERNAME",
  "NXTWAVE_PRIME_PASSWORD",
  "NXTWAVE_FREE_USERNAME",
  "NXTWAVE_FREE_PASSWORD",
];

REQUIRED_ENV.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(
      `Environment variable ${envVar} is not defined. Server cannot start without it.`,
    );
  }
});

export const getNxtWaveToken = async (isPrime) => {
  const cacheKey = isPrime ? "prime" : "free";
  const cached = tokenCache[cacheKey];
  const now = new Date();
  if (cached.token && cached.expiresAt && cached.expiresAt > now) {
    return { success: true, token: cached.token };
  }

  if (pendingRequests[cacheKey]) {
    return pendingRequests[cacheKey];
  }
  const credentials = isPrime
    ? {
        username: process.env.NXTWAVE_PRIME_USERNAME,
        password: process.env.NXTWAVE_PRIME_PASSWORD,
      }
    : {
        username: process.env.NXTWAVE_FREE_USERNAME,
        password: process.env.NXTWAVE_FREE_PASSWORD,
      };
  const fetchPromise = (async () => {
    try {
      const response = await axios.post(
        "https://apis.ccbp.in/login",
        credentials,
      );
      if (response.status === 200 && response.data?.jwt_token) {
        const newToken = response.data?.jwt_token;
        tokenCache[cacheKey] = {
          token: newToken,
          expiresAt: new Date(now.getTime() + 55 * 60 * 1000), // Cache for 55 minutes to be safe (tokens expire in 1 hour)
        };
        return { success: true, token: newToken };
      } else {
        console.error(
          "Unexpected response from NxtWave API. Status:",
          response.status,
        );
        return {
          success: false,
          error: "Failed to authenticate with NxtWave API.",
        };
      }
    } catch (error) {
      console.error("Error in nxtWaveProxy:", error);
      return {
        success: false,
        error: "An error occurred while connecting to NxtWave API.",
      };
    } finally {
      pendingRequests[cacheKey] = null; // Clear pending request after completion
    }
  })();
  pendingRequests[cacheKey] = fetchPromise;
  return fetchPromise;
};
