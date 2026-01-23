const userRepo = require('../repositories/userRepository');
const bcrypt = require('bcrypt');

const updateUserProfile = async (userId, profilePictureUrl) => {
  // 1. Get User
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // 2. Apply Business Logic
  if (profilePictureUrl) {
    user.profilePicture = profilePictureUrl;

    // Logic: Only add to history if it's not already there
    if (!user.profilePictureHistory.includes(profilePictureUrl)) {
      user.profilePictureHistory.push(profilePictureUrl);
    }
  }

  // 3. Save via Repo
  const savedUser = await userRepo.save(user);

  // 4. Sanitize (Remove password before returning)
  const { password, ...userData } = savedUser._doc;
  return userData;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  // 1. Get User (include password field explicitly if your schema hides it)
  const user = await userRepo.findById(userId);
  if (!user) throw new Error('User not found');

  // 2. Verify Old Password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error('Incorrect current password');
  }

  // 3. Hash New Password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // 4. Save
  await userRepo.save(user);

  return { message: "Password updated successfully" };
};


module.exports = {
  updateUserProfile,
  changePassword
};