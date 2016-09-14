export const user = ({user}) => ({
  userState: user.state,
  user: user.data
});

export const users = ({users}) => ({
  users: users.users,
  usersStates: users.states
});
