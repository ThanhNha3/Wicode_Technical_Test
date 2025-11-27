class UserService {
  async getUsers() {
    const res = await fetch(`https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json`);
    if (!res.ok) throw new Error('Error fetching users');
    return res.json();
  }
}

const userService = new UserService();
export default userService;