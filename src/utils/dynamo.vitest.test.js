import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { describe, it, expect, beforeEach } from "vitest";
import { createItem, listAllItems, deleteItem, getItem } from "./dynamo";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

describe("CRUD unit tests with mock", () => {
  it("createItem returns the same item", async () => {
    ddbMock.on(PutCommand).resolves({});

    const item = { id: "1", username: "superman35" };

    const output = await createItem("Test", item);

    expect(output).toEqual(item);
  });

  it("ListAllItems returns an array", async () => {
    const mockItems = [{ id: "1" }, { id: "2" }];
    ddbMock.on(ScanCommand).resolves({ Items: mockItems });

    const output = await listAllItems("Test");

    expect(output).toEqual(mockItems);
  });

  it("ListAllItems returns an empty array when empty", async () => {
    ddbMock.on(ScanCommand).resolves({});

    const output = await listAllItems("Test");

    expect(output).toEqual([]);
  });

  it("deleteItem deletes item then returns the same item", async () => {
    ddbMock.on(DeleteCommand).resolves({
      Attributes: { id: "1" },
    });

    const item = { id: "1", username: "superman35" };

    const output = await deleteItem(item);

    expect(output).toEqual({ id: "1" });
  });

  it("getItem returns item if found", async () => {
    ddbMock.on(GetCommand).resolves({
      Item: { id: "1", username: "superman35" },
    });

    const output = await getItem({ id: "1", username: "superman35" });

    expect(output).toEqual({ id: "1", username: "superman35" });
  });
});
