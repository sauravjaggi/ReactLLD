// export const fetchWithRetry = async (
//   url,
//   options = {},
//   maxRetries = 3
// ) => {
//   let lastError;

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await fetch(url, options);

//       if (!response.ok) {
//         const error = new Error(
//           `HTTP Error: ${response.status}`
//         );

//         error.status = response.status;

//         throw error;
//       }

//       return await response.json();

//     } catch (error) {
//       lastError = error;

//       // Don't retry 4xx errors
//       if (
//         error.status >= 400 &&
//         error.status < 500
//       ) {
//         throw error;
//       }

//       // Stop after final attempt
//       if (attempt === maxRetries) {
//         throw lastError;
//       }

//       console.log(
//         `Retrying... Attempt ${attempt + 1}/${maxRetries}`
//       );
//     }
//   }
// };
