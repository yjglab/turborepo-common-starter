import { Article, User } from "@/model/user.model";
import Service from "..";

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

export default new UserService();
