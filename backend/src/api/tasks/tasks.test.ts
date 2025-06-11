// backend/src/api/tasks/tasks.test.ts
import request from "supertest";
import app from "../../app";
import { readFile, writeFile } from "fs/promises";

const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;

jest.mock("fs/promises");

describe("Tasks API", () => {
  beforeEach(() => {
    mockReadFile.mockClear();
    mockWriteFile.mockClear();

    mockReadFile.mockResolvedValue(
      JSON.stringify({
        tasks: [
          {
            taskId: "1",
            title: "Random test",
            isCompleted: false,
          },
          {
            taskId: "2",
            title: "Task to be deleted",
            isCompleted: true,
          },
        ],
      })
    );

    mockWriteFile.mockResolvedValue(undefined);
  });

  // Test pro GET /api/tasks
  it("should return a list of tasks", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe("Random test");
  });

  // Test pro POST /api/tasks
  it("should create a new task", async () => {
    const newTask = {
      title: "A brand new task",
      description: "This is for testing",
    };

    const response = await request(app).post("/api/tasks").send(newTask);

    expect(response.body).toHaveProperty("taskId");
    expect(response.body.title).toBe(newTask.title);
  });

  it("should delete one task", async () => {
    const taskId: string = "2";

    const response = await request(app)
      .delete(`/api/tasks/:${taskId}`)
      .send(taskId);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Úkol úspěšně smazán.");
    expect(mockReadFile).toHaveBeenCalledTimes(1);
  });

  it("should edit state of task", async () => {
    const updatedTask = {
      taskId: "1",
      title: "Random test",
      isCompleted: true,
    };
    const response = await request(app)
      .put(`/api/tasks/:${updatedTask.taskId}`)
      .send({ updatedTask: updatedTask });

    expect(response.statusCode).toBe(200);
    expect(response.body.isCompleted).toBe(updatedTask.isCompleted);
  });

  it("should return not valid object for edit", async () => {
    const updatedTask = {
      taskId: "1",
      title: "Random test",
      isCompleted: true,
    };
    const response = await request(app)
      .put(`/api/tasks/:${updatedTask.taskId}`)
      .send(updatedTask);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain(
      "Neplatný objekt updatedTask. Zkontrolujte požadovaná pole."
    );
  });
});
