import UserModel from '../models/user.model.js';

class UserService {
  async createUser(userData) {
    // Check for existing email before attempting to create
    const existingUser = await UserModel.getUserByEmail(userData.email);
    if (existingUser) {
      // Throw error if email already exists, as in the original code
      throw new Error('El correo electrónico ya existe');
    }
    // Proceed to create user if email is unique
    const newUser = await UserModel.createUser(userData);
    if (!newUser) {
        // Handle case where UserModel.createUser indicates failure (though shouldn't happen with current check)
        throw new Error('Failed to create user.');
    }
    return newUser;
  }

  async getAllUsers() {
    return UserModel.getAllUsers();
  }

  async getUserById(id) {
    return UserModel.getUserById(id);
  }

  async updateUser(id, userData) {
    return UserModel.updateUser(id, userData);
  }

  async deleteUser(id) {
    return UserModel.deleteUser(id);
  }
}

export default new UserService();