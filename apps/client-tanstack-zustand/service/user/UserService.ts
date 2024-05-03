import Service from "@/service/Service";
import { Article, User } from "@/model/user";

class UserService extends Service {
  getUsers() {
    return this.http.get<User[]>(`/users`);
  }

  getUser(userId: number) {
    return this.http.get<User>(`/user/${userId}`);
  }

  getArticles(userId: number) {
    return this.http.get<Article[]>(`/user/${userId}/articles`);
  }

  getArticle({ userId, articleId }: { userId: number; articleId: number }) {
    return this.http.get<Article[]>(`/user/${userId}/articles/${articleId}`);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UserService();
