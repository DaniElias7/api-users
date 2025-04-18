import UserService from '../services/user.services.js'; // Ensure path is correct

class UserController {
  // Handler to create a new user (Admin only)
  async createUser(req, res) {
    try {
      const loggedInUser = req.user; // User data from authMiddleware

      // Authorization check: Only admins can create users
      if (!loggedInUser || loggedInUser.type !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can create users.' });
      }

      const { email, password, name, type } = req.body; // Destructure needed fields

      // Check if email and password are provided and not empty
      if (!email || typeof email !== 'string' || email.trim() === '') {
          return res.status(400).json({ message: 'Bad Request: Email is required and cannot be empty.' });
      }
      if (!password || typeof password !== 'string' || password.trim() === '') {
          return res.status(400).json({ message: 'Bad Request: Password is required and cannot be empty.' });
      }
      
      if (!name || typeof name !== 'string' || name.trim() === '') {
          return res.status(400).json({ message: 'Bad Request: Name is required and cannot be empty.' });
      }
      if (!type || typeof type !== 'string' || type.trim() === '') {
          return res.status(400).json({ message: 'Bad Request: Type is required and cannot be empty.' });
      }

      // Call service to create user using the validated data from req.body
      const newUser = await UserService.createUser({
          email: email.trim(), // Use trimmed values
          password: password, // Pass password as is (service/model handles storage)
          name: name.trim(),
          type: type.trim()
       });
      res.status(201).json(newUser); // Send back the created user (without password)

    } catch (error) {
      if (error.message === 'El correo electrónico ya existe') {
          return res.status(409).json({ message: error.message }); // 409 Conflict is more specific
      }
      // Otherwise, return a generic bad request or server error
      res.status(400).json({ message: error.message });
    }
  }

  // Handler to get all users (Admin only)
  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Handler to get a user by ID (Admin or the user themselves)
  async getUserById(req, res) {
    try {
      const loggedInUser = req.user;
      const requestedUserId = req.params.id;

      // Authentication check 
      if (!loggedInUser) {
        return res.status(401).json({ message: 'Authentication required.' });
      }

      // Authorization check: Regular users can only view their own profile
      // Note: Comparing req.user.id (number from token) with req.params.id (string)
      if (loggedInUser.type === 'regular' && loggedInUser.id.toString() !== requestedUserId) {
        return res.status(403).json({ message: 'Forbidden: Regular users can only view their own profile.' });
      }

      // Call service to get user by ID
      const user = await UserService.getUserById(requestedUserId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Handler to update a user by ID (Admin can update anyone, Regular can update themselves with restrictions)
  async updateUser(req, res) {
    try {
      const loggedInUser = req.user;
      const userIdToUpdate = req.params.id;
      const updateData = req.body;

      // Authentication check
      if (!loggedInUser) {
        return res.status(401).json({ message: 'Authentication required.' });
      }

      // Authorization check: Regular users can only update their own profile
      if (loggedInUser.type === 'regular') {
          if (loggedInUser.id.toString() !== userIdToUpdate) {
             return res.status(403).json({ message: 'Forbidden: Regular users can only update their own profile.' });
           }
           // Prevent regular users from updating 'type' or 'email' (as per original logic)
           if (updateData.type !== undefined || updateData.email !== undefined) {
             // It might be better to just ignore these fields silently for regular users
             // Or return an error as done here.
             return res.status(403).json({ message: 'Forbidden: Regular users cannot update their type or email.' });
           }
           // Ensure regular users cannot escalate privileges by trying to update type
            delete updateData.type;
            delete updateData.email; // Ensure email is not changed by regular user via this endpoint
      } else if (loggedInUser.type !== 'admin') {
           // If user type is neither 'regular' nor 'admin', deny access
           return res.status(403).json({ message: 'Forbidden: Unauthorized action.' });
      }
      // Admins can update any field for any user (including type and email)

      // Call service to update the user
      const updatedUser = await UserService.updateUser(userIdToUpdate, updateData);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      // Handle potential errors like validation or conflicts
      res.status(400).json({ message: error.message });
    }
  }

  // Handler to delete a user by ID (Admin only)
  async deleteUser(req, res) {
    try {
      const loggedInUser = req.user;
      const userIdToDelete = req.params.id;

      // Authorization check: Only admins can delete users
      if (!loggedInUser || loggedInUser.type !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can delete users.' });
      }

      // Prevent admin from deleting themselves 
      if (loggedInUser.id.toString() === userIdToDelete) {
          return res.status(403).json({ message: 'Forbidden: Admins cannot delete their own account.' });
      }

      // Call service to delete the user
      const deletedUser = await UserService.deleteUser(userIdToDelete);
      if (deletedUser) {
        res.status(204).send(); // No Content success status for DELETE
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default UserController; // Export the class