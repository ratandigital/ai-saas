import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const incrementApiLimit = async (messageCount: Number, promtCount: Number) => {
  const { userId } = auth();
  let messageToken = Number(messageCount) * 100 / 75;
  let promtToken = Number(promtCount) * 100 / 75;
const totalTokenUsge = messageToken + promtToken
  if (!userId) {
    return;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId: userId },
      data: { count: userApiLimit.count + totalTokenUsge },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userId: userId, count: totalTokenUsge},
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userId: userId },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId
    }
  });

  if (!userApiLimit) {
    return 0;
  }

  return userApiLimit.count;
};







export const testLimit = async (chatMassage: string, prompt: string) => {
  try {
    const { userId } = auth();
    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    const ansMassage = chatMassage; // Directly use chatMassage
    const promtMassage = prompt; // Use 'prompt' with the correct type

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: { userId },
    });

    if (userApiLimit) {
      // Create the testApiLimit
      const newTestApiLimit = await prismadb.testApiLimit.create({
        data: {
          userId: userId,
          promtMassage: ansMassage,
          ansMassage: promtMassage,
        },
      });

  
      // Update UserApiLimit to include the new testApiLimit ID
      await prismadb.userApiLimit.update({
        where: { userId },
        data: {
          testApiLimitIds: {
            push: newTestApiLimit.id, // Add new ID to the array
          },
        },
      });
    } else {
      console.error("Error: No API limit found for this user.");
    }
  } catch (error) {
    console.error("Error creating testApiLimit:", error);
  }
};



export const ImageCreate = async (chatMassage: string, promt: string) => {
  try {
    const { userId } = auth();
    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    const ansMassage = chatMassage;
    const promtMassage = promt;

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: { userId: userId },
    });

    if (userApiLimit) {
      // Create a new imageCreate entry linked by userId
   let imageGen=   await prismadb.imageCreate.create({
        data: {
          userId: userId,
          promtMassage: ansMassage,
          ansMassage: promtMassage,
        },
      });
      await prismadb.userApiLimit.update({
        where: { userId },  // Update by userId in userApiLimit table
        data: {
          imageCreateId: {  // Assuming you have an array field named 'imageCreateIds' on the userApiLimit table
            push: imageGen.id, // Add new imageGen.id to the array
          },
        },
      });
      
    } else {
      console.error("Error: No API limit found for this user.");
    }
  } catch (error) {
    console.error("Error creating imageCreate:", error);
  }
};
