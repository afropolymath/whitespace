import { observable } from 'mobx';

export interface IAuthStore {
  user: firebase.User;
  isLoggedIn: Boolean;
  setUser: (user: firebase.User) => void;
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
