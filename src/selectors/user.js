export const user = ({user}) => ({
  followingStates: user.followingStates,
  userState: user.state,
  user: user.data
});

export const users = ({users}) => ({
  users: users.users,
  usersStates: users.states
});
