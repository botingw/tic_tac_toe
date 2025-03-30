class SocketMock {
  constructor() {
    this.events = {};
    this.id = `socket-${Math.random().toString(36).substr(2, 9)}`;
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return this; // For chaining
  }

  once(event, callback) {
    // For simplicity, we'll just use 'on' for both
    return this.on(event, callback);
  }

  emit(event, ...args) {
    // For server -> client events
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback(...args);
      });
    }
  }

  disconnect() {
    if (this.events['disconnect']) {
      this.events['disconnect'].forEach(callback => {
        callback();
      });
    }
  }
}

class ServerMock {
  constructor() {
    this.sockets = [];
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return this;
  }

  emit(event, ...args) {
    // Broadcast to all sockets
    this.sockets.forEach(socket => {
      socket.emit(event, ...args);
    });
  }

  createSocket() {
    const socket = new SocketMock();
    this.sockets.push(socket);
    
    // Process connection event synchronously
    if (this.events['connection']) {
      this.events['connection'].forEach(callback => {
        callback(socket);
      });
    }
    
    return socket;
  }
}

module.exports = { ServerMock, SocketMock }; 