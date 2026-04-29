import mongoose from "mongoose";
import userModel from "../models/user.js";

mongoose.set("debug", true);


function getUsers(name, job) {
  if (name != undefined && job != undefined) {
    return userModel.find({ name: name, job: job });
  }
  if (name != undefined) {
    return findUserByName(name);
  }
  if (job != undefined) {
    return findUserByJob(job);
  }
  return userModel.find();
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

// returns promise for result of deletion
function removeUserById(id) {
    return userModel.findByIdAndDelete(id);
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  removeUserById
};