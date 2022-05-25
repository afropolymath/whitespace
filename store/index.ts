import { observable } from 'mobx';
import { User } from 'firebase/auth';

export interface IAuthStore {
  user: User;
  isLoggedIn: Boolean;
  setUser: (user: User) => void;
}

export const authStore: IAuthStore = observable<IAuthStore>({
  user: null,
  get isLoggedIn() {
    return !!authStore.user;
  },
  setUser(user) {
    authStore.user = user;
  },
});

export const storiesStore = observable({
  stories: [],
  setStories(stories) {
    storiesStore.stories = stories;
  },
});
