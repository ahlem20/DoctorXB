import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import { checkDoctorLimit } from '../utils/licenseService.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isActive) {
        res.status(401);
        throw new Error('Account deactivated');
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        permissions: user.permissions,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(401);
    res.json({ message: error.message || 'Invalid credentials' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private/Admin
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let finalRole = role;
    if (role === 'Médecin') finalRole = 'Doctor';
    else if (role === 'Infirmier(ère)') finalRole = 'Nurse';
    else if (role === 'Réceptionniste') finalRole = 'Receptionist';

    // Centralized licensing check for Doctor accounts
    if (finalRole === 'Doctor') {
      await checkDoctorLimit();
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole || 'Nurse',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        permissions: user.permissions,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400);
    res.json({ message: error.message || 'Invalid data' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      permissions: user.permissions,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.address = req.body.address !== undefined ? req.body.address : user.address;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        permissions: updatedUser.permissions,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(400);
    res.json({ message: error.message || 'Failed to update profile' });
  }
};

// @desc    Get all users (Staff)
// @route   GET /api/auth/users
// @access  Private/Doctor
const getUsers = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
  res.json(users);
};

// @desc    Update user permissions
// @route   PUT /api/auth/users/:id/permissions
// @access  Private/Doctor
const updateUserPermissions = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (!user.permissions) {
      user.permissions = {};
    }
    if (req.body.permissions && typeof req.body.permissions.viewFinance !== 'undefined') {
      user.permissions.viewFinance = req.body.permissions.viewFinance;
    }
    user.markModified('permissions');
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      role: updatedUser.role,
      permissions: updatedUser.permissions,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Doctor
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'Doctor') {
      res.status(400);
      throw new Error('Cannot delete doctor account');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, updateUserPermissions, deleteUser };
