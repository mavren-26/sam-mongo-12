const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const newUsers = await User.find({ joinedAt: { $gte: sevenDaysAgo } });
console.log(newUsers);
