import { ResponseParamsList as ResponseParams } from "@app-store/apps/mini-blog/api-contracts/posts/list";
import PostEntity from "@app-store/apps/mini-blog/business-logic/Post";
import HttpError from "@app-store/shared/helpers/errors/HttpError";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return;

  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json("Not authenticated");

  const entity = new PostEntity();

  try {
    const response: ResponseParams = await entity.list(session.user.id);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
