const userRepo = require('../repositories/userRepository');

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

module.exports = {
  updateUserProfile
};