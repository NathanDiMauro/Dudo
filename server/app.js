const { MongoClient, ServerApiVersion } = require('mongodb');

async function main(){
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
   const uri = "mongodb+srv://liamcannon:<1EZ8DMrEZRfbmthI>@cluster0.9og8l.mongodb.net/dudodice?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Make the appropriate DB calls
      await  listDatabases(client);

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}
async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

main().catch(console.error);


async function createProfile(pid, profileName, profilePassword) {
  const insertResult = await collection.insertMany([{ id: id}, {userName: profileName}, {password: profileName}]);
  console.log('Inserted account =>', insertResult);
}

async function getAllProfiles() {
  const findResult = await collection.find({}).toArray();
  console.log('Found profiles =>', findResult);
  return findResult;
}

async function findProfileByName(profileName) {
  const filtedProfile = await collection.find({userName: profileName});
  console.log('Found profile filted by {userName: profileName} =>', filtedProfile);
  return filtedProfile;
}

async function findProfileByID(pid) {
  const filtedID = await collection.find({id: pid});
  console.log('Found profile filted by {userName: id} =>', filtedID);
  return filtedID;
}

async function updateUserName(pid, profileName) {
  const updateResult = await collection.updateOne({id: pid}, {$set: {userName: profileName}});
  console.log('Updated username =>', updateResult);
  return updateResult;
}

async function updatePassword(pid, profilePassword) {
  const updateResult = await collection.updateOne({id: pid}, {$set: {password: profilePassword}});
  console.log('Updated username =>', updateResult);
  return updateResult;
}

async function removeAccount(pid) {
  const deleteResult = await collection.deleteMany({id: pid});
  console.log('Deleted documents =>', deleteResult);
}
