// In-memory store for users
let users = [];

// Counter for generating unique user IDs
let nextUserId = 1;

// Initial admin user data
const adminUser = {
  id: nextUserId++, // Assign the first ID and increment the counter
  name: "admin",
  email: "admin@spsgroup.com.br",
  type: "admin",
  password: "1234" // Plain text password as per requirement
};

// Add the initial admin user to the in-memory store
users.push(adminUser);
console.log('In-memory database initialized with admin user.');

class UserModel {
  async createUser(userData) {
    const { email, name, type, password } = userData;

    // Check if user already exists 
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return null; // Indicate failure due to existing email
    }

    const newUser = {
      id: nextUserId++, // Assign the next available ID
      email,
      name,
      type,
      password // Store plain text password
    };
    users.push(newUser);

    // Return the newly created user data, excluding the password
    const { password: removedPassword, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async getUserByEmail(email) {
    // Find user by email 
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    return user; // Returns the full user object including password, as needed for login check
  }

  async getUserById(id) {
    const userId = parseInt(id, 10); // Ensure ID is a number for comparison
    const user = users.find(user => user.id === userId);
    if (!user) {
      return null; // User not found
    }
    // Return user data excluding the password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers() {
    // Return all users, excluding the password for each
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async updateUser(id, userData) {
    const userId = parseInt(id, 10);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return null; // User not found
    }

    // Get the existing user
    const userToUpdate = users[userIndex];

    // Update fields provided in userData
    userToUpdate.email = userData.email !== undefined ? userData.email : userToUpdate.email;
    userToUpdate.name = userData.name !== undefined ? userData.name : userToUpdate.name;
    userToUpdate.type = userData.type !== undefined ? userData.type : userToUpdate.type;
    if (userData.password) {
      userToUpdate.password = userData.password; // Update plain text password if provided
    }

    // Update the user in the array
    users[userIndex] = userToUpdate;

    // Return the updated user data, excluding the password
    const { password, ...updatedUserWithoutPassword } = userToUpdate;
    return updatedUserWithoutPassword;
  }

  async deleteUser(id) {
    const userId = parseInt(id, 10);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return null; // User not found
    }

    // Remove user from the array
    const deletedUser = users.splice(userIndex, 1)[0];

    return { id: deletedUser.id };
  }
}

export default new UserModel();