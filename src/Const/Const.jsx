
const STATE = "development" // "development" or "production"

export const WCA_BASE_URL = "https://www.worldcubeassociation.org"

export const WCA_CLIENT_ID = "CMQwkEvQoMV3XXQkwLqyTu5B7oD9W0RcjbjJ4P3CPIA"

export const WCA_REDIRECT_URI = STATE === "development" ? "http://localhost:5173" : "https://groupmaster.vercel.app"