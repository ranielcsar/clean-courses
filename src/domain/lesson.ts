import crypto from "crypto";
import { Course } from "./course";

export class Lesson {
  constructor(
    private id: string,
    private name: string,
    private youtubeUrl: string,
    private course: Course
  ) {}

  static create(name: string, youtubeUrl: string, course: Course) {
    const id = crypto.randomUUID();
    return new Lesson(id, name, youtubeUrl, course);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getUrl() {
    return this.youtubeUrl;
  }

  getCourse() {
    this.course;
  }
}
