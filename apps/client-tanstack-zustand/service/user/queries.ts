import UserService from "./UserService";

const queryKeys = {
  all: ["users"] as const,
  detail: (userId: number) => [...queryKeys.all, userId] as const,
  detailArticles: (userId: number) =>
    [...queryKeys.detail(userId), "articles"] as const,
  detailArticle: ({
    userId,
    articleId,
  }: {
    userId: number;
    articleId: number;
  }) => [...queryKeys.detailArticles(userId), articleId] as const,
};

const queryOptions = {
  all: () => ({
    queryKey: queryKeys.all,
    queryFn: () => UserService.getUsers(),
  }),
  detail: (userId: number) => ({
    queryKey: queryKeys.detail(userId),
    queryFn: () => UserService.getUser(userId),
  }),
  articles: (userId: number) => ({
    queryKey: queryKeys.detailArticles(userId),
    queryFn: () => UserService.getArticles(userId),
  }),
  article: ({ userId, articleId }: { userId: number; articleId: number }) => ({
    queryKey: queryKeys.detailArticle({ userId, articleId }),
    queryFn: () => UserService.getArticle({ userId, articleId }),
  }),
};

export default queryOptions;
