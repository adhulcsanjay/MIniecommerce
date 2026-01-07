
// function getEnv(key: string): string {
//   const value = process.env[key]

//   if (!value) {
//     throw new Error(`Missing environment variable: ${key}`)
//   }

//   return value
// }

// export const CONFIG = {
//   API_BASE_URL: getEnv('NEXT_PUBLIC_API_BASE_URL'),
// }


export const CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL!,
}
