import axios from "axios";

export const getNxtWaveToken = async (isPrime) => {
  if (
    !process.env.NXTWAVE_PRIME_USERNAME ||
    !process.env.NXTWAVE_PRIME_PASSWORD ||
    !process.env.NXTWAVE_FREE_USERNAME ||
    !process.env.NXTWAVE_FREE_PASSWORD
  ) {
    throw new Error(
      "NxtWave API credentials are not fully defined in environment variables.",
    );
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
  try {
    const response = await axios.get("https://apis.ccbp.in/login", {
      auth: credentials,
    });
    if (response.status === 200 && response.data?.jwt_token) {
      return {success: true, token: response.data?.jwt_token};
    } else {
        console.error("Unexpected response from NxtWave API. Status:", response.status);
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
  }
};
