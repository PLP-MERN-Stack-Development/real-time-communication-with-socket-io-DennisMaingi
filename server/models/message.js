export class Message {
  constructor(id, username, text, roomId, userId) {
    this.id = id;
    this.username = username;
    this.text = text;
    this.roomId = roomId;
    this.userId = userId;
    this.timestamp = new Date();
    this.reactions = {};
    this.readBy = new Set();
  }

  addReaction(reaction, userId) {
    if (!this.reactions[reaction]) {
      this.reactions[reaction] = new Set();
    }
    this.reactions[reaction].add(userId);
  }

  markAsRead(userId) {
    this.readBy.add(userId);
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      text: this.text,
      roomId: this.roomId,
      userId: this.userId,
      timestamp: this.timestamp.toISOString(),
      reactions: Object.fromEntries(
        Object.entries(this.reactions).map(([reaction, users]) => [
          reaction,
          Array.from(users)
        ])
      ),
      readBy: Array.from(this.readBy)
    };
  }
}