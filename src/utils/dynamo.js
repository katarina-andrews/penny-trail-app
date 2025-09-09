import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

export const listAllItems = async (tableName) => {
  try {
    const command = new ScanCommand({ TableName: tableName });
    const response = await docClient.send(command);
    console.log(response);

    return response.Items || [];
  } catch (err) {
    console.log(err.message);
    return [];
  }
};

export const createItem = async (tableName, item) => {
  const command = new PutCommand({ TableName: tableName, Item: item });
  const response = await docClient.send(command);

  console.log(response);
  return item;
};

export const getItem = async (tableName, key) => {
  const res = await docClient.send(new GetCommand({ TableName: tableName, Key: key }));
  return res.Item ?? null;
};

export const updateItem = async (tableName, key, changes) => {
  const names = {};
  const values = {};
  const sets = [];
  let i = 0;
  for (const [k, v] of Object.entries(changes)) {
    const n = `#n${i}`, val = `:v${i}`;
    names[n] = k;
    values[val] = v;
    sets.push(`${n} = ${val}`);
    i++;
  }
  const res = await docClient.send(new UpdateCommand({
    TableName: tableName,
    Key: key,
    UpdateExpression: `SET ${sets.join(", ")}`,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ReturnValues: "ALL_NEW",
  }));
  return res.Attributes ?? null;
};

export const deleteItem = async (tableName, key) => {
  const res = await docClient.send(new DeleteCommand({
    TableName: tableName,
    Key: key,
    ReturnValues: "ALL_OLD",
  }));
  return res.Attributes ?? null;
};