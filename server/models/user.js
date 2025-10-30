export class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.createdAt = new Date();
    this.lastSeen = new Date();
    this.isOnline = false;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      isOnline: this.isOnline,
      lastSeen: this.lastSeen
    };
  }
}