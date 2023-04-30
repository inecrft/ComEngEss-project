const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

exports.getReminders = async (req, res) => {
  const params = {
    TableName: process.env.aws_reminders_table_name,
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    console.log(data);
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.addNewUser = async (req, res) => {
  const item = { ...req.body, reminders: [] };

  const params = {
    TableName: process.env.aws_reminders_table_name,
    Item: item,
  };
  try {
    const data = await docClient.send(new PutCommand(params));
    console.log("Success - item added or updated", item);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.addReminder = async (req, res) => {
  const item = { ...req.body };

  const params = {
    TableName: process.env.aws_reminders_table_name,
    Item: item,
  };
  try {
    const data = await docClient.send(new PutCommand(params));
    console.log("Success - item added or updated", item);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
