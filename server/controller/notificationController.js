import {
  dbGetAllNotificationToken,
  dbGetUserNotificationToken,
} from "../model/notificationTable.js";
import { Expo } from "expo-server-sdk";

let expo = new Expo();

const notifyAllUsers = async (req, res, next) => {
  try {
    const { message } = req.body;
    const tokens = await dbGetAllNotificationToken();
    const tokensArray = tokens.map((token) => {
      return token.token;
    });
    const tickets = await sendNotification(buildMessage(message, tokensArray));

    res.status(200).json({ res: tickets, status: "ok" });
  } catch (error) {
    next(error);
  }
};

const notifyUser = async (req, res, next) => {
  try {
    const { message, userId } = req.body;
    const token = await dbGetUserNotificationToken(userId);

    const tokensArray = token.map((token) => {
      return token.token;
    });

    const tickets = await sendNotification(buildMessage(message, tokensArray));

    res.status(200).json({ res: "Notification sent", status: "ok" });
  } catch (error) {
    next(error);
  }
};

const buildMessage = (message = "", tokens = []) => {
  let messages = [];

  for (let pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    messages.push({
      to: pushToken,
      sound: "default",
      body: message,
      data: { withSome: "data" },
    });
  }

  return messages;
};

const sendNotification = async (messages) => {
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      //  console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }

  return tickets;
};

export { notifyAllUsers, notifyUser };
