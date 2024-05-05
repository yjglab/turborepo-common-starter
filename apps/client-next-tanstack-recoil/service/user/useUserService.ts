import { UseQueryResult, useQuery } from "@tanstack/react-query";
import queryOptions from "./queries";

export function useUsers(): UseQueryResult {
  return useQuery(queryOptions.all());
}

export function useUser({ userId }: { userId: number }) {
  return useQuery(queryOptions.detail(userId));
}

export function useArticles({ userId }: { userId: number }) {
  return useQuery(queryOptions.articles(userId));
}

export function useArticle({
  userId,
  articleId,
}: {
  userId: number;
  articleId: number;
}) {
  return useQuery(queryOptions.article({ userId, articleId }));
}
